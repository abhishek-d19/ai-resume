import React from 'react';
import { FolderGit2, Trash2, Plus } from 'lucide-react';
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
  items?: ProjectItem[];
  data?: ProjectItem[];
  onChange: (updated: ProjectItem[]) => void;
}

export const Projects: React.FC<ProjectsProps> = ({ items, data, onChange }) => {
  const safeItems = Array.isArray(items) ? items : (Array.isArray(data) ? data : []);

  const handleAddItem = () => {
    const newItem: ProjectItem = {
      id: `proj-${Date.now()}`,
      name: '',
      description: '',
      techStack: '',
      bullets: ['']
    };
    onChange([...safeItems, newItem]);
  };

  const handleDeleteItem = (id: string) => {
    onChange(safeItems.filter(item => item.id !== id));
  };

  const handleItemChange = (id: string, field: keyof ProjectItem, value: any) => {
    onChange(safeItems.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleAddBullet = (id: string) => {
    onChange(safeItems.map(item => {
      if (item.id === id) {
        const bullets = Array.isArray(item.bullets) ? item.bullets : [];
        return { ...item, bullets: [...bullets, ''] };
      }
      return item;
    }));
  };

  const handleBulletChange = (id: string, bulletIdx: number, value: string) => {
    onChange(safeItems.map(item => {
      if (item.id === id) {
        const bullets = Array.isArray(item.bullets) ? [...item.bullets] : [''];
        bullets[bulletIdx] = value;
        return { ...item, bullets };
      }
      return item;
    }));
  };

  const handleRemoveBullet = (id: string, bulletIdx: number) => {
    onChange(safeItems.map(item => {
      if (item.id === id) {
        const bullets = Array.isArray(item.bullets) ? item.bullets.filter((_, idx) => idx !== bulletIdx) : [];
        return { ...item, bullets: bullets.length ? bullets : [''] };
      }
      return item;
    }));
  };

  return (
    <SectionCard>
      <SectionHeader title="Key Projects" icon={<FolderGit2 size={18} />} onAddItem={handleAddItem} addItemLabel="Add Project" />

      {safeItems.length === 0 ? (
        <div style={{ padding: '24px 16px', background: '#F8FAFC', borderRadius: 14, border: '1px border-dashed #CBD5E1', textAlign: 'center' }}>
          <p style={{ fontSize: '0.85rem', color: '#64748B', margin: '0 0 12px 0' }}>Show recruiters what you've built — key systems, open-source work, or side projects.</p>
          <button
            onClick={handleAddItem}
            style={{ padding: '8px 18px', borderRadius: 20, background: '#0284C7', color: '#FFFFFF', fontSize: '0.82rem', fontWeight: 800, border: 'none', cursor: 'pointer' }}
          >
            + Add Project Entry
          </button>
        </div>
      ) : (
        safeItems.map((item) => {
          const bulletsList = Array.isArray(item.bullets) ? item.bullets : [''];

          return (
            <div key={item.id} style={{ background: '#F8FAFC', padding: 20, borderRadius: 14, border: '1px solid #E2E8F0', marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--color-teal-dark)', textTransform: 'uppercase' }}>Project Entry</span>
                <button
                  onClick={() => handleDeleteItem(item.id)}
                  aria-label="Delete Project"
                  style={{ background: '#FEE2E2', border: 'none', borderRadius: 8, padding: 6, cursor: 'pointer', color: '#991B1B' }}
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748B' }}>Project Name</label>
                  <input
                    type="text"
                    value={item.name || ''}
                    onChange={(e) => handleItemChange(item.id, 'name', e.target.value)}
                    placeholder="e.g. Tokens Studio Infrastructure"
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: '0.88rem', fontWeight: 700 }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748B' }}>Tech Stack / Technologies</label>
                  <input
                    type="text"
                    value={item.techStack || ''}
                    onChange={(e) => handleItemChange(item.id, 'techStack', e.target.value)}
                    placeholder="e.g. TypeScript, React, Node.js"
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748B' }}>Brief Overview / Summary</label>
                <textarea
                  value={item.description || ''}
                  onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                  placeholder="Overview of project scope, architecture, and deliverables..."
                  rows={2}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', outline: 'none', fontSize: '0.88rem', fontFamily: 'inherit' }}
                />
              </div>

              {/* PROJECT BULLETS BUILDER */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>Key Deliverables & Bullets</label>
                  <button
                    onClick={() => handleAddBullet(item.id)}
                    style={{ background: 'none', border: 'none', color: 'var(--color-teal-dark)', fontWeight: 800, fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                  >
                    <Plus size={12} /> Add Bullet
                  </button>
                </div>

                {bulletsList.map((b, bIdx) => (
                  <div key={bIdx} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <textarea
                      value={b || ''}
                      onChange={(e) => handleBulletChange(item.id, bIdx, e.target.value)}
                      placeholder="Measurable accomplishment or key feature built..."
                      rows={2}
                      style={{ flex: 1, padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', outline: 'none', fontSize: '0.88rem', fontFamily: 'inherit' }}
                    />
                    {bulletsList.length > 1 && (
                      <button
                        onClick={() => handleRemoveBullet(item.id, bIdx)}
                        style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: 4 }}
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

            </div>
          );
        })
      )}
    </SectionCard>
  );
};

export default Projects;
