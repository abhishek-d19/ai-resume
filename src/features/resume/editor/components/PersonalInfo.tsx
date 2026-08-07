import React from 'react';
import { User } from 'lucide-react';
import { SectionCard } from './SectionCard';
import { SectionHeader } from './SectionHeader';

export interface PersonalInfoData {
  fullName: string;
  headline: string;
  email: string;
  phone: string;
  location: string;
}

export interface PersonalInfoProps {
  data: PersonalInfoData;
  onChange: (updated: PersonalInfoData) => void;
}

export const PersonalInfo: React.FC<PersonalInfoProps> = ({ data, onChange }) => {
  const handleChange = (field: keyof PersonalInfoData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <SectionCard>
      <SectionHeader title="Personal Information" icon={<User size={18} />} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, marginBottom: 16 }}>
        <div>
          <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 6 }}>Full Name</label>
          <input
            type="text"
            value={data.fullName || ''}
            onChange={(e) => handleChange('fullName', e.target.value)}
            placeholder="e.g. Abhishek Sharma"
            style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #CBD5E1', outline: 'none', fontSize: '0.9rem' }}
          />
        </div>

        <div>
          <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 6 }}>Professional Headline</label>
          <input
            type="text"
            value={data.headline || ''}
            onChange={(e) => handleChange('headline', e.target.value)}
            placeholder="e.g. Senior Software Engineer"
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
            placeholder="candidate@example.com"
            style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #CBD5E1', outline: 'none', fontSize: '0.9rem' }}
          />
        </div>

        <div>
          <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 6 }}>Phone Number</label>
          <input
            type="text"
            value={data.phone || ''}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="+1 (555) 000-0000"
            style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #CBD5E1', outline: 'none', fontSize: '0.9rem' }}
          />
        </div>

        <div>
          <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 6 }}>Location</label>
          <input
            type="text"
            value={data.location || ''}
            onChange={(e) => handleChange('location', e.target.value)}
            placeholder="San Francisco, CA"
            style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #CBD5E1', outline: 'none', fontSize: '0.9rem' }}
          />
        </div>
      </div>
    </SectionCard>
  );
};
