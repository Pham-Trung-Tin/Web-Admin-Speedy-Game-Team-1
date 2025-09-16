import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { createRoom } from "../../../services/gameRoomService";
import { authService } from "../../../services/authService";
import "./gameRoom.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

const CreateRoom = () => {
  const [room, setRoom] = useState({
    roomCode: "",
    password: "",
    status: "waiting",
    visibility: "public",
    difficulty: "Easy",
    mapSize: "3x5", // ✅ đổi default hợp lệ
    maxPlayers: 2,
    colorCount: 2,
    shapeCount: 2,
    gameStarted: false,
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRoom({
      ...room,
      [name]: ["maxPlayers", "colorCount", "shapeCount"].includes(name)
        ? Number(value)
        : value,
    });
  };

  const handleCreate = async () => {
    if (!room.roomCode.trim()) {
      setErrorMsg("Room code is required!");
      return;
    }

    // Kiểm tra authentication trước khi gửi request
    if (!authService.isAuthenticated()) {
      setErrorMsg("You must be logged in to create a room. Please login first.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const payload = {
        roomCode: room.roomCode.trim(),
        password: room.password?.trim() || null,
        status: room.status,
        visibility: room.visibility,
        difficulty: room.difficulty,
        mapSize: room.mapSize,
        maxPlayers: room.maxPlayers,
        colorCount: room.colorCount,
        shapeCount: room.shapeCount,
        // gameStarted: false,
      };

      const res = await fetch(`${API_BASE_URL}/admin/game-rooms`, {
        method: "POST",
        headers: headers(),
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        // Xử lý lỗi authentication đặc biệt
        if (res.status === 401) {
          authService.logout(); // Xóa token không hợp lệ
          throw new Error("Authentication failed. Please login again.");
        }
        throw new Error(data.message || "Failed to create room");
      }

      alert("Room created successfully!");

      // Quay lại tab GameRooms
      const event = new CustomEvent("changeAdminTab", { detail: "GameRooms" });
      window.dispatchEvent(event);
    } catch (error) {
      setErrorMsg(error.message || "Error creating room!");
      console.error("Error creating room:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="game-room-page">
      <div className="page-content">
        <h2>Create Room</h2>
        {errorMsg && <div className="error-message">{errorMsg}</div>}

        {/* Room Code */}
        <div className="form-group">
          <label htmlFor="roomCode">Room Code</label>
          <input
            id="roomCode"
            name="roomCode"
            value={room.roomCode}
            onChange={handleChange}
            placeholder="Enter room code"
            disabled={loading}
          />
        </div>

        {/* Password */}
        <div className="form-group">
          <label htmlFor="password">Password (optional)</label>
          <input
            id="password"
            name="password"
            type="text"
            value={room.password}
            onChange={handleChange}
            placeholder="Enter password or leave empty"
            disabled={loading}
          />
        </div>

        {/* Status */}
        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={room.status}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="waiting">Waiting</option>
            <option value="playing">Playing</option>
            <option value="finished">Finished</option>
          </select>
        </div>

        {/* Visibility */}
        <div className="form-group">
          <label htmlFor="visibility">Visibility</label>
          <select
            id="visibility"
            name="visibility"
            value={room.visibility}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </div>

        {/* Difficulty */}
        <div className="form-group">
          <label htmlFor="difficulty">Difficulty</label>
          <select
            id="difficulty"
            name="difficulty"
            value={room.difficulty}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="Easy">Easy</option>
            <option value="Normal">Normal</option>
            <option value="Hard">Hard</option>
            <option value="Thử Thách">Thử Thách</option>
            <option value="Căng Nhé">Căng Nhé</option>
            <option value="Siêu Cấp">Siêu Cấp</option>
            <option value="Hủy Diệt">Hủy Diệt</option>
          </select>
        </div>

        {/* Map Size */}
        <div className="form-group">
          <label htmlFor="mapSize">Map Size</label>
          <select
            id="mapSize"
            name="mapSize"
            value={room.mapSize}
            onChange={handleChange}
            disabled={loading}
          >
            {/* ✅ Chỉ giữ giá trị backend cho phép */}
            <option value="3x5">3x5</option>
            <option value="5x7">5x7</option>
            <option value="6x6">6x6</option>
            <option value="6x7">6x7</option>
            <option value="6x8">6x8</option>
            <option value="6x9">6x9</option>
          </select>
        </div>

        {/* Max Players */}
        <div className="form-group">
          <label htmlFor="maxPlayers">Max Players</label>
          <input
            type="number"
            id="maxPlayers"
            name="maxPlayers"
            min="2"
            max="10"
            value={room.maxPlayers}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        {/* Colors */}
        <div className="form-group">
          <label htmlFor="colorCount">Colors</label>
          <input
            type="number"
            id="colorCount"
            name="colorCount"
            min="1"
            max="10"
            value={room.colorCount}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        {/* Shapes */}
        <div className="form-group">
          <label htmlFor="shapeCount">Shapes</label>
          <input
            type="number"
            id="shapeCount"
            name="shapeCount"
            min="1"
            max="10"
            value={room.shapeCount}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        {/* Buttons */}
        <div className="form-actions">
          <button onClick={handleCreate} disabled={loading}>
            {loading ? "Creating..." : "Create"}
          </button>
          <button
            onClick={() => navigate("/admin/game-rooms")}
            className="cancel-btn"
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateRoom;
