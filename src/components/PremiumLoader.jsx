import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';

export default function PremiumLoader({ messages = [], onComplete, title = "Processing Analysis" }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progressPercent, setProgressPercent] = useState(10);

  useEffect(() => {
    if (messages.length === 0) return;

    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < messages.length - 1) {
          const next = prev + 1;
          setProgressPercent(Math.round(((next + 1) / messages.length) * 100));
          return next;
        } else {
          clearInterval(interval);
          setProgressPercent(100);
          if (onComplete) {
            setTimeout(onComplete, 800);
          }
          return prev;
        }
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [messages, onComplete]);

  return (
    <div style={{ 
      background: '#FFFFFF', 
      borderRadius: 24, 
      padding: '48px 36px', 
      textAlign: 'center', 
      border: '1px solid rgba(56, 232, 245, 0.4)', 
      boxShadow: '0 20px 50px rgba(56, 232, 245, 0.15)',
      maxWidth: 580,
      margin: '0 auto'
    }}>
      {/* Pulse Glowing Loader Icon */}
      <div 
        style={{ 
          width: 72, 
          height: 72, 
          borderRadius: '50%', 
          background: 'var(--color-cyan-light)', 
          color: 'var(--color-teal-dark)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          margin: '0 auto 24px auto',
          boxShadow: '0 0 40px rgba(56, 232, 245, 0.7)',
          animation: 'pulseGlow 2s infinite ease-in-out'
        }}
      >
        <Sparkles size={32} />
      </div>

      <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--color-teal-dark)', marginBottom: 8 }}>
        {title}
      </h3>

      {/* Staged Message Indicator */}
      <div style={{ fontSize: '1rem', fontWeight: 700, color: '#059669', marginBottom: 20, minHeight: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        <Sparkles size={16} />
        <span>{messages[currentStepIndex] || "Analyzing..."}</span>
      </div>

      {/* Progress Bar Container */}
      <div style={{ width: '100%', height: 8, background: '#F1F5F9', borderRadius: 4, overflow: 'hidden', marginBottom: 32 }}>
        <div 
          style={{ 
            width: `${progressPercent}%`, 
            height: '100%', 
            background: 'linear-gradient(90deg, #9877FF, #38E8F5)', 
            transition: 'width 0.8s ease'
          }} 
        />
      </div>

      {/* Skeleton Loaders Showing Alive Progress */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, textAlign: 'left' }}>
        {[...Array(3)].map((_, idx) => (
          <div key={idx} style={{ background: '#F8FAFC', padding: 14, borderRadius: 12, border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: idx <= currentStepIndex ? '#10B981' : '#CBD5E1' }} />
            <div style={{ height: 10, width: `${70 - idx * 15}%`, background: '#E2E8F0', borderRadius: 5 }} />
          </div>
        ))}
      </div>
    </div>
  );
}
