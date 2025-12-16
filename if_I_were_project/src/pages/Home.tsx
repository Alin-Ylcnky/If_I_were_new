import { Link } from 'react-router-dom';

export function Home() {
  return (
    <div className="flex items-center justify-center px-4 min-h-[calc(100vh-80px)]">
      <div className="text-center max-w-2xl animate-fadeIn">
        <h1 className="text-5xl sm:text-6xl md:text-7xl mb-6 tracking-wide animate-float drop-shadow-2xl" style={{
            color: '#E879F9'
          }}>
            <span style={{ fontFamily: "'Italiana', sans-serif", fontWeight: 400 }}>If I were</span>
            <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 700 }}>...</span>
        </h1>
        <div className="mb-12 space-y-3">
          <p className="text-base sm:text-lg md:text-xl leading-relaxed drop-shadow-lg" style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontWeight: 300, color: '#A3A3A3' }}>
            A mirror for the imagined self.
          </p>
          <p className="text-base sm:text-lg md:text-xl leading-relaxed transform scale-y-[-1] blur-[1px] drop-shadow-lg" style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontWeight: 300, color: 'rgba(163, 163, 163, 0.2)' }} aria-hidden="true">
            A mirror for the imagined self.
          </p>
        </div>
        <div className="flex justify-center items-center">
          <Link
            to="/2025"
            className="inline-block px-12 py-4 text-xl rounded-full transition-all duration-300 hover:scale-105 border border-fuchsia-400 shadow-[0_0_15px_rgba(232,121,249,0.3)] hover:shadow-[0_0_30px_rgba(232,121,249,0.6)] backdrop-blur-md bg-black/20"
            style={{
              fontFamily: "'Italiana', sans-serif",
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
