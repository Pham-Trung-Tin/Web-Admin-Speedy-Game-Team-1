// services/AuthService.js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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

  // Validate sign up data with backend
  async validateSignUpData(formData) {
    try {
      const data = await apiFetch('/auth/validate-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      return { isValid: true, errors: {} };
    } catch (error) {
      // Nếu endpoint không tồn tại hoặc unauthorized, skip validation
      if (error.status === 401 || error.status === 404) {
        console.log('Validation endpoint not available, skipping backend validation');
        return { isValid: true, errors: {} };
      }
      
      // Backend trả về validation errors
      if (error.status === 400 && error.data?.errors) {
        return { isValid: false, errors: error.data.errors };
      }
      
      // Các lỗi khác, skip validation
      console.warn('Validation API error:', error.message);
      return { isValid: true, errors: {} };
    }
  },

  // Register new user
  async register(userData) {
    try {
      const data = await apiFetch('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      return data;
    } catch (error) {
      // Xử lý lỗi duplicate cụ thể
      if (error.status === 409) {
        // Conflict - username or email already exists
        const errorMessage = error.data?.message || error.message || '';
        
        if (errorMessage.toLowerCase().includes('email')) {
          throw { status: 409, field: 'email', message: 'Email already exists' };
        } else if (errorMessage.toLowerCase().includes('username')) {
          throw { status: 409, field: 'username', message: 'Username already exists' };
        } else {
          throw { status: 409, field: 'general', message: 'Email or Username already exists' };
        }
      }
      
      // Xử lý lỗi validation từ backend
      if (error.status === 400 && error.data?.errors) {
        throw { status: 400, errors: error.data.errors };
      }
      
      // Các lỗi khác
      throw error;
    }
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

  // ---------- GAME HISTORIES ----------
  // GET /user/game-histories/by-room/{roomCode}?page=&limit=
  async getUserGameHistoriesByRoom({ roomCode, page = 1, limit = 20 }) {
    if (!roomCode) throw new Error("roomCode is required");
    const q = new URLSearchParams({ page: String(page), limit: String(limit) }).toString();
    const data = await apiFetch(
      `/user/game-histories/by-room/${encodeURIComponent(roomCode)}?${q}`,
      { method: "GET", headers: jsonHeaders() }
    );
    // Swagger trả trực tiếp { page, limit, total, data: [] } (không bọc ok:true)
    return data?.data || data;
  },

  // ---------- GAME ROOMS (của user hiện tại) ----------
async getUserGameRooms({ page = 1, limit = 20 } = {}) {
  const q = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  }).toString();

  // Swagger trả về: { page, limit, total, data: [], me: {...} }
  const data = await apiFetch(`/user/game-rooms?${q}`, {
    method: 'GET',
    headers: jsonHeaders(),
  });

  return data; // KHÔNG unwrap .data vì response đã ở dạng cuối
}
};



export const authService = AuthService;
export default AuthService;
