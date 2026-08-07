import React from 'react';
import { Award, Trash2 } from 'lucide-react';
import { SectionCard } from './SectionCard';
import { SectionHeader } from './SectionHeader';

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  issueDate?: string;
}

export interface CertificationsProps {
  items: CertificationItem[];
  onChange: (updated: CertificationItem[]) => void;
}

export const Certifications: React.FC<CertificationsProps> = ({ items, onChange }) => {
  const handleAddItem = () => {
    const newItem: CertificationItem = {
      id: `cert-${Date.now()}`,
      name: '',
      issuer: '',
      issueDate: ''
    };
    onChange([...items, newItem]);
  };

  const handleDeleteItem = (id: string) => {
    onChange(items.filter(item => item.id !== id));
  };

  const handleItemChange = (id: string, field: keyof CertificationItem, value: string) => {
    onChange(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  return (
    <SectionCard>
      <SectionHeader title="Certifications" icon={<Award size={18} />} onAddItem={handleAddItem} addItemLabel="Add Certification" />

      {items.map((item) => (
        <div key={item.id} style={{ background: '#F8FAFC', padding: 16, borderRadius: 14, border: '1px solid #E2E8F0', marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--color-teal-dark)', textTransform: 'uppercase' }}>Certificate</span>
            <button
              onClick={() => handleDeleteItem(item.id)}
              aria-label="Delete Certification"
              style={{ background: '#FEE2E2', border: 'none', borderRadius: 8, padding: 4, cursor: 'pointer', color: '#991B1B' }}
            >
              <Trash2 size={14} />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 120px', gap: 12 }}>
            <input
              type="text"
              value={item.name}
              onChange={(e) => handleItemChange(item.id, 'name', e.target.value)}
              placeholder="Certificate Title"
              style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontWeight: 700, fontSize: '0.88rem' }}
            />
            <input
              type="text"
              value={item.issuer}
              onChange={(e) => handleItemChange(item.id, 'issuer', e.target.value)}
              placeholder="Issuing Organization"
              style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
            />
            <input
              type="text"
              value={item.issueDate || ''}
              onChange={(e) => handleItemChange(item.id, 'issueDate', e.target.value)}
              placeholder="Year / Date"
              style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
            />
          </div>
        </div>
      ))}
    </SectionCard>
  );
};
