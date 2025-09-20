import axios from "axios";
import { jwtDecode } from "jwt-decode";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

// Interceptor để gắn token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

const getUserFromToken = () => {
  const token = localStorage.getItem("access_token");
  if (token) {
    try {
      const decoded = jwtDecode(token);
      return decoded.username || decoded.sub || "Unnamed User";
    } catch (e) {
      console.error("Error decoding token:", e);
      return "Unnamed User";
    }
  }
  return "Unnamed User";
};

// ✅ Danh sách sessions
export const getSessions = async (params = {}, config = {}) => {
  const res = await api.get("/game-sessions", { params, ...config });
  return {
    ...res.data,
    data: Array.isArray(res.data.data)
      ? res.data.data.map((s) => ({
          ...s,
          name: s.name || s.roomCode || "Unnamed",
        }))
      : res.data.data,
  };
};

// ✅ Lấy session theo ID
export const getSessionById = async (id) => {
  const res = await api.get(`/game-sessions/${id}`);
  const session = res.data;
  if (session && !session.name) {
    session.name = session.roomCode || "Unnamed";
  }
  return session;
};

// ✅ Lấy session theo Room
export const getSessionsByRoom = async (roomValue, isCode = false) => {
  const endpoint = isCode
    ? `/game-sessions/room/code/${roomValue}`
    : `/game-sessions/room/${roomValue}`;
  const res = await api.get(endpoint);
  return Array.isArray(res.data)
    ? res.data.map((s) => ({
        ...s,
        name: s.name || s.roomCode || "Unnamed",
      }))
    : res.data;
};

// ✅ Lấy session theo Player
export const getSessionsByPlayer = async (playerValue, isUsername = false) => {
  const endpoint = isUsername
    ? `/game-sessions/player/username/${playerValue}`
    : `/game-sessions/player/${playerValue}`;
  const res = await api.get(endpoint);
  return Array.isArray(res.data)
    ? res.data.map((s) => ({
        ...s,
        name: s.name || s.roomCode || "Unnamed",
      }))
    : res.data;
};

// ✅ Tạo session
export const createSession = async (data = {}) => {
  const username = getUserFromToken();
  const defaultData = {
    ...data,
    name:
      data.name ||
      `${username}'s Session - ${data.roomCode || `Auto-${Date.now()}`}`,
    state: data.state || "active",
  };
  const res = await api.post("/game-sessions", defaultData);
  return res.data;
};
