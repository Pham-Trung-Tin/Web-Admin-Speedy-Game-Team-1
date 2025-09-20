// services/gameRoomService.js

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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

export const GameRoomService = {
  // GET /gameroom/rooms/public - Lấy danh sách phòng public
  async getPublicRooms({ page = 1, limit = 20, difficulty = '', maxPlayers = null } = {}) {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    
    if (difficulty) {
      params.append('difficulty', difficulty);
    }
    
    if (maxPlayers !== null && maxPlayers !== undefined) {
      params.append('maxPlayers', String(maxPlayers));
    }

    const data = await apiFetch(`/gameroom/rooms/public?${params.toString()}`, {
      method: 'GET',
      headers: jsonHeaders(),
    });
    
    return data;
  },

  // Các API khác cho GameRoom có thể thêm sau
  // Ví dụ: createRoom, joinRoom, updateRoom, deleteRoom, etc.
};

export const gameRoomService = GameRoomService;
export default GameRoomService;