import React from 'react';
import { Layers, MessageSquare } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ background: '#FFFFFF', borderTop: '1px solid #E5E7EB', padding: '64px 0 40px 0' }}>
      <div className="container">
        
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr repeat(4, 1fr)', gap: 40, marginBottom: 48 }}>
          
          {/* Column 1: Brand Info */}
          <div>
            <a href="#" className="navbar-brand" style={{ marginBottom: 16 }}>
              <div className="navbar-logo-icon">
                <Layers size={18} strokeWidth={2.5} />
              </div>
              <span>TOKENS STUDIO</span>
            </a>
            <p style={{ fontSize: '0.9rem', color: '#6B7280', maxWidth: 280, marginTop: 12 }}>
              The automated design system platform for modern design & engineering teams.
            </p>
          </div>

          {/* Column 2: Platform Links */}
          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-teal-dark)', marginBottom: 16 }}>
              PLATFORM
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.9rem', color: '#4B5563' }}>
              <li><a href="#">Figma Plugin</a></li>
              <li><a href="#">Studio Engine</a></li>
              <li><a href="#">Studio Hub</a></li>
              <li><a href="#">Multi-Repo Sync</a></li>
              <li><a href="#">Changelog</a></li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-teal-dark)', marginBottom: 16 }}>
              RESOURCES
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.9rem', color: '#4B5563' }}>
              <li><a href="#">Documentation</a></li>
              <li><a href="#">Token Specification</a></li>
              <li><a href="#">Community Forum</a></li>
              <li><a href="#">Video Tutorials</a></li>
              <li><a href="#">Blog & News</a></li>
            </ul>
          </div>

          {/* Column 4: Company */}
          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-teal-dark)', marginBottom: 16 }}>
              COMPANY
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.9rem', color: '#4B5563' }}>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Press Kit</a></li>
              <li><a href="#">Contact Us</a></li>
              <li><a href="#">Partners</a></li>
            </ul>
          </div>

          {/* Column 5: Legal */}
          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-teal-dark)', marginBottom: 16 }}>
              LEGAL
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.9rem', color: '#4B5563' }}>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">Security</a></li>
              <li><a href="#">Cookie Preferences</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div style={{ paddingTop: 32, borderTop: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ fontSize: '0.85rem', color: '#9CA3AF' }}>
            © {new Date().getFullYear()} Tokens Studio Inc. All rights reserved. Recreated for specification demo.
          </div>

          <div style={{ display: 'flex', gap: 16, color: '#6B7280' }}>
            {/* GitHub */}
            <a href="#" aria-label="GitHub">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </a>
            {/* Twitter */}
            <a href="#" aria-label="Twitter">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            {/* Discord */}
            <a href="#" aria-label="Discord">
              <MessageSquare size={20} />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
