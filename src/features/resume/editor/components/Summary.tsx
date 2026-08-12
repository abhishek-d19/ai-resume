import React, { useState } from 'react';
import { FileText, Sparkles, RefreshCw } from 'lucide-react';
import { SectionCard } from './SectionCard';
import { SectionHeader } from './SectionHeader';
import { resumeCopilotServiceInstance } from '../../../../services/ResumeCopilotService';
import { CopilotDiffModal } from '../../../ai/copilot/components/CopilotDiffModal';

export interface SummaryProps {
  data?: string;
  summary?: string;
  onChange: (updated: string) => void;
}

export const Summary: React.FC<SummaryProps> = ({ data, summary, onChange }) => {
  const currentSummary = data !== undefined ? data : (summary || '');
  const [loading, setLoading] = useState(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);
  const [suggestion, setSuggestion] = useState<{ improved: string; explanation: string } | null>(null);

  const handleImproveWithAI = async () => {
    if (!currentSummary || !currentSummary.trim()) {
      setErrorNotice('Please enter draft summary text before requesting AI improvement.');
      setTimeout(() => setErrorNotice(null), 4000);
      return;
    }

    setLoading(true);
    setErrorNotice(null);
    try {
      const res = await resumeCopilotServiceInstance.improveSummary(currentSummary);
      setSuggestion({ improved: res.improved, explanation: res.explanation });
    } catch (err: any) {
      console.warn('[Summary Copilot Error]:', err);
      setErrorNotice("AI suggestion couldn't be generated. Your original content is safe.");
      setTimeout(() => setErrorNotice(null), 4000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SectionCard>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <SectionHeader title="Professional Summary" icon={<FileText size={18} />} />

        <button
          onClick={handleImproveWithAI}
          disabled={loading || !currentSummary.trim()}
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
            opacity: (loading || !currentSummary.trim()) ? 0.5 : 1
          }}
        >
          {loading ? <RefreshCw size={13} className="animate-spin" /> : <Sparkles size={13} />}
          <span>{loading ? 'Improving...' : 'Improve with AI'}</span>
        </button>
      </div>

      {errorNotice && (
        <div style={{ fontSize: '0.78rem', color: '#991B1B', background: '#FEF2F2', padding: '8px 12px', borderRadius: 8, border: '1px solid #FCA5A5', marginBottom: 10 }}>
          {errorNotice}
        </div>
      )}

      <div>
        <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 6 }}>
          Executive Summary
        </label>
        <textarea
          value={currentSummary}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Brief overview of your key qualifications, metrics, and technical expertise..."
          rows={4}
          style={{
            width: '100%',
            padding: '12px 14px',
            borderRadius: 10,
            border: '1px solid #CBD5E1',
            outline: 'none',
            fontSize: '0.88rem',
            fontFamily: 'inherit',
            lineHeight: 1.5
          }}
        />
      </div>

      <CopilotDiffModal
        isOpen={Boolean(suggestion)}
        onClose={() => setSuggestion(null)}
        title="Improve Professional Summary"
        originalContent={currentSummary}
        suggestedContent={suggestion?.improved || ''}
        explanation={suggestion?.explanation}
        onAccept={(finalText) => onChange(finalText)}
      />
    </SectionCard>
  );
};

export default Summary;
