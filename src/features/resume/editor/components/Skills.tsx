import React from 'react';
import { Wrench, Trash2 } from 'lucide-react';
import { SectionCard } from './SectionCard';
import { SectionHeader } from './SectionHeader';

export interface SkillCategoryItem {
  id: string;
  category: string;
  skillsList: string;
}

export interface SkillsProps {
  items: SkillCategoryItem[];
  onChange: (updated: SkillCategoryItem[]) => void;
}

export const Skills: React.FC<SkillsProps> = ({ items, onChange }) => {
  const handleAddItem = () => {
    const newItem: SkillCategoryItem = {
      id: `skill-${Date.now()}`,
      category: '',
      skillsList: ''
    };
    onChange([...items, newItem]);
  };

  const handleDeleteItem = (id: string) => {
    onChange(items.filter(item => item.id !== id));
  };

  const handleItemChange = (id: string, field: keyof SkillCategoryItem, value: string) => {
    onChange(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  return (
    <SectionCard>
      <SectionHeader title="Technical Skills" icon={<Wrench size={18} />} onAddItem={handleAddItem} addItemLabel="Add Skill Category" />

      {items.map((item) => (
        <div key={item.id} style={{ background: '#F8FAFC', padding: 16, borderRadius: 14, border: '1px solid #E2E8F0', marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--color-teal-dark)', textTransform: 'uppercase' }}>Category</span>
            <button
              onClick={() => handleDeleteItem(item.id)}
              aria-label="Delete Skill Category"
              style={{ background: '#FEE2E2', border: 'none', borderRadius: 8, padding: 4, cursor: 'pointer', color: '#991B1B' }}
            >
              <Trash2 size={14} />
            </button>
          </div>

          <input
            type="text"
            value={item.category}
            onChange={(e) => handleItemChange(item.id, 'category', e.target.value)}
            placeholder="Category Name (e.g. Frontend Architecture)"
            style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontWeight: 700, marginBottom: 8, fontSize: '0.88rem' }}
          />

          <input
            type="text"
            value={item.skillsList}
            onChange={(e) => handleItemChange(item.id, 'skillsList', e.target.value)}
            placeholder="Comma separated skills (e.g. React 19, TypeScript, Next.js, WebGL)"
            style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
          />
        </div>
      ))}
    </SectionCard>
  );
};
