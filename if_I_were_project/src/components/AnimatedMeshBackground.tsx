import { useEffect, useRef } from 'react';

export function AnimatedMeshBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    const blobs = [
      {
        x: 0.25,
        y: 0.15,
        color: { r: 80, g: 80, b: 90 },
        size: 0.45,
        speedX: 0.00008,
        speedY: 0.00006,
        offsetX: 0,
        offsetY: 0
      },
      {
        x: 0.75,
        y: 0.35,
        color: { r: 60, g: 60, b: 70 },
        size: 0.5,
        speedX: 0.00007,
        speedY: 0.00009,
        offsetX: Math.PI,
        offsetY: Math.PI * 0.5
      },
      {
        x: 0.15,
        y: 0.65,
        color: { r: 50, g: 50, b: 60 },
        size: 0.55,
        speedX: 0.00006,
        speedY: 0.00008,
        offsetX: Math.PI * 1.5,
        offsetY: Math.PI * 0.7
      },
      {
        x: 0.85,
        y: 0.75,
        color: { r: 70, g: 70, b: 80 },
        size: 0.6,
        speedX: 0.00009,
        speedY: 0.00007,
        offsetX: Math.PI * 0.3,
        offsetY: Math.PI * 1.2
      },
      {
        x: 0.5,
        y: 0.5,
        color: { r: 45, g: 45, b: 55 },
        size: 0.5,
        speedX: 0.00005,
        speedY: 0.00007,
        offsetX: Math.PI * 0.8,
        offsetY: Math.PI * 1.8
      },
      {
        x: 0.6,
        y: 0.25,
        color: { r: 55, g: 55, b: 65 },
        size: 0.4,
        speedX: 0.00007,
        speedY: 0.00006,
        offsetX: Math.PI * 1.3,
        offsetY: Math.PI * 0.4
      }
    ];

    let time = 0;
    let animationId: number;

    const animate = () => {
      time += 1;

      const bgGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      bgGradient.addColorStop(0, '#1a1a1a');
      bgGradient.addColorStop(0.5, '#232323');
      bgGradient.addColorStop(1, '#2d2d2d');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.filter = 'blur(120px)';

      blobs.forEach((blob) => {
        const driftX = Math.sin(time * blob.speedX + blob.offsetX) * 150;
        const driftY = Math.cos(time * blob.speedY + blob.offsetY) * 150;

        const x = canvas.width * blob.x + driftX;
        const y = canvas.height * blob.y + driftY;
        const radius = Math.max(canvas.width, canvas.height) * blob.size;

        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, `rgba(${blob.color.r}, ${blob.color.g}, ${blob.color.b}, 0.95)`);
        gradient.addColorStop(0.3, `rgba(${blob.color.r}, ${blob.color.g}, ${blob.color.b}, 0.7)`);
        gradient.addColorStop(0.6, `rgba(${blob.color.r}, ${blob.color.g}, ${blob.color.b}, 0.3)`);
        gradient.addColorStop(1, `rgba(${blob.color.r}, ${blob.color.g}, ${blob.color.b}, 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', setCanvasSize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
