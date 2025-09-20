import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./AdminLeaderBoard.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL;
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

api.interceptors.request.use((config) => {
  const token = window?.localStorage?.getItem?.("access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response) return Promise.reject(err);
    return Promise.reject(new Error("Network error. Please check your connection."));
  }
);

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
 *  avatar?: string,
 *  _origRank?: number
 * }} Player
 */

const numberFmt = (n) => (n ?? 0).toLocaleString();

const normalizePlayer = (p, idx) => {
  // Map fields according to actual API response structure
  const score = p.score ?? p.totalScore ?? 0;
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

  const origRank = p.rank ?? idx + 1;

  return {
    rank: origRank,
    _origRank: origRank,
    id: p.userId ?? p.id ?? p.username ?? idx,
    username: p.username ?? p.name ?? `Player ${idx + 1}`,
    score: Number(score ?? 0),
    level: p.level ?? "LEVEL_1",
    games: Number(games ?? 0),
    wins: Number(wins ?? 0),
    winRate,
    avatar: p.avatar && p.avatar !== "default-avatar.png" ? p.avatar : "👤",
  };
};

// Fake data fallback
const FAKE_DATA = Array.from({ length: 20 })
  .map((_, i) => ({
    rank: i + 1,
    username: `player_${i + 1}`,
    totalScore: Math.floor(250000 - i * 2345 + (i % 7) * 321),
    level: `LEVEL_${1 + ((i * 2) % 10)}`, // Generate LEVEL_1 to LEVEL_10
    games: 50 + ((i * 7) % 530),
    wins: 25 + ((i * 5) % 400),
    winRate: Math.min(100, 40 + ((i * 3) % 55)),
    avatar: "🎮",
  }))
  .map(normalizePlayer);

