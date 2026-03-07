'use client';

import { useState, useEffect } from 'react';
import withAuth from '@/components/withAuth';
import { useAuth } from '@/context/AuthContext';
import { useLocale } from '@/context/LocaleContext';

function ProfilePage() {
  const auth = useAuth();
  const { t } = useLocale();
  const [name, setName] = useState('');
  const [language, setLanguage] = useState('');
  const [region, setRegion] = useState('');
  const [pictureUrl, setPictureUrl] = useState('');
  const [pictureFile, setPictureFile] = useState<File | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Change password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    if (auth && auth.user) {
      setName(auth.user.name || auth.user.username || '');
      setPictureUrl(auth.user.picture || '');
      setLanguage(auth.user.language || 'en');
      setRegion(auth.user.region || '');
    }
  }, [auth?.user?.id, auth?.user?.name, auth?.user?.username, auth?.user?.picture, auth?.user?.language, auth?.user?.region]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPictureFile(file);
      setPictureUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    if (!auth || !auth.updateUserProfile) return;

    try {
      // Pass the file if selected, otherwise pass the existing URL (or empty string)
      await auth.updateUserProfile(name, language, region, pictureFile || pictureUrl);
      setMessage({ type: 'success', text: t.profile?.success_message || 'Profile updated successfully!' });
      setPictureFile(null); // Reset file selection after successful upload
    } catch (error) {
      const err = error as Error;
      setMessage({ type: 'error', text: err.message || 'Failed to update profile' });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage(null);

    if (!auth || !auth.changePassword) return;

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: t.profile?.passwords_do_not_match || 'Passwords do not match' });
      return;
    }

    setIsChangingPassword(true);

    try {
      await auth.changePassword(currentPassword, newPassword, confirmPassword);
      setPasswordMessage({ type: 'success', text: t.profile?.password_change_success || 'Password changed successfully!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      const err = error as Error;
      setPasswordMessage({ type: 'error', text: err.message || 'Failed to change password' });
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="grid-container" style={{ padding: '2rem 0' }}>
      <div className="grid-x grid-margin-x align-center">
        <div className="cell medium-8 large-6">
          <div className="card-organic">
            <h2 className="text-center mb-2" style={{ color: 'var(--color-clay)', marginBottom: '1.5rem' }}>{t.profile?.title || "Your Profile"}</h2>

            {auth && auth.user && (
              <>
                <div className="text-center mb-3" style={{ marginBottom: '2rem' }}>
                  <div style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-sand)',
                    border: '3px solid var(--color-terracotta)',
                    margin: '0 auto 1rem auto',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative'
                  }}>
                    {pictureUrl ? (
                      <img src={pictureUrl} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span className="display-font" style={{ fontSize: '2.5rem', color: 'var(--color-terracotta)' }}>
                        {(name || auth.user.username || 'U').charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <p className="lead" style={{ color: 'var(--color-clay)' }}>{auth.user.email}</p>
                </div>

                {message && (
                  <div className={`callout ${message.type === 'success' ? 'success' : 'alert'}`} style={{ borderRadius: '12px', border: 'none', background: message.type === 'success' ? 'rgba(72, 192, 178, 0.2)' : 'rgba(188, 108, 37, 0.2)', color: 'var(--color-clay)' }}>
                    {message.text}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="grid-y grid-margin-y">
                    <div className="cell">
                      <label style={{ color: 'var(--color-clay)', fontWeight: '600' }}>
                        {t.profile?.name_label || "Name"}
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="search-input"
                          style={{ marginTop: '0.5rem' }}
                          placeholder={t.profile?.name_label || "Name"}
                        />
                      </label>
                    </div>
                    <div className="cell">
                      <label style={{ color: 'var(--color-clay)', fontWeight: '600' }}>
                        {t.profile?.language_label || "Preferred Language for Notifications"}
                        <select
                          value={language}
                          onChange={(e) => setLanguage(e.target.value)}
                          className="search-input"
                          style={{ marginTop: '0.5rem' }}
                        >
                          <option value="en">English</option>
                          <option value="es">Español</option>
                          <option value="fi">Suomi</option>
                        </select>
                      </label>
                    </div>
                    <div className="cell">
                      <label style={{ color: 'var(--color-clay)', fontWeight: '600' }}>
                        Region
                        <select
                          value={region}
                          onChange={(e) => setRegion(e.target.value)}
                          className="search-input"
                          style={{ marginTop: '0.5rem' }}
                        >
                          <option value="es">España</option>
                          <option value="fi">Finlandia</option>
                        </select>
                      </label>
                    </div>
                    <div className="cell">
                      <label style={{ color: 'var(--color-clay)', fontWeight: '600' }}>
                        {t.profile?.picture_label || "Profile Picture"}
                        <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <label htmlFor="file-upload" className="oasis-button" style={{ margin: 0, padding: '0.5rem 1rem', fontSize: '0.9rem', cursor: 'pointer', display: 'inline-block' }}>
                            {t.profile?.upload_button || "Upload New Picture"}
                          </label>
                          <input
                            id="file-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                          />
                          <span style={{ fontSize: '0.9rem', color: 'var(--color-clay)', fontStyle: 'italic' }}>
                            {pictureFile ? pictureFile.name : (t.profile?.no_file_chosen || "No file chosen")}
                          </span>
                        </div>
                      </label>
                    </div>
                    <div className="cell text-center" style={{ marginTop: '2rem' }}>
                      <button type="submit" className="oasis-button" disabled={isLoading}>
                        {isLoading ? (t.profile?.saving || "Updating...") : (t.profile?.save_button || "Update Profile")}
                      </button>
                    </div>
                  </div>
                </form>

                <hr style={{ margin: '2.5rem 0', borderTop: '2px dashed var(--color-sand)' }} />

                <h3 className="text-center mb-2" style={{ color: 'var(--color-clay)', marginBottom: '1.5rem' }}>
                  {t.profile?.change_password_title || "Change Password"}
                </h3>

                {passwordMessage && (
                  <div className={`callout ${passwordMessage.type === 'success' ? 'success' : 'alert'}`} style={{ borderRadius: '12px', border: 'none', background: passwordMessage.type === 'success' ? 'rgba(72, 192, 178, 0.2)' : 'rgba(188, 108, 37, 0.2)', color: 'var(--color-clay)' }}>
                    {passwordMessage.text}
                  </div>
                )}

                <form onSubmit={handlePasswordSubmit}>
                  <div className="grid-y grid-margin-y">
                    <div className="cell">
                      <label style={{ color: 'var(--color-clay)', fontWeight: '600' }}>
                        {t.profile?.current_password_label || "Current Password"}
                        <input
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="search-input"
                          style={{ marginTop: '0.5rem' }}
                          required
                        />
                      </label>
                    </div>
                    <div className="cell">
                      <label style={{ color: 'var(--color-clay)', fontWeight: '600' }}>
                        {t.profile?.new_password_label || "New Password"}
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="search-input"
                          style={{ marginTop: '0.5rem' }}
                          required
                        />
                      </label>
                    </div>
                    <div className="cell">
                      <label style={{ color: 'var(--color-clay)', fontWeight: '600' }}>
                        {t.profile?.confirm_password_label || "Confirm New Password"}
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="search-input"
                          style={{ marginTop: '0.5rem' }}
                          required
                        />
                      </label>
                    </div>
                    <div className="cell text-center" style={{ marginTop: '2rem' }}>
                      <button type="submit" className="oasis-button" disabled={isChangingPassword}>
                        {isChangingPassword ? (t.profile?.saving || "Updating...") : (t.profile?.change_password_button || "Change Password")}
                      </button>
                    </div>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAuth(ProfilePage);
