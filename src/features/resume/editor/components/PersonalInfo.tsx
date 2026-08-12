import React from 'react';
import { SectionCard } from './SectionCard';

export interface PersonalInfoData {
  fullName?: string;
  headline?: string;
  email?: string;
  phone?: string;
  location?: string;
  website?: string;
  linkedin?: string;
  github?: string;
}

interface PersonalInfoProps {
  data: PersonalInfoData;
  onChange: (data: PersonalInfoData) => void;
}

export const PersonalInfo: React.FC<PersonalInfoProps> = ({ data, onChange }) => {
  const handleChange = (field: keyof PersonalInfoData, value: string) => {
    onChange({
      ...data,
      [field]: value
    });
  };

  return (
    <SectionCard title="Personal Information" icon="👤" description="Contact details and primary professional header">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 16 }}>
        <div>
          <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 6 }}>Full Name</label>
          <input
            type="text"
            value={data.fullName || ''}
            onChange={(e) => handleChange('fullName', e.target.value)}
            placeholder="e.g. Tony Stark"
            style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #CBD5E1', outline: 'none', fontSize: '0.9rem' }}
          />
        </div>

        <div>
          <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 6 }}>Professional Headline</label>
          <input
            type="text"
            value={data.headline || ''}
            onChange={(e) => handleChange('headline', e.target.value)}
            placeholder="e.g. Principal Software Engineer & Systems Architect"
            style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #CBD5E1', outline: 'none', fontSize: '0.9rem' }}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
        <div>
          <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 6 }}>Email Address</label>
          <input
            type="email"
            value={data.email || ''}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="tony.stark@example.com"
            style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #CBD5E1', outline: 'none', fontSize: '0.9rem' }}
          />
        </div>

        <div>
          <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 6 }}>Phone Number</label>
          <input
            type="text"
            value={data.phone || ''}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="+1 (555) 010-3000"
            style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #CBD5E1', outline: 'none', fontSize: '0.9rem' }}
          />
        </div>

        <div>
          <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 6 }}>Location</label>
          <input
            type="text"
            value={data.location || ''}
            onChange={(e) => handleChange('location', e.target.value)}
            placeholder="New York, NY"
            style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #CBD5E1', outline: 'none', fontSize: '0.9rem' }}
          />
        </div>
      </div>
    </SectionCard>
  );
};
