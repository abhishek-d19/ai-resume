import React, { useState } from 'react';
import { Layers, ChevronRight, Sparkles, Menu, X, User } from 'lucide-react';

export default function Navbar({ currentView, navigateToView }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="navbar-wrapper">
      <div className="container navbar-container">
        {/* Brand Logo */}
        <div 
          onClick={() => navigateToView ? navigateToView('landing') : null} 
          className="navbar-brand" 
          style={{ cursor: 'pointer' }}
        >
          <div className="navbar-logo-icon">
            <Layers size={18} strokeWidth={2.5} />
          </div>
          <span>LUMINA AI</span>
        </div>

        {/* Desktop Navigation Links */}
        <nav>
          <ul className="navbar-links" style={{ display: mobileMenuOpen ? 'none' : 'flex' }}>
            <li>
              <button 
                onClick={() => navigateToView ? navigateToView('landing') : null} 
                className="navbar-link"
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: currentView === 'landing' ? 800 : 500 }}
              >
                Home
              </button>
            </li>
            <li>
              <button 
                onClick={() => navigateToView ? navigateToView('dashboard') : null} 
                className="navbar-link"
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: currentView === 'dashboard' ? 800 : 500 }}
              >
                Dashboard
              </button>
            </li>
            <li>
              <button 
                onClick={() => navigateToView ? navigateToView('studio') : null} 
                className="navbar-link"
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: currentView === 'studio' ? 800 : 500 }}
              >
                Resume Studio
              </button>
            </li>
            <li>
              <button 
                onClick={() => navigateToView ? navigateToView('panel') : null} 
                className="navbar-link"
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: currentView === 'panel' ? 800 : 500 }}
              >
                Hiring Panel
              </button>
            </li>
            <li>
              <button 
                onClick={() => navigateToView ? navigateToView('jdmatch') : null} 
                className="navbar-link"
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: currentView === 'jdmatch' ? 800 : 500 }}
              >
                JD Match
              </button>
            </li>
          </ul>
        </nav>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button 
            onClick={() => navigateToView ? navigateToView('auth') : null} 
            className="btn-secondary-pill"
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
          >
            <User size={14} />
            <span>Sign In</span>
          </button>

          <button 
            onClick={() => navigateToView ? navigateToView('studio') : null} 
            className="btn-cyan-pill"
            style={{ padding: '8px 20px', fontSize: '0.85rem' }}
          >
            <Sparkles size={14} />
            <span>ANALYZE RESUME</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button 
            className="mobile-menu-btn" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ display: 'none', padding: 8 }}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </header>
  );
}
