import React from 'react';
import { Trophy, Trash2 } from 'lucide-react';
import { SectionCard } from './SectionCard';
import { SectionHeader } from './SectionHeader';

export interface AchievementItem {
  id: string;
  title: string;
  description: string;
}

export interface AchievementsProps {
  items?: AchievementItem[];
  data?: AchievementItem[];
  onChange: (updated: AchievementItem[]) => void;
}

export const Achievements: React.FC<AchievementsProps> = ({ items, data, onChange }) => {
  const safeItems = Array.isArray(items) ? items : (Array.isArray(data) ? data : []);

  const handleAddItem = () => {
    const newItem: AchievementItem = {
      id: `achieve-${Date.now()}`,
      title: '',
      description: ''
    };
    onChange([...safeItems, newItem]);
  };

  const handleDeleteItem = (id: string) => {
    onChange(safeItems.filter(item => item.id !== id));
  };

  const handleItemChange = (id: string, field: keyof AchievementItem, value: string) => {
    onChange(safeItems.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  return (
    <SectionCard>
      <SectionHeader title="Key Achievements & Awards" icon={<Trophy size={18} />} onAddItem={handleAddItem} addItemLabel="Add Achievement" />

      {safeItems.map((item) => (
        <div key={item.id} style={{ background: '#F8FAFC', padding: 16, borderRadius: 14, border: '1px solid #E2E8F0', marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--color-teal-dark)', textTransform: 'uppercase' }}>Achievement</span>
            <button
              onClick={() => handleDeleteItem(item.id)}
              aria-label="Delete Achievement"
              style={{ background: '#FEE2E2', border: 'none', borderRadius: 8, padding: 4, cursor: 'pointer', color: '#991B1B' }}
            >
              <Trash2 size={14} />
            </button>
          </div>

          <input
            type="text"
            value={item.title || ''}
            onChange={(e) => handleItemChange(item.id, 'title', e.target.value)}
            placeholder="Title (e.g. Winner of Global AI Hackathon 2024)"
            style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', outline: 'none', fontSize: '0.88rem', fontWeight: 700, marginBottom: 8 }}
          />

          <textarea
            value={item.description || ''}
            onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
            placeholder="Impact & details..."
            rows={2}
            style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', outline: 'none', fontSize: '0.88rem', fontFamily: 'inherit' }}
          />
        </div>
      ))}
    </SectionCard>
  );
};

export default Achievements;
