import { useState, useMemo } from "react";
import { AuthService } from "../../../services/AuthService";
import "./GameRoomUser.css";

const GameRoomUser = () => {
  const [form, setForm] = useState({ page: 1, limit: 20 });
  const [result, setResult] = useState({ page: 1, limit: 20, total: 0, data: [], me: null });
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
    setLoading(true);
    setError("");

    try {
      const res = await AuthService.getUserGameRooms({
        page: payload.page,
        limit: payload.limit,
      });

      // res dạng: { page, limit, total, data: [], me: {...} }
      setResult({
        page: Number(res.page) || payload.page,
        limit: Number(res.limit) || payload.limit,
        total: Number(res.total) || 0,
        data: Array.isArray(res.data) ? res.data : [],
        me: res.me || null,
      });

      setForm((p) => ({
        ...p,
        page: Number(res.page) || payload.page,
        limit: Number(res.limit) || payload.limit,
      }));
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra khi tải danh sách rooms");
      setResult((r) => ({ ...r, data: [], total: 0 }));
      console.error("GameRoomUser search error:", err);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e) => {
    e?.preventDefault();
    search();
  };

  const reset = () => {
    setForm({ page: 1, limit: 20 });
    setResult({ page: 1, limit: 20, total: 0, data: [], me: null });
    setError("");
  };

  const copyJson = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(result, null, 2));
      alert("Đã copy JSON response!");
    } catch (err) {
      console.error("Failed to copy:", err);
      alert("Không thể copy JSON");
    }
  };

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
    <div className="game-room-user-container">
      <div className="game-room-user-header">
        <h3>👥 Game Room Users</h3>
        <p>Danh sách phòng mà user đang tham gia (kèm tổng quan của bạn)</p>
      </div>

      {/* Search form */}
      <form className="search-form-section" onSubmit={onSubmit}>
        <div className="search-form">
          <div className="form-row">
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
              {loading ? "Đang tải..." : "🔍 Tải danh sách"}
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

      {/* Me (thông tin ngắn của user) */}
      {result.me && (
        <div className="me-summary">
          <div className="me-avatar">
            {result.me.avatar ? (
              <img
                src={result.me.avatar}
                alt={result.me.fullName || "me"}
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
            ) : (
              <div className="me-placeholder">
                {(result.me.fullName || "A").charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="me-info">
            <div className="me-name">{result.me.fullName}</div>
            <div className="me-level">Level: {result.me.level || "Nhập Môn"}</div>
            <div className="me-id">ID: {result.me._id || result.me.id}</div>
          </div>
        </div>
      )}

      {/* Result */}
      <div className="results-section">
        <div className="results-header">
          <h4>Danh sách Rooms</h4>
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
              <div className="empty-icon">👥</div>
              <h5>Không có dữ liệu rooms</h5>
              <p>Chưa có phòng nào bạn đang tham gia.</p>
            </div>
          ) : (
            <div className="data-table">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Mã phòng</th>
                    <th>Tên phòng</th>
                    <th>Số người</th>
                    <th>Trạng thái</th>
                    <th>Tạo lúc</th>
                    <th>Cập nhật</th>
                  </tr>
                </thead>
                <tbody>
                  {result.data.map((room, idx) => (
                    <tr key={room.id || room._id || idx}>
                      <td>{(result.page - 1) * result.limit + idx + 1}</td>
                      <td><span className="room-code-badge">{room.roomCode || room.code || "-"}</span></td>
                      <td>{room.name || "-"}</td>
                      <td>{room.playerCount ?? room.players?.length ?? "-"}</td>
                      <td><span className={`status-badge ${room.status || "active"}`}>{room.status || "active"}</span></td>
                      <td>{room.createdAt ? new Date(room.createdAt).toLocaleString("vi-VN") : "-"}</td>
                      <td>{room.updatedAt ? new Date(room.updatedAt).toLocaleString("vi-VN") : "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="pagination">
          <div className="pagination-info">
            {result.total > 0 ? (
              <>Trang {result.page} / {totalPages}</>
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
              disabled={loading || (result.total > 0 && result.page >= totalPages)}
            >
              Sau →
            </button>
          </div>
        </div>

        {/* JSON Response */}
        {/* <div className="json-response">
          <div className="json-header">
            <h5>Response JSON</h5>
            <button className="btn btn-small" onClick={copyJson}>📋 Copy</button>
          </div>
          <pre className="json-content">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div> */}
      </div>
    </div>
  );
};

export default GameRoomUser;
