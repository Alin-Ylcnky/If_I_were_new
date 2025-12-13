import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

export function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      console.log('Checking authorization for email:', email);

      const { data: authData, error: authError } = await supabase
        .from('authorized_users')
        .select('email')
        .eq('email', email.toLowerCase().trim())
        .maybeSingle();

      if (authError) {
        console.error('Authorization check error:', authError);
        setError('Unable to verify authorization. Please try again or contact the site administrator.');
        setLoading(false);
        return;
      }

      if (!authData) {
        console.log('Email not found in authorized_users table');
        setError('This email is not authorized to create an account. Please contact the site administrator.');
        setLoading(false);
        return;
      }

      console.log('Email is authorized, proceeding with signup');

      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin + '/login',
        },
      });

      if (signUpError) {
        console.error('Signup error:', signUpError);
        if (signUpError.message.includes('already registered') || signUpError.message.includes('User already registered')) {
          setError('This email is already registered. Please login instead.');
        } else {
          setError(signUpError.message || 'Failed to create account. Please try again.');
        }
        setLoading(false);
        return;
      }

      navigate('/login', {
        state: {
          message: 'Account created successfully! You can now login.'
        }
      });
    } catch (err) {
      console.error('Unexpected signup error:', err);
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center px-4 py-20">
      <div className="card-glow backdrop-blur-sm rounded-2xl p-8 w-full max-w-md border border-white/10 animate-fadeIn transition-shadow duration-300" style={{ background: 'rgba(30, 30, 30, 0.8)' }}>
        <h2 className="text-4xl mb-2 text-center tracking-tight" style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontWeight: 500, color: '#E5E5E5' }}>
          Create Account
        </h2>
        <p className="text-center mb-2 leading-relaxed" style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, color: '#A3A3A3' }}>
          Sign up to access your creative canvas
        </p>
        <p className="text-center mb-8 text-sm" style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', color: '#666666' }}>
          Only authorized emails can create an account
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-lg p-4 flex items-start gap-3 border border-red-500/30" style={{ background: 'rgba(220, 38, 38, 0.1)' }}>
              <AlertCircle className="mt-0.5 flex-shrink-0" size={20} style={{ color: '#ef4444' }} />
              <p className="text-sm" style={{ color: '#fca5a5' }}>{error}</p>
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm mb-2" style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, color: '#A3A3A3' }}>
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border border-white/20 focus:ring-2 focus:ring-white/30 focus:border-transparent outline-none transition-all"
              style={{ background: 'rgba(255, 255, 255, 0.05)', color: '#E5E5E5', fontFamily: "'Manrope', sans-serif" }}
              placeholder="you@example.com"
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
              placeholder="At least 6 characters"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm mb-2" style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, color: '#A3A3A3' }}>
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border border-white/20 focus:ring-2 focus:ring-white/30 focus:border-transparent outline-none transition-all"
              style={{ background: 'rgba(255, 255, 255, 0.05)', color: '#E5E5E5', fontFamily: "'Manrope', sans-serif" }}
              placeholder="Confirm your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="text-glow w-full py-3 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-white/20 hover:border-white/40 hover:scale-105 transform"
            style={{ background: 'rgba(255, 255, 255, 0.1)', color: '#E5E5E5', fontFamily: "'Manrope', sans-serif", fontWeight: 500 }}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>

          <div className="text-center mt-4">
            <p className="text-sm" style={{ fontFamily: "'Manrope', sans-serif", color: '#A3A3A3' }}>
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-glow transition-colors"
                style={{ color: '#E5E5E5', fontWeight: 500 }}
              >
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
