import { Link } from 'react-router-dom';

export function Home() {
  return (
    <div className="flex items-center justify-center px-4 min-h-[calc(100vh-80px)]">
      <div className="text-center max-w-2xl animate-fadeIn">
        
        {/* MAIN TITLE: Raleway Font (Thin & Uppercase for Cinematic look) */}
        <h1 className="text-5xl sm:text-7xl md:text-8xl mb-8 tracking-[0.2em] animate-float drop-shadow-2xl" style={{
            color: '#E879F9'
          }}>
            {/* fontWeight: 200 makes it extra thin and elegant */}
            <span style={{ fontFamily: "'Raleway', sans-serif", fontWeight: 200, textTransform: 'uppercase' }}>If I were</span>
            <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 700 }}>...</span>
        </h1>

        {/* SUBTITLE SECTION: Manrope (Clean & Readable) */}
        <div className="mb-12 space-y-2">
          
          {/* 1. Primary Text */}
          <p className="text-lg sm:text-xl md:text-2xl leading-relaxed drop-shadow-lg" style={{ 
            fontFamily: "'Manrope', sans-serif", 
            color: '#F5F5F5', // Off-white for readability
            fontWeight: 300,
            letterSpacing: '0.05em'
          }}>
            A mirror for the imagined self.
          </p>
          
          {/* 2. Reflection Effect (Subtle Fuchsia Tint) */}
          <p className="text-lg sm:text-xl md:text-2xl leading-relaxed transform scale-y-[-1] blur-[0.5px] select-none" style={{ 
            fontFamily: "'Manrope', sans-serif", 
            color: '#E879F9', // Fuchsia tint for neon reflection
            opacity: 0.25, 
            fontWeight: 300,
            letterSpacing: '0.05em'
          }} aria-hidden="true">
            A mirror for the imagined self.
          </p>
        </div>

        {/* ACTION BUTTON: Matching the Title Style */}
        <div className="flex justify-center items-center">
          <Link
            to="/2025"
            className="inline-block px-12 py-4 text-xl rounded-full transition-all duration-300 hover:scale-105 border border-fuchsia-400 shadow-[0_0_15px_rgba(232,121,249,0.3)] hover:shadow-[0_0_30px_rgba(232,121,249,0.6)] backdrop-blur-md bg-black/40"
            style={{
              fontFamily: "'Raleway', sans-serif",
              fontWeight: 400, // Slightly thicker than title for readability
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
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