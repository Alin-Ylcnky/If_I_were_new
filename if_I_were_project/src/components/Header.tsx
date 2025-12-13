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
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/20 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            to="/"
            className="text-2xl transition-colors tracking-wide text-glow"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: 'italic',
              fontWeight: 400,
              color: '#E5E5E5'
            }}
          >
            If I were...
          </Link>

          <nav className="flex items-center gap-4">
            {location.pathname !== '/' && (
              <Link
                to="/"
                className="text-glow transition-colors text-sm"
                style={{
                  fontFamily: "'Manrope', sans-serif",
                  fontWeight: 400,
                  color: '#A3A3A3'
                }}
              >
                Home
              </Link>
            )}

            {location.pathname !== '/our-story' && (
              <Link
                to="/our-story"
                className="text-glow transition-colors text-sm"
                style={{
                  fontFamily: "'Manrope', sans-serif",
                  fontWeight: 400,
                  color: '#A3A3A3'
                }}
              >
                Our Story
              </Link>
            )}

            {isAuthorized ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/settings"
                  className="text-glow flex items-center gap-2 px-4 py-2 transition-colors text-sm"
                  style={{
                    fontFamily: "'Manrope', sans-serif",
                    fontWeight: 400,
                    color: '#A3A3A3'
                  }}
                >
                  <Settings size={18} />
                  <span>Settings</span>
                </Link>
                <span className="px-3 py-1 text-sm rounded-full border border-white/20" style={{
                  fontFamily: "'Manrope', sans-serif",
                  fontWeight: 400,
                  color: '#E5E5E5',
                  background: 'rgba(255, 255, 255, 0.05)'
                }}>
                  Edit Mode
                </span>
                <button
                  onClick={handleSignOut}
                  className="text-glow flex items-center gap-2 px-4 py-2 transition-colors text-sm"
                  style={{
                    fontFamily: "'Manrope', sans-serif",
                    fontWeight: 400,
                    color: '#A3A3A3'
                  }}
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="text-glow px-4 py-2 transition-colors text-sm"
                style={{
                  fontFamily: "'Manrope', sans-serif",
                  fontWeight: 400,
                  color: '#A3A3A3'
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
