import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import AuthScreen from './components/AuthScreen';
import HeroSection from './components/HeroSection';
import ResumeStudioWorkspace from './components/ResumeStudioWorkspace';
import ResumeAnalysisDashboardView from './components/ResumeAnalysisDashboardView';
import HiringPanelExperience from './components/HiringPanelExperience';
import JDMatchEngine from './components/JDMatchEngine';
import NotificationSystem from './components/NotificationSystem';
import HowItWorks from './components/HowItWorks';
import FeatureCards from './components/FeatureCards';
import BrandLogos from './components/BrandLogos';
import TestimonialsGrid from './components/TestimonialsGrid';
import ResourceCards from './components/ResourceCards';
import VideoCarousel from './components/VideoCarousel';
import Pricing from './components/Pricing';
import FooterCTA from './components/FooterCTA';
import Footer from './components/Footer';
import ProductUserFlowStepper from './components/ProductUserFlowStepper';
import CommandPaletteModal from './components/CommandPaletteModal';
import KeyboardShortcutsFooterBar from './components/KeyboardShortcutsFooterBar';
import AuthenticatedAppShell from './components/AuthenticatedAppShell';
import ResumeDashboardView from './components/ResumeDashboardView';
import { useAuth } from './hooks/useAuth';
import { Loader2 } from 'lucide-react';

import './index.css';
import './styles/components.css';

