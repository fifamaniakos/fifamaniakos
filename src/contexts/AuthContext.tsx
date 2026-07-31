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
    const { data: taken } = await supabase.rpc('gamertag_taken', {
      p_gamertag: gamertag,
      p_platform: platform,
    });

    if (taken) {
      return { error: 'Ese Gamertag ya tiene una cuenta registrada. Iniciá sesión en vez de registrarte de nuevo.' };
    }

    // La fila en `managers` la crea un trigger en la base (ver
    // 004_signup_trigger.sql) a partir de este metadata, con privilegios
    // elevados que no dependen de que ya haya una sesión activa.
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { gamertag, platform } },
    });
    if (error || !data.user) {
      return { error: error?.message ?? 'No se pudo crear la cuenta.' };
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
    // Se relee la sesión directamente (en vez de confiar en el `session` del
    // contexto) porque justo después de signUp() el estado de React puede no
    // haberse actualizado todavía con el evento SIGNED_IN.
    const { data: sessionData } = await supabase.auth.getSession();
    const currentSession = sessionData.session;
    if (!currentSession) {
      return {
        error:
          'No hay sesión activa. Si tu proyecto de Supabase exige confirmar el email, ' +
          'confirmá el mail y volvé a iniciar sesión para vincular tu club.'
      };
    }
    const { error } = await supabase
      .from('managers')
      .update({ club_id: clubId })
      .eq('user_id', currentSession.user.id);
    if (error) return { error: error.message };
    await loadProfile(currentSession.user.id);
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
