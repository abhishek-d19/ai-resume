import React from 'react';
import { Link as LinkIcon, Trash2 } from 'lucide-react';
import { SectionCard } from './SectionCard';
import { SectionHeader } from './SectionHeader';

export interface LinkItem {
  id: string;
  platform: string;
  url: string;
}

export interface LinksProps {
  items: LinkItem[];
  onChange: (updated: LinkItem[]) => void;
}

export const Links: React.FC<LinksProps> = ({ items, onChange }) => {
  const handleAddItem = () => {
    const newItem: LinkItem = {
      id: `link-${Date.now()}`,
      platform: 'Portfolio',
      url: 'https://'
    };
    onChange([...items, newItem]);
  };

  const handleDeleteItem = (id: string) => {
    onChange(items.filter(item => item.id !== id));
  };

  const handleItemChange = (id: string, field: keyof LinkItem, value: string) => {
    onChange(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  return (
    <SectionCard>
      <SectionHeader title="Links & Social Profiles" icon={<LinkIcon size={18} />} onAddItem={handleAddItem} addItemLabel="Add Link" />

      {items.map((item) => (
        <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '140px 1fr 40px', gap: 12, alignItems: 'center', marginBottom: 10 }}>
          <input
            type="text"
            value={item.platform}
            onChange={(e) => handleItemChange(item.id, 'platform', e.target.value)}
            placeholder="Platform Label"
            style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontWeight: 700, fontSize: '0.88rem' }}
          />
          <input
            type="text"
            value={item.url}
            onChange={(e) => handleItemChange(item.id, 'url', e.target.value)}
            placeholder="URL (e.g. https://github.com/username)"
            style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
          />
          <button
            onClick={() => handleDeleteItem(item.id)}
            aria-label="Delete Link"
            style={{ background: '#FEE2E2', border: 'none', borderRadius: 8, padding: 8, cursor: 'pointer', color: '#991B1B' }}
          >
            <Trash2 size={14} />
          </button>
        </div>
      ))}
    </SectionCard>
  );
};
