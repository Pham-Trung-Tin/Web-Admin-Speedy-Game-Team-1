import React from "react";

// Định dạng ngày giờ
const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date
    .toLocaleString("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
    .replace(/\//g, "-");
};

const SessionTable = ({ sessions, page, limit, onView }) => {
  return (
    <div className="overflow-x-auto shadow-lg rounded-lg bg-white">
      <table className="min-w-full border border-gray-200">
        <thead>
          <tr className="bg-blue-500 text-white">
            <th className="px-4 py-2 border">#</th>
            <th className="px-4 py-2 border">Name</th>
            <th className="px-4 py-2 border">Room</th>
            <th className="px-4 py-2 border">Host</th>
            <th className="px-4 py-2 border">State</th>
            <th className="px-4 py-2 border">Created At</th>
            <th className="px-4 py-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {(sessions || []).map((session, idx) => {
            const host =
              session.playerSessions?.find((p) => p.isHost)?.user?.username ||
              "-";
            return (
              <tr
                key={session._id || idx}
                className={`hover:bg-gray-50 transition ${
                  idx % 2 === 0 ? "bg-gray-50/50" : "bg-white"
                }`}
              >
                <td className="px-4 py-2 border text-center">
                  {(page - 1) * limit + idx + 1}
                </td>
                <td className="px-4 py-2 border font-medium text-blue-600">
                  {session.name || session.roomCode || "Unnamed"}
                </td>
                <td className="px-4 py-2 border">
                  {session.roomCode || session.roomId || "-"}
                </td>
                <td className="px-4 py-2 border">{host}</td>
                <td className="px-4 py-2 border capitalize">
                  {session.state || "-"}
                </td>
                <td className="px-4 py-2 border">
                  {formatDate(session.createdAt)}
                </td>
                <td className="px-4 py-2 border text-center">
                  <button
                    onClick={() => onView && onView(session)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    View
                  </button>
                </td>
              </tr>
            );
          })}
          {sessions.length === 0 && (
            <tr>
              <td
                colSpan="7"
                className="px-4 py-4 text-center text-gray-500 italic"
              >
                No sessions found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SessionTable;
