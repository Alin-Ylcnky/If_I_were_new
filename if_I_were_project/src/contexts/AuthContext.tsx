import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isAuthorized: boolean;
  loading: boolean;
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAuthorization = async (userEmail: string | undefined) => {
    if (!userEmail) {
      setIsAuthorized(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('authorized_users')
        .select('email')
        .eq('email', userEmail)
        .maybeSingle();

      if (error) {
        console.error('Authorization check error:', error);
        setIsAuthorized(false);
        return;
      }

      const isAuth = data !== null;
      console.log('Authorization check for', userEmail, ':', isAuth);
      setIsAuthorized(isAuth);
    } catch (err) {
      console.error('Unexpected error during authorization check:', err);
      setIsAuthorized(false);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user?.email) {
        checkAuthorization(session.user.email).finally(() => setLoading(false));
      } else {
        setIsAuthorized(false);
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      (async () => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user?.email) {
          await checkAuthorization(session.user.email);
        } else {
          setIsAuthorized(false);
        }
      })();
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string, rememberMe = true) => {
    try {
      console.log('Attempting sign in for:', email);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign in error from Supabase:', error);
        return { error };
      }

      console.log('Sign in successful, session created');

      if (!rememberMe && data.session) {
        sessionStorage.setItem('creative-canvas-session', JSON.stringify(data.session));
        localStorage.removeItem('creative-canvas-auth');
      }

      if (data.user?.email) {
        await checkAuthorization(data.user.email);

        const { data: authData } = await supabase
          .from('authorized_users')
          .select('email')
          .eq('email', data.user.email)
          .maybeSingle();

        if (!authData) {
          await supabase.auth.signOut();
          return { error: new Error('This account is not authorized to access this application. Please contact the administrator.') };
        }
      }

      return { error: null };
    } catch (err) {
      console.error('Unexpected error during sign in:', err);
      return { error: err instanceof Error ? err : new Error('Unknown error occurred') };
    }
  };


  const signOut = async () => {
    await supabase.auth.signOut();
    setIsAuthorized(false);
  };

  return (
    <AuthContext.Provider value={{ user, session, isAuthorized, loading, signIn, signOut }}>
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
