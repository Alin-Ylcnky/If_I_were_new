import { useEffect, useRef } from 'react';

export function InteractiveBlob() {
  const headRef = useRef<HTMLDivElement>(null);
  const tailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      const { clientX, clientY } = e;

      // 1. The Head (Star): Follows quickly (duration: 100ms)
      if (headRef.current) {
        headRef.current.animate(
          {
            left: `${clientX}px`,
            top: `${clientY}px`,
          },
          { duration: 100, fill: "forwards" }
        );
      }

      // 2. The Tail (Aura): Follows slowly (duration: 1200ms) creates the trail effect
      if (tailRef.current) {
        tailRef.current.animate(
          {
            left: `${clientX}px`,
            top: `${clientY}px`,
          },
          { duration: 1200, fill: "forwards" }
        );
      }
    };

    window.addEventListener('pointermove', handlePointerMove);
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      
      {/* THE TAIL (The glowing comet trail) 
          - Large, Fuchsia, Blurred, Low Opacity
      */}
      <div
        ref={tailRef}
        className="absolute w-[300px] h-[300px] bg-fuchsia-600 rounded-full mix-blend-screen filter blur-[80px] opacity-20 transform -translate-x-1/2 -translate-y-1/2"
      />

      {/* THE HEAD (The Shooting Star)
          - Small, Bright White, High Glow
      */}
      <div
        ref={headRef}
        className="absolute w-2 h-2 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.8)] transform -translate-x-1/2 -translate-y-1/2 z-10"
      />
    </div>
  );
}