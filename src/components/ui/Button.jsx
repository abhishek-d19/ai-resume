import React from 'react';

export function Button({ variant = 'cyan', size = 'medium', children, icon, onClick, ariaLabel, className = '', style = {}, type = 'button' }) {
  let baseClass = 'btn-cyan-pill';
  if (variant === 'secondary') baseClass = 'btn-secondary-pill';
  if (variant === 'teal') baseClass = 'btn-teal-pill';

  const sizePadding = size === 'small' ? '8px 16px' : size === 'large' ? '14px 32px' : '10px 24px';
  const fontSize = size === 'small' ? '0.8rem' : size === 'large' ? '1rem' : '0.88rem';

  return (
    <button
      type={type}
      onClick={onClick}
      aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
      className={`${baseClass} ${className}`}
      style={{ padding: sizePadding, fontSize: fontSize, cursor: 'pointer', ...style }}
    >
      {icon && <span style={{ display: 'inline-flex', alignItems: 'center' }}>{icon}</span>}
      <span>{children}</span>
    </button>
  );
}
