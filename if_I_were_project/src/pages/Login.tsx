import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function Login() {
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const savedRememberMe = localStorage.getItem('rememberMe');
    if (savedRememberMe !== null) {
      setRememberMe(savedRememberMe === 'true');
    }

    const message = (location.state as { message?: string })?.message;
    if (message) {
      setSuccessMessage(message);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      localStorage.setItem('rememberMe', rememberMe.toString());

      const { error } = await signIn(loginId, password, rememberMe);

      if (error) {
        console.error('Login error:', error);
        setError(error.message || 'Login failed. Please try again.');
        setLoading(false);
      } else {
        navigate('/2025');
      }
    } catch (err) {
      console.error('Unexpected login error:', err);
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center px-4 py-20">
      <div className="card-glow backdrop-blur-sm rounded-2xl p-8 w-full max-w-md border border-white/10 animate-fadeIn transition-shadow duration-300" style={{ background: 'rgba(30, 30, 30, 0.8)' }}>
        <h2 className="text-4xl mb-2 text-center tracking-tight" style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontWeight: 500, color: '#E5E5E5' }}>
          Welcome Back
        </h2>
        <p className="text-center mb-2 leading-relaxed" style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, color: '#A3A3A3' }}>
          Sign in to edit your creative canvas
        </p>
        <p className="text-center mb-8 text-sm" style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', color: '#666666' }}>
          This is a private creative space
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-lg p-4 flex items-start gap-3 border border-red-500/30" style={{ background: 'rgba(220, 38, 38, 0.1)' }}>
              <AlertCircle className="mt-0.5 flex-shrink-0" size={20} style={{ color: '#ef4444' }} />
              <p className="text-sm" style={{ color: '#fca5a5' }}>{error}</p>
            </div>
          )}

          {successMessage && (
            <div className="rounded-lg p-4 flex items-start gap-3 border border-green-500/30" style={{ background: 'rgba(34, 197, 94, 0.1)' }}>
              <CheckCircle className="mt-0.5 flex-shrink-0" size={20} style={{ color: '#22c55e' }} />
              <p className="text-sm" style={{ color: '#86efac' }}>{successMessage}</p>
            </div>
          )}

          <div>
            <label htmlFor="loginId" className="block text-sm mb-2" style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, color: '#A3A3A3' }}>
              User ID
            </label>
            <input
              id="loginId"
              type="text"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border border-white/20 focus:ring-2 focus:ring-white/30 focus:border-transparent outline-none transition-all"
              style={{ background: 'rgba(255, 255, 255, 0.05)', color: '#E5E5E5', fontFamily: "'Manrope', sans-serif" }}
              placeholder="Alin or Kelsey"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm mb-2" style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, color: '#A3A3A3' }}>
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border border-white/20 focus:ring-2 focus:ring-white/30 focus:border-transparent outline-none transition-all"
              style={{ background: 'rgba(255, 255, 255, 0.05)', color: '#E5E5E5', fontFamily: "'Manrope', sans-serif" }}
              placeholder="Enter your password"
            />
          </div>

          <div className="flex items-center">
            <input
              id="rememberMe"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-white/30 focus:ring-white/30 focus:ring-2"
              style={{ accentColor: '#E5E5E5' }}
            />
            <label htmlFor="rememberMe" className="ml-2 block text-sm" style={{ fontFamily: "'Manrope', sans-serif", color: '#A3A3A3' }}>
              Remember me
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="text-glow w-full py-3 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-white/20 hover:border-white/40 hover:scale-105 transform"
            style={{ background: 'rgba(255, 255, 255, 0.1)', color: '#E5E5E5', fontFamily: "'Manrope', sans-serif", fontWeight: 500 }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

        </form>
      </div>
    </div>
  );
}
