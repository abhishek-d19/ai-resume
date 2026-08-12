import React, { useState } from 'react';
import { User, Lock, ArrowRight, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function AuthScreen({ navigateToView, onAuthSuccess }) {
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState('candidate@example.com');
  const [password, setPassword] = useState('••••••••••••');
  const [fullName, setFullName] = useState('Tony Stark');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('[Auth Diagnostic Step 1]: Form submit triggered', { isSignUp });

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      console.warn('[Auth Diagnostic Step 2]: Validation failed - empty email or password');
      setError('Please enter a valid email address and password.');
      return;
    }

    console.log('[Auth Diagnostic Step 3]: Invoking authentication service...');
    setSubmitting(true);
    setError(null);

    try {
      if (isSignUp) {
        console.log('[Auth Diagnostic Step 4]: Invoking signUp with profile payload...');
        const authData = await signUp(trimmedEmail, trimmedPassword, { fullName: fullName.trim() });
        console.log('[Auth Diagnostic Step 5]: Sign up succeeded:', authData);
      } else {
        console.log('[Auth Diagnostic Step 4]: Invoking signIn...');
        const authData = await signIn(trimmedEmail, trimmedPassword);
        console.log('[Auth Diagnostic Step 5]: Sign in succeeded:', authData);
      }

      if (onAuthSuccess) {
        onAuthSuccess();
      } else if (navigateToView) {
        navigateToView('dashboard');
      }
    } catch (err) {
      console.error('[Auth Diagnostic Error]: Exception caught during authentication process:', err);
      const errMsg = err?.message || 'Authentication failed. Please verify your credentials and try again.';
      setError(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ maxWidth: 420, width: '100%', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 24, padding: 36, boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ width: 48, height: 48, borderRadius: 16, background: '#0284C7', color: '#FFFFFF', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.4rem', marginBottom: 12 }}>
            L
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
            {isSignUp ? 'Create your Lumina AI account' : 'Sign in to Lumina AI'}
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#64748B', marginTop: 4 }}>
            {isSignUp ? 'Executive Resume Intelligence & Career Copilot' : 'Welcome back to your career copilot workspace'}
          </p>
        </div>

        {error && (
          <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: 14, padding: 14, marginBottom: 20, display: 'flex', alignItems: 'flex-start', gap: 10, color: '#991B1B', fontSize: '0.82rem' }}>
            <AlertCircle size={18} style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <strong style={{ display: 'block', marginBottom: 2 }}>Authentication Exception</strong>
              <span>{error}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {isSignUp && (
            <div style={{ textAlign: 'left', marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#475569', marginBottom: 6, textTransform: 'uppercase' }}>
                Full Name
              </label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: 14, top: 14, color: '#94A3B8' }} />
                <input 
                  type="text" 
                  placeholder="Tony Stark"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  style={{ width: '100%', padding: '12px 14px 12px 40px', borderRadius: 12, border: '1px solid #CBD5E1', outline: 'none', fontSize: '0.9rem', fontFamily: 'inherit' }}
                />
              </div>
            </div>
          )}

          <div style={{ textAlign: 'left', marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#475569', marginBottom: 6, textTransform: 'uppercase' }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <User size={16} style={{ position: 'absolute', left: 14, top: 14, color: '#94A3B8' }} />
              <input 
                type="email" 
                placeholder="tony.stark@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', padding: '12px 14px 12px 40px', borderRadius: 12, border: '1px solid #CBD5E1', outline: 'none', fontSize: '0.9rem', fontFamily: 'inherit' }}
              />
            </div>
          </div>

          <div style={{ textAlign: 'left', marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#475569', marginBottom: 6, textTransform: 'uppercase' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: 14, top: 14, color: '#94A3B8' }} />
              <input 
                type="password" 
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', padding: '12px 14px 12px 40px', borderRadius: 12, border: '1px solid #CBD5E1', outline: 'none', fontSize: '0.9rem', fontFamily: 'inherit' }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            style={{ width: '100%', padding: 14, borderRadius: 14, background: '#0284C7', color: '#FFFFFF', border: 'none', fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: submitting ? 0.7 : 1 }}
          >
            {submitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Processing...
              </>
            ) : (
              <>
                {isSignUp ? 'Create Free Account' : 'Sign In'}
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div style={{ marginTop: 24, textAlign: 'center', paddingTop: 20, borderTop: '1px solid #F1F5F9' }}>
          <button
            type="button"
            onClick={() => { setIsSignUp(!isSignUp); setError(null); }}
            style={{ background: 'none', border: 'none', color: '#0284C7', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
          >
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
}
