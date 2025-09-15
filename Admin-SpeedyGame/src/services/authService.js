// services/AuthService.js

// Base URL: dev uses Vite proxy "/api", prod can set full domain
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  '/api';

// ----- helpers -----
const getToken = () => localStorage.getItem('access_token') || '';

const jsonHeaders = (extra = {}) => ({
  'Content-Type': 'application/json',
  ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
  ...extra,
});

async function parseJsonSafe(res) {
  try { return await res.json(); } catch { return null; }
}

async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    credentials: 'include', // keep if backend may use cookie; safe even with Bearer
    ...options,
  });
  const data = await parseJsonSafe(res);
  if (!res.ok || (data && data.ok === false)) {
    const msg = data?.message || `HTTP ${res.status}`;
    const err = new Error(msg);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

// ----- AuthService -----
export const AuthService = {
  // Login: { email/username, password }
  async login(credentials) {
    const data = await apiFetch('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    if (data?.token) localStorage.setItem('access_token', data.token);
    if (data?.user) localStorage.setItem('user_profile', JSON.stringify(data.user));
    return data;
  },

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_profile');
  },

  isAuthenticated() {
    return !!getToken();
  },

  getToken,

  getUser() {
    const raw = localStorage.getItem('user_profile');
    return raw ? JSON.parse(raw) : null;
  },

  // ===== Current user profile APIs =====

  async getMyProfile() {
    // Swagger shows { ok: true, data: {...} }
    const data = await apiFetch('/user/me', { method: 'GET', headers: jsonHeaders() });
    return data?.data || data;
  },

  // PATCH /user/profile (multipart: bio + avatar)
  async updateProfileMultipart({ bio, avatarFile }) {
    const form = new FormData();
    if (typeof bio === 'string') form.append('bio', bio);
    if (avatarFile instanceof File) form.append('avatar', avatarFile);

    const data = await apiFetch('/user/profile', {
      method: 'PATCH',
      headers: {
        // DO NOT set Content-Type for FormData
        ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
      },
      body: form,
    });
    // Usually { ok: true, data: {...} }
    return data?.data || data;
  },

  async updateMyProfile(payload) {
    const data = await apiFetch('/user/me', {
      method: 'PUT', // change if your backend uses PATCH
      headers: jsonHeaders(),
      body: JSON.stringify(payload),
    });
    return data?.data || data;
  },

  async changePassword({ currentPassword, newPassword }) {
    return apiFetch('/user/change-password', {
      method: 'POST',
      headers: jsonHeaders(),
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },

  // Optional — if backend supports multipart avatar upload
  // Optional — upload avatar only
  async uploadAvatar(file) {
    const form = new FormData();
    form.append('avatar', file);

    const data = await apiFetch('/user/avatar', {
      method: 'POST',
      headers: {
        ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
      },
      body: form, // don't set Content-Type with FormData
    });

    return data?.data || data; // typically { avatar: 'https://...' }
  },
};

export const authService = AuthService;
export default AuthService;
