import React, { useState, useEffect } from 'react';
import { Play, Sparkles, CheckCircle2, ArrowRight, Clock, FileText, Users, Target, Download, ShieldCheck, ChevronRight, Briefcase, FileSearch, UserCheck, MessageSquare } from 'lucide-react';
import EmptyState from './EmptyState';

export default function HeroSection({ navigateToView }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [showEmptyDashboard, setShowEmptyDashboard] = useState(false);

  // Requirement 1: Automatic Hero Looping Sequence
  const heroSequence = [
    { text: "Resume Uploaded", icon: "📄", status: "Complete" },
    { text: "AI Scanning Resume Metrics...", icon: "✨", status: "In Progress" },
    { text: "ATS Analysis Complete (Score: 94%)", icon: "✓", status: "Complete" },
    { text: "Sarah (HR Recruiter) joined meeting", icon: "👩‍💼", status: "Joined" },
    { text: "David (Engineering Manager) joined meeting", icon: "👨‍💻", status: "Joined" },
    { text: "Emma (Hiring Manager) joined meeting", icon: "👩‍🔬", status: "Joined" },
    { text: "Consensus Generated: Strong Hire", icon: "🤝", status: "Consensus" },
    { text: "Recruiter Confidence: High", icon: "🎯", status: "Approved" }
  ];

  const [sequenceIndex, setSequenceIndex] = useState(0);
  const [ctaHighlighted, setCtaHighlighted] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setSequenceIndex((prev) => {
        const next = (prev + 1) % heroSequence.length;
        if (next === heroSequence.length - 1) {
          setCtaHighlighted(true);
          setTimeout(() => setCtaHighlighted(false), 2000);
        }
        return next;
      });
    }, 2400);

    return () => clearInterval(timer);
  }, []);

  // Requirement 4: Rotating AI Insights
  const aiInsights = [
    { reviewer: "Sarah (HR Recruiter)", avatar: "👩‍💼", quote: "Projects need stronger measurable impact.", color: "#38E8F5" },
    { reviewer: "David (Engineering Manager)", avatar: "👨‍💻", quote: "Backend experience is improving continuously.", color: "#9877FF" },
    { reviewer: "Emma (Hiring Manager)", avatar: "👩‍🔬", quote: "Leadership initiative stands out clearly.", color: "#10B981" },
    { reviewer: "Career Coach", avatar: "🧭", quote: "Today's mission: Improve React project description.", color: "#F5BB27" }
  ];

  const [insightIndex, setInsightIndex] = useState(0);

  useEffect(() => {
    const insightTimer = setInterval(() => {
      setInsightIndex((prev) => (prev + 1) % aiInsights.length);
    }, 3500);

    return () => clearInterval(insightTimer);
  }, []);

  const journeySteps = [
    { title: "Resume Uploaded", status: "Complete", active: false, done: true },
    { title: "Analysis Complete", status: "Complete", active: false, done: true },
    { title: "Hiring Panel Reviewed", status: "Complete", active: false, done: true },
    { title: "Interview Ready", status: "In Progress", active: true, done: false }
  ];

  const quickActions = [
    { title: "Resume Studio", desc: "AI metric parser", icon: <FileText size={16} />, target: 'studio' },
    { title: "Analyze Resume", desc: "Run executive scan", icon: <Sparkles size={16} />, target: 'analysis' },
    { title: "JD Match", desc: "Target role alignment", icon: <Target size={16} />, target: 'jdmatch' },
    { title: "Export Resume", desc: "Download v2 draft", icon: <Download size={16} />, target: 'export' }
  ];

  const recentActivities = [
    { title: "Resume Version 7", time: "10 mins ago", type: "Edit" },
    { title: "Hiring Panel Review", time: "2 hours ago", type: "Simulation" },
    { title: "JD Match Completed", time: "1 day ago", type: "Analysis" },
    { title: "Resume Exported", time: "2 days ago", type: "Export" }
  ];

  const upcomingApplications = [
    { company: "Google SWE Intern", status: "Panel Approved", match: "98% Fit", color: "#10B981" },
    { company: "Amazon PM Intern", status: "In Progress", match: "94% Fit", color: "#F5BB27" },
    { company: "Microsoft Explore", status: "Drafting Resume v2", match: "91% Fit", color: "#9877FF" }
  ];

  return (
    <section className="hero-wrapper">
      <div className="container">
        {/* Main Hero Headline */}
        <h1 className="hero-title">
          LAND INTERVIEWS.<br />
          <span style={{ color: 'var(--color-teal-dark)' }}>NOT GUESSWORK.</span>
        </h1>

        {/* Hero Subtitle */}
        <p className="hero-subtitle">
          Your personal AI career platform that analyzes resumes, simulates hiring panels, matches job descriptions, and helps you grow into interview-ready confidence.
        </p>

        {/* Dual CTA Buttons with subtle loop highlight */}
        <div className="hero-cta-group">
          <button 
            onClick={() => navigateToView ? navigateToView('studio') : null} 
            className="btn-cyan-pill" 
            style={{ 
              padding: '14px 32px', 
              fontSize: '1rem', 
              cursor: 'pointer',
              boxShadow: ctaHighlighted ? '0 0 35px rgba(56, 232, 245, 0.9)' : 'none',
              transform: ctaHighlighted ? 'scale(1.04)' : 'scale(1)',
              transition: 'all 0.4s ease'
            }}
          >
            <Play size={14} fill="currentColor" />
            <span>ANALYZE RESUME</span>
          </button>
          <button 
            onClick={() => navigateToView ? navigateToView('panel') : null} 
            className="btn-secondary-pill" 
            style={{ padding: '14px 32px', fontSize: '1rem', cursor: 'pointer' }}
          >
            <Play size={14} fill="currentColor" />
            <span>SEE DEMO</span>
          </button>
        </div>

        {/* Mission Control Dashboard Mockup Frame */}
        <div className="dashboard-mockup" style={{ maxWidth: 1100, margin: '0 auto', background: '#FFFFFF', padding: 28, borderRadius: 24, boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.12)', border: '1px solid rgba(0,0,0,0.08)' }}>
          
          {/* Dashboard Header Bar */}
          <div className="dashboard-header" style={{ marginBottom: 20 }}>
            <div className="window-dots">
              <span className="dot dot-red"></span>
              <span className="dot dot-yellow"></span>
              <span className="dot dot-green"></span>
            </div>
            <div style={{ fontSize: '0.9rem', fontWeight: 900, color: 'var(--color-teal-dark)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              LUMINA MISSION CONTROL
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button 
                onClick={() => setShowEmptyDashboard(!showEmptyDashboard)}
                style={{ fontSize: '0.75rem', fontWeight: 700, padding: '4px 12px', borderRadius: 8, background: '#F1F5F9', border: '1px solid #CBD5E1', cursor: 'pointer', color: '#475569' }}
              >
                {showEmptyDashboard ? "View Active Dashboard" : "Explore Example"}
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', fontWeight: 800, padding: '4px 12px', borderRadius: 12, background: 'var(--color-cyan-light)', color: 'var(--color-teal-dark)' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981' }}></span>
                <span>LIVE AI SESSION</span>
              </div>
            </div>
          </div>

          {/* AUTOMATIC HERO LOOPING SEQUENCE TICKER BAR */}
          <div style={{ 
            background: '#F0FDF4', 
            border: '1px solid #BBF7D0', 
            borderRadius: 14, 
            padding: '10px 18px', 
            marginBottom: 20, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            fontSize: '0.88rem',
            color: '#166534',
            fontWeight: 700,
            transition: 'all 0.3s ease'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: '1.1rem' }}>{heroSequence[sequenceIndex].icon}</span>
              <span>{heroSequence[sequenceIndex].text}</span>
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, background: '#DCFCE7', color: '#15803D', padding: '3px 10px', borderRadius: 8 }}>
              {heroSequence[sequenceIndex].status}
            </span>
          </div>

          {/* DASHBOARD EMPTY STATE OR ACTIVE MISSION CONTROL */}
          {showEmptyDashboard ? (
            <div style={{ padding: '32px 0' }}>
              <EmptyState 
                icon={<FileSearch size={32} />}
                title="No resume uploaded yet."
                description="Upload your resume to activate Lumina Mission Control and receive daily career guidance."
                ctaText="Upload First Resume"
                onCtaClick={() => navigateToView ? navigateToView('studio') : null}
              />
            </div>
          ) : (
            <>
          <div style={{ 
            background: 'linear-gradient(135deg, #032D30 0%, #002B2E 100%)', 
            color: '#FFFFFF', 
            borderRadius: 20, 
            padding: 32, 
            textAlign: 'left',
            marginBottom: 28,
            boxShadow: '0 16px 36px rgba(3, 45, 48, 0.2)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 20 }}>
              <div>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#FFFFFF', marginBottom: 4, letterSpacing: '-0.02em' }}>
                  Good morning, Abhishek 👋
                </h2>
                <div style={{ fontSize: '0.9rem', color: '#A5C9CC' }}>
                  Your career mentor AI is active and monitoring application progress.
                </div>
              </div>

              {/* Career Confidence Badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 20, background: 'rgba(56, 232, 245, 0.15)', border: '1px solid rgba(56, 232, 245, 0.3)' }}>
                <ShieldCheck size={18} style={{ color: '#38E8F5' }} />
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#38E8F5' }}>Career Confidence: High</span>
              </div>
            </div>

            {/* DYNAMIC ROTATING AI INSIGHT CARD (Requirement 4) */}
            <div style={{ background: 'rgba(255, 255, 255, 0.08)', borderRadius: 16, padding: 20, border: '1px solid rgba(255, 255, 255, 0.12)', backdropFilter: 'blur(8px)', marginBottom: 20, transition: 'all 0.4s ease' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#38E8F5', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Sparkles size={14} /> DYNAMIC AI CAREER INSIGHT
                </div>
                <span style={{ fontSize: '0.72rem', color: '#A5C9CC', fontWeight: 600 }}>Auto-rotating feedback</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 10 }}>
                <span style={{ fontSize: '1.75rem' }}>{aiInsights[insightIndex].avatar}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, fontSize: '0.88rem', color: aiInsights[insightIndex].color }}>
                    {aiInsights[insightIndex].reviewer}
                  </div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFFFFF', marginTop: 2, fontStyle: 'italic', letterSpacing: '-0.01em' }}>
                    "{aiInsights[insightIndex].quote}"
                  </div>
                </div>
              </div>
            </div>

            {/* Opportunity Focus Box */}
            <div style={{ background: 'rgba(255, 255, 255, 0.08)', borderRadius: 16, padding: 20, border: '1px solid rgba(255, 255, 255, 0.12)', backdropFilter: 'blur(8px)', marginBottom: 20 }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#38E8F5', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
                Today's Biggest Opportunity
              </div>
              
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', marginBottom: 8 }}>
                Improve your React project description.
              </h3>

              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', color: '#9CA3AF', marginBottom: 20 }}>
                <Clock size={14} /> Estimated effort: 6 minutes.
              </div>

              {/* Primary & Secondary Actions */}
              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                <a href="#resume" className="btn-cyan-pill" style={{ padding: '10px 22px', fontSize: '0.88rem' }}>
                  <span>Continue Improving Resume</span>
                  <ArrowRight size={14} />
                </a>
                <a href="#panel" className="btn-secondary-pill" style={{ padding: '10px 22px', fontSize: '0.88rem', background: 'rgba(255,255,255,0.15)', color: '#FFF' }}>
                  <span>View Hiring Panel</span>
                </a>
              </div>
            </div>

            {/* TODAY'S TOP OPPORTUNITIES BOX */}
            <div style={{ background: 'rgba(255, 255, 255, 0.05)', borderRadius: 16, padding: 20, border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#38E8F5', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 14 }}>
                Today's Top Opportunities
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {/* Item 1 */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#FFFFFF' }}>
                      1. Quantify Project Results
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#9CA3AF', marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Clock size={12} /> Estimated Time: 4 min
                    </div>
                  </div>
                  <button className="btn-cyan-pill" style={{ padding: '6px 18px', fontSize: '0.8rem' }}>
                    Fix
                  </button>
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)', margin: 0 }} />

                {/* Item 2 */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#FFFFFF' }}>
                      2. Improve Leadership Bullet
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#9CA3AF', marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Clock size={12} /> Estimated Time: 2 min
                    </div>
                  </div>
                  <button className="btn-cyan-pill" style={{ padding: '6px 18px', fontSize: '0.8rem' }}>
                    Fix
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* TODAY'S JOURNEY (FOUR HORIZONTAL PROGRESS CARDS) */}
          <div style={{ textTransform: 'uppercase', textAlign: 'left', marginBottom: 12, fontSize: '0.8rem', fontWeight: 800, color: '#64748B', letterSpacing: '0.05em' }}>
            Today's Journey
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginBottom: 28 }}>
            {journeySteps.map((step, idx) => (
              <div 
                key={idx} 
                style={{ 
                  background: step.done ? '#F0FDF4' : step.active ? '#E6FAFC' : '#F8FAFC', 
                  border: step.done ? '1px solid #BBF7D0' : step.active ? '2px solid #38E8F5' : '1px solid #E2E8F0',
                  borderRadius: 16,
                  padding: 16,
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12
                }}
              >
                <div style={{ 
                  width: 32, 
                  height: 32, 
                  borderRadius: '50%', 
                  background: step.done ? '#10B981' : step.active ? '#032D30' : '#CBD5E1', 
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '0.8rem',
                  flexShrink: 0
                }}>
                  {step.done ? <CheckCircle2 size={18} /> : idx + 1}
                </div>

                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--color-teal-dark)' }}>
                    {step.title}
                  </div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: step.done ? '#166534' : step.active ? '#032D30' : '#64748B' }}>
                    {step.status}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 3-COLUMN CONTROL GRID: Quick Actions | Recent Activity | Upcoming Applications */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20, textAlign: 'left' }}>
            
            {/* Quick Actions Card */}
            <div style={{ background: '#F8FAFC', borderRadius: 20, padding: 20, border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 14 }}>
                Quick Actions
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {quickActions.map((act, i) => (
                  <div 
                    key={i} 
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between', 
                      background: '#FFFFFF', 
                      padding: '12px 14px', 
                      borderRadius: 12, 
                      border: '1px solid #E2E8F0',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--color-cyan-light)', color: 'var(--color-teal-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {act.icon}
                      </div>
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-teal-dark)' }}>{act.title}</div>
                        <div style={{ fontSize: '0.72rem', color: '#64748B' }}>{act.desc}</div>
                      </div>
                    </div>
                    <ChevronRight size={14} style={{ color: '#94A3B8' }} />
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity Card */}
            <div style={{ background: '#F8FAFC', borderRadius: 20, padding: 20, border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 14 }}>
                Recent Activity
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {recentActivities.map((act, i) => (
                  <div key={i} style={{ background: '#FFFFFF', padding: '12px 14px', borderRadius: 12, border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-teal-dark)' }}>{act.title}</div>
                      <div style={{ fontSize: '0.72rem', color: '#64748B' }}>{act.type} • {act.time}</div>
                    </div>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: 6, background: '#F1F5F9', color: '#475569' }}>
                      {act.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Applications Card */}
            <div style={{ background: '#F8FAFC', borderRadius: 20, padding: 20, border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 14 }}>
                Upcoming Applications
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {upcomingApplications.map((app, i) => (
                  <div key={i} style={{ background: '#FFFFFF', padding: '12px 14px', borderRadius: 12, border: '1px solid #E2E8F0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-teal-dark)', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Briefcase size={14} style={{ color: app.color }} /> {app.company}
                      </span>
                      <span style={{ fontSize: '0.7rem', fontWeight: 800, color: app.color }}>{app.match}</span>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600 }}>
                      Status: {app.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
          </>
          )}

        </div>
      </div>
    </section>
  );
}
