import React from 'react';

export function Tabs({ tabs = [], activeTab, onChangeTab, style = {} }) {
  return (
    <div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '4px 0', ...style }}>
      {tabs.map((tab, idx) => {
        const isActive = activeTab === tab.id || activeTab === idx;
        return (
          <button
            key={tab.id || idx}
            onClick={() => onChangeTab(tab.id || idx)}
            style={{
              padding: '8px 16px',
              borderRadius: 12,
              border: isActive ? '1px solid var(--color-cyan-primary)' : '1px solid #E2E8F0',
              background: isActive ? 'var(--color-cyan-light)' : '#FFFFFF',
              color: isActive ? 'var(--color-teal-dark)' : '#64748B',
              fontWeight: isActive ? 800 : 600,
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease'
            }}
          >
            {tab.icon && <span>{tab.icon}</span>}
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
