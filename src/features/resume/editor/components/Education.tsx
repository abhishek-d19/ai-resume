import React from 'react';
import { GraduationCap, Trash2 } from 'lucide-react';
import { SectionCard } from './SectionCard';
import { SectionHeader } from './SectionHeader';

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  gpa?: string;
}

export interface EducationProps {
  items?: EducationItem[];
  data?: EducationItem[];
  onChange: (updated: EducationItem[]) => void;
}

export const Education: React.FC<EducationProps> = ({ items, data, onChange }) => {
  const safeItems = Array.isArray(items) ? items : (Array.isArray(data) ? data : []);

  const handleAddItem = () => {
    const newItem: EducationItem = {
      id: `edu-${Date.now()}`,
      institution: '',
      degree: '',
      fieldOfStudy: '',
      startDate: '',
      endDate: ''
    };
    onChange([...safeItems, newItem]);
  };

  const handleDeleteItem = (id: string) => {
    onChange(safeItems.filter(item => item.id !== id));
  };

  const handleItemChange = (id: string, field: keyof EducationItem, value: string) => {
    onChange(safeItems.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  return (
    <SectionCard>
      <SectionHeader title="Education" icon={<GraduationCap size={18} />} onAddItem={handleAddItem} addItemLabel="Add Education" />

      {safeItems.map((item) => (
        <div key={item.id} style={{ background: '#F8FAFC', padding: 20, borderRadius: 14, border: '1px solid #E2E8F0', marginBottom: 16, position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--color-teal-dark)', textTransform: 'uppercase' }}>Academic Qualification</span>
            <button
              onClick={() => handleDeleteItem(item.id)}
              aria-label="Delete Education Item"
              style={{ background: '#FEE2E2', border: 'none', borderRadius: 8, padding: 6, cursor: 'pointer', color: '#991B1B' }}
            >
              <Trash2 size={14} />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <input
              type="text"
              value={item.institution || ''}
              onChange={(e) => handleItemChange(item.id, 'institution', e.target.value)}
              placeholder="Institution Name (e.g. UC Berkeley)"
              style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', outline: 'none', fontSize: '0.88rem', fontWeight: 700 }}
            />
            <input
              type="text"
              value={item.degree || ''}
              onChange={(e) => handleItemChange(item.id, 'degree', e.target.value)}
              placeholder="Degree (e.g. Bachelor of Science)"
              style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', outline: 'none', fontSize: '0.88rem' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <input
              type="text"
              value={item.fieldOfStudy || ''}
              onChange={(e) => handleItemChange(item.id, 'fieldOfStudy', e.target.value)}
              placeholder="Field of Study (e.g. Computer Science)"
              style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', outline: 'none', fontSize: '0.88rem' }}
            />
            <input
              type="text"
              value={item.startDate || ''}
              onChange={(e) => handleItemChange(item.id, 'startDate', e.target.value)}
              placeholder="Start Date (e.g. 2016)"
              style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', outline: 'none', fontSize: '0.88rem' }}
            />
            <input
              type="text"
              value={item.endDate || ''}
              onChange={(e) => handleItemChange(item.id, 'endDate', e.target.value)}
              placeholder="End Date (e.g. 2020)"
              style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', outline: 'none', fontSize: '0.88rem' }}
            />
          </div>
        </div>
      ))}
    </SectionCard>
  );
};

export default Education;
