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
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to login');
  }

  return response.json();
}

export async function register(username: string, email: string, password: string): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.errors.join(', '));
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
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to login with Google');
  }

  return response.json();
}

export async function updateProfile(token: string, name: string, language: string, picture: File | string): Promise<void> {
  const formData = new FormData();
  formData.append('name', name);
  formData.append('language', language);

  if (picture instanceof File) {
    formData.append('picture', picture);
  }
  // If picture is a string (URL), we don't send it as 'picture' param usually implies a file upload
  // or the backend handles it differently. Assuming backend expects file for 'picture'.
  // If you need to clear the picture or send a URL, adjust backend expectations.
  // For this implementation, we only append if it's a File (new upload).

  const response = await fetch(`${API_URL}/users/me`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`
      // Content-Type is NOT set for FormData, browser does it with boundary
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to update profile');
  }
}


