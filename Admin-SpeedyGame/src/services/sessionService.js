import axios from "axios";
import { jwtDecode } from "jwt-decode";

// Xác định baseURL từ file .env
const baseURL = import.meta.env.VITE_API_BASE_URL;

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
  const res = await api.get(`/game-sessions/${id}`);
  console.log("Raw response from getSessionById at", new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }), ":", res.data);
  const session = res.data;
  if (session && !session.name) {
    session.name = session.roomCode || "Unnamed";
  }
  console.log("Processed session from getSessionById at", new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }), ":", session);
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

export const getSessionsByRoomWithParams = async (roomIdOrCode, params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const endpoint = `/game-sessions/by-room/${roomIdOrCode}${queryString ? `?${queryString}` : ''}`;
  
  console.log("API Call Details:", {
    baseURL,
    endpoint,
    fullURL: `${baseURL}${endpoint}`,
    roomIdOrCode,
    params,
    queryString
  });
  
  const res = await api.get(endpoint);
  console.log("Raw response from getSessionsByRoomWithParams at", new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }), ":", res);
  console.log("Response data:", res.data);
  console.log("Response status:", res.status);
  console.log("Response headers:", res.headers);
  
  // Handle different response structures
  let processedData;
  if (res.data && typeof res.data === 'object') {
    if (Array.isArray(res.data.data)) {
      // Response has data wrapper
      processedData = {
        data: res.data.data.map(session => ({
          ...session,
          name: session.name || session.roomCode || "Unnamed"
        })),
        total: res.data.total || res.data.data.length,
        page: res.data.page || params.page || 1,
        limit: res.data.limit || params.limit || 20
      };
    } else if (Array.isArray(res.data)) {
      // Response is direct array
      processedData = {
        data: res.data.map(session => ({
          ...session,
          name: session.name || session.roomCode || "Unnamed"
        })),
        total: res.data.length,
        page: params.page || 1,
        limit: params.limit || 20
      };
    } else {
      // Single object or other structure
      processedData = res.data;
    }
  } else {
    processedData = { data: [], total: 0, page: 1, limit: 20 };
  }
  
  console.log("Processed data from getSessionsByRoomWithParams at", new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }), ":", processedData);
  return processedData;
};

export const getSessionsByPlayerWithParams = async (userId, params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const endpoint = `/game-sessions/by-player/${userId}${queryString ? `?${queryString}` : ''}`;
  
  console.log("API Call Details:", {
    baseURL,
    endpoint,
    fullURL: `${baseURL}${endpoint}`,
    userId,
    params,
    queryString
  });
  
  const res = await api.get(endpoint);
  console.log("Raw response from getSessionsByPlayerWithParams at", new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }), ":", res);
  console.log("Response data:", res.data);
  console.log("Response status:", res.status);
  console.log("Response headers:", res.headers);
  
  // Handle different response structures
  let processedData;
  if (res.data && typeof res.data === 'object') {
    if (Array.isArray(res.data.data)) {
      // Response has data wrapper
      processedData = {
        data: res.data.data.map(session => ({
          ...session,
          name: session.name || session.roomCode || "Unnamed"
        })),
        total: res.data.total || res.data.data.length,
        page: res.data.page || params.page || 1,
        limit: res.data.limit || params.limit || 20
      };
    } else if (Array.isArray(res.data)) {
      // Response is direct array
      processedData = {
        data: res.data.map(session => ({
          ...session,
          name: session.name || session.roomCode || "Unnamed"
        })),
        total: res.data.length,
        page: params.page || 1,
        limit: params.limit || 20
      };
    } else {
      // Single object or other structure
      processedData = res.data;
    }
  } else {
    processedData = { data: [], total: 0, page: 1, limit: 20 };
  }
  
  console.log("Processed data from getSessionsByPlayerWithParams at", new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }), ":", processedData);
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

export const claimEndBonus = async (sessionId, boostType = "NONE") => {
  try {
    const res = await api.post(`/player-sessions/${sessionId}/claim-end-bonus`, {
      boostType
    });
    console.log("Claimed bonus at", new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }), ":", res.data);
    return res.data;
  } catch (error) {
    console.error("Error claiming bonus at", new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }), ":", error);
    throw error;
  }
};