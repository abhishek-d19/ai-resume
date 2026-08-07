import React from 'react';
import { Plus, ArrowUp, ArrowDown } from 'lucide-react';

export interface SectionHeaderProps {
  title: string;
  icon?: React.ReactNode;
  onAddItem?: () => void;
  addItemLabel?: string;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  icon,
  onAddItem,
  addItemLabel = 'Add Item',
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown
}) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, paddingBottom: 12, borderBottom: '1px solid #F1F5F9' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {icon && <span style={{ color: 'var(--color-teal-dark)', display: 'flex', alignItems: 'center' }}>{icon}</span>}
        <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--color-teal-dark)', letterSpacing: '-0.02em', margin: 0 }}>
          {title}
        </h3>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {/* Reorder Architecture Controls */}
        {(onMoveUp || onMoveDown) && (
          <div style={{ display: 'flex', gap: 4 }}>
            {onMoveUp && (
              <button 
                onClick={onMoveUp} 
                disabled={!canMoveUp}
                aria-label="Move section up" 
                style={{ background: '#F1F5F9', border: 'none', borderRadius: 6, padding: 6, cursor: canMoveUp ? 'pointer' : 'not-allowed', opacity: canMoveUp ? 1 : 0.4 }}
              >
                <ArrowUp size={14} />
              </button>
            )}
            {onMoveDown && (
              <button 
                onClick={onMoveDown} 
                disabled={!canMoveDown}
                aria-label="Move section down" 
                style={{ background: '#F1F5F9', border: 'none', borderRadius: 6, padding: 6, cursor: canMoveDown ? 'pointer' : 'not-allowed', opacity: canMoveDown ? 1 : 0.4 }}
              >
                <ArrowDown size={14} />
              </button>
            )}
          </div>
        )}

        {/* Add Item Trigger */}
        {onAddItem && (
          <button
            onClick={onAddItem}
            className="btn-cyan-pill"
            style={{ padding: '6px 14px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 4 }}
          >
            <Plus size={14} />
            <span>{addItemLabel}</span>
          </button>
        )}
      </div>
    </div>
  );
};
