import React, { useState, useEffect, useCallback } from "react";
import { getSessions } from "../../services/sessionService";
import SessionTable from "../../components/SessionTable";

const ListSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [status, setStatus] = useState("");
  const [roomId, setRoomId] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [player, setPlayer] = useState("");
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
        state: status || undefined,
        roomId: roomId || undefined,
        roomCode: roomCode || undefined,
        player: player || undefined,
        page,
        limit,
      };
      const res = await getSessions(params);
      setSessions(res.data || []);
      setTotal(res.total || 0);
    } catch (err) {
      console.error("❌ Error fetching sessions:", err);
      setError("Không lấy được danh sách sessions. Vui lòng thử lại.");
      setSessions([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [status, roomId, roomCode, player, page]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const clearFilters = () => {
    setStatus("");
    setRoomId("");
    setRoomCode("");
    setPlayer("");
    setPage(1);
    fetchSessions();
  };

  const totalPages = Math.ceil(total / limit);

  // Khi người dùng bấm View: dispatch event để Admin.jsx bắt và chuyển sang SessionDetail
  const handleView = (session) => {
    const payload = { tab: "SessionDetail", session };
    window.dispatchEvent(new CustomEvent("changeAdminTab", { detail: payload }));
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Game Sessions</h2>

      {/* Thanh filter */}
      <div className="flex flex-wrap items-center gap-3 mb-4 bg-white p-4 rounded shadow">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border px-3 py-2 rounded w-40"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="ongoing">Ongoing</option>
          <option value="abandoned">Abandoned</option>
        </select>

        <input
          type="text"
          placeholder="Filter by Room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          className="border px-3 py-2 rounded w-40"
        />

        <input
          type="text"
          placeholder="Filter by Room Code"
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value)}
          className="border px-3 py-2 rounded w-40"
        />

        <input
          type="text"
          placeholder="Filter by Player"
          value={player}
          onChange={(e) => setPlayer(e.target.value)}
          className="border px-3 py-2 rounded w-40"
        />

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
          Clear
        </button>
      </div>

      {error && <p className="text-red-500">{error}</p>}
      {loading && <p>Loading...</p>}

      {!loading && !error && sessions.length > 0 && (
        <>
          <SessionTable
            sessions={sessions}
            page={page}
            limit={limit}
            onView={(session) => handleView(session)}
          />
          {totalPages > 1 && (
            <div className="flex gap-2 justify-end mt-2">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="px-3 py-1 border rounded"
              >
                Prev
              </button>
              <span className="px-3 py-1">
                {page} / {totalPages}
              </span>
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
