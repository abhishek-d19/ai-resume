import React, { useState } from 'react';
import { CheckCircle2, Info, AlertTriangle, Sparkles, X } from 'lucide-react';

export default function NotificationSystem() {
  const [activeToast, setActiveToast] = useState({
    type: 'ai_insight',
    title: 'AI Insight',
    message: 'Quantifying project metrics can boost recruiter response rate by +18%.',
    visible: true
  });

  const notificationTypes = {
    success: {
      type: 'Success',
      bg: '#ECFDF5',
      border: '#A7F3D0',
      text: '#065F46',
      iconColor: '#10B981',
      icon: <CheckCircle2 size={20} />,
      defaultTitle: 'Success',
      defaultMsg: 'Resume v2 exported successfully as ATS-verified PDF.'
    },
    info: {
      type: 'Info',
      bg: '#F0F9FF',
      border: '#BAE6FD',
      text: '#0369A1',
      iconColor: '#0284C7',
      icon: <Info size={20} />,
      defaultTitle: 'Info',
      defaultMsg: 'Document changes automatically synced to cloud.'
    },
    warning: {
      type: 'Warning',
      bg: '#FEF3C7',
      border: '#FDE68A',
      text: '#92400E',
      iconColor: '#F59E0B',
      icon: <AlertTriangle size={20} />,
      defaultTitle: 'Warning',
      defaultMsg: 'Missing 2 required technical keywords for Google SWE role.'
    },
    ai_insight: {
      type: 'AI Insight',
      bg: '#F3E8FF',
      border: '#E9D5FF',
      text: '#6B21A8',
      iconColor: '#9877FF',
      icon: <Sparkles size={20} />,
      defaultTitle: 'AI Insight',
      defaultMsg: 'Quantifying project metrics can boost recruiter response rate by +18%.'
    }
  };

  const triggerNotification = (typeKey) => {
    const config = notificationTypes[typeKey];
    setActiveToast({
      type: typeKey,
      title: config.defaultTitle,
      message: config.defaultMsg,
      visible: true
    });
  };

  return (
    <section className="section-padding" style={{ background: '#FFFFFF', borderTop: '1px solid #F3F4F6' }}>
      <div className="container">
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 20, background: 'rgba(152, 119, 255, 0.15)', color: '#7E22CE', fontSize: '0.8rem', fontWeight: 800, marginBottom: 16 }}>
            <Sparkles size={14} /> DESIGN SYSTEM NOTIFICATIONS
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--color-teal-dark)', letterSpacing: '-0.03em' }}>
            LUMINA NOTIFICATION SYSTEM
          </h2>
          <p style={{ maxWidth: 580, margin: '12px auto 0 auto', fontSize: '1.05rem', color: '#6B7280' }}>
            Four curated, beautifully crafted notification variants designed for real-time candidate feedback.
          </p>
        </div>

        {/* NOTIFICATION SHOWCASE GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, maxWidth: 1040, margin: '0 auto 40px auto' }}>
          
          {/* 1. SUCCESS NOTIFICATION */}
          <div 
            onClick={() => triggerNotification('success')}
            style={{ 
              background: notificationTypes.success.bg, 
              border: `1.5px solid ${notificationTypes.success.border}`, 
              borderRadius: 20, 
              padding: 20, 
              textAlign: 'left',
              cursor: 'pointer',
              boxShadow: '0 10px 25px rgba(16, 185, 129, 0.08)',
              transition: 'transform 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <div style={{ color: notificationTypes.success.iconColor }}>{notificationTypes.success.icon}</div>
              <span style={{ fontWeight: 900, fontSize: '1rem', color: notificationTypes.success.text }}>
                {notificationTypes.success.type}
              </span>
            </div>
            <p style={{ fontSize: '0.88rem', color: notificationTypes.success.text, margin: 0, lineHeight: 1.5, opacity: 0.9 }}>
              {notificationTypes.success.defaultMsg}
            </p>
          </div>

          {/* 2. INFO NOTIFICATION */}
          <div 
            onClick={() => triggerNotification('info')}
            style={{ 
              background: notificationTypes.info.bg, 
              border: `1.5px solid ${notificationTypes.info.border}`, 
              borderRadius: 20, 
              padding: 20, 
              textAlign: 'left',
              cursor: 'pointer',
              boxShadow: '0 10px 25px rgba(2, 132, 199, 0.08)',
              transition: 'transform 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <div style={{ color: notificationTypes.info.iconColor }}>{notificationTypes.info.icon}</div>
              <span style={{ fontWeight: 900, fontSize: '1rem', color: notificationTypes.info.text }}>
                {notificationTypes.info.type}
              </span>
            </div>
            <p style={{ fontSize: '0.88rem', color: notificationTypes.info.text, margin: 0, lineHeight: 1.5, opacity: 0.9 }}>
              {notificationTypes.info.defaultMsg}
            </p>
          </div>

          {/* 3. WARNING NOTIFICATION */}
          <div 
            onClick={() => triggerNotification('warning')}
            style={{ 
              background: notificationTypes.warning.bg, 
              border: `1.5px solid ${notificationTypes.warning.border}`, 
              borderRadius: 20, 
              padding: 20, 
              textAlign: 'left',
              cursor: 'pointer',
              boxShadow: '0 10px 25px rgba(245, 158, 11, 0.08)',
              transition: 'transform 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <div style={{ color: notificationTypes.warning.iconColor }}>{notificationTypes.warning.icon}</div>
              <span style={{ fontWeight: 900, fontSize: '1rem', color: notificationTypes.warning.text }}>
                {notificationTypes.warning.type}
              </span>
            </div>
            <p style={{ fontSize: '0.88rem', color: notificationTypes.warning.text, margin: 0, lineHeight: 1.5, opacity: 0.9 }}>
              {notificationTypes.warning.defaultMsg}
            </p>
          </div>

          {/* 4. AI INSIGHT NOTIFICATION */}
          <div 
            onClick={() => triggerNotification('ai_insight')}
            style={{ 
              background: notificationTypes.ai_insight.bg, 
              border: `1.5px solid ${notificationTypes.ai_insight.border}`, 
              borderRadius: 20, 
              padding: 20, 
              textAlign: 'left',
              cursor: 'pointer',
              boxShadow: '0 10px 25px rgba(152, 119, 255, 0.12)',
              transition: 'transform 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <div style={{ color: notificationTypes.ai_insight.iconColor }}>{notificationTypes.ai_insight.icon}</div>
              <span style={{ fontWeight: 900, fontSize: '1rem', color: notificationTypes.ai_insight.text }}>
                {notificationTypes.ai_insight.type}
              </span>
            </div>
            <p style={{ fontSize: '0.88rem', color: notificationTypes.ai_insight.text, margin: 0, lineHeight: 1.5, opacity: 0.9 }}>
              {notificationTypes.ai_insight.defaultMsg}
            </p>
          </div>

        </div>

        {/* FLOATING ACTIVE NOTIFICATION TOAST PREVIEW */}
        {activeToast.visible && (
          <div style={{ 
            position: 'fixed', 
            top: 24, 
            right: 24, 
            zIndex: 999, 
            background: notificationTypes[activeToast.type].bg, 
            border: `1.5px solid ${notificationTypes[activeToast.type].border}`, 
            borderRadius: 20, 
            padding: '16px 20px', 
            boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
            maxWidth: 380,
            textAlign: 'left',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 12,
            animation: 'floatCard1 0.4s ease'
          }}>
            <div style={{ color: notificationTypes[activeToast.type].iconColor, marginTop: 2 }}>
              {notificationTypes[activeToast.type].icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 900, fontSize: '0.95rem', color: notificationTypes[activeToast.type].text, marginBottom: 2 }}>
                {activeToast.title}
              </div>
              <div style={{ fontSize: '0.85rem', color: notificationTypes[activeToast.type].text, opacity: 0.9, lineHeight: 1.4 }}>
                {activeToast.message}
              </div>
            </div>
            <button 
              onClick={() => setActiveToast({ ...activeToast, visible: false })}
              style={{ background: 'none', border: 'none', color: notificationTypes[activeToast.type].text, cursor: 'pointer', padding: 2, opacity: 0.7 }}
            >
              <X size={16} />
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
