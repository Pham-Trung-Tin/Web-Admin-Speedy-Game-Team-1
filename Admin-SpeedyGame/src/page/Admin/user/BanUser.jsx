
import { useEffect, useState } from 'react';
import { getUserById, banUser, unbanUser } from '../../../services/userService';

const BanUser = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState("");

  useEffect(() => {
    const userId = localStorage.getItem('selectedUserId');
    if (!userId) {
      setError('Không tìm thấy user.');
      setLoading(false);
      return;
    }
    getUserById(userId)
      .then(data => {
        if (data && (data._id || data.id)) setUser(data);
        else setError('Không tìm thấy user.');
      })
      .catch(() => setError('Lỗi tải thông tin user.'))
      .finally(() => setLoading(false));
  }, []);

  const handleBanUnban = async () => {
    setActionLoading(true);
    setActionMessage("");
    try {
      const userId = user._id || user.id;
      if (user.status === 'banned' || user.status === 'Bị cấm') {
        await unbanUser(userId);
        setActionMessage('✅ Đã gỡ chặn user thành công!');
        setUser({ ...user, status: 'active' });
      } else {
        await banUser(userId);
        setActionMessage('🚫 Đã chặn user thành công!');
        setUser({ ...user, status: 'banned' });
      }
    } catch (err) {
      setActionMessage('❌ Có lỗi xảy ra, vui lòng thử lại!');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return (
    <div style={{padding:32, textAlign:'center'}}>
      <div className="loader" style={{marginBottom:16}}></div>
      <span style={{fontSize:18}}>Đang tải thông tin user...</span>
    </div>
  );
  if (error) return <div style={{color:'red',padding:32, textAlign:'center'}}>{error}</div>;
  if (!user) return null;

  return (
    <div style={{maxWidth:480,margin:'40px auto',background:'linear-gradient(135deg,#f8fafc 0%,#e3f2fd 100%)',borderRadius:20,boxShadow:'0 6px 32px rgba(0,0,0,0.10)',padding:'40px 28px 32px 28px',position:'relative',overflow:'hidden'}}>
      <div style={{display:'flex',flexDirection:'column',alignItems:'center',marginBottom:32}}>
        <button
          onClick={() => window.dispatchEvent(new CustomEvent('changeAdminTab', { detail: 'Users' }))}
          style={{marginBottom:18,padding:'8px 22px',borderRadius:8,background:'#1976d2',color:'#fff',border:'none',fontWeight:'bold',fontSize:16,cursor:'pointer',boxShadow:'0 2px 8px rgba(25,118,210,0.10)',transition:'background 0.2s'}}
        >⬅ Quay lại</button>
        <div style={{display:'flex',alignItems:'center',gap:28}}>
          {user.avatar ? (
            <img src={user.avatar} alt="avatar" style={{width:88,height:88,borderRadius:'50%',objectFit:'cover',boxShadow:'0 2px 12px rgba(25,118,210,0.10)'}} />
          ) : (
            <div style={{width:88,height:88,borderRadius:'50%',background:'#e3eafc',display:'flex',alignItems:'center',justifyContent:'center',fontSize:38,color:'#1976d2',boxShadow:'0 2px 12px rgba(25,118,210,0.10)'}}>
              {user.username?.charAt(0)?.toUpperCase() || user.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
          )}
          <div>
            <div style={{fontWeight:'bold',fontSize:26,marginBottom:6,color:'#222'}}>{user.username || user.name}</div>
            <div style={{fontSize:16,color:'#555',marginBottom:8}}>{user.email}</div>
            <div style={{fontSize:17,display:'flex',alignItems:'center',gap:8}}>
              {user.status==='banned'||user.status==='Bị cấm' ? <span style={{color:'#f44336',fontSize:22}}>🚫</span> : <span style={{color:'#4caf50',fontSize:22}}>✔️</span>}
              <span style={{fontWeight:'bold',color:user.status==='banned'||user.status==='Bị cấm'?'#f44336':'#4caf50'}}>
                {user.status === 'banned' || user.status === 'Bị cấm' ? 'Bị cấm' : 'Đang hoạt động'}
              </span>
            </div>
          </div>
        </div>
      </div>
      <button
        onClick={handleBanUnban}
        disabled={actionLoading}
        style={{width:'100%',padding:'16px 0',borderRadius:10,background:user.status==='banned'||user.status==='Bị cấm'?'#4caf50':'#f44336',color:'#fff',border:'none',fontWeight:'bold',fontSize:20,boxShadow:'0 2px 12px rgba(0,0,0,0.08)',transition:'background 0.2s',marginBottom:8,letterSpacing:1}}
      >
        {actionLoading ? (
          <span style={{display:'inline-flex',alignItems:'center',gap:10}}>
            <span className="loader" style={{width:22,height:22,border:'4px solid #fff',borderTop:'4px solid #eee',borderRadius:'50%',display:'inline-block',animation:'spin 1s linear infinite'}}></span>
            Đang xử lý...
          </span>
        ) : user.status === 'banned' || user.status === 'Bị cấm' ? (
          <span>🔓 Gỡ chặn</span>
        ) : (
          <span>🚫 Chặn user</span>
        )}
      </button>
      {actionMessage && <div style={{marginTop:24,padding:14,background:'#e3f2fd',borderRadius:10,color:'#1976d2',fontWeight:'bold',textAlign:'center',fontSize:17,boxShadow:'0 1px 6px rgba(25,118,210,0.08)'}}>{actionMessage}</div>}
      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .loader { border: 4px solid #eee; border-top: 4px solid #1976d2; border-radius: 50%; width: 22px; height: 22px; animation: spin 1s linear infinite; display: inline-block; }
        @media (max-width: 600px) {
          div[style*='max-width:480px'] { max-width: 98vw !important; padding: 18px 4vw 18px 4vw !important; }
        }
      `}</style>
    </div>
  );
};

export default BanUser;
