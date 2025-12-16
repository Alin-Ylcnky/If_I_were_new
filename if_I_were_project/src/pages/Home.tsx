import { Link } from 'react-router-dom';

export function Home() {
  return (
    // DIŞ KUTU: Ekranın tam ortasına yerleştirir
    <div className="flex items-center justify-center px-4 min-h-[calc(100vh-80px)] w-full">
      
      {/* İÇ KUTU: Flex-Col ve Items-Center ile her şeyi MİLİMETRİK ortalar */}
      <div className="flex flex-col items-center justify-center text-center max-w-4xl animate-fadeIn w-full">
        
        {/* 1. BAŞLIK: Cormorant Garamond (İtalik & Zarif) */}
        <h1 className="w-full text-5xl sm:text-6xl md:text-7xl mb-8 tracking-wide animate-float drop-shadow-2xl" style={{
            color: '#E879F9'
          }}>
            {/* pr-2 (padding-right) ekleyerek italik fontun sağa yatmasını dengeliyoruz */}
            <span className="pr-2" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontStyle: 'italic' }}>If I were</span>
            <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 700 }}>...</span>
        </h1>

        {/* 2. ALT YAZI & YANSIMA (İtalik) */}
        <div className="mb-12 space-y-2 flex flex-col items-center w-full">
          
          {/* Asıl Yazı */}
          <p className="text-xl sm:text-2xl md:text-3xl leading-relaxed drop-shadow-lg" style={{ 
            fontFamily: "'Cormorant Garamond', serif", 
            fontStyle: 'italic',
            color: '#E5E5E5', 
            fontWeight: 400
          }}>
            A mirror for the imagined self.
          </p>
          
          {/* Yansıma */}
          <p className="text-xl sm:text-2xl md:text-3xl leading-relaxed transform scale-y-[-1] blur-[0.5px] select-none" style={{ 
            fontFamily: "'Cormorant Garamond', serif", 
            fontStyle: 'italic',
            color: '#E879F9', 
            opacity: 0.3, 
            fontWeight: 400
          }} aria-hidden="true">
            A mirror for the imagined self.
          </p>
        </div>

        {/* 3. BUTON: Tam Ortada */}
        <div className="flex justify-center items-center w-full">
          <Link
            to="/2025"
            className="inline-block px-10 py-3 text-xl rounded-full transition-all duration-300 hover:scale-105 border border-fuchsia-400 shadow-[0_0_15px_rgba(232,121,249,0.3)] hover:shadow-[0_0_30px_rgba(232,121,249,0.6)] backdrop-blur-md bg-black/40"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: 'italic',
              fontWeight: 600,
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