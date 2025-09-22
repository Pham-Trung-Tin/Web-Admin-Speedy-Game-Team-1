import React, { useEffect, useState, useCallback } from "react";
import { getSessions } from "../../../services/sessionService";
import SessionTable from "../../../components/SessionTable";

const ListSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [status, setStatus] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(10);
  const [clientPage, setClientPage] = useState(1);
  const pageSize = 10; // UI pagination size

  const fetchSessions = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = {
        state: status ? status.toLowerCase() : undefined,
        roomCode: roomCode.trim() || undefined,
        page: 1, // Always fetch from page 1
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
  }, [status, roomCode, limit]);

  useEffect(() => {
    fetchSessions();
  }, [status, fetchSessions]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (roomCode) fetchSessions();
      if (!roomCode && !status) fetchSessions();
    }, 400);
    return () => clearTimeout(timer);
  }, [roomCode, status, fetchSessions]);

  // Reset client page when limit changes
  useEffect(() => {
    setClientPage(1);
  }, [limit]);

  // Reset client page when sessions data changes
  useEffect(() => {
    setClientPage(1);
  }, [sessions]);

  const clearFilters = () => {
    setStatus("");
    setRoomCode("");
    setClientPage(1);
    setLimit(10);
    fetchSessions();
  };

  const totalPages = Math.ceil(sessions.length / pageSize);
  const startIndex = (clientPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentPageSessions = sessions.slice(startIndex, endIndex);

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
          <option value="finished">Finished</option>
          <option value="abandoned">Abandoned</option>
          <option value="playing">Playing</option>
        </select>
        <input
          type="text"
          placeholder="Filter by Room Code"
          className="border px-3 py-2 rounded"
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value)}
        />
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Limit:</label>
          <select
            className="border px-2 py-2 rounded"
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            title="Number of sessions to fetch from API"
          >
            {[10, 20, 30, 50, 80, 100].map((n) => (
              <option key={n} value={n}>
                List {n}
              </option>
            ))}
          </select>
        </div>
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
      </div>
      {error && <p className="text-red-500">{error}</p>}
      {loading && <p>Loading...</p>}
      {!loading && !error && sessions.length > 0 && (
        <>
          <SessionTable sessions={currentPageSessions} />
          {totalPages > 1 && (
            <div className="flex gap-2 justify-between items-center mt-4">
              {/* <div className="text-sm text-gray-600">
                Hiển thị {Math.min(startIndex + 1, sessions.length)}-{Math.min(endIndex, sessions.length)} trong tổng số {sessions.length} sessions 
                {sessions.length >= limit ? ` (giới hạn ${limit} từ API)` : ''}
                • Mỗi trang tối đa 10 sessions
              </div> */}
              <div className="flex gap-2 items-center">
                <button
                  onClick={() => setClientPage((p) => Math.max(p - 1, 1))}
                  disabled={clientPage === 1}
                  className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-50"
                >
                  Prev
                </button>
                <span className="px-3 py-1 bg-gray-100 rounded">Trang {clientPage} / {totalPages}</span>
                <button
                  onClick={() => setClientPage((p) => Math.min(p + 1, totalPages))}
                  disabled={clientPage === totalPages}
                  className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
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