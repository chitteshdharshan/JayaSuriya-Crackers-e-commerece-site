import React, { useEffect, useRef } from 'react';

const CelebrationBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize);
    resize();

    // Particles/Sparks
    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + Math.random() * 100;
        this.size = Math.random() * 2 + 1;
        this.speedY = Math.random() * 1 + 0.5;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.color = `rgba(255, ${Math.floor(Math.random() * 100 + 155)}, 0, ${this.opacity})`;
      }

      update() {
        this.y -= this.speedY;
        if (this.y < -10) this.reset();
      }

      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Subtle Fireworks
    class BackgroundFirework {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * (canvas.height * 0.6);
        this.particles = [];
        this.timer = Math.random() * 300 + 100; // Delay before next
        this.exploded = false;
        this.color = `hsl(${Math.random() * 360}, 100%, 60%)`;
      }

      explode() {
        for (let i = 0; i < 30; i++) {
          const angle = (Math.PI * 2 / 30) * i;
          const speed = Math.random() * 2 + 1;
          this.particles.push({
            x: this.x,
            y: this.y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            alpha: 1
          });
        }
        this.exploded = true;
      }

      update() {
        if (!this.exploded) {
          this.timer--;
          if (this.timer <= 0) this.explode();
        } else {
          this.particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.02; // Gravity
            p.alpha -= 0.01;
          });
          this.particles = this.particles.filter(p => p.alpha > 0);
          if (this.particles.length === 0) this.reset();
        }
      }

      draw() {
        if (this.exploded) {
          this.particles.forEach(p => {
            ctx.globalAlpha = p.alpha * 0.3;
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
            ctx.fill();
          });
        }
      }
    }

    const particles = Array.from({ length: 50 }, () => new Particle());
    const fireworks = Array.from({ length: 3 }, () => new BackgroundFirework());

    const render = () => {
      // Create Gradient Background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#0a0a1a');
      gradient.addColorStop(0.5, '#050505');
      gradient.addColorStop(1, '#1a0a2a');
      
      ctx.globalAlpha = 1;
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.update();
        p.draw();
      });

      fireworks.forEach(f => {
        f.update();
        f.draw();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: -1,
        pointerEvents: 'none'
      }}
    />
  );
};

export default CelebrationBackground;
