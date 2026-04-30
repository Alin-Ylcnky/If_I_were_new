import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { api } from '../lib/api';

type AuthContextType = {
  user: { id: string; email: string } | null;
  isAuthorized: boolean;
  loading: boolean;
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchMe = async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      setUser(null);
      setIsAuthorized(false);
      setLoading(false);
      return;
    }

    try {
      const data = await api.get<{ user: { id: string; email: string } }>('/api/auth/me', { auth: true });
      setUser(data.user);
      setIsAuthorized(true);
    } catch (err) {
      console.error('Session validation failed:', err);
      localStorage.removeItem('auth_token');
      setUser(null);
      setIsAuthorized(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMe();
  }, []);

  const signIn = async (email: string, password: string, rememberMe = true) => {
    try {
      const data = await api.post<{ token: string; user: { id: string; email: string } }>('/api/auth/login', {
        email,
        password,
        rememberMe,
      });
      localStorage.setItem('auth_token', data.token);
      setUser(data.user);
      setIsAuthorized(true);
      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err : new Error('Unknown error occurred') };
    }
  };

  const signOut = async () => {
    localStorage.removeItem('auth_token');
    setUser(null);
    setIsAuthorized(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthorized, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
