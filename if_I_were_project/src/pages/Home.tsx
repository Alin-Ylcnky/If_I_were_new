import { Link } from 'react-router-dom';

export function Home() {
  return (
    <div className="flex items-center justify-center px-4 min-h-[calc(100vh-80px)]">
      <div className="text-center max-w-2xl animate-fadeIn">
        <h1 className="text-5xl sm:text-6xl md:text-7xl text-cyan-200 mb-6 tracking-wide animate-float drop-shadow-2xl" style={{
          fontFamily: 'Allura, cursive',
          textShadow: '0 0 20px rgba(125, 211, 192, 0.8), 0 0 30px rgba(125, 211, 192, 0.5), 0 0 40px rgba(125, 211, 192, 0.3)'
        }}>
          If I were...
        </h1>
        <div className="mb-12 space-y-3">
          <p className="text-base sm:text-lg md:text-xl text-slate-200/90 leading-relaxed drop-shadow-lg italic" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 200 }}>
            A mirror for the imagined self.
          </p>
          <p className="text-base sm:text-lg md:text-xl text-slate-200/20 leading-relaxed transform scale-y-[-1] blur-[1px] drop-shadow-lg italic" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 200 }} aria-hidden="true">
            A mirror for the imagined self.
          </p>
        </div>
        <div className="flex justify-center items-center">
          <Link
            to="/2025"
            className="inline-block px-10 py-4 bg-gradient-to-r from-teal-500/90 to-cyan-500/90 backdrop-blur-sm text-slate-100 text-lg font-semibold rounded-full hover:shadow-2xl hover:shadow-cyan-400/50 transition-all duration-300 hover:scale-110 transform border-2 border-cyan-300/50 hover:border-cyan-200"
          >
            Echoes of 2025
          </Link>
        </div>
      </div>
    </div>
  );
}
