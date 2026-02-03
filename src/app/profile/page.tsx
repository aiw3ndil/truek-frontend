'use client';

import withAuth from '@/components/withAuth';
import { useAuth } from '@/context/AuthContext';

function ProfilePage() {
  const auth = useAuth();

  return (
    <div className="grid-x grid-padding-x align-center">
      <div className="cell large-10 text-center">
        <h1>Welcome to your profile</h1>
        {auth && auth.user && (
          <div>
            <p>Username: {auth.user.username}</p>
            <p>Email: {auth.user.email}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default withAuth(ProfilePage);
