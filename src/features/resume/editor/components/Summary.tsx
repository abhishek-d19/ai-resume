import React from 'react';
import { FileText } from 'lucide-react';
import { SectionCard } from './SectionCard';
import { SectionHeader } from './SectionHeader';

export interface SummaryProps {
  summary: string;
  onChange: (updated: string) => void;
}

export const Summary: React.FC<SummaryProps> = ({ summary, onChange }) => {
  return (
    <SectionCard>
      <SectionHeader title="Professional Summary" icon={<FileText size={18} />} />

      <div>
        <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 6 }}>
          Executive Summary
        </label>
        <textarea
          value={summary || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Brief overview of your key qualifications, metrics, and technical expertise..."
          rows={4}
          style={{
            width: '100%',
            padding: '12px 14px',
            borderRadius: 10,
            border: '1px solid #CBD5E1',
            outline: 'none',
            fontSize: '0.9rem',
            fontFamily: 'inherit',
            lineHeight: 1.5
          }}
        />
      </div>
    </SectionCard>
  );
};
