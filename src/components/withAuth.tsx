'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, ComponentType } from 'react';

export default function withAuth<P extends object>(Component: ComponentType<P>) {
  return function AuthenticatedComponent(props: P) {
    const auth = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (auth && !auth.isLoading && !auth.isAuthenticated()) {
        router.push('/login');
      }
    }, [auth, router]);

    if (!auth || auth.isLoading) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#2b1d0e' }}>
          <div className="loading-spinner" style={{ fontSize: '3rem', animation: 'spin 2s linear infinite' }}>⌛</div>
        </div>
      );
    }

    if (!auth.isAuthenticated()) {
      return null;
    }

    return <Component {...props} />;
  };
}
