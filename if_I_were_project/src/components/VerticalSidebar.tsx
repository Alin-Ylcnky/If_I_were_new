export function VerticalSidebar() {
  return (
    <div className="fixed left-0 top-0 h-full w-12 z-40 flex items-center justify-center pointer-events-none hidden lg:flex">
      <div 
        className="text-[#A3A3A3] text-xs tracking-[0.3em] uppercase"
        style={{
          writingMode: 'vertical-rl',
          textOrientation: 'mixed',
          transform: 'rotate(180deg)',
          fontFamily: 'Manrope, sans-serif',
          fontWeight: 300,
          letterSpacing: '0.3em'
        }}
      >
        Collection 2025
      </div>
    </div>
  );
}
