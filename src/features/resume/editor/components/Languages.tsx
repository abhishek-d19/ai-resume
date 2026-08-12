import React from 'react';
import { Languages as LanguagesIcon, Trash2 } from 'lucide-react';
import { SectionCard } from './SectionCard';
import { SectionHeader } from './SectionHeader';

export interface LanguageItem {
  id: string;
  language: string;
  proficiency: string;
}

export interface LanguagesProps {
  items?: LanguageItem[];
  data?: LanguageItem[];
  onChange: (updated: LanguageItem[]) => void;
}

export const Languages: React.FC<LanguagesProps> = ({ items, data, onChange }) => {
  const safeItems = Array.isArray(items) ? items : (Array.isArray(data) ? data : []);

  const handleAddItem = () => {
    const newItem: LanguageItem = {
      id: `lang-${Date.now()}`,
      language: '',
      proficiency: ''
    };
    onChange([...safeItems, newItem]);
  };

  const handleDeleteItem = (id: string) => {
    onChange(safeItems.filter(item => item.id !== id));
  };

  const handleItemChange = (id: string, field: keyof LanguageItem, value: string) => {
    onChange(safeItems.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  return (
    <SectionCard>
      <SectionHeader title="Languages" icon={<LanguagesIcon size={18} />} onAddItem={handleAddItem} addItemLabel="Add Language" />

      {safeItems.map((item) => (
        <div key={item.id} style={{ background: '#F8FAFC', padding: 16, borderRadius: 14, border: '1px solid #E2E8F0', marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--color-teal-dark)', textTransform: 'uppercase' }}>Language Entry</span>
            <button
              onClick={() => handleDeleteItem(item.id)}
              aria-label="Delete Language"
              style={{ background: '#FEE2E2', border: 'none', borderRadius: 8, padding: 4, cursor: 'pointer', color: '#991B1B' }}
            >
              <Trash2 size={14} />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <input
              type="text"
              value={item.language || ''}
              onChange={(e) => handleItemChange(item.id, 'language', e.target.value)}
              placeholder="Language (e.g. English, Spanish, German)"
              style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', outline: 'none', fontSize: '0.88rem', fontWeight: 700 }}
            />
            <input
              type="text"
              value={item.proficiency || ''}
              onChange={(e) => handleItemChange(item.id, 'proficiency', e.target.value)}
              placeholder="Proficiency Level (e.g. Native, Professional Working)"
              style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', outline: 'none', fontSize: '0.88rem' }}
            />
          </div>
        </div>
      ))}
    </SectionCard>
  );
};

export default Languages;
