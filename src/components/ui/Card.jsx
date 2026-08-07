import React from 'react';

export function Card({ children, variant = 'default', padding = 24, className = '', style = {} }) {
  let bg = '#FFFFFF';
  let border = '1px solid #E2E8F0';
  let shadow = '0 10px 30px rgba(0,0,0,0.04)';

  if (variant === 'glass') {
    bg = 'rgba(255, 255, 255, 0.85)';
    border = '1px solid rgba(255, 255, 255, 0.4)';
    shadow = '0 20px 40px rgba(0, 0, 0, 0.08)';
  } else if (variant === 'dark') {
    bg = 'linear-gradient(135deg, #032D30 0%, #002B2E 100%)';
    border = '1px solid #38E8F5';
    shadow = '0 20px 50px rgba(3, 45, 48, 0.3)';
  } else if (variant === 'muted') {
    bg = '#F8FAFC';
    border = '1px solid #E2E8F0';
    shadow = 'none';
  }

  return (
    <div
      className={className}
      style={{
        background: bg,
        border: border,
        boxShadow: shadow,
        borderRadius: 20,
        padding: padding,
        textAlign: 'left',
        transition: 'all 0.2s ease',
        ...style
      }}
    >
      {children}
    </div>
  );
}
