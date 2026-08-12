import React from 'react';
import { Link2, Trash2 } from 'lucide-react';
import { SectionCard } from './SectionCard';
import { SectionHeader } from './SectionHeader';

export interface LinkItem {
  id: string;
  label: string;
  url: string;
}

export interface LinksProps {
  items?: LinkItem[];
  data?: LinkItem[];
  onChange: (updated: LinkItem[]) => void;
}

export const Links: React.FC<LinksProps> = ({ items, data, onChange }) => {
  const safeItems = Array.isArray(items) ? items : (Array.isArray(data) ? data : []);

  const handleAddItem = () => {
    const newItem: LinkItem = {
      id: `link-${Date.now()}`,
      label: '',
      url: ''
    };
    onChange([...safeItems, newItem]);
  };

  const handleDeleteItem = (id: string) => {
    onChange(safeItems.filter(item => item.id !== id));
  };

  const handleItemChange = (id: string, field: keyof LinkItem, value: string) => {
    onChange(safeItems.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  return (
    <SectionCard>
      <SectionHeader title="Links & Profiles" icon={<Link2 size={18} />} onAddItem={handleAddItem} addItemLabel="Add Link" />

      {safeItems.map((item) => (
        <div key={item.id} style={{ background: '#F8FAFC', padding: 16, borderRadius: 14, border: '1px solid #E2E8F0', marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--color-teal-dark)', textTransform: 'uppercase' }}>Link / Profile</span>
            <button
              onClick={() => handleDeleteItem(item.id)}
              aria-label="Delete Link"
              style={{ background: '#FEE2E2', border: 'none', borderRadius: 8, padding: 4, cursor: 'pointer', color: '#991B1B' }}
            >
              <Trash2 size={14} />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 12 }}>
            <input
              type="text"
              value={item.label || ''}
              onChange={(e) => handleItemChange(item.id, 'label', e.target.value)}
              placeholder="Platform / Label (e.g. GitHub, Portfolio)"
              style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', outline: 'none', fontSize: '0.88rem', fontWeight: 700 }}
            />
            <input
              type="url"
              value={item.url || ''}
              onChange={(e) => handleItemChange(item.id, 'url', e.target.value)}
              placeholder="URL (e.g. https://github.com/username)"
              style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', outline: 'none', fontSize: '0.88rem' }}
            />
          </div>
        </div>
      ))}
    </SectionCard>
  );
};

export default Links;
