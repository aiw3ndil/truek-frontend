export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

interface AuthResponse {
  token: string;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to login: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function register(username: string, email: string, password: string, passwordConfirmation: string): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      name: username, 
      email, 
      password, 
      password_confirmation: passwordConfirmation 
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.errors?.join(', ') || `Failed to register: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function loginWithGoogle(token: string): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/auth/google`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to login with Google: ${response.status} ${response.statusText}`);
  }

  const text = await response.text();
  if (!text) {
    throw new Error('Empty response from server during Google login');
  }

  return JSON.parse(text);
}

export async function updateProfile(token: string, name: string, language: string, region: string, picture: File | string): Promise<void> {
  const formData = new FormData();
  formData.append('name', name);
  formData.append('language', language);
  formData.append('region', region);

  if (picture instanceof File) {
    formData.append('picture', picture);
  }

  const response = await fetch(`${API_URL}/users/me`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to update profile: ${response.status} ${response.statusText}`);
  }
}

export async function forgotPassword(email: string): Promise<void> {
  const response = await fetch(`${API_URL}/password_resets`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to request password reset: ${response.status} ${response.statusText}`);
  }
}

export async function resetPassword(token: string, password: string, passwordConfirmation: string): Promise<void> {
  const response = await fetch(`${API_URL}/password_resets/${token}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      password, 
      password_confirmation: passwordConfirmation 
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    if (response.status === 410) {
      throw new Error('expired');
    }
    if (response.status === 404) {
      throw new Error('invalid');
    }
    throw new Error(errorData.errors?.join(', ') || errorData.error || `Failed to reset password: ${response.status} ${response.statusText}`);
  }
}


