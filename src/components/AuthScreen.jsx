import React, { useState } from 'react';
import { User, Lock, ArrowRight, ShieldCheck, Sparkles, Check, Globe } from 'lucide-react';

export default function AuthScreen({ navigateToView }) {
  const [isSignUp, setIsSignUp] = useState(true);

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

          <p style={{ fontSize: '0.9rem', color: '#64748B', marginBottom: 28, lineHeight: 1.5 }}>
            {isSignUp 
              ? "Start your journey toward interview-ready executive resume confidence." 
              : "Sign in to access your Lumina Mission Control dashboard."}
          </p>

          <form onSubmit={(e) => { e.preventDefault(); navigateToView('dashboard'); }}>
            <div style={{ textAlign: 'left', marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#475569', marginBottom: 6, textTransform: 'uppercase' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: 14, top: 14, color: '#94A3B8' }} />
                <input 
                  type="email" 
                  defaultValue="abhishek@example.com"
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
                  defaultValue="••••••••••••"
                  required
                  style={{ width: '100%', padding: '12px 14px 12px 40px', borderRadius: 12, border: '1px solid #CBD5E1', outline: 'none', fontSize: '0.9rem', fontFamily: 'inherit' }}
                />
              </div>
            </div>

            <button type="submit" className="btn-cyan-pill" style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '1rem', marginBottom: 16 }}>
              <span>{isSignUp ? "Continue to Dashboard" : "Sign In to Dashboard"}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          <div style={{ fontSize: '0.85rem', color: '#64748B' }}>
            {isSignUp ? "Already have an account?" : "Don't have an account yet?"}{" "}
            <button 
              onClick={() => setIsSignUp(!isSignUp)}
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
