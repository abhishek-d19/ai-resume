import React, { useState } from 'react';
import { User, Lock, ArrowRight, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function AuthScreen({ navigateToView, onAuthSuccess }) {
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState('candidate@example.com');
  const [password, setPassword] = useState('••••••••••••');
  const [fullName, setFullName] = useState('Abhishek Sharma');
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
      const res = isSignUp
        ? await signUp({ email: trimmedEmail, password: trimmedPassword, fullName: fullName.trim() || 'Candidate' })
        : await signIn({ email: trimmedEmail, password: trimmedPassword });

      console.log('[Auth Diagnostic Step 4]: Authentication service result', { success: res.success });

      if (res.success) {
        console.log('[Auth Diagnostic Step 5]: Navigating to Dashboard...');
        if (onAuthSuccess) {
          onAuthSuccess();
        } else if (navigateToView) {
          navigateToView('dashboard');
        }
      } else {
        setError(res.error || 'Authentication failed. Please check your email and password.');
      }
    } catch (err) {
      console.error('[Auth Diagnostic Exception]:', err.message);
      setError(err.message || "Account created, but we couldn't finish setting up your profile. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="section-padding" style={{ background: '#F9F9FB', minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <div className="container">
        
        {/* Breadcrumb Navigation */}
        <div style={{ maxWidth: 480, margin: '0 auto 20px auto', display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', color: '#64748B' }}>
          <span onClick={() => navigateToView('landing')} style={{ cursor: 'pointer', fontWeight: 600 }}>Home</span>
          <span>/</span>
          <span style={{ color: 'var(--color-teal-dark)', fontWeight: 800 }}>Authentication</span>
        </div>

        {/* Auth Card Box */}
        <div style={{ 
          background: '#FFFFFF', 
          borderRadius: 24, 
          padding: 40, 
          maxWidth: 480, 
          margin: '0 auto', 
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.1)', 
          border: '1px solid #E2E8F0',
          textAlign: 'center'
        }}>
          
          <div style={{ width: 56, height: 56, borderRadius: 16, background: 'var(--color-cyan-light)', color: 'var(--color-teal-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
            <ShieldCheck size={28} />
          </div>

          <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--color-teal-dark)', marginBottom: 8 }}>
            {isSignUp ? "Create Your Account" : "Welcome Back"}
          </h2>

          <p style={{ fontSize: '0.9rem', color: '#64748B', marginBottom: 24, lineHeight: 1.5 }}>
            {isSignUp 
              ? "Start your journey toward interview-ready executive resume confidence." 
              : "Sign in to access your Lumina Mission Control dashboard."}
          </p>

          {/* Authentication Error Banner */}
          {error && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', padding: '10px 14px', borderRadius: 12, color: '#991B1B', fontSize: '0.82rem', fontWeight: 600, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8, textAlign: 'left' }}>
              <AlertCircle size={16} style={{ shrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            
            {/* Full Name Field for Sign Up */}
            {isSignUp && (
              <div style={{ textAlign: 'left', marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#475569', marginBottom: 6, textTransform: 'uppercase' }}>
                  Full Name
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={16} style={{ position: 'absolute', left: 14, top: 14, color: '#94A3B8' }} />
                  <input 
                    type="text" 
                    placeholder="Abhishek Sharma"
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
                  placeholder="candidate@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
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
                  required
                  style={{ width: '100%', padding: '12px 14px 12px 40px', borderRadius: 12, border: '1px solid #CBD5E1', outline: 'none', fontSize: '0.9rem', fontFamily: 'inherit' }}
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={submitting}
              className="btn-cyan-pill" 
              style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '1rem', marginBottom: 16, cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1 }}
            >
              <span>
                {submitting 
                  ? 'Authenticating...' 
                  : isSignUp 
                    ? "Continue to Dashboard" 
                    : "Sign In to Dashboard"
                }
              </span>
              {submitting ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
            </button>
          </form>

          <div style={{ fontSize: '0.85rem', color: '#64748B' }}>
            {isSignUp ? "Already have an account?" : "Don't have an account yet?"}{" "}
            <button 
              onClick={() => { setIsSignUp(!isSignUp); setError(null); }}
              style={{ background: 'none', border: 'none', color: 'var(--color-teal-dark)', fontWeight: 800, cursor: 'pointer', textDecoration: 'underline' }}
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
