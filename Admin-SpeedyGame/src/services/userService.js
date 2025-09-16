// Gọi API xóa user với access token
export async function deleteUser(id) {
  const token = localStorage.getItem('access_token');
  const response = await fetch(`/api/admin/users/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  if (!response.ok) {
    let errMsg = 'Failed to delete user';
    try {
      const err = await response.json();
      if (err && err.message) errMsg = err.message;
    } catch {}
    throw new Error(errMsg);
  }
  return response.json();
}
// Gọi API tạo user mới với access token
export async function createUser(userData) {
  const token = localStorage.getItem('access_token');
  const response = await fetch('/api/admin/users', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || 'Tạo user thất bại');
  }
  return response.json();
}
// Gọi API lấy danh sách user với access token
export async function getUserList() {
  const token = localStorage.getItem('access_token');
  const response = await fetch('/api/admin/users', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  if (!response.ok) throw new Error('Failed to fetch user list');
  return response.json();
}
