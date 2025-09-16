import axios from "axios";
import { jwtDecode } from "jwt-decode";

// Xác định baseURL tuỳ môi trường
const baseURL =
  import.meta.env.MODE === "development"
    ? "/api" // dev dùng proxy trong vite.config.js
    : (import.meta.env.VITE_API_URL || "https://speedycount-staging.amazingtech.cc/api");

// Tạo axios instance
const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// Interceptor để gắn token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Hàm lấy thông tin từ token
const getUserFromToken = () => {
  const token = localStorage.getItem("access_token");
  if (token) {
    try {
      const decoded = jwtDecode(token);
      return decoded.username || decoded.sub || "Unnamed User"; // Lấy username hoặc field tương ứng
    } catch (e) {
      console.error("Error decoding token at", new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }), ":", e);
      return "Unnamed User";
    }
  }
  return "Unnamed User";
};

// Các hàm gọi API
export const getSessions = async (params = {}, config = {}) => {
  const res = await api.get("/game-sessions", { params, ...config });
  console.log("Raw response from getSessions at", new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }), ":", res.data);
  const processedData = {
    ...res.data,
    data: Array.isArray(res.data.data)
      ? res.data.data.map(session => ({
          ...session,
          name: session.name || session.roomCode || "Unnamed"
        }))
      : res.data.data
  };
  console.log("Processed data from getSessions at", new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }), ":", processedData);
  return processedData;
};

export const getSessionById = async (id) => {
  const res = await api.get(`/sessions/${id}`);
  const session = res.data;
  if (session && !session.name) {
    session.name = session.roomCode || "Unnamed";
  }
  return session;
};

export const getSessionsByRoom = async (roomValue, isCode = false) => {
  const endpoint = isCode
    ? `/sessions/room/code/${roomValue}`
    : `/sessions/room/${roomValue}`;
  const res = await api.get(endpoint);
  console.log("Raw response from getSessionsByRoom at", new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }), ":", res.data);
  const processedData = Array.isArray(res.data)
    ? res.data.map(session => ({
        ...session,
        name: session.name || session.roomCode || "Unnamed"
      }))
    : res.data;
  console.log("Processed data from getSessionsByRoom at", new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }), ":", processedData);
  return processedData;
};

export const getSessionsByPlayer = async (playerValue, isUsername = false) => {
  const endpoint = isUsername
    ? `/sessions/player/username/${playerValue}`
    : `/sessions/player/${playerValue}`;
  const res = await api.get(endpoint);
  console.log("Raw response from getSessionsByPlayer at", new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }), ":", res.data);
  const processedData = Array.isArray(res.data)
    ? res.data.map(session => ({
        ...session,
        name: session.name || session.roomCode || "Unnamed"
      }))
    : res.data;
  console.log("Processed data from getSessionsByPlayer at", new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }), ":", processedData);
  return processedData;
};

export const createSession = async (data = {}) => {
  const username = getUserFromToken();
  const defaultData = {
    ...data,
    name: data.name || `${username}'s Session - ${data.roomCode || `Auto-${Date.now()}`}`,
    state: data.state || "active"
  };
  const res = await api.post("/game-sessions", defaultData);
  console.log("Created session at", new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }), ":", res.data);
  return res.data;
};