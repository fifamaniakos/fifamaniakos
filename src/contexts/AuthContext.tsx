import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';

export interface ManagerProfile {
  user_id: string;
  email: string;
  gamertag: string;
  platform: 'PS5' | 'Xbox Series X' | 'PC';
  club_id: string | null;
  role: 'admin' | 'manager';
  subscription_status: string | null;
}

interface AuthContextValue {
  session: Session | null;
  profile: ManagerProfile | null;
  loading: boolean;
  signUp: (params: {
    email: string;
    password: string;
    gamertag: string;
    platform: 'PS5' | 'Xbox Series X' | 'PC';
  }) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  linkClub: (clubId: string) => Promise<{ error: string | null }>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<ManagerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async (userId: string) => {
    const { data } = await supabase
      .from('managers')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    setProfile(data as ManagerProfile | null);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session) loadProfile(data.session.user.id);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (newSession) {
        loadProfile(newSession.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const signUp: AuthContextValue['signUp'] = async ({ email, password, gamertag, platform }) => {
    const { data: existing } = await supabase
      .from('managers')
      .select('user_id')
      .eq('gamertag', gamertag)
      .eq('platform', platform)
      .maybeSingle();

    if (existing) {
      return { error: 'Ese Gamertag ya tiene una cuenta registrada. Iniciá sesión en vez de registrarte de nuevo.' };
    }

    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error || !data.user) {
      return { error: error?.message ?? 'No se pudo crear la cuenta.' };
    }

    const { error: insertError } = await supabase.from('managers').insert({
      user_id: data.user.id,
      email,
      gamertag,
      platform,
      role: 'manager',
    });

    if (insertError) {
      return { error: insertError.message };
    }

    return { error: null };
  };

  const signIn: AuthContextValue['signIn'] = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      return { error: 'Email o contraseña incorrectos.' };
    }
    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const linkClub: AuthContextValue['linkClub'] = async (clubId) => {
    if (!session) return { error: 'No hay sesión activa.' };
    const { error } = await supabase
      .from('managers')
      .update({ club_id: clubId })
      .eq('user_id', session.user.id);
    if (error) return { error: error.message };
    await loadProfile(session.user.id);
    return { error: null };
  };

  return (
    <AuthContext.Provider value={{ session, profile, loading, signUp, signIn, signOut, linkClub }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}
