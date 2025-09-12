import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./AdminLeaderBoard.css";

// =====================================
// Leaderboard Page with Role Guard (ADMIN / staff)
// - Supports admin payload shape:
//   {
//     mode: "all-time",
//     total: number,
//     items: [{ rank, userId, username, avatar, level, totalScore }]
//   }
// - Only users with roles in ALLOWED_ROLES can access
// - Fallback demo data so you can preview without API
// =====================================

// ---- Config: adapt to your app ----
const ALLOWED_ROLES = ["ADMIN", "staff"]; // normalized to upper-case at runtime
const API_BASE =
  import.meta?.env?.VITE_API_BASE_URL ||
  "https://speedycount-staging.amazingtech.cc/api"; // include /api
const ENDPOINTS = {
  allTime: "leaderboard/top",
  period: "leaderboard/top-period",
  reset: "leaderboard/reset",
};

// Axios instance
const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  timeout: 10000,
});

// Optional: attach auth token if your app uses it
api.interceptors.request.use((config) => {
  const token = window?.localStorage?.getItem?.("access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    // Normalize network errors
    if (err.response) return Promise.reject(err);
    return Promise.reject(
      new Error("Network error. Please check your connection.")
    );
  }
);

// ---- Types ----
/** @typedef {Object} Player */
/** @typedef {{
 *  rank?: number,
 *  id?: string | number,
 *  username: string,
 *  score: number,
 *  level?: number | string,
 *  games?: number,
 *  wins?: number,
 *  winRate?: number | string,
 *  avatar?: string
 * }} Player
 */

// ---- Helpers ----
const numberFmt = (n) => (n ?? 0).toLocaleString();
const classNames = (...c) => c.filter(Boolean).join(" ");

// Try to read roles from a global your app sets after login
const getUserRoles = () => {
  // Prefer localStorage profile set after login; fallback to globals
  try {
    const raw = localStorage.getItem("user_profile");
    if (raw) {
      const p = JSON.parse(raw);
      return p.role || p.roles || [];
    }
  } catch {}
  const rawGlobal =
    (typeof window !== "undefined" &&
      (window.__USER__?.roles || window.APP_USER?.roles)) ||
    [];
  return Array.isArray(rawGlobal) ? rawGlobal : [];
};

const hasAccessByRoles = (roles) => {
  const norm = roles.map((r) => String(r).toUpperCase());
  return norm.some((r) =>
    ALLOWED_ROLES.map((x) => String(x).toUpperCase()).includes(r)
  );
};

// Map API player shape -> our Player
const normalizePlayer = (p, idx) => {
  // Accept both public and admin payloads
  const score = p.totalScore ?? p.score ?? 0;
  const games = p.games ?? p.matches ?? 0;
  const wins = p.wins ?? p.victories ?? 0;
  const winRate =
    p.winRate != null
      ? typeof p.winRate === "string" && p.winRate.includes("%")
        ? parseFloat(p.winRate)
        : Number(p.winRate)
      : wins && games
      ? (wins / Math.max(1, games)) * 100
      : 0;

  return {
    rank: p.rank ?? idx + 1,
    id: p.id ?? p.userId ?? p.username ?? idx,
    username: p.username ?? p.name ?? `Player ${idx + 1}`,
    score: Number(score ?? 0),
    level: p.level ?? 1, // may be string in admin payload, we display as-is
    games: Number(games ?? 0),
    wins: Number(wins ?? 0),
    winRate,
    avatar: p.avatar ?? "👤",
  };
};

// Fake data fallback (in case API is not reachable in preview)
const FAKE_DATA = Array.from({ length: 20 }).map((_, i) => ({
  rank: i + 1,
  username: `player_${i + 1}`,
  totalScore: Math.floor(250000 - i * 2345 + (i % 7) * 321),
  level: String(1 + ((i * 3) % 90)), // mimic string level from admin payload
  games: 50 + ((i * 7) % 530),
  wins: 25 + ((i * 5) % 400),
  winRate: Math.min(100, 40 + ((i * 3) % 55)),
  avatar: "🎮",
})).map(normalizePlayer);

const SortIcon = ({ dir }) => (
  <span className="inline-block align-middle ml-1 opacity-60 select-none">
    {dir === "asc" ? "▲" : dir === "desc" ? "▼" : "↕"}
  </span>
);

const ColumnHeader = ({ label, sortKey, sort, setSort }) => {
  const dir = sort.key === sortKey ? sort.dir : undefined;
  return (
    <button
      className="text-left w-full font-semibold hover:opacity-80"
      onClick={() => {
        setSort((s) => ({
          key: sortKey,
          dir:
            s.key === sortKey
              ? s.dir === "asc"
                ? "desc"
                : s.dir === "desc"
                ? undefined
                : "asc"
              : "asc",
        }));
      }}
      title={`Sort by ${label}`}
    >
      {label}
      <SortIcon dir={dir} />
    </button>
  );
};

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState("All-Time"); // "All-Time" | "Period"
  const [period, setPeriod] = useState("week"); // week | month
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [limit, setLimit] = useState(10); // API limit parameter (max 100)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [forbidden, setForbidden] = useState(false);
  const [players, setPlayers] = useState(/** @type {Player[]} */ ([]));
  const [stats, setStats] = useState({
    maxScore: 0,
    totalPlayers: 0,
    totalGames: 0,
  });
  const [sort, setSort] = useState({ key: "rank", dir: "asc" });

  // Role gate (client-side)
  const roles = getUserRoles();
  const hasAccess = hasAccessByRoles(roles);

  // Fetch leaderboard
  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError("");
      setForbidden(false);
      try {
        // Build URL with parameters
        let url;
        let params = { limit: limit };
        
        if (activeTab === "All-Time") {
          url = ENDPOINTS.allTime;
        } else {
          url = ENDPOINTS.period;
          params.period = period;
        }

        const res = await api.get(url, { params });
        const json = res.data;

        // Accept admin payload { mode, total, items } or public arrays
        const rows = Array.isArray(json)
          ? json
          : json.items ?? json.data ?? json;
        const normalized = (rows || []).map(normalizePlayer);

        if (!cancelled) {
          const fallback = normalized.length ? normalized : FAKE_DATA;
          setPlayers(fallback);
          const highest = fallback.reduce(
            (m, p) => Math.max(m, p.score ?? 0),
            0
          );
          const totalPlayers = Number(json?.total ?? fallback.length);
          const totalGames = fallback.reduce((s, p) => s + (p.games || 0), 0);
          setStats({ maxScore: highest, totalPlayers, totalGames });
        }
      } catch (e) {
        console.warn("Leaderboard API error, falling back to fake data:", e);
        if (!cancelled) {
          setPlayers(FAKE_DATA);
          setStats({
            maxScore: FAKE_DATA.reduce((m, p) => Math.max(m, p.score), 0),
            totalPlayers: FAKE_DATA.length,
            totalGames: FAKE_DATA.reduce((s, p) => s + (p.games || 0), 0),
          });
          setError(String(e?.message ?? e));
        }
      } finally {
        !cancelled && setLoading(false);
      }
    }

    // If client roles already show no access, skip fetch
    if (hasAccess) load();
    else setForbidden(true);
    return () => {
      cancelled = true;
    };
  }, [activeTab, period, limit, hasAccess]);

  // ranking recompute after sort & search
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let rows = players.map((p, i) => ({ ...p, rank: p.rank ?? i + 1 }));
    if (q) rows = rows.filter((r) => `${r.username}`.toLowerCase().includes(q));

    if (sort.dir) {
      const dir = sort.dir === "asc" ? 1 : -1;
      rows.sort((a, b) => {
        const ka = a[sort.key] ?? 0;
        const kb = b[sort.key] ?? 0;
        if (typeof ka === "string" || typeof kb === "string")
          return String(ka).localeCompare(String(kb)) * dir;
        return (ka - kb) * dir;
      });
    }
    if (sort.key !== "rank" && sort.dir)
      rows = rows.map((r, i) => ({ ...r, rank: i + 1 }));
    return rows;
  }, [players, query, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    setPage(1);
  }, [query, sort, pageSize, activeTab, period, limit]);

  const resetRankings = async () => {
    const ok = confirm(
      "Are you sure you want to reset rankings? This action cannot be undone."
    );
    if (!ok) return;
    try {
      await api.post(ENDPOINTS.reset);
      alert("Rankings reset requested (stub). Connect your API to complete.");
    } catch (e) {
      alert(`Failed to reset rankings: ${e}`);
    }
  };

  if (forbidden) {
    return (
      <div className="access-denied">
        <div className="access-denied-icon">🔒</div>
        <h1>Access restricted</h1>
        <p>
          This leaderboard is only available to users with roles <b>ADMIN</b> or{" "}
          <b>staff</b>.
        </p>
        <p className="help-text">
          If you believe this is a mistake, please sign in with an authorized
          account or contact an administrator.
        </p>
      </div>
    );
  }

  return (
    <div className="leaderboard-page">
      {/* Header */}
      <div className="leaderboard-header">
        <div className="leaderboard-title-section">
          <h1>
            {activeTab === "All-Time"
              ? "All-Time Leaderboard"
              : "Period Leaderboard"}
          </h1>
          <p>
            {activeTab === "All-Time"
              ? "Top performing players of all time"
              : `Top players by ${period}`}
          </p>
        </div>
        <div className="leaderboard-actions">
          <button
            className="btn btn-secondary"
            onClick={() => alert("Analytics coming soon")}
          >
            📊 Analytics
          </button>
          <button className="btn btn-primary" onClick={resetRankings}>
            🏆 Reset Rankings
          </button>
        </div>
      </div>

      {/* Tabs and Controls */}
      <div className="leaderboard-tabs">
        <div className="tab-group">
          {["All-Time", "Period"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`tab-button ${activeTab === tab ? "active" : ""}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "Period" && (
          <select
            className="period-select"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        )}

        <div className="controls-section">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search player…"
            className="search-input"
          />
          <div className="control-group">
            <label className="control-label">Limit:</label>
            <select
              className="limit-select"
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              title="Number of players to fetch from API"
            >
              {[10, 20, 30, 50, 75, 100].map((n) => (
                <option key={n} value={n}>
                  Top {n}
                </option>
              ))}
            </select>
          </div>
          <div className="control-group">
            <label className="control-label">Per Page:</label>
            <select
              className="pagesize-select"
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
            >
              {[10, 20, 50, 100].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👤</div>
          <div className="stat-content">
            <div className="stat-value">{numberFmt(stats.totalPlayers)}</div>
            <div className="stat-label">Total Players</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🏅</div>
          <div className="stat-content">
            <div className="stat-value">{numberFmt(filtered.length)}</div>
            <div className="stat-label">Ranked Players</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🏆</div>
          <div className="stat-content">
            <div className="stat-value">{numberFmt(stats.maxScore)}</div>
            <div className="stat-label">Highest Score</div>
          </div>
        </div>
      </div>

      {/* Sort and Filter Section */}
      <div className="sort-filter-section">
        <div className="sort-filter-left">
          <div className="filter-group">
            <label htmlFor="sortBy">Sort by:</label>
            <select 
              id="sortBy"
              className="sort-select"
              value={sort.key}
              onChange={(e) => setSort({key: e.target.value, dir: 'desc'})}
            >
              <option value="rank">Rank</option>
              <option value="username">Username</option>
              <option value="level">Level</option>
              <option value="score">Score</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label htmlFor="sortOrder">Order:</label>
            <select 
              id="sortOrder"
              className="sort-select"
              value={sort.dir || 'asc'}
              onChange={(e) => setSort(prev => ({...prev, dir: e.target.value}))}
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>
        
        <div className="sort-filter-right">
          <button 
            className="reset-sort-btn"
            onClick={() => setSort({key: 'rank', dir: 'asc'})}
          >
         Reset Sort
          </button>
          <span className="results-count">
            Showing {pageRows.length} of {filtered.length} players
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>
                {/* <ColumnHeader
                  label="#"
                  sortKey="rank"
                  sort={sort}
                  setSort={setSort}
                /> */}
                Rank
              </th>
              <th>
                {/* <ColumnHeader
                  label="Player"
                  sortKey="username"
                  sort={sort}
                  setSort={setSort}
                /> */}
                Player
              </th>
              <th>
                {/* <ColumnHeader
                  label="Level"
                  sortKey="level"
                  sort={sort}
                  setSort={setSort}
                /> */}
                Level
              </th>
              <th>
                {/* <ColumnHeader
                  label="Score"
                  sortKey="totalScore"
                  sort={sort}
                  setSort={setSort}
                /> */}
                Score
              </th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={4} className="loading-row">
                  <div className="loading-text">Loading leaderboard…</div>
                </td>
              </tr>
            )}
            {!loading &&
              pageRows.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div className="rank-display">
                      <span className="rank-number">#{p.rank}</span>
                    </div>
                  </td>
                  <td>
                    <div className="player-info">
                      <div className="player-avatar">
                        {p.avatar && p.avatar !== "default-avatar.png" ? (
                          <img
                            src={p.avatar}
                            alt={p.username}
                            className="avatar-img"
                          />
                        ) : (
                          <span className="avatar-placeholder">👤</span>
                        )}
                      </div>
                      <span className="player-name">{p.username}</span>
                    </div>
                  </td>
                  <td>
                    <span className="level-badge">{p.level}</span>
                  </td>
                  <td>
                    <span className="score-value">{numberFmt(p.score)}</span>
                  </td>
                </tr>
              ))}
            {!loading && pageRows.length === 0 && (
              <tr>
                <td colSpan={4} className="empty-row">
                  No players found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination">
        <div className="pagination-info">
          {filtered.length} players • Page {page} / {totalPages}
        </div>
        <div className="pagination-buttons">
          <button
            className="pagination-button"
            disabled={page <= 1}
            onClick={() => setPage(1)}
          >
            ⏮
          </button>
          <button
            className="pagination-button"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            ← Prev
          </button>
          <button
            className="pagination-button"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next →
          </button>
          <button
            className="pagination-button"
            disabled={page >= totalPages}
            onClick={() => setPage(totalPages)}
          >
            ⏭
          </button>
        </div>
      </div>

      {/* Error (non-blocking) */}
      {error && (
        <div className="error-message">
          Note: API error encountered (showing demo data). Details: {error}
        </div>
      )}

      {/* Footer / API docs hint */}
      <div className="api-docs">
        <div>
          API endpoints (axios): <code>GET /leaderboard/top</code>,{" "}
          <code>GET /leaderboard/top-period?period=week|month</code>,{" "}
          <code>POST /leaderboard/reset</code>. Base URL:{" "}
          <code>{API_BASE || "/"}</code>
        </div>
      </div>
    </div>
  );
}
