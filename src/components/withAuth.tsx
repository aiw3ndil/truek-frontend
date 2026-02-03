'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, ComponentType } from 'react';

export default function withAuth<P extends object>(Component: ComponentType<P>) {
  return function AuthenticatedComponent(props: P) {
    const auth = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (auth && !auth.isAuthenticated()) {
        router.push('/login');
      }
    }, [auth, router]);

    if (!auth || !auth.isAuthenticated()) {
      return null; // or a loading spinner
    }

    return <Component {...props} />;
  };
}
