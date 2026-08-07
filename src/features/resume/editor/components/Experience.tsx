import React from 'react';
import { Briefcase, Trash2, Plus } from 'lucide-react';
import { SectionCard } from './SectionCard';
import { SectionHeader } from './SectionHeader';

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  location?: string;
  startDate: string;
  endDate: string;
  bullets: string[];
}

export interface ExperienceProps {
  items: ExperienceItem[];
  onChange: (updated: ExperienceItem[]) => void;
}

export const Experience: React.FC<ExperienceProps> = ({ items, onChange }) => {
  const handleAddItem = () => {
    const newItem: ExperienceItem = {
      id: `exp-${Date.now()}`,
      company: '',
      role: '',
      location: '',
      startDate: '',
      endDate: '',
      bullets: ['']
    };
    onChange([...items, newItem]);
  };

  const handleDeleteItem = (id: string) => {
    onChange(items.filter(item => item.id !== id));
  };

  const handleItemChange = (id: string, field: keyof ExperienceItem, value: any) => {
    onChange(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleBulletChange = (expId: string, bIdx: number, value: string) => {
    onChange(items.map(item => {
      if (item.id !== expId) return item;
      const newBullets = [...item.bullets];
      newBullets[bIdx] = value;
      return { ...item, bullets: newBullets };
    }));
  };

  const handleAddBullet = (expId: string) => {
    onChange(items.map(item => {
      if (item.id !== expId) return item;
      return { ...item, bullets: [...item.bullets, ''] };
    }));
  };

  const handleDeleteBullet = (expId: string, bIdx: number) => {
    onChange(items.map(item => {
      if (item.id !== expId) return item;
      return { ...item, bullets: item.bullets.filter((_, idx) => idx !== bIdx) };
    }));
  };

  return (
    <SectionCard>
      <SectionHeader title="Professional Experience" icon={<Briefcase size={18} />} onAddItem={handleAddItem} addItemLabel="Add Position" />

      {items.map((item) => (
        <div key={item.id} style={{ background: '#F8FAFC', padding: 20, borderRadius: 14, border: '1px solid #E2E8F0', marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--color-teal-dark)', textTransform: 'uppercase' }}>Position</span>
            <button
              onClick={() => handleDeleteItem(item.id)}
              aria-label="Delete Experience Position"
              style={{ background: '#FEE2E2', border: 'none', borderRadius: 8, padding: 6, cursor: 'pointer', color: '#991B1B' }}
            >
              <Trash2 size={14} />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <input
              type="text"
              value={item.company}
              onChange={(e) => handleItemChange(item.id, 'company', e.target.value)}
              placeholder="Company Name (e.g. Lumina AI)"
              style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: '0.88rem', fontWeight: 700 }}
            />
            <input
              type="text"
              value={item.role}
              onChange={(e) => handleItemChange(item.id, 'role', e.target.value)}
              placeholder="Role / Title (e.g. Senior Frontend Engineer)"
              style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: '0.88rem', fontWeight: 700 }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
            <input
              type="text"
              value={item.location || ''}
              onChange={(e) => handleItemChange(item.id, 'location', e.target.value)}
              placeholder="Location (e.g. San Francisco, CA)"
              style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
            />
            <input
              type="text"
              value={item.startDate}
              onChange={(e) => handleItemChange(item.id, 'startDate', e.target.value)}
              placeholder="Start Date (e.g. 2024)"
              style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
            />
            <input
              type="text"
              value={item.endDate}
              onChange={(e) => handleItemChange(item.id, 'endDate', e.target.value)}
              placeholder="End Date (e.g. Present)"
              style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
            />
          </div>

          {/* Bullet Points */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>Accomplishment Bullets</label>
              <button
                onClick={() => handleAddBullet(item.id)}
                style={{ background: 'none', border: 'none', color: 'var(--color-teal-dark)', fontWeight: 800, fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
              >
                <Plus size={12} /> Add Bullet
              </button>
            </div>

            {item.bullets.map((b, bIdx) => (
              <div key={bIdx} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <textarea
                  value={b}
                  onChange={(e) => handleBulletChange(item.id, bIdx, e.target.value)}
                  placeholder="Action verb + metric impact statement..."
                  rows={2}
                  style={{ flex: 1, padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', outline: 'none', fontSize: '0.88rem', fontFamily: 'inherit' }}
                />
                {item.bullets.length > 1 && (
                  <button
                    onClick={() => handleDeleteBullet(item.id, bIdx)}
                    aria-label="Delete bullet point"
                    style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: 4 }}
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </SectionCard>
  );
};
