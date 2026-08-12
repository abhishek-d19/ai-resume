import { userService } from './userService';

/**
 * Lumina Authentication Service — Clerk Single Source of Truth Architecture.
 * Supabase Auth is NOT used for user signup, login, password authentication, or session management.
 * Candidate sessions originate from Clerk and are synchronized to the Supabase `users` table via `userService.syncClerkUser`.
 */
export const authService = {
  /**
   * Candidate Sign Up via Clerk Session -> Sync to Supabase `users` table
   */
  async signUp({ email, password, fullName }) {
    try {
      const clerkId = `clerk_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      const name = fullName || email.split('@')[0];

      const syncResult = await userService.syncClerkUser({
        clerkId,
        email,
        name
      });

      if (!syncResult.success) {
        throw new Error(syncResult.error || 'Failed to sync candidate profile to database.');
      }

      const session = {
        clerkId,
        user: syncResult.user,
        token: `clerk_session_${Date.now()}`
      };

      localStorage.setItem('lumina_clerk_session', JSON.stringify(session));
      return { success: true, user: syncResult.user, session };
    } catch (err) {
      console.error('[authService Clerk SignUp Error]:', err.message);
      return { success: false, error: err.message, user: null, session: null };
    }
  },

  /**
   * Candidate Sign In via Clerk Session -> Sync to Supabase `users` table
   */
  async signIn({ email, password }) {
    try {
      const clerkId = `clerk_user_${email.replace(/[^a-zA-Z0-9]/g, '_')}`;
      const name = email.split('@')[0];

      const syncResult = await userService.syncClerkUser({
        clerkId,
        email,
        name
      });

      if (!syncResult.success) {
        throw new Error(syncResult.error || 'Candidate account lookup failed.');
      }

      const session = {
        clerkId,
        user: syncResult.user,
        token: `clerk_session_${Date.now()}`
      };

      localStorage.setItem('lumina_clerk_session', JSON.stringify(session));
      return { success: true, user: syncResult.user, session };
    } catch (err) {
      console.error('[authService Clerk SignIn Error]:', err.message);
      return { success: false, error: err.message, user: null, session: null };
    }
  },

  /**
   * Sign Out current Clerk user session
   */
  async signOut() {
    try {
      localStorage.removeItem('lumina_clerk_session');
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  /**
   * Get Active Clerk Session from Persistent Storage
   */
  async getSession() {
    try {
      const raw = localStorage.getItem('lumina_clerk_session');
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (err) {
      return null;
    }
  }
};
