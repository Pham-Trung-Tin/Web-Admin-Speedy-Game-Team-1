import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSessionById } from "../../services/sessionService";
import "./SessionDetail.css";

// Helper format date
const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleString("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const SessionDetail = ({ session: propSession }) => {
  const { id } = useParams();
  const [session, setSession] = useState(propSession || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (propSession) {
      setSession(propSession);
      return;
    }
    if (!id) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getSessionById(id);
        setSession(data);
      } catch (error) {
        console.error("❌ Lỗi khi load session:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, propSession]);

  if (loading) return <div className="p-6">Đang tải...</div>;
  if (!session) return <div className="p-6">No session selected</div>;

  const goBack = () => {
    window.dispatchEvent(
      new CustomEvent("changeAdminTab", { detail: { tab: "GameSessions" } })
    );
  };

  const host =
    session.playerSessions?.find((p) => p.isHost)?.user?.username || "-";

  return (
    <div className="session-detail-page">
      {/* Header */}
      <div className="session-header">
        <h2 className="text-2xl font-bold">Session Detail</h2>
        <button onClick={goBack} className="back-btn">
          ⬅ Back
        </button>
      </div>

      {/* Session Info */}
      <div className="session-card">
        <div className="card-row">
          <div className="card-item">
            <strong>Session ID</strong>
            {session._id || session.id}
          </div>
          <div className="card-item">
            <strong>Name</strong>
            {session.name || session.roomCode || "-"}
          </div>
          <div className="card-item">
            <strong>Room Code</strong>
            {session.roomCode || "-"}
          </div>
          <div className="card-item">
            <strong>Room ID</strong>
            {session.roomId || "-"}
          </div>
        </div>

        <div className="card-row">
          <div className="card-item">
            <strong>Host</strong>
            <span className="badge badge-host">{host}</span>
          </div>
          <div className="card-item">
            <strong>Status</strong>
            <span
              className={`badge-state state-${session.state?.toLowerCase()}`}
            >
              {session.state || "-"}
            </span>
          </div>
          <div className="card-item">
            <strong>Total Rounds</strong>
            {session.totalRounds ?? "-"}
          </div>
          <div className="card-item">
            <strong>Current Round</strong>
            {session.currentRoundNo ?? "-"}
          </div>
        </div>

        <div className="card-row">
          <div className="card-item">
            <strong>Session Pass</strong>
            {session.sessionPass || "(none)"}
          </div>
          <div className="card-item">
            <strong>Started At</strong>
            {formatDate(session.startedAt)}
          </div>
          <div className="card-item">
            <strong>Created At</strong>
            {formatDate(session.createdAt)}
          </div>
          <div className="card-item">
            <strong>Ended At</strong>
            {formatDate(session.endedAt)}
          </div>
          <div className="card-item">
            <strong>Finalized At</strong>
            {formatDate(session.finalizedAt)}
          </div>
        </div>
      </div>

      {/* Players Section */}
      {Array.isArray(session.playerSessions) && (
        <div className="players-section">
          <h3>Players</h3>
          <div className="table-wrap">
            <table className="players-table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Avatar</th>
                  <th>Score</th>
                  <th>Wins</th>
                  <th>Losses</th>
                  <th>Rounds Played</th>
                  <th>Host</th>
                </tr>
              </thead>
              <tbody>
                {session.playerSessions.map((ps) => (
                  <tr key={ps._id}>
                    <td>{ps.user?.username || "Unknown"}</td>
                    <td className="text-center">
                      {ps.user?.avatar ? (
                        <img
                          src={ps.user.avatar}
                          alt={ps.user.username}
                          className="avatar-img"
                        />
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="text-center">{ps.totalScore}</td>
                    <td className="text-center">{ps.wins}</td>
                    <td className="text-center">{ps.losses}</td>
                    <td className="text-center">{ps.roundsPlayed}</td>
                    <td className="text-center">
                      {ps.isHost ? <span className="badge badge-host">Host</span> : ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionDetail;
