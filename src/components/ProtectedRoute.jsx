import React from 'react';
import { useAuth } from '../hooks/useAuth';
import PremiumLoader from './PremiumLoader';

export default function ProtectedRoute({ children, onUnauthenticated }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ padding: 60, textAlign: 'center' }}>
        <PremiumLoader 
          title="Verifying Lumina Authentication"
          messages={["Checking security session...", "Loading career workspace..."]}
        />
      </div>
    );
  }

  if (!isAuthenticated) {
    if (onUnauthenticated) {
      onUnauthenticated();
    }
    return null;
  }

  return <>{children}</>;
}
