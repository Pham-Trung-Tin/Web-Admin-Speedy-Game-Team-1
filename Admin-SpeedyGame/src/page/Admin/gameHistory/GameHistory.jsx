// src/pages/Admin/Profile/GameHistory.jsx
import { useState, useMemo } from "react";
import { AuthService } from "../../../services/AuthService";
import "./GameHistory.css";

const GameHistory = () => {
  const [form, setForm] = useState({ roomCode: "", page: 1, limit: 20 });
  const [result, setResult] = useState({ page: 1, limit: 20, total: 0, data: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil((result?.total || 0) / (result?.limit || 20))),
    [result.total, result.limit]
  );

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({
      ...p,
      [name]:
        name === "page" || name === "limit"
          ? Math.max(1, parseInt(value || "1", 10))
          : value,
    }));
  };

  const search = async (opts) => {
    const payload = { ...form, ...(opts || {}) };
    if (!payload.roomCode.trim()) {
      setError("Vui lòng nhập Room Code");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const data = await AuthService.getUserGameHistoriesByRoom({
        roomCode: payload.roomCode.trim(),
        page: payload.page,
        limit: payload.limit,
      });
      setResult({
        page: data.page ?? payload.page,
        limit: data.limit ?? payload.limit,
        total: data.total ?? (Array.isArray(data.data) ? data.data.length : 0),
        data: data.data ?? [],
      });
      setForm((p) => ({ ...p, page: data.page ?? payload.page, limit: data.limit ?? payload.limit }));
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra khi tìm kiếm dữ liệu");
      setResult((r) => ({ ...r, data: [], total: 0 }));
      console.error("GameHistory search error:", err);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e) => {
    e?.preventDefault();
    search();
  };

  const reset = () => {
    setForm({ roomCode: "", page: 1, limit: 20 });
    setResult({ page: 1, limit: 20, total: 0, data: [] });
    setError("");
  };

 

//   const copyJson = async () => {
//     try {
//       await navigator.clipboard.writeText(JSON.stringify(result, null, 2));
//       alert("Đã copy JSON response!");
//     } catch (err) {
//       console.error("Failed to copy:", err);
//       alert("Không thể copy JSON");
//     }
//   };

  const gotoPrev = () => {
    if (loading) return;
    const newPage = Math.max(1, Number(form.page) - 1);
    setForm((p) => ({ ...p, page: newPage }));
    search({ page: newPage });
  };
  const gotoNext = () => {
    if (loading) return;
    const newPage = Number(form.page) + 1;
    if (result.total > 0 && newPage > totalPages) return;
    setForm((p) => ({ ...p, page: newPage }));
    search({ page: newPage });
  };

  return (
    <div className="game-history-container">
      <div className="game-history-header">
        <h3>🎮 Game History</h3>
        <p>Tra cứu lịch sử game theo Room Code</p>
      </div>

      {/* Search form */}
      <form className="search-form-section" onSubmit={onSubmit}>
        <div className="search-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="roomCode">
                Room Code <span className="required">*</span>
              </label>
              <input
                type="text"
                id="roomCode"
                name="roomCode"
                value={form.roomCode}
                onChange={onChange}
                placeholder="Nhập Room Code (ví dụ: R002)"
                className="form-input"
                onKeyDown={(e) => e.key === "Enter" && onSubmit(e)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="page">Page</label>
              <input
                type="number"
                id="page"
                name="page"
                min="1"
                value={form.page}
                onChange={onChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="limit">Limit</label>
              <input
                type="number"
                id="limit"
                name="limit"
                min="1"
                max="100"
                value={form.limit}
                onChange={onChange}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-actions">
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? "Đang tìm kiếm..." : "🔍 Tìm kiếm"}
            </button>
            <button type="button" className="btn btn-secondary" onClick={reset} disabled={loading}>
              🔄 Reset
            </button>
          </div>
        </div>
      </form>

      {/* Error */}
      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      {/* Result */}
      <div className="results-section">
        <div className="results-header">
          <h4>Kết quả tìm kiếm</h4>
          <div className="results-info">
            <span className="info-badge">Page: {result.page}</span>
            <span className="info-badge">Limit: {result.limit}</span>
            <span className="info-badge">Total: {result.total}</span>
          </div>
        </div>

        <div className="data-display">
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner" />
              <p>Đang tải dữ liệu...</p>
            </div>
          ) : !result.data?.length ? (
            <div className="empty-state">
              <div className="empty-icon">📊</div>
              <h5>Không có dữ liệu game</h5>
              <p>Room Code "{form.roomCode}" chưa có lịch sử game nào.</p>
              <p className="empty-hint">
                💡 Hãy thử chơi một game trong room này hoặc kiểm tra lại Room Code
              </p>
            </div>
          ) : (
            <div className="data-table">
              <table>
                <thead>
                  <tr>
                    <th>Game ID</th>
                    <th>Room Code</th>
                    <th>Player Count</th>
                    <th>Start Time</th>
                    <th>End Time</th>
                    <th>Duration</th>
                    <th>Status</th>
                    <th>Winner</th>
                  </tr>
                </thead>
                <tbody>
                  {result.data.map((item, index) => {
                    const id = item.id || item._id || `#${index + 1}`;
                    const players = Array.isArray(item.players)
                      ? item.players.length
                      : item.playerCount ?? "-";
                    const start = item.startTime
                      ? new Date(item.startTime).toLocaleString("vi-VN")
                      : "-";
                    const end = item.endTime
                      ? new Date(item.endTime).toLocaleString("vi-VN")
                      : "-";
                    const duration = item.duration
                      ? `${Math.round(item.duration / 1000)}s`
                      : item.startTime && item.endTime
                      ? `${Math.round((new Date(item.endTime) - new Date(item.startTime)) / 1000)}s`
                      : "-";
                    const status = item.status || "completed";
                    const winner = item.winner
                      ? typeof item.winner === "object"
                        ? item.winner.username || item.winner.name || "Unknown"
                        : item.winner
                      : "-";

                    return (
                      <tr key={id}>
                        <td>{id}</td>
                        <td><span className="room-code-badge">{item.roomCode}</span></td>
                        <td>{players}</td>
                        <td>{start}</td>
                        <td>{end}</td>
                        <td>{duration}</td>
                        <td><span className={`status-badge ${status}`}>{status}</span></td>
                        <td>{winner}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="pagination">
          <div className="pagination-info">
            {result.total > 0 ? (
              <>
                Trang {result.page} / {totalPages}
              </>
            ) : (
              <>Trang {result.page}</>
            )}
          </div>
          <div className="pagination-controls">
            <button className="btn btn-sm" onClick={gotoPrev} disabled={loading || result.page <= 1}>
              ← Trước
            </button>
            <button
              className="btn btn-sm"
              onClick={gotoNext}
              disabled={
                loading ||
                (result.total > 0 && result.page >= totalPages)
              }
            >
              Sau →
            </button>
          </div>
        </div>

        {/* JSON Response */}
        {/* <div className="json-response">
          <div className="json-header">
            <h5>Response JSON</h5>
            <button className="btn btn-small" onClick={copyJson}>
              📋 Copy
            </button>
          </div>
          <pre className="json-content">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div> */}
      </div>
    </div>
  );
};

export default GameHistory;
