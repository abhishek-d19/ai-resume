import React, { useState } from 'react';
import { Play, X, Volume2, Maximize, CheckCircle2 } from 'lucide-react';

export default function VideoShowcase() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section id="demo" className="section-padding" style={{ background: '#FFFFFF', borderTop: '1px solid #F3F4F6', borderBottom: '1px solid #F3F4F6' }}>
      <div className="container" style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.25rem)', marginBottom: 12, color: 'var(--color-text-dark)' }}>
          WATCH<br />
          <span style={{ color: 'var(--color-teal-dark)' }}>THE REAL THING</span><br />
          IN ACTION
        </h2>
        <p style={{ maxWidth: 540, margin: '0 auto 48px auto' }}>
          See how leading design teams automate token pipelines from Figma directly to multi-repository production code in minutes.
        </p>

        {/* Main Video Showcase Frame */}
        <div 
          style={{ 
            position: 'relative', 
            maxWidth: 1000, 
            margin: '0 auto', 
            borderRadius: 24, 
            overflow: 'hidden',
            boxShadow: '0 30px 70px -15px rgba(0, 0, 0, 0.2)',
            border: '2px solid rgba(0, 0, 0, 0.06)',
            background: '#0D1117',
            cursor: 'pointer'
          }}
          onClick={() => setIsPlaying(true)}
        >
          {/* Mock Video Preview Content */}
          <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%', background: 'linear-gradient(135deg, #032D30 0%, #0D1117 100%)' }}>
            
            {/* Overlay Simulated Interface Elements */}
            <div style={{ position: 'absolute', inset: 0, padding: 32, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: 'radial-gradient(circle at center, rgba(56,232,245,0.08) 0%, transparent 70%)' }}>
              
              {/* Top Bar inside Video */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#FFF' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(0,0,0,0.6)', padding: '6px 14px', borderRadius: 20, backdropFilter: 'blur(8px)' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981' }}></span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>STUDIO PLATFORM DEMO</span>
                </div>
                <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>4K • 60 FPS</div>
              </div>

              {/* Center Play Button Pulse Animation */}
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                <div 
                  className="btn-cyan-pill" 
                  style={{ 
                    width: 84, 
                    height: 84, 
                    borderRadius: '50%', 
                    padding: 0, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    boxShadow: '0 0 40px rgba(56, 232, 245, 0.8)',
                    animation: 'pulseGlow 2.5s infinite ease-in-out'
                  }}
                >
                  <Play size={36} fill="currentColor" style={{ marginLeft: 6 }} />
                </div>
                <div style={{ color: '#FFF', fontWeight: 800, fontSize: '0.9rem', marginTop: 16, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Click to Watch Demo (3 mins)
                </div>
              </div>

              {/* Bottom Speaker Overlay */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'rgba(0,0,0,0.75)', padding: '10px 18px', borderRadius: 16, width: 'fit-content', backdropFilter: 'blur(8px)', textAlign: 'left' }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, #38E8F5, #9877FF)', display: 'flex', alignItems: 'center', justifyCenter: 'center', color: '#032D30', fontWeight: 900, fontSize: '1rem' }}>
                  TS
                </div>
                <div>
                  <div style={{ color: '#FFF', fontWeight: 700, fontSize: '0.9rem' }}>Studio Founder Walkthrough</div>
                  <div style={{ color: '#9CA3AF', fontSize: '0.75rem' }}>Building multi-brand design systems with automated tokens</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fullscreen Video Modal Layer */}
        {isPlaying && (
          <div 
            style={{ 
              position: 'fixed', 
              inset: 0, 
              zIndex: 1000, 
              background: 'rgba(0,0,0,0.92)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              padding: 24,
              backdropFilter: 'blur(12px)'
            }}
          >
            <div style={{ position: 'relative', width: '100%', maxWidth: 1000, background: '#000', borderRadius: 20, overflow: 'hidden', boxShadow: '0 25px 60px rgba(0,0,0,0.5)' }}>
              <button 
                onClick={() => setIsPlaying(false)}
                style={{ position: 'absolute', top: 16, right: 16, zIndex: 10, background: '#38E8F5', color: '#032D30', padding: 8, borderRadius: '50%', cursor: 'pointer' }}
              >
                <X size={24} />
              </button>

              <div style={{ padding: '60px 40px', color: '#FFF', textAlign: 'center' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#38E8F5', color: '#032D30', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
                  <Play size={32} fill="currentColor" />
                </div>
                <h3 style={{ fontSize: '1.75rem', marginBottom: 12 }}>Studio Platform Video Demonstration</h3>
                <p style={{ maxWidth: 500, margin: '0 auto 24px auto', color: '#9CA3AF' }}>
                  Simulated Video Player. Live automated token transformations active.
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
                  <button onClick={() => setIsPlaying(false)} className="btn-cyan-pill">
                    CLOSE PLAYER
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
