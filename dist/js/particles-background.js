/**
 * Particles Background Animation Component
 * Inspired by React Bits (https://reactbits.dev/components/particles)
 * Customized for Synergy Brand Architect's Careers Hero Banner
 */

class ParticlesBackground {
    constructor(canvasId, options = {}) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.animationId = null;

        // Custom configurations
        this.options = {
            particleCount: options.particleCount || 120,
            particleColors: options.particleColors || ['#ffffff', '#ff5e14', '#a0a0a0'],
            speed: options.speed || 0.4,
            moveParticlesOnHover: options.moveParticlesOnHover !== undefined ? options.moveParticlesOnHover : true,
            hoverRadius: options.hoverRadius || 120,
            repulsionForce: options.repulsionForce || 0.8,
            ...options
        };

        this.mouse = {
            x: null,
            y: null,
            active: false
        };

        this.init();
    }

    init() {
        this.resize();
        this.createParticles();
        this.bindEvents();
        this.animate();
    }

    resize() {
        // High DPI Display Adaptation
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.width = rect.width;
        this.height = rect.height;

        this.dpr = window.devicePixelRatio || 1;
        this.canvas.width = this.width * this.dpr;
        this.canvas.height = this.height * this.dpr;
        this.canvas.style.width = `${this.width}px`;
        this.canvas.style.height = `${this.height}px`;

        this.ctx.scale(this.dpr, this.dpr);
    }

    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.options.particleCount; i++) {
            const size = Math.random() * 2.5 + 0.8; // Elegant small pixel sizes
            this.particles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                vx: (Math.random() * 2 - 1) * this.options.speed,
                vy: (Math.random() * 2 - 1) * this.options.speed,
                size: size,
                color: this.options.particleColors[Math.floor(Math.random() * this.options.particleColors.length)],
                alpha: Math.random() * 0.6 + 0.2,
                originalAlpha: Math.random() * 0.6 + 0.2,
                twinkleSpeed: Math.random() * 0.02 + 0.005,
                twinklePhase: Math.random() * Math.PI * 2
            });
        }
    }

    bindEvents() {
        window.addEventListener('resize', () => {
            this.resize();
            // Re-generate or clamp particle positions to within new boundary
            this.particles.forEach(p => {
                if (p.x > this.width) p.x = Math.random() * this.width;
                if (p.y > this.height) p.y = Math.random() * this.height;
            });
        });

        if (this.options.moveParticlesOnHover) {
            const parent = this.canvas.parentElement;
            
            parent.addEventListener('mousemove', (e) => {
                const rect = parent.getBoundingClientRect();
                this.mouse.x = e.clientX - rect.left;
                this.mouse.y = e.clientY - rect.top;
                this.mouse.active = true;
            });

            parent.addEventListener('mouseleave', () => {
                this.mouse.x = null;
                this.mouse.y = null;
                this.mouse.active = false;
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        this.particles.forEach(p => {
            // Smooth natural drift
            p.x += p.vx;
            p.y += p.vy;

            // Continuous twinkling animation
            p.twinklePhase += p.twinkleSpeed;
            p.alpha = p.originalAlpha + Math.sin(p.twinklePhase) * 0.15;
            p.alpha = Math.max(0.1, Math.min(0.8, p.alpha));

            // Interactive Hover Attraction / Repulsion Physics
            if (this.options.moveParticlesOnHover && this.mouse.active) {
                const dx = p.x - this.mouse.x;
                const dy = p.y - this.mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < this.options.hoverRadius) {
                    // Force intensity based on distance (closer = stronger)
                    const force = (this.options.hoverRadius - dist) / this.options.hoverRadius;
                    
                    // Repulsion movement direction
                    const pushX = (dx / dist) * force * this.options.repulsionForce;
                    const pushY = (dy / dist) * force * this.options.repulsionForce;

                    // Smooth springy position adjustment
                    p.x += pushX;
                    p.y += pushY;
                }
            }

            // Boundary wrapping
            if (p.x < 0) p.x = this.width;
            if (p.x > this.width) p.x = 0;
            if (p.y < 0) p.y = this.height;
            if (p.y > this.height) p.y = 0;

            // Rendering the particle with a soft glow look
            this.ctx.fillStyle = p.color;
            this.ctx.globalAlpha = p.alpha;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fill();
        });

        // Reset globalAlpha to default
        this.ctx.globalAlpha = 1.0;

        this.animationId = requestAnimationFrame(() => this.animate());
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

// Automatically mount when DOM content is ready
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('particles-canvas')) {
        new ParticlesBackground('particles-canvas', {
            particleCount: 140,
            particleColors: ['#ffffff', '#ff5e14', 'rgba(255, 94, 20, 0.5)', '#888888'],
            speed: 0.35,
            hoverRadius: 130,
            repulsionForce: 1.2
        });
    }
});
