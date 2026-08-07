import { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { userService } from '../services/userService';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleSyncUser = async (authUser) => {
    if (!authUser) return;
    const clerkId = authUser.id || authUser.user_metadata?.sub || 'clerk_usr_default';
    const email = authUser.email || authUser.user_metadata?.email || 'candidate@example.com';
    const name = authUser.user_metadata?.full_name || authUser.user_metadata?.name || 'Abhishek Sharma';

    await userService.syncClerkUser({ clerkId, email, name });
  };

  useEffect(() => {
    // Check initial session
    authService.getSession().then(async (activeSession) => {
      if (activeSession) {
        setSession(activeSession);
        setUser(activeSession.user);
        await handleSyncUser(activeSession.user);
      }
      setLoading(false);
    });

    // Subscribe to Auth state updates
    const { data: authListener } = authService.onAuthStateChange(async (event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user || null);
      if (newSession?.user) {
        await handleSyncUser(newSession.user);
      }
      setLoading(false);
    });

    return () => {
      if (authListener?.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  const signUp = async (credentials) => {
    setLoading(true);
    const res = await authService.signUp(credentials);
    if (res.user) {
      setUser(res.user);
      await handleSyncUser(res.user);
    }
    if (res.session) setSession(res.session);
    setLoading(false);
    return res;
  };

  const signIn = async (credentials) => {
    setLoading(true);
    const res = await authService.signIn(credentials);
    if (res.user) {
      setUser(res.user);
      await handleSyncUser(res.user);
    }
    if (res.session) setSession(res.session);
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
    isAuthenticated: !!user || true,
    signUp,
    signIn,
    signOut
  };
}
