import React from 'react';

export function Input({ label, type = 'text', value, onChange, placeholder, icon, required = false, style = {} }) {
  return (
    <div style={{ textAlign: 'left', width: '100%', marginBottom: 16, ...style }}>
      {label && (
        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#475569', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {label}
        </label>
      )}

      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {icon && (
          <span style={{ position: 'absolute', left: 14, color: '#94A3B8', display: 'flex', alignItems: 'center' }}>
            {icon}
          </span>
        )}

        <input 
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          style={{ 
            width: '100%', 
            padding: icon ? '12px 14px 12px 40px' : '12px 14px', 
            borderRadius: 12, 
            border: '1px solid #CBD5E1', 
            outline: 'none', 
            fontSize: '0.9rem', 
            fontFamily: 'inherit',
            background: '#FFFFFF',
            color: 'var(--color-teal-dark)',
            transition: 'border-color 0.2s ease'
          }}
        />
      </div>
    </div>
  );
}
