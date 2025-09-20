import { useEffect, useState } from "react";
import { GameRoomService } from "../../../services/gameRoomService";
import "./gameRoom.css";

const PublicRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRooms, setTotalRooms] = useState(0);
  const pageSize = 20;

  // Filters
  const [difficulty, setDifficulty] = useState("");
  const [maxPlayers, setMaxPlayers] = useState("");
  const [searchText, setSearchText] = useState("");

  const fetchPublicRooms = async () => {
    try {
      setLoading(true);
      setErrorMsg("");

      const params = {
        page: currentPage,
        limit: pageSize,
      };

      if (difficulty) params.difficulty = difficulty;
      if (maxPlayers) params.maxPlayers = parseInt(maxPlayers);

      const data = await GameRoomService.getPublicRooms(params);
      
      if (data?.data && Array.isArray(data.data)) {
        setRooms(data.data);
        setTotalPages(Math.ceil((data.pagination?.total || data.total || 0) / pageSize));
        setTotalRooms(data.pagination?.total || data.total || 0);
      } else {
        setRooms([]);
        setTotalPages(1);
        setTotalRooms(0);
      }
    } catch (error) {
      setErrorMsg("Error fetching public rooms: " + error.message);
      console.error("Error fetching public rooms:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublicRooms();
  }, [currentPage, difficulty, maxPlayers]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleReset = () => {
    setDifficulty("");
    setMaxPlayers("");
    setSearchText("");
    setCurrentPage(1);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return !isNaN(date) ? date.toLocaleDateString() + " " + date.toLocaleTimeString() : dateStr;
  };

  // Filter rooms by search text (client-side)
  const filteredRooms = rooms.filter((room) =>
    room.roomCode?.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="game-room-page">
      <div className="page-content">
        <h2>Public Game Rooms</h2>
        <p className="page-description">
          Browse all public game rooms available for players to join
        </p>

        {/* Filters */}
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by room code..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />

          <select 
            value={difficulty} 
            onChange={(e) => {
              setDifficulty(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          <input
            type="number"
            placeholder="Max Players"
            value={maxPlayers}
            onChange={(e) => {
              setMaxPlayers(e.target.value);
              setCurrentPage(1);
            }}
            min="1"
            max="10"
          />

          <button onClick={fetchPublicRooms}>Refresh</button>
          <button onClick={handleReset}>Reset Filters</button>
        </div>

        {/* Stats */}
        <div className="stats-info">
          <p>Found {totalRooms} public rooms</p>
        </div>

        {errorMsg && <div className="error-message">{errorMsg}</div>}

        {loading ? (
          <div className="loading">Loading public rooms...</div>
        ) : filteredRooms.length > 0 ? (
          <>
            <div className="rooms-grid">
              {filteredRooms.map((room) => (
                <div key={room._id || room.id} className="room-card">
                  <div className="room-header">
                    <h3 className="room-code">{room.roomCode}</h3>
                    <span className={`status ${room.status?.toLowerCase()}`}>
                      {room.status}
                    </span>
                  </div>
                  
                  <div className="room-info">
                    <div className="info-row">
                      <span className="label">Difficulty:</span>
                      <span className={`difficulty ${room.difficulty?.toLowerCase()}`}>
                        {room.difficulty}
                      </span>
                    </div>
                    
                    <div className="info-row">
                      <span className="label">Players:</span>
                      <span>{room.maxPlayers || 'N/A'} max</span>
                    </div>
                    
                    <div className="info-row">
                      <span className="label">Map Size:</span>
                      <span>{room.mapSize || 'N/A'}</span>
                    </div>
                    
                    <div className="info-row">
                      <span className="label">Colors:</span>
                      <span>{room.colorCount || 'N/A'}</span>
                    </div>
                    
                    <div className="info-row">
                      <span className="label">Shapes:</span>
                      <span>{room.shapeCount || 'N/A'}</span>
                    </div>
                    
                    <div className="info-row">
                      <span className="label">Visibility:</span>
                      <span className="visibility">{room.visibility}</span>
                    </div>
                    
                    <div className="info-row">
                      <span className="label">Created:</span>
                      <span className="date">{formatDate(room.createdAt)}</span>
                    </div>
                  </div>

                  <div className="room-actions">
                    <button 
                      className="btn-view"
                      onClick={() => {
                        localStorage.setItem("selectedRoomId", room._id || room.id);
                        window.dispatchEvent(
                          new CustomEvent("changeAdminTab", { detail: "RoomDetails" })
                        );
                      }}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="page-btn"
              >
                ← Previous
              </button>
              
              <div className="page-numbers">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`page-btn ${currentPage === pageNum ? 'active' : ''}`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="page-btn"
              >
                Next →
              </button>
            </div>

            <div className="pagination-info">
              Page {currentPage} of {totalPages} • {totalRooms} total rooms
            </div>
          </>
        ) : (
          <div className="no-data">
            <h3>No public rooms found</h3>
            <p>Try adjusting your filters or check back later.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicRooms;