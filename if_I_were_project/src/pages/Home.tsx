import { Link } from 'react-router-dom';

export function Home() {
  return (
    // OUTER CONTAINER: Centers everything vertically and horizontally
    <div className="flex items-center justify-center px-4 min-h-[calc(100vh-80px)] w-full">
      
      {/* INNER CONTAINER: Flex-col ensures perfect vertical stacking and centering */}
      <div className="flex flex-col items-center justify-center text-center max-w-4xl animate-fadeIn w-full">
        
        {/* MAIN TITLE: Cormorant Garamond (Elegant Serif) 
            - Matches the "If I were" style request.
            - fontWeight: 300 (Light) for elegance. */}
        <h1 className="w-full text-5xl sm:text-6xl md:text-7xl mb-8 tracking-wide animate-float drop-shadow-2xl" style={{
            color: '#E879F9'
          }}>
            <span className="pr-2" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontStyle: 'italic' }}>If I were</span>
            <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 100 }}>...</span>
        </h1>

        {/* SUBTITLE SECTION: Manrope (Matches "Collection 2025" sidebar text) 
            - Kept Italic as requested for the "Mirror" concept. */}
        <div className="mb-12 space-y-2 flex flex-col items-center w-full">
          
          {/* Primary Text */}
<p className="text-sm sm:text-base leading-relaxed drop-shadow-lg" style={{ 
  fontFamily: "'Manrope', sans-serif", 
  fontStyle: 'italic',
  color: '#E5E5E5', 
  fontWeight: 200, // Extra Light for elegance
  letterSpacing: '0.05em'
}}>
  A mirror for the imagined self.
</p>

{/* Reflection */}
<p className="text-sm sm:text-base leading-relaxed transform scale-y-[-1] blur-[0.5px] select-none" style={{ 
  fontFamily: "'Manrope', sans-serif", 
  fontStyle: 'italic',
  color: '#E879F9', 
  opacity: 0.25, 
  fontWeight: 200,
  letterSpacing: '0.05em'
}} aria-hidden="true">
  A mirror for the imagined self.
</p>
        </div>

        {/* ACTION BUTTON: Cormorant Garamond (Matches Title) 
            - Uppercase and Italic styling. */}
        <div className="flex justify-center items-center w-full">
          <Link
            to="/2025"
            className="inline-block px-10 py-3 text-lg rounded-full transition-all duration-300 hover:scale-105 border border-fuchsia-400 shadow-[0_0_15px_rgba(232,121,249,0.3)] hover:shadow-[0_0_30px_rgba(232,121,249,0.6)] backdrop-blur-md bg-black/40"
            style={{
              fontFamily: "'Manrope', serif",
              fontStyle: 'regular',
              fontWeight: 300,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: '#E879F9'
            }}
          >
            Echoes of 2025
          </Link>
        </div>
      </div>
    </div>
  );
}