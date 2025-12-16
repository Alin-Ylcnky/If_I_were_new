import { Link } from 'react-router-dom';

export function Home() {
  return (
    // OUTER CONTAINER: Centers everything vertically and horizontally
    <div className="flex items-center justify-center px-4 min-h-[calc(100vh-80px)] w-full">
      
      {/* INNER CONTAINER: Flex-col ensures perfect vertical stacking and centering */}
      <div className="flex flex-col items-center justify-center text-center max-w-4xl animate-fadeIn w-full">
        
        {/* MAIN TITLE: Cormorant Garamond 
            - Changed fontWeight to 300 (Light) to fix the "rough" look.
            - It looks much more elegant and minimal now. */}
        <h1 className="w-full text-5xl sm:text-6xl md:text-7xl mb-8 tracking-wide animate-float drop-shadow-2xl" style={{
            color: '#E879F9'
          }}>
            {/* Added padding-right (pr-2) to balance the italic slant */}
            <span className="pr-2" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontStyle: 'italic' }}>If I were</span>
            <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 700 }}>...</span>
        </h1>

        {/* SUBTITLE & REFLECTION SECTION */}
        <div className="mb-12 space-y-2 flex flex-col items-center w-full">
          
          {/* Primary Text: Italic & Light */}
          <p className="text-xl sm:text-2xl md:text-3xl leading-relaxed drop-shadow-lg" style={{ 
            fontFamily: "'Cormorant Garamond', serif", 
            fontStyle: 'italic',
            color: '#E5E5E5', 
            fontWeight: 300 // Light weight for elegance
          }}>
            A mirror for the imagined self.
          </p>
          
          {/* Reflection Effect: Italic, Fuchsia tint & Opacity */}
          <p className="text-xl sm:text-2xl md:text-3xl leading-relaxed transform scale-y-[-1] blur-[0.5px] select-none" style={{ 
            fontFamily: "'Cormorant Garamond', serif", 
            fontStyle: 'italic',
            color: '#E879F9', 
            opacity: 0.3, 
            fontWeight: 300
          }} aria-hidden="true">
            A mirror for the imagined self.
          </p>
        </div>

        {/* ACTION BUTTON: Uppercase & Centered */}
        <div className="flex justify-center items-center w-full">
          <Link
            to="/2025"
            className="inline-block px-10 py-3 text-lg rounded-full transition-all duration-300 hover:scale-105 border border-fuchsia-400 shadow-[0_0_15px_rgba(232,121,249,0.3)] hover:shadow-[0_0_30px_rgba(232,121,249,0.6)] backdrop-blur-md bg-black/40"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: 'italic',
              fontWeight: 600, // Slightly bolder than text for contrast
              textTransform: 'uppercase', // CHANGED TO UPPERCASE
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