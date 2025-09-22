import { useEffect, useState } from 'react';
import { getSessionById } from '../../../services/sessionService';

const SessionDetail = ({ sessionId }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!sessionId) return;
    setLoading(true);
    setError(null);
    
    getSessionById(sessionId)
      .then(data => setSession(data))
      .catch(err => {
        console.error('Error fetching session details:', err);
        setError('Không thể tải thông tin session');
      })
      .finally(() => setLoading(false));
  }, [sessionId]);

  const handleBack = () => {
    window.dispatchEvent(new CustomEvent("changeAdminTab", { detail: "GameSessions" }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#10b981';
      case 'ongoing': return '#f59e0b';
      case 'abandoned': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Hoàn thành';
      case 'ongoing': return 'Đang chơi';
      case 'abandoned': return 'Đã hủy';
      default: return status;
    }
  };

  if (loading) return <div style={{padding:32, textAlign:'center'}}>Đang tải...</div>;
  if (error) return <div style={{padding:32, textAlign:'center', color:'red'}}>{error}</div>;
  if (!session) return <div style={{padding:32, textAlign:'center'}}>Không tìm thấy session</div>;

  return (
    <div style={{padding:32, maxWidth:1200, margin:'0 auto'}}>
      <div style={{display:'flex', alignItems:'center', marginBottom:24}}>
        <button 
          onClick={handleBack} 
          style={{
            marginRight:16, 
            padding:'8px 20px', 
            fontSize:16, 
            borderRadius:8, 
            border:'1px solid #3b82f6', 
            background:'#fff', 
            color:'#3b82f6', 
            cursor:'pointer',
            transition:'all 0.2s'
          }}
          onMouseOver={(e) => {
            e.target.style.background = '#3b82f6';
            e.target.style.color = '#fff';
          }}
          onMouseOut={(e) => {
            e.target.style.background = '#fff';
            e.target.style.color = '#3b82f6';
          }}
        >
          ← Back
        </button>
        <h2 style={{
          fontSize:32, 
          fontWeight:'bold', 
          marginBottom:0, 
          borderBottom:'3px solid #3b82f6', 
          display:'inline-block', 
          paddingBottom:8
        }}>
          Session Detail
        </h2>
      </div>

      {/* Main Session Info Card */}
      <div style={{
        background:'#fff', 
        borderRadius:16, 
        boxShadow:'0 4px 16px rgba(0,0,0,0.1)', 
        padding:32, 
        marginBottom:24
      }}>
        <div style={{display:'flex', alignItems:'center', gap:16, marginBottom:24}}>
          <div style={{
            width:80, 
            height:80, 
            borderRadius:'50%', 
            background:`linear-gradient(135deg, ${getStatusColor(session.state)}, ${getStatusColor(session.state)}99)`,
            display:'flex',
            alignItems:'center',
            justifyContent:'center',
            fontSize:24
          }}>
            {session.state === 'completed' ? '🏆' : session.state === 'ongoing' ? '🎮' : '❌'}
          </div>
          <div>
            <h3 style={{fontSize:24, fontWeight:'bold', margin:0, marginBottom:4}}>
              {session.roomCode || session._id}
            </h3>
            <div style={{
              display:'inline-block',
              padding:'4px 12px',
              borderRadius:20,
              background:getStatusColor(session.state),
              color:'white',
              fontSize:14,
              fontWeight:600
            }}>
              {getStatusText(session.state)}
            </div>
          </div>
        </div>

        {/* Basic Info Grid */}
        <div style={{
          display:'grid', 
          gridTemplateColumns:'repeat(auto-fit, minmax(250px, 1fr))', 
          gap:24,
          marginBottom:32
        }}>
          <div>
            <label style={{fontWeight:'bold', color:'#374151', fontSize:14}}>Session ID:</label>
            <div style={{fontSize:16, marginTop:4, fontFamily:'monospace', background:'#f3f4f6', padding:'4px 8px', borderRadius:4}}>
              {session._id}
            </div>
          </div>
          <div>
            <label style={{fontWeight:'bold', color:'#374151', fontSize:14}}>Room Code:</label>
            <div style={{fontSize:16, marginTop:4}}>
              {session.roomCode || 'N/A'}
            </div>
          </div>
          <div>
            <label style={{fontWeight:'bold', color:'#374151', fontSize:14}}>Tổng số vòng:</label>
            <div style={{fontSize:16, marginTop:4}}>
              {session.totalRounds}
            </div>
          </div>
          <div>
            <label style={{fontWeight:'bold', color:'#374151', fontSize:14}}>Vòng hiện tại:</label>
            <div style={{fontSize:16, marginTop:4}}>
              {session.currentRoundNo}
            </div>
          </div>
        </div>

        {/* Time Info Grid */}
        <div style={{
          display:'grid', 
          gridTemplateColumns:'repeat(auto-fit, minmax(250px, 1fr))', 
          gap:24
        }}>
          <div>
            <label style={{fontWeight:'bold', color:'#374151', fontSize:14}}>Bắt đầu:</label>
            <div style={{fontSize:16, marginTop:4}}>
              {formatDate(session.startedAt)}
            </div>
          </div>
          <div>
            <label style={{fontWeight:'bold', color:'#374151', fontSize:14}}>Kết thúc:</label>
            <div style={{fontSize:16, marginTop:4}}>
              {formatDate(session.endedAt)}
            </div>
          </div>
          <div>
            <label style={{fontWeight:'bold', color:'#374151', fontSize:14}}>Tạo lúc:</label>
            <div style={{fontSize:16, marginTop:4}}>
              {formatDate(session.createdAt)}
            </div>
          </div>
          <div>
            <label style={{fontWeight:'bold', color:'#374151', fontSize:14}}>Cập nhật:</label>
            <div style={{fontSize:16, marginTop:4}}>
              {formatDate(session.updatedAt)}
            </div>
          </div>
        </div>
      </div>

      {/* Players Section */}
      {session.playerSessions && session.playerSessions.length > 0 && (
        <div style={{
          background:'#fff', 
          borderRadius:16, 
          boxShadow:'0 4px 16px rgba(0,0,0,0.1)', 
          padding:32
        }}>
          <h3 style={{
            fontSize:24, 
            fontWeight:'bold', 
            marginBottom:24, 
            borderBottom:'2px solid #e5e7eb',
            paddingBottom:12
          }}>
            Người chơi ({session.playerSessions.length})
          </h3>
          
          <div style={{
            display:'grid',
            gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))',
            gap:16
          }}>
            {session.playerSessions.map((player, index) => (
              <div key={player._id} style={{
                background:'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                border:'1px solid #e2e8f0',
                borderRadius:12,
                padding:20,
                position:'relative'
              }}>
                {player.isHost && (
                  <div style={{
                    position:'absolute',
                    top:-8,
                    right:-8,
                    background:'#3b82f6',
                    color:'white',
                    padding:'4px 8px',
                    borderRadius:12,
                    fontSize:10,
                    fontWeight:'bold'
                  }}>
                    HOST
                  </div>
                )}
                
                <div style={{display:'flex', alignItems:'center', gap:12, marginBottom:16}}>
                  <div style={{
                    width:50,
                    height:50,
                    borderRadius:'50%',
                    background:'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                    display:'flex',
                    alignItems:'center',
                    justifyContent:'center',
                    color:'white',
                    fontWeight:'bold',
                    fontSize:18
                  }}>
                    {player.user?.username?.charAt(0)?.toUpperCase() || (index + 1)}
                  </div>
                  <div>
                    <div style={{fontWeight:'bold', fontSize:16}}>
                      {player.user?.username || `Player ${index + 1}`}
                    </div>
                    <div style={{fontSize:14, color:'#6b7280'}}>
                      {player.user?.email || 'N/A'}
                    </div>
                  </div>
                </div>

                <div style={{
                  display:'grid',
                  gridTemplateColumns:'1fr 1fr',
                  gap:12,
                  fontSize:14
                }}>
                  <div>
                    <span style={{fontWeight:'bold', color:'#059669'}}>Điểm: </span>
                    <span style={{fontWeight:'bold', fontSize:16}}>{player.totalScore}</span>
                  </div>
                  <div>
                    <span style={{fontWeight:'bold', color:'#3b82f6'}}>Vòng: </span>
                    {player.roundsPlayed}
                  </div>
                  <div>
                    <span style={{fontWeight:'bold', color:'#10b981'}}>Thắng: </span>
                    {player.wins}
                  </div>
                  <div>
                    <span style={{fontWeight:'bold', color:'#ef4444'}}>Thua: </span>
                    {player.losses}
                  </div>
                  <div>
                    <span style={{fontWeight:'bold', color:'#f59e0b'}}>Hòa: </span>
                    {player.draws}
                  </div>
                  <div>
                    <span style={{fontWeight:'bold', color:'#6b7280'}}>Sẵn sàng: </span>
                    {player.ready ? '✅' : '❌'}
                  </div>
                </div>

                {player.joinedAt && (
                  <div style={{
                    marginTop:12,
                    fontSize:12,
                    color:'#6b7280',
                    borderTop:'1px solid #e2e8f0',
                    paddingTop:8
                  }}>
                    Tham gia: {formatDate(player.joinedAt)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Additional Info */}
      <div style={{
        background:'#fff', 
        borderRadius:16, 
        boxShadow:'0 4px 16px rgba(0,0,0,0.1)', 
        padding:32,
        marginTop:24
      }}>
        <h3 style={{
          fontSize:20, 
          fontWeight:'bold', 
          marginBottom:20, 
          borderBottom:'2px solid #e5e7eb',
          paddingBottom:8
        }}>
          Thông tin bổ sung
        </h3>
        
        <div style={{
          display:'grid', 
          gridTemplateColumns:'repeat(auto-fit, minmax(250px, 1fr))', 
          gap:20
        }}>
          <div>
            <label style={{fontWeight:'bold', color:'#374151', fontSize:14}}>Host ID:</label>
            <div style={{fontSize:14, marginTop:4, fontFamily:'monospace', background:'#f3f4f6', padding:'4px 8px', borderRadius:4}}>
              {session.hostId}
            </div>
          </div>
          {session.sessionPass && (
            <div>
              <label style={{fontWeight:'bold', color:'#374151', fontSize:14}}>Mật khẩu:</label>
              <div style={{fontSize:14, marginTop:4}}>
                {'*'.repeat(session.sessionPass.length)}
              </div>
            </div>
          )}
          {session.finalizedAt && (
            <div>
              <label style={{fontWeight:'bold', color:'#374151', fontSize:14}}>Hoàn thành:</label>
              <div style={{fontSize:14, marginTop:4}}>
                {formatDate(session.finalizedAt)}
              </div>
            </div>
          )}
          <div>
            <label style={{fontWeight:'bold', color:'#374151', fontSize:14}}>Version:</label>
            <div style={{fontSize:14, marginTop:4}}>
              {session.__v || 0}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionDetail;