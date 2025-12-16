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
  // REFS FOR BACKGROUND BLOBS
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

  // REFS FOR SHOOTING STAR CURSOR
  const headRef = useRef<HTMLDivElement>(null);
  const tailRef = useRef<HTMLDivElement>(null);

  // 1. CURSOR EFFECT (SHOOTING STAR)
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      const { clientX, clientY } = e;

      // The Head (Star) - Fast
      if (headRef.current) {
        headRef.current.animate(
          { left: `${clientX}px`, top: `${clientY}px` },
          { duration: 100, fill: "forwards" }
        );
      }

      // The Tail (Trail) - Slow
      if (tailRef.current) {
        tailRef.current.animate(
          { left: `${clientX}px`, top: `${clientY}px` },
          { duration: 1200, fill: "forwards" }
        );
      }
    };

    window.addEventListener('pointermove', handlePointerMove);
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, []);

  // 2. BACKGROUND BLOBS ANIMATION (CANVAS)
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

        // Increased blur for softer, dreamy look
        ctx.filter = 'blur(60px)';

        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);

        // --- UPDATED COLORS TO MATCH FUCHSIA/PURPLE THEME ---
        
        if (blob.isPaused) {
          // Paused State: Gold/Mystical White (Frozen in time)
          gradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
          gradient.addColorStop(0.3, 'rgba(250, 204, 21, 0.7)');
          gradient.addColorStop(0.6, 'rgba(234, 179, 8, 0.4)');
          gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        } else {
          // Active State: Fuchsia, Deep Purple, Violet
          gradient.addColorStop(0, 'rgba(232, 121, 249, 0.9)');   // Bright Fuchsia center
          gradient.addColorStop(0.3, 'rgba(192, 132, 252, 0.7)'); // Purple
          gradient.addColorStop(0.6, 'rgba(147, 51, 234, 0.4)');  // Deep Violet
          gradient.addColorStop(1, 'rgba(107, 33, 168, 0)');      // Transparent Fade
        }

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();

        // Pulsing effect when paused
        if (blob.isPaused) {
          const pulseSize = radius + Math.sin(blob.floatOffset * 2) * 5;
          ctx.filter = 'blur(30px)';
          const pulseGradient = ctx.createRadialGradient(x, y, 0, x, y, pulseSize);
          pulseGradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
          pulseGradient.addColorStop(1, 'rgba(250, 204, 21, 0)');
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
    <div className="fixed inset-0 z-0">
      
      {/* 1. BACKGROUND CANVAS (Blobs) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 cursor-pointer"
        style={{ zIndex: 0 }}
      />

      {/* 2. SHOOTING STAR CURSOR (Overlay) */}
      <div className="pointer-events-none">
         {/* The Tail */}
        <div
            ref={tailRef}
            className="absolute w-[200px] h-[200px] bg-fuchsia-600 rounded-full mix-blend-screen filter blur-[60px] opacity-20 transform -translate-x-1/2 -translate-y-1/2"
        />
        {/* The Head */}
        <div
            ref={headRef}
            className="absolute w-2 h-2 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.9)] transform -translate-x-1/2 -translate-y-1/2"
        />
      </div>
    </div>
  );
}