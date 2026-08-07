import React from 'react';

export interface SectionCardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const SectionCard: React.FC<SectionCardProps> = ({ children, className = '', style = {} }) => {
  return (
    <div
      className={className}
      style={{
        background: '#FFFFFF',
        borderRadius: 20,
        padding: 28,
        border: '1px solid #E2E8F0',
        boxShadow: '0 10px 30px rgba(0,0,0,0.02)',
        marginBottom: 24,
        textAlign: 'left',
        transition: 'all 0.2s ease',
        ...style
      }}
    >
      {children}
    </div>
  );
};