export default function App() {
  const { user, session, loading, isAuthenticated, signOut } = useAuth();
  const [currentView, setCurrentView] = useState('landing');
  const [activeResumeId, setActiveResumeId] = useState(null);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [globalToast, setGlobalToast] = useState(null);

  // Sync currentView when auth state resolves
  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        if (currentView === 'landing' || currentView === 'auth') {
          setCurrentView('dashboard');
        }
      } else {
        if (currentView !== 'landing' && currentView !== 'auth') {
          setCurrentView('landing');
        }
      }
    }
  }, [isAuthenticated, loading]);

  const navigateToView = (viewName, resumeId) => {
    if (resumeId) setActiveResumeId(resumeId);
    if (!isAuthenticated && viewName !== 'landing' && viewName !== 'auth') {
      setCurrentView('auth');
      return;
    }
    setCurrentView(viewName);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const triggerGlobalToast = (msg) => {
    setGlobalToast(msg);
    setTimeout(() => setGlobalToast(null), 3500);
  };

  // GLOBAL KEYBOARD SHORTCUTS LISTENER
  useEffect(() => {
    const handleKeyDown = (e) => {
      const isCmdOrCtrl = e.metaKey || e.ctrlKey;

      if (isCmdOrCtrl && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }

      if (isCmdOrCtrl && e.key.toLowerCase() === 's') {
        e.preventDefault();
        triggerGlobalToast("✓ Resume saved to cloud (⌘S)");
      }

      if (isCmdOrCtrl && e.key.toLowerCase() === 'e') {
        e.preventDefault();
        triggerGlobalToast("📄 Opening PDF Export (⌘E)...");
        navigateToView('studio');
      }

      if (isCmdOrCtrl && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        triggerGlobalToast("✨ Running AI Metric Scan (⌘⇧A)...");
        navigateToView('studio');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAuthenticated]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#032D30', color: '#38E8F5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <Loader2 size={36} className="animate-spin" />
          <span style={{ fontSize: '0.9rem', fontWeight: 700, letterSpacing: '0.5px' }}>Restoring Session...</span>
        </div>
      </div>
    );
  }

  const activeUserId = user?.id;
  const activeUserName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'Candidate';
  const isProtectedView = isAuthenticated && Boolean(activeUserId) && currentView !== 'landing' && currentView !== 'auth';

  const handleSignOut = async () => {
    await signOut();
    setCurrentView('landing');
  };

  const renderAuthenticatedContent = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <ResumeDashboardView 
            userId={activeUserId} 
            userName={activeUserName} 
            onNavigateToStudio={(id) => navigateToView('studio', id)} 
          />
        );
      case 'studio':
        return (
          <ResumeStudioWorkspace 
            resumeId={activeResumeId} 
            userId={activeUserId} 
            onNavigateToDashboard={() => navigateToView('dashboard')} 
            onNavigateToAnalysis={(id) => navigateToView('analysis', id)}
          />
        );
      case 'analysis':
        return (
          <ResumeAnalysisDashboardView 
            resumeId={activeResumeId} 
            userId={activeUserId} 
            onBack={() => navigateToView('studio', activeResumeId)} 
            onNext={() => navigateToView('panel', activeResumeId)}
          />
        );
      case 'panel':
        return (
          <HiringPanelExperience 
            resumeId={activeResumeId} 
            userId={activeUserId} 
            onNavigateToJdMatch={(id) => navigateToView('jdmatch', id)}
            onNavigateToStudio={() => navigateToView('studio', activeResumeId)}
          />
        );
      case 'jdmatch':
        return (
          <JDMatchEngine 
            resumeId={activeResumeId} 
            userId={activeUserId} 
            onNavigateToStudio={() => navigateToView('studio', activeResumeId)}
          />
        );
      case 'journey':
        return <ResourceCards />;
      case 'settings':
        return (
          <div style={{ padding: 40, textAlign: 'left', maxWidth: 640, margin: '0 auto' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--color-teal-dark)', marginBottom: 8 }}>
              Account & Copilot Settings
            </h2>
            <p style={{ color: '#64748B', marginBottom: 24 }}>
              Manage AI hiring panel preferences, email notifications, and cloud sync.
            </p>
            <div style={{ background: '#FFFFFF', padding: 24, borderRadius: 20, border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 800, color: 'var(--color-teal-dark)' }}>Signed In User</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748B' }}>{user?.email}</div>
                </div>
                <span style={{ background: 'var(--color-cyan-light)', color: 'var(--color-teal-dark)', padding: '4px 12px', borderRadius: 8, fontWeight: 800, fontSize: '0.8rem' }}>
                  {activeUserName}
                </span>
              </div>
              <hr style={{ border: 'none', borderTop: '1px solid #F1F5F9' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 800, color: 'var(--color-teal-dark)' }}>Automatic Cloud Sync</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748B' }}>Supabase PostgreSQL RLS Active</div>
                </div>
                <span style={{ background: '#DCFCE7', color: '#15803D', padding: '4px 12px', borderRadius: 8, fontWeight: 800, fontSize: '0.8rem' }}>
                  Active Session
                </span>
              </div>
              <div style={{ paddingTop: 12 }}>
                <button
                  onClick={handleSignOut}
                  style={{ background: '#EF4444', color: '#FFFFFF', border: 'none', padding: '10px 20px', borderRadius: 12, fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  Sign Out of Lumina AI
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return <HeroSection navigateToView={navigateToView} />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg-light)' }}>
      
      {/* GLOBAL KEYBOARD SHORTCUT TOAST */}
      {globalToast && (
        <div style={{ position: 'fixed', top: 80, right: 24, zIndex: 1200, background: '#032D30', color: '#38E8F5', border: '1px solid #38E8F5', padding: '12px 20px', borderRadius: 16, fontWeight: 800, fontSize: '0.88rem', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', animation: 'floatCard1 0.3s ease' }}>
          {globalToast}
        </div>
      )}

      {/* RENDER AUTHENTICATED DESKTOP SAAS SHELL OR UNAUTHENTICATED MARKETING LANDING */}
      {isProtectedView ? (
        <AuthenticatedAppShell
          currentView={currentView}
          onNavigate={navigateToView}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          onSignOut={handleSignOut}
        >
          {renderAuthenticatedContent()}
        </AuthenticatedAppShell>
      ) : (
        <>
          <Navbar 
            currentView={currentView} 
            navigateToView={navigateToView} 
            isAuthenticated={isAuthenticated}
            onSignOut={handleSignOut}
          />

          <main>
            {currentView === 'landing' && (
              <>
                <HeroSection navigateToView={navigateToView} />
                <ResumeStudioWorkspace />
                <HiringPanelExperience />
                <JDMatchEngine />
                <NotificationSystem />
                <HowItWorks />
                <FeatureCards />
                <BrandLogos />
                <TestimonialsGrid />
                <ResourceCards />
                <VideoCarousel />
                <Pricing />
                <FooterCTA navigateToView={navigateToView} />
              </>
            )}

            {currentView === 'auth' && (
              <AuthScreen 
                navigateToView={navigateToView} 
                onAuthSuccess={() => navigateToView('dashboard')}
              />
            )}
          </main>

          <Footer />
        </>
      )}

      {/* COMMAND PALETTE MODAL (⌘ + K) */}
      <CommandPaletteModal 
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        navigateToView={navigateToView}
        onSave={() => triggerGlobalToast("✓ Resume saved to cloud (⌘S)")}
        onExport={() => triggerGlobalToast("📄 Opening PDF Export (⌘E)...")}
        onAnalyze={() => triggerGlobalToast("✨ Running AI Metric Scan (⌘⇧A)...")}
      />

      {/* FLOATING KEYBOARD SHORTCUTS BADGE */}
      <KeyboardShortcutsFooterBar 
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
      />

      {/* Interactive 12-Stage Product Flow Stepper */}
      <ProductUserFlowStepper />

    </div>
  );
}
