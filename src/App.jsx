import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import AuthScreen from './components/AuthScreen';
import HeroSection from './components/HeroSection';
import ResumeStudioWorkspace from './components/ResumeStudioWorkspace';
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

import './index.css';
import './styles/components.css';

import ResumeDashboardView from './components/ResumeDashboardView';

export default function App() {
  const [currentView, setCurrentView] = useState('landing');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [globalToast, setGlobalToast] = useState(null);

  const navigateToView = (viewName) => {
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
  }, []);

  const isAuthenticatedView = currentView !== 'landing' && currentView !== 'auth';

  const renderAuthenticatedContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <ResumeDashboardView onNavigateToStudio={(id) => navigateToView('studio')} />;
      case 'studio':
        return <ResumeStudioWorkspace />;
      case 'analysis':
        return <ResumeStudioWorkspace />;
      case 'panel':
        return <HiringPanelExperience />;
      case 'jdmatch':
        return <JDMatchEngine />;
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
                  <div style={{ fontWeight: 800, color: 'var(--color-teal-dark)' }}>AI Panel Rigor Level</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748B' }}>Strict executive review mode enabled</div>
                </div>
                <span style={{ background: 'var(--color-cyan-light)', color: 'var(--color-teal-dark)', padding: '4px 12px', borderRadius: 8, fontWeight: 800, fontSize: '0.8rem' }}>
                  Strict (Google / Stripe Bar)
                </span>
              </div>
              <hr style={{ border: 'none', borderTop: '1px solid #F1F5F9' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 800, color: 'var(--color-teal-dark)' }}>Automatic Cloud Sync</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748B' }}>Sync version history on edit</div>
                </div>
                <span style={{ background: '#DCFCE7', color: '#15803D', padding: '4px 12px', borderRadius: 8, fontWeight: 800, fontSize: '0.8rem' }}>
                  Enabled
                </span>
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
      {isAuthenticatedView ? (
        <AuthenticatedAppShell
          currentView={currentView}
          onNavigate={navigateToView}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        >
          {renderAuthenticatedContent()}
        </AuthenticatedAppShell>
      ) : (
        <>
          <Navbar currentView={currentView} navigateToView={navigateToView} />

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
              <AuthScreen navigateToView={navigateToView} />
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
