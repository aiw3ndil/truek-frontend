'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

function GoogleCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const auth = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      localStorage.setItem('token', token);
      // We need to inform the AuthContext that the user is now authenticated
      // A better approach would be to have a function in AuthContext to set the user from the token
      // For now, we will just reload the page to make the AuthContext re-evaluate the token
      window.location.href = '/profile';
    } else {
      // Handle error case
      router.push('/login');
    }
  }, [router, searchParams, auth]);

  return (
    <div className="grid-x grid-padding-x align-center">
      <div className="cell large-10 text-center">
        <h1>Authenticating with Google...</h1>
      </div>
    </div>
  );
}

export default function GoogleCallbackPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GoogleCallbackContent />
    </Suspense>
  );
}
