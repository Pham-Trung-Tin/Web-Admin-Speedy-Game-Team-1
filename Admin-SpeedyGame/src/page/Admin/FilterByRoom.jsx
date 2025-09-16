// FilterByRoom.jsx
import React, { useState } from "react";
import SessionTable from "../../components/SessionTable";
import { getSessionsByRoom } from "../../services/sessionService";

const FilterByRoom = () => {
  const [roomInput, setRoomInput] = useState("");
  const [filterType, setFilterType] = useState("id");
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!roomInput.trim()) {
      setError("⚠️ Please enter a Room ID or Code");
      setSessions([]);
      return;
    }
    setError("");
    setLoading(true);

    try {
      const data = await getSessionsByRoom(roomInput.trim(), filterType === "code");
      console.log("Response from getSessionsByRoom at", new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }), ":", data);
      setSessions(data || []);
    } catch (err) {
      console.error("❌ Error fetching sessions by room at", new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }), ":", err);
      setError("Failed to fetch sessions. Please try again.");
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Filter Sessions by Room</h2>
      <div className="flex items-center space-x-3 mb-4">
        <input
          type="text"
          placeholder="Enter Room ID or Code"
          className="border px-3 py-2 rounded w-64"
          value={roomInput}
          onChange={(e) => setRoomInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="border px-2 py-2 rounded"
        >
          <option value="id">Room ID</option>
          <option value="code">Room Code</option>
        </select>
        <button
          onClick={handleSearch}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      {loading ? (
        <p>Loading...</p>
      ) : sessions.length > 0 ? (
        <SessionTable sessions={sessions} />
      ) : (
        !error && <p>No sessions found.</p>
      )}
    </div>
  );
};

export default FilterByRoom;