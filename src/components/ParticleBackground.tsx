'use client';
import { useEffect, useRef } from 'react';

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    const TEAL = 'rgba(26,155,191,';
    const CYAN = 'rgba(100,220,240,';
    const GREEN = 'rgba(46,204,113,';
    const BLUE = 'rgba(52,152,219,';

    const types = ['virus', 'virus', 'virus', 'cell', 'dna', 'cross', 'dot', 'dot'];

    function rand(a: number, b: number) { return a + Math.random() * (b - a); }

    class Particle {
      type: string;
      x: number;
      y: number;
      size: number;
      speed: number;
      drift: number;
      rot: number;
      rotSpeed: number;
      alpha: number;
      pulse: number;
      pulseSpeed: number;
      color: string;

      constructor(init = false) {
        this.type = types[Math.floor(Math.random() * types.length)];
        this.x = rand(0, canvas!.width);
        this.y = init ? rand(0, canvas!.height) : canvas!.height + 40;
        this.size = this.type === 'dna' || this.type === 'cross' ? rand(14, 28) : rand(6, 18);
        this.speed = rand(0.18, 0.55);
        this.drift = rand(-0.25, 0.25);
        this.rot = rand(0, Math.PI * 2);
        this.rotSpeed = rand(-0.006, 0.006);
        this.alpha = rand(0.08, 0.3);
        this.pulse = rand(0, Math.PI * 2);
        this.pulseSpeed = rand(0.012, 0.028);
        const palette = [TEAL, CYAN, GREEN, BLUE];
        this.color = palette[Math.floor(Math.random() * palette.length)];
      }

      reset(init = false) {
        Object.assign(this, new Particle(init));
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rot);
        this.pulse += this.pulseSpeed;
        const a = this.alpha * (0.75 + 0.25 * Math.sin(this.pulse));
        ctx.globalAlpha = a;
        ctx.strokeStyle = this.color + '1)';
        ctx.fillStyle = this.color + '0.08)';
        ctx.lineWidth = 1;

        if (this.type === 'virus') {
          const r = this.size;
          ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
          const spikes = 10;
          for (let i = 0; i < spikes; i++) {
            const angle = (Math.PI * 2 / spikes) * i;
            const x1 = Math.cos(angle) * r, y1 = Math.sin(angle) * r;
            const x2 = Math.cos(angle) * (r + r * 0.45), y2 = Math.sin(angle) * (r + r * 0.45);
            ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
            ctx.beginPath(); ctx.arc(x2, y2, r * 0.12, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
          }
        } else if (this.type === 'cell') {
          const rx = this.size, ry = this.size * 0.55;
          ctx.beginPath(); ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
          ctx.fill(); ctx.stroke();
          ctx.beginPath(); ctx.ellipse(0, 0, rx * 0.55, ry * 0.45, 0, 0, Math.PI * 2); ctx.stroke();
        } else if (this.type === 'dna') {
          const h = this.size * 2.2;
          ctx.lineWidth = 1.2;
          for (let i = 0; i < 12; i++) {
            const t = i / 11, y = -h + h * 2 * t;
            const x1 = Math.sin(t * Math.PI * 3) * this.size * 0.55;
            const x2 = Math.sin(t * Math.PI * 3 + Math.PI) * this.size * 0.55;
            ctx.strokeStyle = CYAN + '0.8)';
            ctx.beginPath(); ctx.arc(x1, y, 2, 0, Math.PI * 2); ctx.stroke();
            ctx.strokeStyle = GREEN + '0.8)';
            ctx.beginPath(); ctx.arc(x2, y, 2, 0, Math.PI * 2); ctx.stroke();
            if (i % 2 === 0) {
              ctx.strokeStyle = TEAL + '0.4)';
              ctx.beginPath(); ctx.moveTo(x1, y); ctx.lineTo(x2, y); ctx.stroke();
            }
          }
        } else if (this.type === 'cross') {
          const s = this.size, t = s * 0.32;
          ctx.beginPath();
          ctx.moveTo(-t, -s); ctx.lineTo(t, -s); ctx.lineTo(t, -t);
          ctx.lineTo(s, -t); ctx.lineTo(s, t); ctx.lineTo(t, t);
          ctx.lineTo(t, s); ctx.lineTo(-t, s); ctx.lineTo(-t, t);
          ctx.lineTo(-s, t); ctx.lineTo(-s, -t); ctx.lineTo(-t, -t);
          ctx.closePath(); ctx.fill(); ctx.stroke();
        } else {
          ctx.beginPath(); ctx.arc(0, 0, this.size * 0.4, 0, Math.PI * 2); ctx.fill();
        }
        ctx.restore();
      }

      update() {
        this.y -= this.speed;
        this.x += this.drift;
        this.rot += this.rotSpeed;
        if (this.y < -60) this.reset();
      }
    }

    particles = Array.from({ length: 38 }, () => new Particle(true));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(); p.draw(ctx); });
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 opacity-45"
    />
  );
}
