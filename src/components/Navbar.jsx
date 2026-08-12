import React, { useState } from 'react';
import { Layers, Sparkles, Menu, X, User, Search, Bell, LogOut } from 'lucide-react';

export default function Navbar({ currentView, navigateToView, isAuthenticated, onSignOut, userName = 'Candidate' }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const initials = userName ? userName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'AS';

  return (
    <header style={{
      background: '#FFFFFF',
      borderBottom: '1px solid #E2E8F0',
      position: 'sticky',
      top: 0,
      zIndex: 800,
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.02)'
    }}>
      <div style={{
        maxWidth: 1240,
        margin: '0 auto',
        padding: '0 24px',
        height: 68,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        
        {/* Brand Logo */}
        <div 
          onClick={() => navigateToView ? navigateToView('landing') : null} 
          style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
        >
          <div style={{
            width: 34,
            height: 34,
            borderRadius: 10,
            background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
            color: '#38E8F5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(15, 23, 42, 0.15)'
          }}>
            <Layers size={18} strokeWidth={2.5} />
          </div>
          <span style={{ fontWeight: 900, fontSize: '1.1rem', letterSpacing: '-0.02em', color: '#0F172A' }}>
            LUMINA <span style={{ color: '#0EA5E9' }}>AI</span>
          </span>
        </div>

        {/* Desktop Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <button 
            onClick={() => navigateToView ? navigateToView('dashboard') : null} 
            style={{
              background: currentView === 'dashboard' ? '#F1F5F9' : 'transparent',
              color: currentView === 'dashboard' ? '#0F172A' : '#64748B',
              border: 'none',
              borderRadius: 8,
              padding: '6px 14px',
              fontSize: '0.88rem',
              fontWeight: currentView === 'dashboard' ? 700 : 500,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            Dashboard
          </button>
          <button 
            onClick={() => navigateToView ? navigateToView('studio') : null} 
            style={{
              background: currentView === 'studio' ? '#F1F5F9' : 'transparent',
              color: currentView === 'studio' ? '#0F172A' : '#64748B',
              border: 'none',
              borderRadius: 8,
              padding: '6px 14px',
              fontSize: '0.88rem',
              fontWeight: currentView === 'studio' ? 700 : 500,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            Resume Studio
          </button>
          <button 
            onClick={() => navigateToView ? navigateToView('panel') : null} 
            style={{
              background: currentView === 'panel' ? '#F1F5F9' : 'transparent',
              color: currentView === 'panel' ? '#0F172A' : '#64748B',
              border: 'none',
              borderRadius: 8,
              padding: '6px 14px',
              fontSize: '0.88rem',
              fontWeight: currentView === 'panel' ? 700 : 500,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            Hiring Panel
          </button>
          <button 
            onClick={() => navigateToView ? navigateToView('jdmatch') : null} 
            style={{
              background: currentView === 'jdmatch' ? '#F1F5F9' : 'transparent',
              color: currentView === 'jdmatch' ? '#0F172A' : '#64748B',
              border: 'none',
              borderRadius: 8,
              padding: '6px 14px',
              fontSize: '0.88rem',
              fontWeight: currentView === 'jdmatch' ? 700 : 500,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            JD Match
          </button>
        </nav>

        {/* Right Action Tools & User Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          
          {/* Quick Search */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: 10,
            padding: '6px 12px',
            fontSize: '0.82rem',
            color: '#94A3B8'
          }}>
            <Search size={14} />
            <span>Search...</span>
            <span style={{ fontSize: '0.72rem', background: '#E2E8F0', color: '#475569', borderRadius: 4, padding: '1px 5px', fontWeight: 700 }}>⌘K</span>
          </div>

          {/* AI Assistant Button */}
          <button 
            onClick={() => navigateToView ? navigateToView('studio') : null} 
            style={{
              background: '#F0F9FF',
              color: '#0284C7',
              border: '1px solid #BAE6FD',
              borderRadius: 10,
              padding: '6px 14px',
              fontSize: '0.82rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              cursor: 'pointer'
            }}
          >
            <Sparkles size={14} />
            <span>AI Assistant</span>
          </button>

          {/* Notifications Icon */}
          <div style={{ width: 34, height: 34, borderRadius: 10, border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B', cursor: 'pointer', position: 'relative' }}>
            <Bell size={16} />
            <span style={{ position: 'absolute', top: 6, right: 6, width: 6, height: 6, borderRadius: '50%', background: '#0EA5E9' }} />
          </div>

          {/* User Avatar */}
          <div style={{
            width: 34,
            height: 34,
            borderRadius: 10,
            background: '#0F172A',
            color: '#38E8F5',
            fontSize: '0.82rem',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
          }}>
            {initials}
          </div>

          {/* Sign Out */}
          {isAuthenticated ? (
            <button 
              onClick={onSignOut} 
              style={{
                background: 'none',
                border: '1px solid #E2E8F0',
                borderRadius: 10,
                padding: '6px 12px',
                fontSize: '0.82rem',
                fontWeight: 600,
                color: '#64748B',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          ) : (
            <button 
              onClick={() => navigateToView ? navigateToView('auth') : null} 
              style={{
                background: '#0F172A',
                color: '#FFF',
                border: 'none',
                borderRadius: 10,
                padding: '6px 14px',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Sign In
            </button>
          )}

        </div>

      </div>
    </header>
  );
}
