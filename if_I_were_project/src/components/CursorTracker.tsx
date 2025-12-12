import { useEffect, useState, useCallback } from 'react';

export function CursorTracker() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const checkIfHoverable = useCallback((element: Element | null): boolean => {
    if (!element) return false;

    const tagName = element.tagName.toLowerCase();
    const interactiveTags = ['a', 'button', 'input', 'textarea', 'select', 'label'];

    if (interactiveTags.includes(tagName)) return true;

    const role = element.getAttribute('role');
    if (role && ['button', 'link', 'tab', 'menuitem', 'option'].includes(role)) return true;

    if (element.hasAttribute('onclick')) return true;

    const cursor = window.getComputedStyle(element).cursor;
    if (cursor === 'pointer') return true;

    if (element.classList.contains('cursor-pointer')) return true;

    return false;
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      const target = e.target as Element;
      const hoverable = checkIfHoverable(target);
      setIsHovering(hoverable);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
      setIsHovering(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.body.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isVisible, checkIfHoverable]);

  if (!isVisible) return null;

  return (
    <div
      className="fixed pointer-events-none z-[9999]"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: `translate(-50%, -50%) scale(${isHovering ? 1.15 : 1})`,
        transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
    >
      <div
        className={`rounded-full transition-all duration-300 ${
          isHovering
            ? 'w-12 h-12 bg-cyan-400/20 backdrop-blur-md border-2 border-cyan-300/40 shadow-[0_0_30px_rgba(34,211,238,0.4),inset_0_0_20px_rgba(255,255,255,0.1)]'
            : 'w-12 h-12 bg-lime-400/25 backdrop-blur-sm border border-lime-300/30'
        }`}
        style={{
          backdropFilter: isHovering ? 'blur(12px) brightness(1.2) saturate(1.3)' : 'blur(4px)',
        }}
      />
    </div>
  );
}
