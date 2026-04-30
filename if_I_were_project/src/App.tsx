import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CursorTracker } from './components/CursorTracker';
import { AnimatedMeshBackground } from './components/AnimatedMeshBackground';
import { InteractiveBlob } from './components/InteractiveBlob';
import { VerticalSidebar } from './components/VerticalSidebar';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Year2025 } from './pages/Year2025';
import { Settings } from './pages/Settings';
import { OurStory } from './pages/OurStory';

function App() {
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    return false;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (
      (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i')) ||
      (e.ctrlKey && e.shiftKey && (e.key === 'J' || e.key === 'j')) ||
      (e.ctrlKey && e.shiftKey && (e.key === 'C' || e.key === 'c')) ||
      (e.ctrlKey && (e.key === 'U' || e.key === 'u')) ||
      (e.metaKey && e.shiftKey && (e.key === 'I' || e.key === 'i')) ||
      (e.metaKey && e.shiftKey && (e.key === 'J' || e.key === 'j')) ||
      (e.metaKey && e.shiftKey && (e.key === 'C' || e.key === 'c')) ||
      (e.metaKey && (e.key === 'U' || e.key === 'u')) ||
      e.key === 'F12' ||
      (e.key === 'PrintScreen' || e.key === 'Print')
    ) {
      e.preventDefault();
      return false;
    }
  };

  return (
    <BrowserRouter>
      <AuthProvider>
        <div
          className="min-h-screen relative"
          onContextMenu={handleContextMenu}
          onKeyDown={handleKeyDown}
          style={{ background: 'linear-gradient(to bottom, #0f0f0f, #000000)' }}
        >
          <AnimatedMeshBackground />
          <InteractiveBlob />
          <VerticalSidebar />
          <div
            className="fixed top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#0f0f0f] to-transparent pointer-events-none"
            style={{ zIndex: 0 }}
          />
          <div className="relative flex flex-col min-h-screen" style={{ zIndex: 1 }}>
            <CursorTracker />
            <Header />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/2025" element={<Year2025 />} />
                <Route path="/our-story" element={<OurStory />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
