export const DEMO_CANDIDATE_UUID = '550e8400-e29b-41d4-a716-446655440000';

export interface DemoCandidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  headline: string;
  summary: string;
  resumeFileName: string;
  education: Array<{
    id: string;
    institution: string;
    degree: string;
    fieldOfStudy: string;
    startDate: string;
    endDate: string;
  }>;
  experience: Array<{
    id: string;
    company: string;
    role: string;
    startDate: string;
    endDate: string;
    location: string;
    bullets: string[];
  }>;
  projects: Array<{
    id: string;
    name: string;
    description: string;
    techStack: string;
    bullets: string[];
  }>;
  skills: Array<{
    id: string;
    category: string;
    skills: string;
  }>;
  certifications: Array<{
    id: string;
    name: string;
    issuer: string;
    date: string;
  }>;
  achievements: Array<{
    id: string;
    title: string;
    description: string;
    date: string;
  }>;
  languages: Array<{
    id: string;
    language: string;
    proficiency: string;
  }>;
}

export const DEMO_CANDIDATE: DemoCandidate = {
  id: DEMO_CANDIDATE_UUID,
  name: 'Tony Stark',
  email: 'tony.stark@example.com',
  phone: '+1 (555) 010-3000',
  location: 'New York, NY',
  headline: 'Principal Software Engineer & Systems Architect',
  summary: 'Technology leader specializing in distributed systems, AI infrastructure, product engineering, and high-performance software platforms.',
  resumeFileName: 'Tony_Stark_Resume.pdf',
  education: [
    {
      id: 'edu-1',
      institution: 'Massachusetts Institute of Technology (MIT)',
      degree: 'B.S. in Computer Science & Electrical Engineering',
      fieldOfStudy: 'Computer Science',
      startDate: '2015',
      endDate: '2019'
    }
  ],
  experience: [
    {
      id: 'exp-1',
      company: 'Stark Industries',
      role: 'Principal Software Engineer & Systems Architect',
      startDate: '2019',
      endDate: 'Present',
      location: 'New York, NY',
      bullets: [
        'Architected high-throughput AI infrastructure platform supporting 2M+ daily active system transactions with 99.999% uptime.',
        'Led engineering team of 14 senior developers building event-driven microservices reducing service latency by 42%.'
      ]
    }
  ],
  projects: [
    {
      id: 'proj-1',
      name: 'AI Infrastructure & Analytics Platform',
      description: 'Distributed real-time telemetry processing platform handling 500k events/sec.',
      techStack: 'TypeScript, Node.js, Python, PostgreSQL, Kubernetes',
      bullets: [
        'Engineered distributed query pipeline processing high-frequency streaming events with sub-50ms latency.'
      ]
    }
  ],
  skills: [
    { id: 'sk-1', category: 'Core Engineering', skills: 'TypeScript, React, Node.js, Python, Go' },
    { id: 'sk-2', category: 'Cloud & Infrastructure', skills: 'AWS, Kubernetes, PostgreSQL, Distributed Systems, AI/ML' }
  ],
  certifications: [
    { id: 'cert-1', name: 'AWS Certified Solutions Architect - Professional', issuer: 'Amazon Web Services', date: '2022' }
  ],
  achievements: [
    { id: 'ach-1', title: 'Executive Engineering Innovation Award', description: 'Awarded for architectural excellence in distributed AI infrastructure.', date: '2023' }
  ],
  languages: [
    { id: 'lang-1', language: 'English', proficiency: 'Native / Bilingual' }
  ]
};

export function buildCanonicalDemoResumeEntity(userId = 'usr_demo'): Record<string, any> {
  return {
    id: DEMO_CANDIDATE_UUID,
    user_id: userId,
    title: DEMO_CANDIDATE.resumeFileName,
    status: 'complete',
    version: 1,
    deleted_at: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    content: {
      personalInfo: {
        fullName: DEMO_CANDIDATE.name,
        email: DEMO_CANDIDATE.email,
        phone: DEMO_CANDIDATE.phone,
        location: DEMO_CANDIDATE.location,
        headline: DEMO_CANDIDATE.headline,
        summary: DEMO_CANDIDATE.summary
      },
      summary: DEMO_CANDIDATE.summary,
      education: DEMO_CANDIDATE.education,
      experience: DEMO_CANDIDATE.experience,
      projects: DEMO_CANDIDATE.projects,
      skills: DEMO_CANDIDATE.skills,
      certifications: DEMO_CANDIDATE.certifications,
      achievements: DEMO_CANDIDATE.achievements,
      languages: DEMO_CANDIDATE.languages
    }
  };
}
