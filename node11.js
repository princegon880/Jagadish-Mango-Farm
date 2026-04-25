const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
    
    // 1. Serve the Homepage
    if (req.url === '/') {
        fs.readFile('index.html', (err, data) => {
            if (err) {
                res.writeHead(404);
                return res.end("Error loading index.html");
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(data);
            res.end();
        });
    } 
    
    // 2. Serve the Homepage CSS
    else if (req.url === '/style.css') {
        fs.readFile('style.css', (err, data) => {
            if (err) {
                res.writeHead(404);
                return res.end("Error loading style.css");
            }
            res.writeHead(200, { 'Content-Type': 'text/css' });
            res.write(data);
            res.end();
        });
    }

    // 🥭 NEW: 3. Serve the Cart Page
    else if (req.url === '/cart.html') {
        fs.readFile('cart.html', (err, data) => {
            if (err) {
                res.writeHead(404);
                return res.end("Error loading cart.html");
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(data);
            res.end();
        });
    }

    // 🥭 NEW: 4. Serve the Cart CSS
    else if (req.url === '/cart.css') {
        fs.readFile('cart.css', (err, data) => {
            if (err) {
                res.writeHead(404);
                return res.end("Error loading cart.css");
            }
            res.writeHead(200, { 'Content-Type': 'text/css' });
            res.write(data);
            res.end();
        });
    }
// Serve the Record Page
    else if (req.url === '/record.html') {
        fs.readFile('record.html', (err, data) => {
            if (err) {
                res.writeHead(404);
                return res.end("Error loading record.html");
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(data);
            res.end();
        });
    }
    // Serve the Login Page
    else if (req.url === '/login.html') {
        fs.readFile('login.html', (err, data) => {
            if (err) {
                res.writeHead(404);
                return res.end("Error loading login.html");
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(data);
            res.end();
        });
    }
    // Serve the Login CSS
    else if (req.url === '/login.css') {
        fs.readFile('login.css', (err, data) => {
            if (err) {
                res.writeHead(404);
                return res.end("Error loading login.css");
            }
            res.writeHead(200, { 'Content-Type': 'text/css' });
            res.write(data);
            res.end();
        });
    }
    // 5. Catch-all for anything else (404 Page Not Found)
    else {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end("<h1>404 - Page Not Found</h1><a href='/'>Go back to the Mango Farm</a>");
    }
});

server.listen(3100, () => {
    console.log('Server running at http://localhost:3100');
});