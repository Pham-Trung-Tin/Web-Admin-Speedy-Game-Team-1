import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./gameRoom.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// ==== AuthService nội tuyến ====
const TOKEN_KEY = "access_token";
const REFRESH_KEY = "refresh_token";
const USER_KEY = "user_profile";

const authService = {
  login: async (credentials) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || `HTTP error! ${res.status}`);

    if (data.access_token) localStorage.setItem(TOKEN_KEY, data.access_token);
    if (data.refresh_token) localStorage.setItem(REFRESH_KEY, data.refresh_token);
    if (data.user_profile) localStorage.setItem(USER_KEY, JSON.stringify(data.user_profile));
    return data;
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
// ===============================

const ListRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // --- filter / search ---
  const [searchText, setSearchText] = useState(""); // lọc trực tiếp
  const [status, setStatus] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [visibility, setVisibility] = useState("");
  const [sort, setSort] = useState("");

  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  // --- pagination ---
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const headers = () => {
    const token = authService.getToken();
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  // fetch list rooms
  const fetchRooms = async () => {
    try {
      setLoading(true);
      setErrorMsg("");

      const params = new URLSearchParams();
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
      setCurrentPage(1);
    } catch (error) {
      setErrorMsg("Error fetching rooms.");
      console.error("Error fetching rooms:", error);
    } finally {
      setLoading(false);
    }
  };

  // tự fetch lại khi filter thay đổi (trừ searchText)
  useEffect(() => {
    fetchRooms();
  }, [status, difficulty, visibility, sort]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this room?")) return;
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
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return !isNaN(date) ? date.toLocaleString() : dateStr;
  };

  // ===== Lọc trực tiếp theo roomCode (case-insensitive) =====
  const filteredRooms = rooms.filter((room) =>
    room.roomCode?.toLowerCase().includes(searchText.toLowerCase())
  );

  // ===== Pagination =====
  const totalPages = Math.ceil(filteredRooms.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedRooms = filteredRooms.slice(startIndex, startIndex + pageSize);

  return (
    <div className="game-room-page">
      <div className="page-content">
        <h2>Game Rooms Management</h2>

        {/* Filter + Search */}
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by room code..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
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
            <option value="Thử Thách">Thử Thách</option>
            <option value="Căng Nhé">Căng Nhé</option>
            <option value="Siêu Cấp">Siêu Cấp</option>
            <option value="Hủy Diệt">Hủy Diệt</option>
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
          <button
            onClick={() =>
              window.dispatchEvent(new CustomEvent("changeAdminTab", { detail: "CreateRoom" }))
            }
          >
            + Create New Room
          </button>
        </div>

        {errorMsg && <div className="error-message">{errorMsg}</div>}

        {loading ? (
          <p>Loading...</p>
        ) : filteredRooms.length > 0 ? (
          <>
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
                {paginatedRooms.map((room) => (
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
                      <div className="action-buttons">
                        <button
                          className="btn-view"
                          title="View details"
                          onClick={() => {
                            localStorage.setItem("selectedRoomId", room._id);
                            window.dispatchEvent(
                              new CustomEvent("changeAdminTab", { detail: "RoomDetails" })
                            );
                          }}
                          disabled={deletingId === room._id}
                        >
                          View
                        </button>
                        <button
                          className="btn-delete"
                          title="Delete room"
                          onClick={() => handleDelete(room._id)}
                          disabled={deletingId === room._id}
                        >
                          {deletingId === room._id ? "..." : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="pagination">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <div>
            <p>No rooms found.</p>
            <button
              onClick={() =>
                window.dispatchEvent(new CustomEvent("changeAdminTab", { detail: "CreateRoom" }))
              }
            >
              Create a new room
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListRooms;
