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

export function getRedactionToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('redaction_token');
}

export function setRedactionToken(token: string): void {
  localStorage.setItem('redaction_token', token);
}

export function removeRedactionToken(): void {
  localStorage.removeItem('redaction_token');
}

export function isRedactionAuthenticated(): boolean {
  return !!getRedactionToken();
}

export async function loginRedaction(email: string, password: string): Promise<User> {
  const res = await fetch(`${API_URL}/redaction/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Identifiants invalides');
  }

  const data: LoginResponse = await res.json();
  setRedactionToken(data.access_token);

  return getRedactionUser();
}

export async function getRedactionUser(): Promise<User> {
  const token = getRedactionToken();
  const res = await fetch(`${API_URL}/redaction/auth/me`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) throw new Error('Non authentifié');
  return res.json();
}

export async function logoutRedaction(): Promise<void> {
  const token = getRedactionToken();
  await fetch(`${API_URL}/redaction/auth/logout`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
  }).catch(() => {});
  removeRedactionToken();
}

/** Authenticated fetch helper for the Newsroom */
export async function redactionFetch(endpoint: string, options: RequestInit = {}): Promise<Response> {
  const token = getRedactionToken();
  const headers: Record<string, string> = {
    'Authorization': `Bearer ${token}`,
    ...(options.headers as Record<string, string> || {}),
  };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    removeRedactionToken();
    if (typeof window !== 'undefined') {
      window.location.href = '/redaction/login';
    }
  }

  return res;
}
