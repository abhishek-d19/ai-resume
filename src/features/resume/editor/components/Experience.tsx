import React, { useState } from 'react';
import { Briefcase, Plus, Trash2, Sparkles, RefreshCw } from 'lucide-react';
import { SectionCard } from './SectionCard';
import { SectionHeader } from './SectionHeader';
import { resumeCopilotServiceInstance } from '../../../../services/ResumeCopilotService';
import { CopilotDiffModal } from '../../../ai/copilot/components/CopilotDiffModal';

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  bullets: string[];
}

export interface ExperienceProps {
  items?: ExperienceItem[];
  data?: ExperienceItem[];
  onChange: (data: ExperienceItem[]) => void;
}

export const Experience: React.FC<ExperienceProps> = ({ items, data, onChange }) => {
  const safeItems = Array.isArray(items) ? items : (Array.isArray(data) ? data : []);
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});
  const [suggestion, setSuggestion] = useState<{
    itemId: string;
    bulletIdx: number;
    original: string;
    rewritten: string;
    explanation: string;
    metricsPrompt?: string;
  } | null>(null);

  const handleAddItem = () => {
    const newItem: ExperienceItem = {
      id: `exp-${Date.now()}`,
      company: '',
      role: '',
      location: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      bullets: ['']
    };
    onChange([...safeItems, newItem]);
  };

  const handleDeleteItem = (id: string) => {
    onChange(safeItems.filter(item => item.id !== id));
  };

  const handleItemChange = (id: string, field: keyof ExperienceItem, value: any) => {
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

  const handleRewriteBullet = async (item: ExperienceItem, bIdx: number, rawBullet: string) => {
    if (!rawBullet || !rawBullet.trim()) return;

    const key = `${item.id}-${bIdx}`;
    setLoadingMap(prev => ({ ...prev, [key]: true }));
    try {
      const res = await resumeCopilotServiceInstance.rewriteBullet(rawBullet, item.role, item.company);
      setSuggestion({
        itemId: item.id,
        bulletIdx: bIdx,
        original: rawBullet,
        rewritten: res.rewritten,
        explanation: res.explanation,
        metricsPrompt: res.metricsPrompt
      });
    } catch (err: any) {
      console.warn('[Bullet Copilot Error]:', err);
    } finally {
      setLoadingMap(prev => ({ ...prev, [key]: false }));
    }
  };

  return (
    <SectionCard>
      <SectionHeader title="Professional Experience" icon={<Briefcase size={18} />} onAddItem={handleAddItem} addItemLabel="Add Experience" />

      {safeItems.length === 0 ? (
        <div style={{ padding: '24px 16px', background: '#F8FAFC', borderRadius: 14, border: '1px border-dashed #CBD5E1', textAlign: 'center' }}>
          <p style={{ fontSize: '0.85rem', color: '#64748B', margin: '0 0 12px 0' }}>No experience entries added yet. Add your employment history.</p>
          <button
            onClick={handleAddItem}
            style={{ padding: '8px 18px', borderRadius: 20, background: '#0284C7', color: '#FFFFFF', fontSize: '0.82rem', fontWeight: 800, border: 'none', cursor: 'pointer' }}
          >
            + Add Experience
          </button>
        </div>
      ) : (
        safeItems.map((item) => {
          const bulletsList = Array.isArray(item.bullets) ? item.bullets : [''];

          return (
            <div key={item.id} style={{ background: '#F8FAFC', padding: 20, borderRadius: 16, border: '1px solid #E2E8F0', marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--color-teal-dark)', textTransform: 'uppercase' }}>Position Entry</span>
                <button
                  onClick={() => handleDeleteItem(item.id)}
                  aria-label="Delete Experience Entry"
                  style={{ background: '#FEE2E2', border: 'none', borderRadius: 8, padding: 6, cursor: 'pointer', color: '#991B1B' }}
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748B' }}>Company Name</label>
                  <input
                    type="text"
                    value={item.company || ''}
                    onChange={(e) => handleItemChange(item.id, 'company', e.target.value)}
                    placeholder="e.g. Acme Corp"
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', outline: 'none', fontSize: '0.88rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748B' }}>Job Title / Role</label>
                  <input
                    type="text"
                    value={item.role || ''}
                    onChange={(e) => handleItemChange(item.id, 'role', e.target.value)}
                    placeholder="e.g. Senior QA Engineer"
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', outline: 'none', fontSize: '0.88rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748B' }}>Location</label>
                  <input
                    type="text"
                    value={item.location || ''}
                    onChange={(e) => handleItemChange(item.id, 'location', e.target.value)}
                    placeholder="e.g. San Francisco, CA"
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', outline: 'none', fontSize: '0.88rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748B' }}>Start Date</label>
                  <input
                    type="text"
                    value={item.startDate || ''}
                    onChange={(e) => handleItemChange(item.id, 'startDate', e.target.value)}
                    placeholder="MM/YYYY"
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', outline: 'none', fontSize: '0.88rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748B' }}>End Date</label>
                  <input
                    type="text"
                    value={item.endDate || ''}
                    disabled={item.isCurrent}
                    onChange={(e) => handleItemChange(item.id, 'endDate', e.target.value)}
                    placeholder={item.isCurrent ? 'Present' : 'MM/YYYY'}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', outline: 'none', fontSize: '0.88rem', background: item.isCurrent ? '#F1F5F9' : '#FFFFFF' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.82rem', fontWeight: 700, color: '#475569', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={Boolean(item.isCurrent)}
                    onChange={(e) => handleItemChange(item.id, 'isCurrent', e.target.checked)}
                  />
                  Currently Working Here
                </label>
              </div>

              {/* ACCOMPLISHMENT BULLETS */}
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

                {bulletsList.map((b, bIdx) => {
                  const isRewriting = Boolean(loadingMap[`${item.id}-${bIdx}`]);

                  return (
                    <div key={bIdx} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <textarea
                        value={b || ''}
                        onChange={(e) => handleBulletChange(item.id, bIdx, e.target.value)}
                        placeholder="Action verb + metric impact statement..."
                        rows={2}
                        style={{ flex: 1, padding: '8px 12px', borderRadius: 8, border: '1px solid #CBD5E1', outline: 'none', fontSize: '0.88rem', fontFamily: 'inherit' }}
                      />
                      
                      <button
                        onClick={() => handleRewriteBullet(item, bIdx, b)}
                        disabled={isRewriting || !b?.trim()}
                        style={{
                          padding: '6px 10px',
                          borderRadius: 8,
                          background: '#F0F9FF',
                          border: '1px solid #BAE6FD',
                          color: '#0284C7',
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                          opacity: (isRewriting || !b?.trim()) ? 0.5 : 1
                        }}
                      >
                        {isRewriting ? <RefreshCw size={11} className="animate-spin" /> : <Sparkles size={11} />}
                        <span>Rewrite</span>
                      </button>

                      {bulletsList.length > 1 && (
                        <button
                          onClick={() => handleRemoveBullet(item.id, bIdx)}
                          style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: 4 }}
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

            </div>
          );
        })
      )}

      {/* REWRITE BULLET DIFF MODAL */}
      <CopilotDiffModal
        isOpen={Boolean(suggestion)}
        onClose={() => setSuggestion(null)}
        title="Rewrite Bullet Point"
        originalContent={suggestion?.original || ''}
        suggestedContent={suggestion?.rewritten || ''}
        explanation={suggestion?.explanation}
        metricsPrompt={suggestion?.metricsPrompt}
        onAccept={(finalText) => {
          if (suggestion) {
            handleBulletChange(suggestion.itemId, suggestion.bulletIdx, finalText);
          }
        }}
      />
    </SectionCard>
  );
};

export default Experience;
