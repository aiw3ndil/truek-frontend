'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function withAuth(Component) {
  return function AuthenticatedComponent(props) {
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
