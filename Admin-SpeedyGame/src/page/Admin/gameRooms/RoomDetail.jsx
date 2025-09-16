import React, { useEffect, useState } from "react";
import { authService } from "../../../services/authService";
import "./gameRoom.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const RoomDetail = () => {
  // Lấy room ID từ localStorage thay vì từ params
  const getRoomId = () => localStorage.getItem("selectedRoomId");
  const id = getRoomId();
  
  // Helper function để chuyển tab
  const goBackToGameRooms = () => {
    const event = new CustomEvent("changeAdminTab", { detail: "GameRooms" });
    window.dispatchEvent(event);
  };

  // API helpers
  const headers = () => {
    const token = authService.getToken();
    if (!token) {
      throw new Error("No authentication token found. Please login first.");
    }
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  const getRoomById = async (roomId) => {
    const response = await fetch(`${API_BASE_URL}/admin/game-rooms/${roomId}`, {
      headers: headers(),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to fetch room");
    return data;
  };

  const updateRoom = async (roomId, payload) => {
    const response = await fetch(`${API_BASE_URL}/admin/game-rooms/${roomId}`, {
      method: "PATCH",
      headers: headers(),
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to update room");
    return data;
  };

  const deleteRoom = async (roomId) => {
    const response = await fetch(`${API_BASE_URL}/admin/game-rooms/${roomId}`, {
      method: "DELETE",
      headers: headers(),
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || "Failed to delete room");
    }
  };
  
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Enum options
  const mapSizeOptions = ["3x5", "4x6", "5x5", "4x7", "5x7", "6x6", "6x7", "6x8", "6x9"];
  const difficultyOptions = ["Easy", "Normal", "Hard", "Thử Thách", "Căng Nhé", "Siêu Cấp", "Hủy Diệt"];
  const statusOptions = ["waiting", "playing", "finished", "deleted"];
  const visibilityOptions = ["public", "private"];

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        setErrorMsg("");
        const data = await getRoomById(id);
        setRoom(data);
      } catch (error) {
        setErrorMsg(error?.response?.data?.message || "Error fetching room data.");
        console.error("Error fetching room:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const parsedValue =
      name === "maxPlayers" || name === "colorCount" || name === "shapeCount"
        ? Number(value)
        : value;
    setRoom({ ...room, [name]: parsedValue });
  };

  const handleSave = async () => {
    setActionLoading(true);
    setErrorMsg("");
    try {
      // API chỉ cho phép update 3 field
      const payload = {
        colorCount: Number(room.colorCount),
        shapeCount: Number(room.shapeCount),
        visibility: room.visibility,
      };

      console.log("PATCH payload:", payload);

      await updateRoom(id, payload);
      alert("Cập nhật thành công!");
      goBackToGameRooms();
    } catch (error) {
      setErrorMsg(error.message || "Error updating room.");
      console.error("Error updating room:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this room?")) {
      setActionLoading(true);
      setErrorMsg("");
      try {
        await deleteRoom(id);
        goBackToGameRooms();
      } catch (error) {
        setErrorMsg(error?.response?.data?.message || "Error deleting room.");
        console.error("Error deleting room:", error);
      } finally {
        setActionLoading(false);
      }
    }
  };

  if (loading) return <p>Loading room data...</p>;
  if (errorMsg) return <p className="error-message">{errorMsg}</p>;
  if (!room) return <p>Room not found.</p>;

  return (
    <div className="game-room-page">
      <div className="page-content">
        <h2>Room Detail</h2>
        {errorMsg && <div className="error-message">{errorMsg}</div>}

        {/* Room Code */}
        <div className="form-group">
          <label htmlFor="roomCode">Room Code</label>
          <input id="roomCode" name="roomCode" value={room.roomCode || ""} readOnly disabled />
        </div>

        {/* Password */}
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="text"
            id="password"
            name="password"
            value={room.password || ""}
            onChange={handleChange}
            disabled
          />
        </div>

        {/* Status */}
        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select id="status" name="status" value={room.status || ""} onChange={handleChange} disabled>
            {statusOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Visibility */}
        <div className="form-group">
          <label htmlFor="visibility">Visibility</label>
          <select
            id="visibility"
            name="visibility"
            value={room.visibility || ""}
            onChange={handleChange}
            disabled={actionLoading}
          >
            {visibilityOptions.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>

        {/* Difficulty */}
        <div className="form-group">
          <label htmlFor="difficulty">Difficulty</label>
          <select id="difficulty" name="difficulty" value={room.difficulty || ""} onChange={handleChange} disabled>
            {difficultyOptions.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Map Size */}
        <div className="form-group">
          <label htmlFor="mapSize">Map Size</label>
          <select id="mapSize" name="mapSize" value={room.mapSize || ""} onChange={handleChange} disabled>
            {mapSizeOptions.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        {/* Max Players */}
        <div className="form-group">
          <label htmlFor="maxPlayers">Max Players</label>
          <input
            type="number"
            id="maxPlayers"
            name="maxPlayers"
            value={room.maxPlayers || ""}
            onChange={handleChange}
            disabled
          />
        </div>

        {/* Color Count */}
        <div className="form-group">
          <label htmlFor="colorCount">Colors</label>
          <input
            type="number"
            id="colorCount"
            name="colorCount"
            value={room.colorCount || ""}
            onChange={handleChange}
            disabled={actionLoading}
          />
        </div>

        {/* Shape Count */}
        <div className="form-group">
          <label htmlFor="shapeCount">Shapes</label>
          <input
            type="number"
            id="shapeCount"
            name="shapeCount"
            value={room.shapeCount || ""}
            onChange={handleChange}
            disabled={actionLoading}
          />
        </div>

        <div className="form-actions">
          <button onClick={handleSave} disabled={actionLoading}>
            {actionLoading ? "Saving..." : "Save"}
          </button>
          <button onClick={handleDelete} className="btn-delete" disabled={actionLoading}>
            {actionLoading ? "Deleting..." : "Delete"}
          </button>
          <button onClick={goBackToGameRooms} className="cancel-btn" disabled={actionLoading}>
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomDetail;
