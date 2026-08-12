import React, { useState } from 'react';
import { Wrench, Trash2, Sparkles, RefreshCw } from 'lucide-react';
import { SectionCard } from './SectionCard';
import { SectionHeader } from './SectionHeader';
import { resumeCopilotServiceInstance } from '../../../../services/ResumeCopilotService';
import { CopilotDiffModal } from '../../../ai/copilot/components/CopilotDiffModal';

export interface SkillCategoryItem {
  id: string;
  category: string;
  skills: string;
}

export interface SkillsProps {
  items?: SkillCategoryItem[];
  data?: SkillCategoryItem[];
  onChange: (updated: SkillCategoryItem[]) => void;
  fullResumeContent?: Record<string, any>;
}

export const Skills: React.FC<SkillsProps> = ({ items, data, onChange, fullResumeContent = {} }) => {
  const safeItems = Array.isArray(items) ? items : (Array.isArray(data) ? data : []);
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<{ suggested: string[]; explanation: string } | null>(null);

  const handleAddItem = () => {
    const newItem: SkillCategoryItem = {
      id: `skill-${Date.now()}`,
      category: '',
      skills: ''
    };
    onChange([...safeItems, newItem]);
  };

  const handleDeleteItem = (id: string) => {
    onChange(safeItems.filter(item => item.id !== id));
  };

  const handleItemChange = (id: string, field: keyof SkillCategoryItem, value: string) => {
    onChange(safeItems.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleSuggestSkills = async () => {
    setLoading(true);
    try {
      const res = await resumeCopilotServiceInstance.suggestSkills(fullResumeContent);
      setSuggestion({
        suggested: res.suggestedSkills,
        explanation: res.explanation
      });
    } catch (err: any) {
      console.warn('[Suggest Skills Error]:', err);
    } finally {
      setLoading(false);
    }
  };

  const currentSkillsStr = safeItems.map(s => `${s.category}: ${s.skills}`).join('  |  ');

  return (
    <SectionCard>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <SectionHeader title="Technical Skills" icon={<Wrench size={18} />} onAddItem={handleAddItem} addItemLabel="Add Category" />

        <button
          onClick={handleSuggestSkills}
          disabled={loading}
          style={{
            padding: '6px 14px',
            borderRadius: 16,
            background: '#F0F9FF',
            border: '1px solid #BAE6FD',
            color: '#0284C7',
            fontSize: '0.78rem',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            opacity: loading ? 0.5 : 1
          }}
        >
          {loading ? <RefreshCw size={13} className="animate-spin" /> : <Sparkles size={13} />}
          <span>{loading ? 'Analyzing...' : 'Suggest Skills'}</span>
        </button>
      </div>

      {safeItems.length === 0 ? (
        <div style={{ padding: '24px 16px', background: '#F8FAFC', borderRadius: 14, border: '1px border-dashed #CBD5E1', textAlign: 'center' }}>
          <p style={{ fontSize: '0.85rem', color: '#64748B', margin: '0 0 12px 0' }}>No skills added yet. Organize your technical competencies by category.</p>
          <button
            onClick={handleAddItem}
            style={{ padding: '8px 18px', borderRadius: 20, background: '#0284C7', color: '#FFFFFF', fontSize: '0.82rem', fontWeight: 800, border: 'none', cursor: 'pointer' }}
          >
            + Add Skill Category
          </button>
        </div>
      ) : (
        safeItems.map((item) => (
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
              value={item.category || ''}
              onChange={(e) => handleItemChange(item.id, 'category', e.target.value)}
              placeholder="Category Name (e.g. Languages & Frameworks)"
              style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', outline: 'none', fontSize: '0.88rem', fontWeight: 700, marginBottom: 8 }}
            />

            <input
              type="text"
              value={item.skills || ''}
              onChange={(e) => handleItemChange(item.id, 'skills', e.target.value)}
              placeholder="Comma-separated skills (e.g. TypeScript, React, Python, PostgreSQL)"
              style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', outline: 'none', fontSize: '0.88rem' }}
            />
          </div>
        ))
      )}

      {/* COPILOT DIFF MODAL */}
      <CopilotDiffModal
        isOpen={Boolean(suggestion)}
        onClose={() => setSuggestion(null)}
        title="Suggested Technical Skills"
        originalContent={currentSkillsStr}
        suggestedContent={suggestion?.suggested.join(', ') || ''}
        explanation={suggestion?.explanation}
        onAccept={(acceptedText) => {
          if (safeItems.length > 0) {
            const first = safeItems[0];
            const existing = first.skills ? `${first.skills}, ${acceptedText}` : acceptedText;
            handleItemChange(first.id, 'skills', existing);
          } else {
            const newItem: SkillCategoryItem = {
              id: `skill-${Date.now()}`,
              category: 'Core Competencies',
              skills: acceptedText
            };
            onChange([newItem]);
          }
        }}
      />
    </SectionCard>
  );
};

export default Skills;
