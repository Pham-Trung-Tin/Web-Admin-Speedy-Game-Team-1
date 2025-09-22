import React, { useState } from "react";
import { claimEndBonus } from "../services/sessionService";
import "./ClaimBonus.css";

// Định dạng ngày giờ cố định
const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleString("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).replace(/\//g, "-"); // Định dạng: "16-09-2025 14:13"
};

const SessionTable = ({ sessions }) => {
  const [claimingStates, setClaimingStates] = useState({});
  const [claimResults, setClaimResults] = useState({});

  const handleClaimBonus = async (sessionId, boostType = "NONE") => {
    setClaimingStates(prev => ({ ...prev, [sessionId]: true }));
    try {
      const result = await claimEndBonus(sessionId, boostType);
      setClaimResults(prev => ({ ...prev, [sessionId]: result }));
      alert(`🎉 Bonus claimed successfully!\n\nFinal Score: ${result.finalScore}\nBonus Extra: ${result.bonusExtra}\nMultiplier: ${result.multiplier}x\nPlayer: ${result.user?.username || 'Unknown'}`);
    } catch (error) {
      console.error("Error claiming bonus:", error);
      const errorMessage = error.response?.data?.message || error.message || "Có lỗi xảy ra khi claim bonus";
      alert(`❌ Lỗi: ${errorMessage}`);
    } finally {
      setClaimingStates(prev => ({ ...prev, [sessionId]: false }));
    }
  };

  const getStateClass = (state) => {
    switch (state) {
      case 'completed': return 'completed';
      case 'ongoing': return 'ongoing';
      case 'abandoned': return 'abandoned';
      default: return 'default';
    }
  };

  const handleRowClick = (sessionId) => {
    // Store the selected session ID
    localStorage.setItem("selectedSessionId", sessionId);
    // Trigger tab change to SessionDetails
    window.dispatchEvent(new CustomEvent("changeAdminTab", { detail: "SessionDetails" }));
  };

  return (
    <div className="overflow-x-auto rounded-lg shadow-lg">
      <table className="min-w-full bg-white border session-table">
        <thead>
          <tr>
            <th className="px-4 py-3 border-b">#</th>
            <th className="px-4 py-3 border-b">Session ID</th>
            <th className="px-4 py-3 border-b">Room Code</th>
            <th className="px-4 py-3 border-b">Host Player</th>
            <th className="px-4 py-3 border-b">Status</th>
            <th className="px-4 py-3 border-b">Created Date</th>
            <th className="px-4 py-3 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((session, idx) => {
            const host = session.playerSessions?.find(p => p.isHost)?.user?.username || "-";
            const isCompleted = session.state === 'completed';
            const isClaiming = claimingStates[session._id];
            const claimResult = claimResults[session._id];
            
            return (
              <tr 
                key={session._id || idx} 
                className="hover:bg-gray-50 transition-colors session-row"
                onClick={() => handleRowClick(session._id)}
                style={{ cursor: 'pointer' }}
              >
                <td className="px-4 py-3 border-b text-center font-medium text-gray-600">{idx + 1}</td>
                <td className="px-4 py-3 border-b">
                  <code className="bg-gray-100 px-2 py-1 rounded text-xs block max-w-xs truncate">
                    {session._id || "Unknown ID"}
                  </code>
                </td>
                <td className="px-4 py-3 border-b">
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                    {session.roomCode || session.roomId || "-"}
                  </code>
                </td>
                <td className="px-4 py-3 border-b">
                  <span className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    {host}
                  </span>
                </td>
                <td className="px-4 py-3 border-b">
                  <span className={`session-state-badge ${getStateClass(session.state)}`}>
                    {session.state || "unknown"}
                  </span>
                </td>
                <td className="px-4 py-3 border-b text-gray-600">
                  {formatDate(session.createdAt)}
                </td>
                <td className="px-4 py-3 border-b">
                  <div className="actions-cell">
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent row click
                        handleClaimBonus(session._id);
                      }}
                      disabled={!isCompleted || isClaiming}
                      className={`claim-bonus-btn px-3 py-2 rounded-lg text-sm font-medium transition-all claim-tooltip ${
                        !isCompleted 
                          ? 'disabled' 
                          : isClaiming
                          ? 'claiming'
                          : 'enabled'
                      }`}
                      data-tooltip={
                        !isCompleted 
                          ? "Session must be completed to claim bonus" 
                          : isClaiming
                          ? "Processing claim request..."
                          : "Click to claim end-game bonus"
                      }
                    >
                      {isClaiming ? (
                        <>
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          🎁 Claim Bonus
                        </>
                      )}
                    </button>
                    {claimResult && (
                      <div className="claim-success-indicator">
                        ✓ Claimed ({claimResult.finalScore} pts)
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {sessions.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-4">🎮</div>
          <p>No game sessions found</p>
        </div>
      )}
    </div>
  );
};

export default SessionTable;