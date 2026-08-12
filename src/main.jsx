import React, { Component, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import './styles/components.css';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[Lumina UI Application Exception]:', error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          background: '#0F172A',
          color: '#F8FAFC',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          <div style={{
            maxWidth: 720,
            width: '100%',
            background: '#1E293B',
            border: '1px solid #334155',
            borderRadius: 24,
            padding: 32,
            textAlign: 'left',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: 'rgba(239, 68, 68, 0.15)',
                color: '#EF4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem',
                fontWeight: 900
              }}>
                ⚠️
              </div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#F8FAFC', margin: 0 }}>
                Lumina Encountered a Runtime Exception
              </h2>
            </div>
            
            <p style={{ fontSize: '0.92rem', color: '#F87171', fontWeight: 800, margin: '0 0 12px 0' }}>
              {this.state.error?.message || 'An unhandled frontend error occurred.'}
            </p>

            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', marginBottom: 6 }}>
                Exact Component Stack Trace
              </div>
              <pre style={{
                background: '#0F172A',
                border: '1px solid #334155',
                borderRadius: 12,
                padding: 16,
                fontSize: '0.8rem',
                color: '#CBD5E1',
                overflowX: 'auto',
                whiteSpace: 'pre-wrap',
                fontFamily: 'monospace',
                maxHeight: 260
              }}>
                {this.state.error?.stack || 'No stack trace available.'}
              </pre>
            </div>

            <button
              onClick={this.handleReload}
              style={{
                background: '#0EA5E9',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: 12,
                padding: '10px 20px',
                fontSize: '0.88rem',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
