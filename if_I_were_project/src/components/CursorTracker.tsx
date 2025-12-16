import { useEffect, useState, useCallback } from 'react';

export function CursorTracker() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  // Helper to check if an element is clickable
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
      // Direct mapping for instant reaction (Star Head)
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
        transform: `translate(-50%, -50%)`,
        // Removing the transition on 'left/top' makes it snappy like a real cursor
      }}
    >
      <div
        className={`rounded-full transition-all duration-300 ${
          isHovering
            ? // HOVER STATE: Soft Fuchsia Aura, Larger, NO STROKE
              'w-10 h-10 bg-fuchsia-500/20 shadow-[0_0_30px_rgba(232,121,249,0.5)] backdrop-blur-[1px]'
            : // DEFAULT STATE: Bright White Star, Small, NO STROKE
              'w-3 h-3 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8),0_0_20px_rgba(232,121,249,0.8)]'
        }`}
      />
    </div>
  );
}