import React from 'react';
import { Globe, Trash2 } from 'lucide-react';
import { SectionCard } from './SectionCard';
import { SectionHeader } from './SectionHeader';

export interface LanguageItem {
  id: string;
  language: string;
  proficiency: string;
}

export interface LanguagesProps {
  items: LanguageItem[];
  onChange: (updated: LanguageItem[]) => void;
}

export const Languages: React.FC<LanguagesProps> = ({ items, onChange }) => {
  const handleAddItem = () => {
    const newItem: LanguageItem = {
      id: `lang-${Date.now()}`,
      language: '',
      proficiency: 'Professional Working'
    };
    onChange([...items, newItem]);
  };

  const handleDeleteItem = (id: string) => {
    onChange(items.filter(item => item.id !== id));
  };

  const handleItemChange = (id: string, field: keyof LanguageItem, value: string) => {
    onChange(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  return (
    <SectionCard>
      <SectionHeader title="Languages" icon={<Globe size={18} />} onAddItem={handleAddItem} addItemLabel="Add Language" />

      {items.map((item) => (
        <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 40px', gap: 12, alignItems: 'center', marginBottom: 10 }}>
          <input
            type="text"
            value={item.language}
            onChange={(e) => handleItemChange(item.id, 'language', e.target.value)}
            placeholder="Language (e.g. English)"
            style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontWeight: 700, fontSize: '0.88rem' }}
          />
          <input
            type="text"
            value={item.proficiency}
            onChange={(e) => handleItemChange(item.id, 'proficiency', e.target.value)}
            placeholder="Proficiency (e.g. Native / Fluent)"
            style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
          />
          <button
            onClick={() => handleDeleteItem(item.id)}
            aria-label="Delete Language"
            style={{ background: '#FEE2E2', border: 'none', borderRadius: 8, padding: 8, cursor: 'pointer', color: '#991B1B' }}
          >
            <Trash2 size={14} />
          </button>
        </div>
      ))}
    </SectionCard>
  );
};
