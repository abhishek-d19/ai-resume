import { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { userService } from '../services/userService';

/**
 * Custom React Hook for Lumina Candidate Authentication.
 * Single Source of Truth: Clerk Signup/Login -> Sync to Supabase `users` table -> Dashboard.
 * Supabase Auth is NOT used for user auth or session management.
 */
export function useAuth() {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check initial Clerk active session
    authService.getSession().then(async (activeSession) => {
      if (activeSession && activeSession.user) {
        setSession(activeSession);
        setUser(activeSession.user);

        // Ensure latest profile is synced to Supabase users table
        await userService.syncClerkUser({
          clerkId: activeSession.clerkId || activeSession.user.clerk_id || activeSession.user.id,
          email: activeSession.user.email,
          name: activeSession.user.name || activeSession.user.email.split('@')[0]
        });
      } else {
        setSession(null);
        setUser(null);
      }
      setLoading(false);
    });
  }, []);

  const signUp = async (credentials) => {
    setLoading(true);
    const res = await authService.signUp(credentials);
    if (res.success && res.user) {
      setUser(res.user);
      setSession(res.session);
    }
    setLoading(false);
    return res;
  };

  const signIn = async (credentials) => {
    setLoading(true);
    const res = await authService.signIn(credentials);
    if (res.success && res.user) {
      setUser(res.user);
      setSession(res.session);
    }
    setLoading(false);
    return res;
  };

  const signOut = async () => {
    setLoading(true);
    await authService.signOut();
    setUser(null);
    setSession(null);
    setLoading(false);
  };

  return {
    user,
    session,
    loading,
    isAuthenticated: Boolean(user && session),
    signUp,
    signIn,
    signOut
  };
}
