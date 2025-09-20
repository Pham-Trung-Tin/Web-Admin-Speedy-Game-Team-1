import React, { useEffect, useState, useCallback } from "react";
import { getSessions, createSession } from "../../services/sessionService";
import SessionTable from "../../components/SessionTable";

const ListSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [status, setStatus] = useState("");
  const [roomId, setRoomId] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [playerInput, setPlayerInput] = useState("");
  const [playerFilterType, setPlayerFilterType] = useState("id");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  const fetchSessions = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = {
        state: status ? status.toLowerCase() : undefined,
        roomId: roomId.trim() || undefined,
        roomCode: roomCode.trim() || undefined,
        page,
        limit,
      };
      Object.keys(params).forEach((k) => params[k] === undefined && delete params[k]);

      const data = await getSessions(params, { headers: { "Cache-Control": "no-cache" } });
      let sessionsData = [];
      let totalItems = 0;

      if (Array.isArray(data)) {
        sessionsData = data;
        totalItems = data.length;
      } else if (Array.isArray(data?.data)) {
        sessionsData = data.data;
        totalItems = data.total || data.count || sessionsData.length;
      } else if (Array.isArray(data?.items)) {
        sessionsData = data.items;
        totalItems = data.total || data.count || sessionsData.length;
      }

      // Lọc client-side theo Player nếu có input
      if (playerInput.trim()) {
        sessionsData = sessionsData.filter(session =>
          session.playerSessions?.some(player =>
            (playerFilterType === "id" && player.userId?.toString().includes(playerInput.trim())) ||
            (playerFilterType === "username" && player.user?.username?.toLowerCase().includes(playerInput.trim().toLowerCase()))
          )
        );
        totalItems = sessionsData.length;
      }

      console.log("Fetched sessions at", new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }), ":", sessionsData);
      setSessions(sessionsData);
      setTotal(totalItems);
    } catch (err) {
      console.error("❌ Error fetching sessions at", new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }), ":", err);
      setError("Không lấy được danh sách sessions. Vui lòng thử lại.");
      setSessions([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [status, roomId, roomCode, playerInput, playerFilterType, page]);

  useEffect(() => {
    fetchSessions();
  }, [status, fetchSessions, page]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (roomId || roomCode || playerInput) fetchSessions();
      if (!roomId && !roomCode && !playerInput && !status) fetchSessions();
    }, 400);
    return () => clearTimeout(timer);
  }, [roomId, roomCode, playerInput, status, fetchSessions]);

  const clearFilters = () => {
    setStatus("");
    setRoomId("");
    setRoomCode("");
    setPlayerInput("");
    setPlayerFilterType("id");
    setPage(1);
    fetchSessions();
  };

  const createTestSession = async () => {
    setLoading(true);
    try {
      const newSession = await createSession({
        roomCode: `TEST-${Date.now()}`,
        maxPlayers: 4,
      });
      console.log("New session created at", new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }), ":", newSession);
      fetchSessions();
    } catch (err) {
      console.error("Error creating session at", new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }), ":", err);
      setError("Không thể tạo session. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Game Sessions</h2>
      <div className="flex flex-wrap gap-4 mb-4">
        <select
          className="border px-3 py-2 rounded"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="completed">Completed</option>
          <option value="ongoing">Ongoing</option>
          <option value="abandoned">Abandoned</option>
        </select>
        <input
          type="text"
          placeholder="Filter by Room ID"
          className="border px-3 py-2 rounded"
          value={roomId}
          onChange={(e) => {
            setRoomCode("");
            setRoomId(e.target.value);
          }}
        />
        <input
          type="text"
          placeholder="Filter by Room Code"
          className="border px-3 py-2 rounded"
          value={roomCode}
          onChange={(e) => {
            setRoomId("");
            setRoomCode(e.target.value);
          }}
        />
        <input
          type="text"
          placeholder="Filter by Player"
          className="border px-3 py-2 rounded"
          value={playerInput}
          onChange={(e) => setPlayerInput(e.target.value)}
        />
        <select
          value={playerFilterType}
          onChange={(e) => setPlayerFilterType(e.target.value)}
          className="border px-2 py-2 rounded"
        >
          <option value="id">Player ID</option>
          <option value="username">Username</option>
        </select>
        <button
          onClick={fetchSessions}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? "Loading..." : "Refresh"}
        </button>
        <button
          onClick={clearFilters}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Clear Filters
        </button>
        <button
          onClick={createTestSession}
          disabled={loading}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Test Session"}
        </button>
      </div>
      {error && <p className="text-red-500">{error}</p>}
      {loading && <p>Loading...</p>}
      {!loading && !error && sessions.length > 0 && (
        <>
          <SessionTable sessions={sessions} />
          {totalPages > 1 && (
            <div className="flex gap-2 justify-end mt-2">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="px-3 py-1 border rounded"
              >
                Prev
              </button>
              <span className="px-3 py-1">{page} / {totalPages}</span>
              <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className="px-3 py-1 border rounded"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
      {!loading && !error && sessions.length === 0 && (
        <p className="text-gray-500">No sessions found.</p>
      )}
    </div>
  );
};

export default ListSessions;