import React from 'react';
import { FolderGit2, Trash2 } from 'lucide-react';
import { SectionCard } from './SectionCard';
import { SectionHeader } from './SectionHeader';

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  techStack?: string;
  bullets?: string[];
}

export interface ProjectsProps {
  items: ProjectItem[];
  onChange: (updated: ProjectItem[]) => void;
}

export const Projects: React.FC<ProjectsProps> = ({ items, onChange }) => {
  const handleAddItem = () => {
    const newItem: ProjectItem = {
      id: `proj-${Date.now()}`,
      name: '',
      description: '',
      techStack: ''
    };
    onChange([...items, newItem]);
  };

  const handleDeleteItem = (id: string) => {
    onChange(items.filter(item => item.id !== id));
  };

  const handleItemChange = (id: string, field: keyof ProjectItem, value: any) => {
    onChange(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  return (
    <SectionCard>
      <SectionHeader title="Projects" icon={<FolderGit2 size={18} />} onAddItem={handleAddItem} addItemLabel="Add Project" />

      {items.map((item) => (
        <div key={item.id} style={{ background: '#F8FAFC', padding: 20, borderRadius: 14, border: '1px solid #E2E8F0', marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--color-teal-dark)', textTransform: 'uppercase' }}>Project</span>
            <button
              onClick={() => handleDeleteItem(item.id)}
              aria-label="Delete Project"
              style={{ background: '#FEE2E2', border: 'none', borderRadius: 8, padding: 6, cursor: 'pointer', color: '#991B1B' }}
            >
              <Trash2 size={14} />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <input
              type="text"
              value={item.name}
              onChange={(e) => handleItemChange(item.id, 'name', e.target.value)}
              placeholder="Project Name (e.g. Tokens Studio Infrastructure)"
              style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: '0.88rem', fontWeight: 700 }}
            />
            <input
              type="text"
              value={item.techStack || ''}
              onChange={(e) => handleItemChange(item.id, 'techStack', e.target.value)}
              placeholder="Technologies Used (e.g. TypeScript, React, Node.js)"
              style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
            />
          </div>

          <textarea
            value={item.description}
            onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
            placeholder="Brief description of architecture and achievements..."
            rows={2}
            style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', outline: 'none', fontSize: '0.88rem', fontFamily: 'inherit' }}
          />
        </div>
      ))}
    </SectionCard>
  );
};
