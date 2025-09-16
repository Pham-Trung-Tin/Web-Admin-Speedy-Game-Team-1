import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./gameRoom.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// ===== AuthService nội tuyến (không cần import) =====
const TOKEN_KEY = "access_token";
const REFRESH_KEY = "refresh_token";
const USER_KEY = "user_profile";

const authService = {
  login: async (credentials) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || `HTTP error! ${response.status}`);

      if (data.access_token) localStorage.setItem(TOKEN_KEY, data.access_token);
      if (data.refresh_token) localStorage.setItem(REFRESH_KEY, data.refresh_token);
      if (data.user_profile) localStorage.setItem(USER_KEY, JSON.stringify(data.user_profile));

      return data;
    } catch (err) {
      console.error("Login API error:", err);
      throw err;
    }
  },
  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(USER_KEY);
  },
  isAuthenticated: () => !!localStorage.getItem(TOKEN_KEY),
  getToken: () => localStorage.getItem(TOKEN_KEY),
  getUser: () => {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  },
};
// ==============================================

const ListRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // Bộ lọc
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [visibility, setVisibility] = useState("");
  const [sort, setSort] = useState("");

  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  const headers = () => {
    const token = authService.getToken();
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  const fetchRooms = async () => {
    try {
      setLoading(true);
      setErrorMsg("");

      const params = new URLSearchParams();
      if (keyword) params.append("roomCode", keyword);
      if (status) params.append("status", status);
      if (difficulty) params.append("difficulty", difficulty);
      if (visibility) params.append("visibility", visibility);
      if (sort) params.append("sort", sort);

      const res = await fetch(
        `${API_BASE_URL}/admin/game-rooms?${params.toString()}`,
        { headers: headers() }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch rooms");

      setRooms(data || []);
    } catch (error) {
      setErrorMsg("Error fetching rooms.");
      console.error("Error fetching rooms:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [keyword, status, difficulty, visibility, sort]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this room?")) {
      setDeletingId(id);
      try {
        const res = await fetch(`${API_BASE_URL}/admin/game-rooms/${id}`, {
          method: "DELETE",
          headers: headers(),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to delete room");

        fetchRooms();
      } catch (error) {
        setErrorMsg("Error deleting room.");
        console.error("Error deleting room:", error);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return !isNaN(date) ? date.toLocaleString() : dateStr;
  };

  return (
    <div className="game-room-page">
      <div className="page-content">
        <h2>Game Rooms Management</h2>

        {/* Bộ lọc */}
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by room code..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />

          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All Status</option>
            <option value="waiting">Waiting</option>
            <option value="playing">Playing</option>
            <option value="finished">Finished</option>
            <option value="deleted">Deleted</option>
          </select>

          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
            <option value="">All Difficulty</option>
            <option value="Easy">Easy</option>
            <option value="Normal">Normal</option>
            <option value="Hard">Hard</option>
          </select>

          <select value={visibility} onChange={(e) => setVisibility(e.target.value)}>
            <option value="">All Visibility</option>
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>

          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="">Default Sort</option>
            <option value="asc">Created Asc</option>
            <option value="desc">Created Desc</option>
          </select>

          <button onClick={fetchRooms}>Reload</button>
          <button onClick={() => {
            const event = new CustomEvent("changeAdminTab", { detail: "CreateRoom" });
            window.dispatchEvent(event);
          }}>
            + Create New Room
          </button>
        </div>

        {errorMsg && <div className="error-message">{errorMsg}</div>}

        {loading ? (
          <p>Loading...</p>
        ) : rooms.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Room Code</th>
                <th>Status</th>
                <th>Players</th>
                <th>Map Size</th>
                <th>Difficulty</th>
                <th>Visibility</th>
                <th>Max Players</th>
                <th>Colors</th>
                <th>Shapes</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => (
                <tr key={room._id}>
                  <td>{room.roomCode || "N/A"}</td>
                  <td>{room.status || "N/A"}</td>
                  <td>{Array.isArray(room.players) ? room.players.length : 0}</td>
                  <td>{room.mapSize || "N/A"}</td>
                  <td>{room.difficulty || "N/A"}</td>
                  <td>{room.visibility || "N/A"}</td>
                  <td>{room.maxPlayers ?? "N/A"}</td>
                  <td>{room.colorCount ?? "N/A"}</td>
                  <td>{room.shapeCount ?? "N/A"}</td>
                  <td>{formatDate(room.createdAt)}</td>
                  <td>
                    <button
                      className="btn-view"
                      onClick={() => {
                        // Có thể lưu room ID vào localStorage để RoomDetail component sử dụng
                        localStorage.setItem("selectedRoomId", room._id);
                        const event = new CustomEvent("changeAdminTab", { detail: "RoomDetails" });
                        window.dispatchEvent(event);
                      }}
                      disabled={deletingId === room._id}
                    >
                      View
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(room._id)}
                      disabled={deletingId === room._id}
                    >
                      {deletingId === room._id ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div>
            <p>No rooms found.</p>
            <button onClick={() => {
              const event = new CustomEvent("changeAdminTab", { detail: "CreateRoom" });
              window.dispatchEvent(event);
            }}>
              Create a new room
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListRooms;
