import { useEffect, useRef, useState } from 'react';

interface Blob {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  velocityX: number;
  velocityY: number;
  size: number;
  floatOffset: number;
  isPaused: boolean;
}

export function InteractiveBlob() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [, forceUpdate] = useState({});
  const blobsStateRef = useRef<Blob[]>([
    {
      x: Math.random() * 0.6 + 0.2,
      y: Math.random() * 0.6 + 0.2,
      targetX: 0,
      targetY: 0,
      velocityX: 0,
      velocityY: 0,
      size: 100,
      floatOffset: 0,
      isPaused: false
    },
    {
      x: Math.random() * 0.6 + 0.2,
      y: Math.random() * 0.6 + 0.2,
      targetX: 0,
      targetY: 0,
      velocityX: 0,
      velocityY: 0,
      size: 90,
      floatOffset: Math.PI * 0.5,
      isPaused: false
    },
    {
      x: Math.random() * 0.6 + 0.2,
      y: Math.random() * 0.6 + 0.2,
      targetX: 0,
      targetY: 0,
      velocityX: 0,
      velocityY: 0,
      size: 95,
      floatOffset: Math.PI,
      isPaused: false
    }
  ]);

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

    const blobs = blobsStateRef.current;

    const generateNewTarget = (blob: Blob) => {
      const padding = 0.15;
      blob.targetX = Math.random() * (1 - padding * 2) + padding;
      blob.targetY = Math.random() * (1 - padding * 2) + padding;
    };

    blobs.forEach(blob => generateNewTarget(blob));

    let animationId: number;
    const easeSpeed = 0.015;
    const arrivalThreshold = 0.02;

    const isPointInBlob = (clickX: number, clickY: number, blob: Blob): boolean => {
      const blobX = blob.x * canvas.width;
      const blobY = blob.y * canvas.height;
      const distance = Math.sqrt(
        Math.pow(clickX - blobX, 2) + Math.pow(clickY - blobY, 2)
      );
      return distance <= blob.size;
    };

    const handleClick = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = event.clientX - rect.left;
      const clickY = event.clientY - rect.top;

      for (let i = blobs.length - 1; i >= 0; i--) {
        if (isPointInBlob(clickX, clickY, blobs[i])) {
          blobs[i].isPaused = !blobs[i].isPaused;
          forceUpdate({});
          break;
        }
      }
    };

    canvas.addEventListener('click', handleClick);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      blobs.forEach((blob) => {
        if (!blob.isPaused) {
          const dx = blob.targetX - blob.x;
          const dy = blob.targetY - blob.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < arrivalThreshold) {
            generateNewTarget(blob);
          }

          blob.velocityX = dx * easeSpeed;
          blob.velocityY = dy * easeSpeed;
          blob.x += blob.velocityX;
          blob.y += blob.velocityY;

          blob.x = Math.max(0.1, Math.min(0.9, blob.x));
          blob.y = Math.max(0.1, Math.min(0.9, blob.y));
        } else {
          blob.floatOffset += 0.02;
          const floatY = Math.sin(blob.floatOffset) * 0.005;
          blob.y += floatY;
        }

        const x = blob.x * canvas.width;
        const y = blob.y * canvas.height;
        const radius = blob.size;

        ctx.filter = 'blur(40px)';

        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);

        if (blob.isPaused) {
          gradient.addColorStop(0, 'rgba(255, 200, 50, 0.9)');
          gradient.addColorStop(0.3, 'rgba(255, 150, 80, 0.7)');
          gradient.addColorStop(0.6, 'rgba(255, 100, 100, 0.4)');
          gradient.addColorStop(1, 'rgba(255, 80, 120, 0)');
        } else {
          gradient.addColorStop(0, 'rgba(50, 255, 180, 0.9)');
          gradient.addColorStop(0.3, 'rgba(80, 220, 255, 0.7)');
          gradient.addColorStop(0.6, 'rgba(100, 180, 255, 0.4)');
          gradient.addColorStop(1, 'rgba(120, 150, 255, 0)');
        }

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();

        if (blob.isPaused) {
          const pulseSize = radius + Math.sin(blob.floatOffset * 2) * 5;
          ctx.filter = 'blur(20px)';
          const pulseGradient = ctx.createRadialGradient(x, y, 0, x, y, pulseSize);
          pulseGradient.addColorStop(0, 'rgba(255, 220, 100, 0.3)');
          pulseGradient.addColorStop(1, 'rgba(255, 200, 50, 0)');
          ctx.fillStyle = pulseGradient;
          ctx.beginPath();
          ctx.arc(x, y, pulseSize, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', setCanvasSize);
      canvas.removeEventListener('click', handleClick);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 cursor-pointer"
      style={{ zIndex: 0 }}
    />
  );
}
