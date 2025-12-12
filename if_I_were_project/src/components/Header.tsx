import { Link, useLocation } from 'react-router-dom';
import { LogOut, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function Header() {
  const { isAuthorized, signOut } = useAuth();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/5 border-b border-white/10 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            to="/"
            className="text-2xl text-cyan-200 hover:text-cyan-100 transition-colors tracking-wide"
            style={{
              fontFamily: 'Allura, cursive',
              textShadow: '0 0 30px rgba(125, 211, 192, 1), 0 0 50px rgba(125, 211, 192, 0.9), 0 0 70px rgba(125, 211, 192, 0.8), 0 0 90px rgba(125, 211, 192, 0.6), 0 0 110px rgba(125, 211, 192, 0.5), 0 0 130px rgba(125, 211, 192, 0.4)'
            }}
          >
            If I were...
          </Link>

          <nav className="flex items-center gap-4">
            {location.pathname !== '/' && (
              <Link
                to="/"
                className="text-slate-300 hover:text-cyan-200 transition-colors text-sm font-light"
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 300,
                  textShadow: '0 0 10px rgba(125, 211, 192, 0.3)'
                }}
              >
                Home
              </Link>
            )}

            {location.pathname !== '/our-story' && (
              <Link
                to="/our-story"
                className="text-slate-300 hover:text-cyan-200 transition-colors text-sm font-light"
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 300,
                  textShadow: '0 0 10px rgba(125, 211, 192, 0.3)'
                }}
              >
                Our Story
              </Link>
            )}

            {isAuthorized ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/settings"
                  className="flex items-center gap-2 px-4 py-2 text-slate-300 hover:text-cyan-200 transition-colors text-sm font-light"
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 300,
                    textShadow: '0 0 10px rgba(125, 211, 192, 0.3)'
                  }}
                >
                  <Settings size={18} />
                  <span>Settings</span>
                </Link>
                <span className="px-3 py-1 bg-cyan-500/10 text-cyan-200 text-sm font-light rounded-full border border-cyan-400/30" style={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 300,
                  textShadow: '0 0 10px rgba(125, 211, 192, 0.5)',
                  boxShadow: '0 0 15px rgba(125, 211, 192, 0.3)'
                }}>
                  Edit Mode
                </span>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 px-4 py-2 text-slate-300 hover:text-cyan-200 transition-colors text-sm font-light"
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 300,
                    textShadow: '0 0 10px rgba(125, 211, 192, 0.3)'
                  }}
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 text-slate-300 hover:text-cyan-200 transition-colors text-sm font-light"
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 300,
                  textShadow: '0 0 10px rgba(125, 211, 192, 0.3)'
                }}
              >
                Login
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
