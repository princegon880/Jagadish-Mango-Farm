// 3D Effects for Jagadish Mango Farm Hero Section

document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    // Three.js Setup
    const scene = new THREE.Scene();
    // Add a soft fog to blend particles into the background
    scene.fog = new THREE.FogExp2(0x1b4332, 0.001);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Particle System
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 700;
    
    const posArray = new Float32Array(particlesCount * 3);
    const colorsArray = new Float32Array(particlesCount * 3);

    // Color Palette: Mango Gold, Dark Gold, Green
    const colors = [
        new THREE.Color('#fbbf24'), // Mango Gold
        new THREE.Color('#f59e0b'), // Mango Gold Dark
        new THREE.Color('#2d6a4f'), // Green
        new THREE.Color('#ffedd5')  // Light
    ];

    for(let i = 0; i < particlesCount * 3; i+=3) {
        // Spread particles around
        posArray[i] = (Math.random() - 0.5) * 15;     // x
        posArray[i+1] = (Math.random() - 0.5) * 15;   // y
        posArray[i+2] = (Math.random() - 0.5) * 10;   // z

        // Randomly pick a color from the palette
        const color = colors[Math.floor(Math.random() * colors.length)];
        colorsArray[i] = color.r;
        colorsArray[i+1] = color.g;
        colorsArray[i+2] = color.b;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorsArray, 3));

    // Create a circular particle texture programmatically
    const getTexture = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.arc(16, 16, 14, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        const texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;
        return texture;
    };

    const material = new THREE.PointsMaterial({
        size: 0.15,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        map: getTexture(),
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const particlesMesh = new THREE.Points(particlesGeometry, material);
    scene.add(particlesMesh);

    // Organic Floating Spheres (Mango Vibes)
    const sphereGroup = new THREE.Group();
    
    const sphereGeometry = new THREE.IcosahedronGeometry(0.4, 1);
    
    for(let i = 0; i < 5; i++) {
        const sphereMat = new THREE.MeshBasicMaterial({
            color: colors[i % colors.length],
            wireframe: true,
            transparent: true,
            opacity: 0.3
        });
        const sphere = new THREE.Mesh(sphereGeometry, sphereMat);
        
        sphere.position.x = (Math.random() - 0.5) * 8;
        sphere.position.y = (Math.random() - 0.5) * 8;
        sphere.position.z = (Math.random() - 0.5) * 5 - 2;
        
        // Random rotation speeds
        sphere.userData = {
            rx: (Math.random() - 0.5) * 0.02,
            ry: (Math.random() - 0.5) * 0.02
        };
        
        sphereGroup.add(sphere);
    }
    
    scene.add(sphereGroup);

    camera.position.z = 3;

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX) * 0.001;
        mouseY = (event.clientY - windowHalfY) * 0.001;
    });

    // Handle Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Animation Loop
    const clock = new THREE.Clock();

    const animate = () => {
        requestAnimationFrame(animate);

        const elapsedTime = clock.getElapsedTime();

        // Slowly rotate particle system
        particlesMesh.rotation.y = elapsedTime * 0.05;
        particlesMesh.rotation.x = Math.sin(elapsedTime * 0.2) * 0.1;

        // Smoothly move particles mesh based on mouse
        targetX = mouseX * 2;
        targetY = mouseY * 2;
        
        particlesMesh.position.x += 0.02 * (targetX - particlesMesh.position.x);
        particlesMesh.position.y += 0.02 * (-targetY - particlesMesh.position.y);

        // Animate floating spheres
        sphereGroup.children.forEach((sphere, index) => {
            sphere.rotation.x += sphere.userData.rx;
            sphere.rotation.y += sphere.userData.ry;
            sphere.position.y += Math.sin(elapsedTime * 0.5 + index) * 0.002;
        });
        
        // Camera parallax effect
        camera.position.x += (mouseX - camera.position.x) * 0.05;
        camera.position.y += (-mouseY - camera.position.y) * 0.05;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    };

    animate();
});
