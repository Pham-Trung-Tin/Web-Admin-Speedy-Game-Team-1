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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 10; // Items per page

  const fetchSessions = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = {
        state: status ? status.toLowerCase() : undefined,
        roomCode: roomCode.trim() || undefined,
        page: currentPage,
        limit: pageSize,
      };
      Object.keys(params).forEach((k) => params[k] === undefined && delete params[k]);

      console.log("Fetching sessions with params:", params);
      const data = await getSessions(params, { headers: { "Cache-Control": "no-cache" } });
      console.log("Raw API response:", data);
      
      let sessionsData = [];
      let totalItems = 0;

      // Handle different response structures more carefully
      if (data && typeof data === 'object') {
        if (Array.isArray(data)) {
          // Direct array response
          sessionsData = data;
          totalItems = data.length;
        } else if (Array.isArray(data.data)) {
          // Response with data wrapper
          sessionsData = data.data;
          // Try multiple fields for total count
          totalItems = data.total || data.count || data.totalCount || data.totalItems || 
                      data.pagination?.total || data.meta?.total || sessionsData.length;
        } else if (Array.isArray(data.items)) {
          // Response with items wrapper
          sessionsData = data.items;
          totalItems = data.total || data.count || data.totalCount || data.totalItems || 
                      data.pagination?.total || data.meta?.total || sessionsData.length;
        } else if (data.result && Array.isArray(data.result)) {
          // Response with result wrapper
          sessionsData = data.result;
          totalItems = data.total || data.count || data.totalCount || data.totalItems || 
                      data.pagination?.total || data.meta?.total || sessionsData.length;
        } else {
          console.warn("Unexpected response structure:", data);
          sessionsData = [];
          totalItems = 0;
        }
      } else {
        console.warn("Invalid response data:", data);
        sessionsData = [];
        totalItems = 0;
      }

      // If total is still 0 but we have data, use length as fallback
      if (totalItems === 0 && sessionsData.length > 0) {
        totalItems = sessionsData.length;
        console.warn("Using sessionsData.length as totalItems fallback:", totalItems);
      }

      console.log("Fetched sessions at", new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }), ":", {
        sessionsData: sessionsData.length,
        totalItems,
        currentPage,
        totalPages: Math.ceil(totalItems / pageSize),
        status: status,
        responseStructure: {
          isArray: Array.isArray(data),
          hasData: !!data?.data,
          hasItems: !!data?.items,
          hasResult: !!data?.result,
          totalField: data?.total,
          countField: data?.count,
          totalCountField: data?.totalCount
        }
      });
      
      setSessions(sessionsData);
      setTotal(totalItems);
      setTotalPages(Math.ceil(totalItems / pageSize));
    } catch (err) {
      console.error("❌ Error fetching sessions at", new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }), ":", err);
      console.error("Error details:", err.response?.data || err.message);
      setError(`Không lấy được danh sách sessions. Lỗi: ${err.response?.data?.message || err.message}`);
      setSessions([]);
      setTotal(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, [status, roomCode, currentPage, pageSize]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (roomCode || !roomCode) {
        setCurrentPage(1); // Reset to page 1 when searching or clearing
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [roomCode]);

  // Reset to page 1 when status filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [status]);

  const clearFilters = () => {
    setStatus("");
    setRoomCode("");
    setCurrentPage(1);
    fetchSessions();
  };

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
          <SessionTable sessions={sessions} />
          <div className="flex gap-2 justify-between items-center mt-4">
            <div className="text-sm text-gray-600">
              {totalPages > 1 ? (
                `Trang ${currentPage} / ${totalPages} - Tổng cộng ${total} sessions`
              ) : (
                `Tổng cộng ${total || sessions.length} sessions`
              )}
            </div>
            {totalPages > 1 && (
              <div className="flex gap-2 items-center">
                <button
                  onClick={() => {
                    console.log("Prev clicked, current page:", currentPage);
                    setCurrentPage((p) => Math.max(p - 1, 1));
                  }}
                  disabled={currentPage === 1 || loading}
                  className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-50"
                >
                  Prev
                </button>
                <span className="px-3 py-1 bg-gray-100 rounded">Trang {currentPage} / {totalPages}</span>
                <button
                  onClick={() => {
                    console.log("Next clicked, current page:", currentPage, "total pages:", totalPages);
                    setCurrentPage((p) => Math.min(p + 1, totalPages));
                  }}
                  disabled={currentPage === totalPages || loading}
                  className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </>
      )}
      {!loading && !error && sessions.length === 0 && (
        <p className="text-gray-500">No sessions found.</p>
      )}
    </div>
  );
};

export default ListSessions;