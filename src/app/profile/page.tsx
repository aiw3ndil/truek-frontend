'use client';

import withAuth from '@/components/withAuth';
import { useAuth } from '@/context/AuthContext';

function ProfilePage() {
  const auth = useAuth();

  return (
    <div className="grid-x grid-padding-x align-center">
      <div className="cell large-10 text-center">
        <h1>Welcome to your profile</h1>
        {auth && auth.user && <p>Your token is: {auth.user.token}</p>}
      </div>
    </div>
  );
}

export default withAuth(ProfilePage);
