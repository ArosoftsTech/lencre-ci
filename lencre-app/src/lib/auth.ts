const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';

interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('admin_token');
}

export function setToken(token: string): void {
  localStorage.setItem('admin_token', token);
}

export function removeToken(): void {
  localStorage.removeItem('admin_token');
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

export async function login(email: string, password: string): Promise<User> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Identifiants invalides');
  }

  const data: LoginResponse = await res.json();
  setToken(data.access_token);

  // Fetch user info
  return getUser();
}

export async function getUser(): Promise<User> {
  const token = getToken();
  const res = await fetch(`${API_URL}/auth/me`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });

  if (!res.ok) throw new Error('Non authentifié');
  return res.json();
}

export async function logout(): Promise<void> {
  const token = getToken();
  await fetch(`${API_URL}/auth/logout`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
  }).catch(() => {});
  removeToken();
}

/** Authenticated fetch helper for the CMS */
export async function adminFetch(endpoint: string, options: RequestInit = {}): Promise<Response> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  // Don't set Content-Type for FormData (file uploads)
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    removeToken();
    if (typeof window !== 'undefined') {
      window.location.href = '/admin/login';
    }
  }

  if (res.status === 403) {
    const errorData = await res.clone().json().catch(() => ({}));
    console.error('Access Denied:', errorData.error || 'Accès refusé');
    // We don't necessarily redirect on 403, as they are logged in but unauthorized for this action
  }

  return res;
}
