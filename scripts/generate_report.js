const { createClient } = require('@supabase/supabase-js');
const { Resend } = require('resend');

const SUPABASE_URL = 'https://tmrhndrdbgszlpicsbof.supabase.co';
const SUPABASE_KEY = 'sb_publishable_TZr6E1V9dC-udBumRgwZgA_SHYbzAMQ';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const resend = new Resend(process.env.RESEND_API_KEY);

async function run() {
  try {
    console.log("Authenticating with Supabase...");
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: process.env.SUPABASE_EMAIL,
      password: process.env.SUPABASE_PASSWORD,
    });

    if (authError) throw new Error("Authentication failed: " + authError.message);
    const userId = authData.user.id;
    console.log("Authenticated successfully.");

    console.log("Fetching today's sales records...");
    
    // Get today's date in YYYY-MM-DD
    const tzoffset = (new Date()).getTimezoneOffset() * 60000;
    const today = new Date(Date.now() - tzoffset).toISOString().split('T')[0];
    
    const { data: salesData, error: dbError } = await supabase
      .from('sales_records')
      .select('*')
      .eq('user_id', userId)
      .eq('date', today);

    if (dbError) throw new Error("Failed to fetch data: " + dbError.message);

    if (!salesData || salesData.length === 0) {
      console.log("No sales recorded today. Skipping email.");
      return;
    }

    console.log(`Found ${salesData.length} records. Generating CSV...`);
    
    const headers = ['Date', 'Client Name', 'Phone', 'Price per KG', 'Base KG', 'Qty', 'Total KG', 'Total Price', 'Status'];
    const rows = salesData.map(record => {
      const name = record.name ? record.name.toString().replace(/"/g, '""') : '';
      const phone = record.phone ? record.phone.toString().replace(/"/g, '""') : '';
      const totalKg = record.baseKg * record.qty;
      return [
        record.date,
        `"${name}"`,
        `"${phone}"`,
        record.pricePerKg,
        record.baseKg,
        record.qty,
        totalKg,
        record.price,
        record.status
      ];
    });

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const base64Csv = Buffer.from(csvContent).toString('base64');

    console.log("Sending email via Resend...");
    const emailResult = await resend.emails.send({
      from: 'Mango Farm System <onboarding@resend.dev>', // Resend's default testing domain
      to: process.env.SUPABASE_EMAIL, // Sending to the same email
      subject: `Daily Sales Report - ${today}`,
      html: `<p>Hello!</p><p>Please find attached the daily sales report for <b>${today}</b>.</p><p>Total records today: ${salesData.length}</p>`,
      attachments: [
        {
          filename: `sales_report_${today}.csv`,
          content: base64Csv,
        }
      ]
    });

    console.log("Email sent successfully!", emailResult);
  } catch (err) {
    console.error("Error during report generation:", err);
    process.exit(1);
  }
}

run();
