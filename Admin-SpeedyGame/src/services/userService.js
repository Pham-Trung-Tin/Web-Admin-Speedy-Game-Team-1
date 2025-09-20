export async function deleteUser(id) {
  // Use soft delete by updating status to 'deleted'
  return apiFetch(`/admin/users/${id}`, {
    method: 'PATCH',
    headers: headersJson(),
    body: JSON.stringify({ status: 'deleted' }),
  });
}
// services/UserService.js

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const token = () => localStorage.getItem('access_token') || '';

const headersJson = () => ({
  'Content-Type': 'application/json',
  ...(token() ? { Authorization: `Bearer ${token()}` } : {}),
});

async function parseJsonSafe(res) {
  try { return await res.json(); } catch { return null; }
}

async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    credentials: 'include',
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

// Admin endpoints: list/create/delete users
export async function getUserList() {
  return apiFetch('/admin/users', { method: 'GET', headers: headersJson() });
}

export async function createUser(userData) {
  return apiFetch('/admin/users', {
    method: 'POST',
    headers: headersJson(),
    body: JSON.stringify(userData),
  });
}


export async function banUser(id) {
  return apiFetch(`/admin/users/${id}/ban`, {
    method: 'POST',
    headers: headersJson(),
  });
}

export async function unbanUser(id) {
  return apiFetch(`/admin/users/${id}/unban`, {
    method: 'POST',
    headers: headersJson(),
  });
}


