import React from "react";

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
  return (
    <div className="overflow-x-auto rounded shadow">
      <table className="min-w-full bg-white border">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 border">#</th>
            <th className="px-4 py-2 border">Name</th>
            <th className="px-4 py-2 border">Room</th>
            <th className="px-4 py-2 border">Host</th>
            <th className="px-4 py-2 border">State</th>
            <th className="px-4 py-2 border">Created At</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((session, idx) => {
            const host = session.playerSessions?.find(p => p.isHost)?.user?.username || "-";
            return (
              <tr key={session._id || idx} className="hover:bg-gray-50">
                <td className="px-4 py-2 border text-center">{idx + 1}</td>
                <td className="px-4 py-2 border">{session.name || session.roomCode || "Unnamed"}</td>
                <td className="px-4 py-2 border">{session.roomCode || session.roomId || "-"}</td>
                <td className="px-4 py-2 border">{host}</td>
                <td className="px-4 py-2 border capitalize">{session.state || "-"}</td>
                <td className="px-4 py-2 border">{formatDate(session.createdAt)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default SessionTable;