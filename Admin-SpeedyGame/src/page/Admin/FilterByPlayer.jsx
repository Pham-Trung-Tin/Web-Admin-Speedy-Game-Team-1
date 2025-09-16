// FilterByPlayer.jsx
import React, { useState } from "react";
import SessionTable from "../../components/SessionTable";
import { getSessionsByPlayer } from "../../services/sessionService";

const FilterByPlayer = () => {
  const [playerInput, setPlayerInput] = useState("");
  const [filterType, setFilterType] = useState("id");
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!playerInput.trim()) {
      setError("⚠️ Please enter a Player ID or Username");
      setSessions([]);
      return;
    }
    setError("");
    setLoading(true);

    try {
      const data = await getSessionsByPlayer(playerInput.trim(), filterType === "username");
      console.log("Response from getSessionsByPlayer at", new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }), ":", data);
      setSessions(data || []);
    } catch (err) {
      console.error("❌ Error fetching sessions by player at", new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }), ":", err);
      setError("Failed to fetch sessions. Please try again.");
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Filter Sessions by Player</h2>
      <div className="flex items-center space-x-3 mb-4">
        <input
          type="text"
          placeholder="Enter Player ID or Username"
          className="border px-3 py-2 rounded w-64"
          value={playerInput}
          onChange={(e) => setPlayerInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="border px-2 py-2 rounded"
        >
          <option value="id">Player ID</option>
          <option value="username">Username</option>
        </select>
        <button
          onClick={handleSearch}
          disabled={loading}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
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

export default FilterByPlayer;