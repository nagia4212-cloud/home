document.addEventListener('DOMContentLoaded', () => {
    // Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Intersection Observer for Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Animate once
            }
        });
    }, observerOptions);

    // Observe all fade elements
    const fadeElements = document.querySelectorAll('.fade-in-up, .fade-in, .fade-in-left, .fade-in-right');
    fadeElements.forEach(el => observer.observe(el));

    // Mobile Menu Toggle
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            if (navLinks.style.display === 'flex') {
                navLinks.style.display = 'none';
            } else {
                navLinks.style.display = 'flex';
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '70px';
                navLinks.style.left = '0';
                navLinks.style.width = '100%';
                navLinks.style.backgroundColor = '#09090b'; /* Updated to Zinc-950 */
                navLinks.style.padding = '20px';
                navLinks.style.borderBottom = '1px solid #27272a';
            }
        });
    }

    // Canvas Digital Terrain Animation
    initTerrainCanvas();
});

function initTerrainCanvas() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;

    // Configuration
    const terrainSpeed = 0.2;
    const lines = 15; // Number of contour lines
    const sphereRadius = 15;

    let time = 0;

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    // Perlin-ish Noise Generator (Simple pseudo-random for waves)
    function noise(x, z) {
        return Math.sin(x * 0.005 + z * 0.01 + time * 0.5) *
            Math.cos(x * 0.002 - z * 0.005 + time * 0.3) * 50;
    }

    function drawTerrain() {
        ctx.lineWidth = 1.5;

        for (let i = 0; i < lines; i++) {
            const z = i * 40 + 100; // Depth steps
            const alpha = 1 - (i / lines); // Fade out as it gets closer/further

            ctx.beginPath();
            ctx.strokeStyle = `rgba(16, 185, 129, ${alpha * 0.3})`; // Emerald contour lines

            for (let x = 0; x < width; x += 20) {
                const yOffset = noise(x, z + time * 10);
                const yBase = height / 2 + (i - lines / 2) * 30; // Perspective-like stacking

                if (x === 0) ctx.moveTo(x, yBase + yOffset);
                else ctx.lineTo(x, yBase + yOffset);
            }
            ctx.stroke();
        }
    }

    function drawSphere() {
        // Golden Sphere mainly on the right side
        const sphereX = width * 0.75 + Math.sin(time) * 20;
        const sphereY = height / 2 + Math.cos(time * 0.5) * 50 + noise(sphereX, 500); // Ride the terrain

        // Trail effect (simple)
        const trailLength = 10;
        for (let i = 1; i <= trailLength; i++) {
            const tx = width * 0.75 + Math.sin(time - i * 0.1) * 20;
            const ty = height / 2 + Math.cos((time - i * 0.1) * 0.5) * 50 + noise(tx, 500);

            ctx.beginPath();
            ctx.arc(tx, ty, sphereRadius * (1 - i / trailLength), 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 215, 0, ${0.3 * (1 - i / trailLength)})`;
            ctx.fill();
        }

        // Main Sphere (Matte)
        const gradient = ctx.createRadialGradient(sphereX - 5, sphereY - 5, 2, sphereX, sphereY, sphereRadius);
        gradient.addColorStop(0, '#ffeeb0'); // Champagne Gold Highlight
        gradient.addColorStop(1, '#d4af37'); // Gold Shadow

        ctx.beginPath();
        ctx.arc(sphereX, sphereY, sphereRadius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.shadowBlur = 25;
        ctx.shadowColor = 'rgba(255, 215, 0, 0.4)'; // Slight glow, but sphere itself is solid
        ctx.fill();
        ctx.shadowBlur = 0; // Reset
    }

    function animate() {
        // Clearing with a very slight fade for motion blur potential vs hard clear
        ctx.clearRect(0, 0, width, height);

        // Draw decorative subtle abstract grid or particles if needed? 
        // Request was simple "Abstract Topography"

        drawTerrain();
        drawSphere();

        time += 0.01;
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);
    resize();
    animate();
}
