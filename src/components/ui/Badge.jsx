import React from 'react';

export function Badge({ children, variant = 'cyan', icon, style = {} }) {
  let bg = 'var(--color-cyan-light)';
  let color = 'var(--color-teal-dark)';
  let border = 'none';

  if (variant === 'green' || variant === 'success') {
    bg = '#DCFCE7';
    color = '#15803D';
  } else if (variant === 'amber' || variant === 'warning') {
    bg = '#FEF3C7';
    color = '#B45309';
  } else if (variant === 'purple') {
    bg = '#F3E8FF';
    color = '#6B21A8';
  } else if (variant === 'dark') {
    bg = '#032D30';
    color = '#38E8F5';
  }

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '3px 10px',
        borderRadius: 8,
        fontSize: '0.75rem',
        fontWeight: 800,
        background: bg,
        color: color,
        border: border,
        whiteSpace: 'nowrap',
        ...style
      }}
    >
      {icon && <span>{icon}</span>}
      <span>{children}</span>
    </span>
  );
}
