export async function getUserById(id) {
  return apiFetch(`/admin/users/${id}`, {
    method: 'GET',
    headers: headersJson(),
  });
}