// Optional: list levels that match your backend (e.g., LEVEL_1, LEVEL_2, …)
const LEVEL_OPTIONS = ["", "LEVEL_1", "LEVEL_2", "LEVEL_3", "LEVEL_4", "LEVEL_5", "LEVEL_6", "LEVEL_7", "LEVEL_8", "LEVEL_9", "LEVEL_10"];

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState("All-Time"); // "All-Time" | "Period"
  const [period, setPeriod] = useState("week"); // week | month
  const [level, setLevel] = useState(""); // "" (no filter) | "LEVEL_1" | "LEVEL_2" | ...
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10; // fixed UI page size
  const [limit, setLimit] = useState(10); // API page size
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [players, setPlayers] = useState(/** @type {Player[]} */ ([]));
  const [stats, setStats] = useState({
    maxScore: 0,
    totalPlayers: 0,
    totalGames: 0,
  });
  const [sort, setSort] = useState({ key: "rank", dir: "asc" }); // key: 'rank'|'username'|'level'|'score'

  // Fetch leaderboard
  useEffect(() => {
    let cancelled = false;

    async function fetchTotalCount() {
      try {
        const countRes = await api.get(ENDPOINTS.allTime, { params: { limit: 1000 } });
        const countData = countRes.data;
        const countItems = Array.isArray(countData)
          ? countData
          : countData.items ?? countData.data ?? [];
        return countItems.length;
      } catch (e) {
        console.warn("Failed to fetch total count:", e);
        return null;
      }
    }

    async function load() {
      setLoading(true);
      setError("");
      try {
        let url;
        let params = { limit };

        if (activeTab === "All-Time") {
          url = ENDPOINTS.allTime;
          // All-Time tab doesn't support level filtering
        } else {
          url = ENDPOINTS.period;
          params.period = period;             // week | month
          if (level && level.trim() !== "") params.level = level;    // level filter only for Period tab
        }

        const [res, totalCount] = await Promise.all([
          api.get(url, { params }),
          activeTab === "All-Time" ? fetchTotalCount() : Promise.resolve(null),
        ]);

        const json = res.data;
        const rows = Array.isArray(json) ? json : json.items ?? json.data ?? json;
        const normalized = (rows || []).map(normalizePlayer);

        console.log("API Response:", {
          activeTab,
          period,
          level,
          url,
          params,
          jsonResponse: json,
          rowsExtracted: rows,
          normalizedData: normalized
        });

        if (!cancelled) {
          // Always use API data, even if empty
          setPlayers(normalized);

          const highest = normalized.reduce((m, p) => Math.max(m, p.score ?? 0), 0);
          let totalPlayers;
          if (totalCount !== null) {
            totalPlayers = totalCount;
          } else if (json?.total !== undefined && typeof json.total === "number") {
            totalPlayers = json.total;
          } else {
            totalPlayers = normalized.length;
          }
          const totalGames = normalized.reduce((s, p) => s + (p.games || 0), 0);
          setStats({ maxScore: highest, totalPlayers, totalGames });
        }
      } catch (e) {
        console.error("Leaderboard API error:", e);
        if (!cancelled) {
          // Don't use fake data, just show empty state with error
          setPlayers([]);
          setStats({
            maxScore: 0,
            totalPlayers: 0,
            totalGames: 0,
          });
          setError(`API Error: ${e?.response?.data?.message || e?.message || "Failed to fetch leaderboard data"}`);
        }
      } finally {
        !cancelled && setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [activeTab, period, level, limit]); // <-- include `level`

  // Filter + Sort (DO NOT mutate original rank)
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    let rows = players.map((p, i) => ({
      ...p,
      _origRank: p._origRank ?? p.rank ?? i + 1,
    }));

    // Only filter by username search query - level filtering is handled by API
    if (q) {
      rows = rows.filter((r) => {
        const username = String(r.username || "").toLowerCase();
        return username.includes(q);
      });
    }

    // Sort the results
    if (sort.dir) {
      const dir = sort.dir === "asc" ? 1 : -1;
      const key = sort.key === "rank" ? "_origRank" : sort.key;

      rows.sort((a, b) => {
        const ka = a[key];
        const kb = b[key];

        const numA = Number(ka);
        const numB = Number(kb);
        const bothNumeric = !Number.isNaN(numA) && !Number.isNaN(numB);

        if (bothNumeric) return (numA - numB) * dir;
        return String(ka ?? "").localeCompare(String(kb ?? "")) * dir;
      });
    }

    return rows;
  }, [players, query, sort]); // Remove 'level' from dependencies since we don't filter by it on frontend

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  const pageRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    const end = page * pageSize;
    return filtered.slice(start, end);
  }, [filtered, page]);

  useEffect(() => {
    setPage(1);
  }, [query, sort, activeTab, period, level, limit]);

  // Reset level filter when switching to All-Time tab
  useEffect(() => {
    if (activeTab === "All-Time") {
      setLevel("");
    }
  }, [activeTab]);

  const resetRankings = async () => {
    const ok = confirm("Are you sure you want to reset rankings? This action cannot be undone.");
    if (!ok) return;
    try {
      await api.post(ENDPOINTS.reset);
      alert("Rankings reset requested (stub). Connect your API to complete.");
    } catch (e) {
      alert(`Failed to reset rankings: ${e}`);
    }
  };

  return (
    <div className="leaderboard-page">
      {/* Header */}
      <div className="leaderboard-header">
        <div className="leaderboard-title-section">
          <h1>{activeTab === "All-Time" ? "All-Time Leaderboard" : "Period Leaderboard"}</h1>
          <p>
            {activeTab === "All-Time"
              ? "Top performing players of all time"
              : `Top players by ${period}${level && level.trim() !== "" ? ` • ${level.replace('LEVEL_', 'Level ')}` : ""}`}
          </p>
        </div>
        {/* <div className="leaderboard-actions">
          <button className="btn btn-secondary" onClick={() => alert("Analytics coming soon")}>📊 Analytics</button>
          <button className="btn btn-primary" onClick={resetRankings}>🏆 Reset Rankings</button>
        </div> */}
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
          <>
            <select
              className="period-select"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>

            <select
              className="level-select"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              title="Filter by level (optional)"
            >
              {LEVEL_OPTIONS.map((lv) => (
                <option key={lv || "ALL"} value={lv}>
                  {lv ? lv.replace('LEVEL_', 'Level ') : "All Levels"}
                </option>
              ))}
            </select>
          </>
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
          <div className="stat-icon">🏆</div>
          <div className="stat-content">
            <div className="stat-value">{numberFmt(stats.maxScore)}</div>
            <div className="stat-label">Highest Score</div>
          </div>
        </div>
      </div>

      {/* Sort & Filter Section */}
      <div className="sort-filter-section">
        <div className="sort-filter-left">
          <div className="filter-group">
            <label htmlFor="sortBy">Sort by:</label>
            <select
              id="sortBy"
              className="sort-select"
              value={sort.key}
              onChange={(e) => setSort({ key: e.target.value, dir: "asc" })}
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
              value={sort.dir || "asc"}
              onChange={(e) => setSort((prev) => ({ ...prev, dir: e.target.value }))}
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>

        <div className="sort-filter-right">
          <button className="reset-sort-btn" onClick={() => setSort({ key: "rank", dir: "asc" })}>
            Reset Sort
          </button>
          {((activeTab === "Period" && level && level.trim() !== "") || query) && (
            <button 
              className="reset-sort-btn" 
              onClick={() => {
                setLevel("");
                setQuery("");
              }}
              title="Clear all filters"
            >
              Clear Filters
            </button>
          )}
          <span className="results-count">
            Showing {pageRows.length} of {filtered.length} players
            {activeTab === "Period" && level && level.trim() !== "" && ` (API filtered by ${level.replace('LEVEL_', 'Level ')})`}
            {query && ` (search: "${query}")`}
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Player</th>
              <th>Level</th>
              <th>Score</th>
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
                      <span className="rank-number">#{p._origRank ?? p.rank}</span>
                    </div>
                  </td>
                  <td>
                    <div className="player-info">
                      <div className="player-avatar">
                        {p.avatar && p.avatar !== "default-avatar.png" ? (
                          <img src={p.avatar} alt={p.username} className="avatar-img" />
                        ) : (
                          <span className="avatar-placeholder">👤</span>
                        )}
                      </div>
                      <span className="player-name">{p.username}</span>
                    </div>
                  </td>
                  <td>
                    <span 
                      className="level-badge" 
                      data-level={p.level}
                      title={`Player Level: ${p.level}`}
                    >
                      {typeof p.level === 'string' && p.level.startsWith('LEVEL_') 
                        ? p.level.replace('LEVEL_', 'LV ') 
                        : `LV ${p.level}`}
                    </span>
                  </td>
                  <td>
                    <span className="score-value">{numberFmt(p.score)}</span>
                  </td>
                </tr>
              ))}
            {!loading && pageRows.length === 0 && (
              <tr>
                <td colSpan={4} className="empty-row">
                  {activeTab === "Period" && level && level.trim() !== "" 
                    ? `No players found for ${level.replace('LEVEL_', 'Level ')}.`
                    : query 
                    ? `No players found matching "${query}".`
                    : activeTab === "All-Time" 
                    ? "No players found."
                    : "No players found in this period."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination">
        <div className="pagination-info">
          Showing {Math.min((page - 1) * pageSize + 1, filtered.length)}-
          {Math.min(page * pageSize, filtered.length)} of {filtered.length} players • Page {page} of {totalPages}
        </div>
        <div className="pagination-buttons">
          <button className="pagination-button" disabled={page <= 1} onClick={() => setPage(1)}>
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
          <button className="pagination-button" disabled={page >= totalPages} onClick={() => setPage(totalPages)}>
            ⏭
          </button>
        </div>
      </div>

      {/* Error (non-blocking) */}
      {error && <div className="error-message">Note: API error encountered (showing demo data). Details: {error}</div>}
    </div>
  );
}
