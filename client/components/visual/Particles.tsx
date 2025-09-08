import { useEffect, useRef } from "react";

export default function Particles({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    const DPR = Math.max(1, Math.min(2, window.devicePixelRatio || 1));

    const particles = Array.from({ length: 40 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 1.2 + Math.random() * 2.4,
      vx: (Math.random() - 0.5) * 0.0006,
      vy: (Math.random() - 0.5) * 0.0006,
    }));

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.floor(rect.width * DPR);
      canvas.height = Math.floor(rect.height * DPR);
    };
    resize();

    const draw = () => {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > 1) p.vx *= -1;
        if (p.y < 0 || p.y > 1) p.vy *= -1;

        const gx = p.x * width;
        const gy = p.y * height;
        const grad = ctx.createRadialGradient(gx, gy, 0, gx, gy, p.r * 18 * DPR);
        grad.addColorStop(0, "hsla(258,90%,66%,0.35)");
        grad.addColorStop(1, "hsla(258,90%,66%,0.0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(gx, gy, p.r * 18 * DPR, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    const handleResize = () => {
      resize();
    };
    window.addEventListener("resize", handleResize);
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <canvas ref={ref} className={className} />;
}
