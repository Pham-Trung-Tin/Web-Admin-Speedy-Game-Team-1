
import { useEffect, useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const UserDetail = ({ userId }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Lấy userId từ props hoặc localStorage
    const actualUserId = userId || localStorage.getItem("selectedUserId");
    if (!actualUserId) {
      setError('Không tìm thấy ID user');
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    const token = localStorage.getItem("access_token");
    fetch(`${API_BASE_URL}/admin/users/${actualUserId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then(res => {
        if (!res.ok) {
          if (res.status === 401) throw new Error('Unauthorized - Vui lòng đăng nhập lại');
          if (res.status === 404) throw new Error('Không tìm thấy user');
          throw new Error(`HTTP ${res.status} - ${res.statusText}`);
        }
        return res.json();
      })
      .then(data => setUser(data))
      .catch(err => setError(err.message || 'Không thể tải thông tin user'))
      .finally(() => setLoading(false));
  }, [userId]);

  const handleBack = () => {
    window.dispatchEvent(new CustomEvent("changeAdminTab", { detail: "Users" }));
  };

  return (
    <div style={{padding:32, maxWidth:800, margin:'0 auto'}}>
      <div style={{display:'flex', alignItems:'center', marginBottom:24}}>
        <button onClick={handleBack} style={{marginRight:16, padding:'6px 18px', fontSize:16, borderRadius:6, border:'1px solid #2196f3', background:'#fff', color:'#2196f3', cursor:'pointer'}}>← Back</button>
        <h2 style={{textAlign:'center', fontSize:32, fontWeight:'bold', marginBottom:0, borderBottom:'3px solid #2196f3', display:'inline-block', paddingBottom:8}}>User Detail</h2>
      </div>
      {loading ? <p>Đang tải...</p> : error ? <p style={{color:'red'}}>{error}</p> : user ? (
        <div style={{background:'#fff', borderRadius:16, boxShadow:'0 2px 8px rgba(0,0,0,0.08)', padding:32, display:'flex', gap:32}}>
          <div style={{flex:'0 0 120px', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
            <div style={{marginBottom:16}}>
              {user.avatar ? <img src={user.avatar} alt="avatar" style={{width:120, height:120, borderRadius:'50%', boxShadow:'0 2px 8px rgba(0,0,0,0.10)'}} /> : <div style={{width:120, height:120, borderRadius:'50%', background:'#eee', display:'flex', alignItems:'center', justifyContent:'center'}}>N/A</div>}
            </div>
            <div style={{fontWeight:'bold', fontSize:18}}>{user.username}</div>
            <div style={{fontSize:14, color:'#888'}}>ID: {user._id || user.id}</div>
          </div>
          <div style={{flex:1, display:'grid', gridTemplateColumns:'1fr 1fr', gap:24}}>
            <div><label style={{fontWeight:'bold'}}>Email:</label><div>{user.email}</div></div>
            <div><label style={{fontWeight:'bold'}}>Level:</label><div>{user.level}</div></div>
            <div><label style={{fontWeight:'bold'}}>Status:</label><div>{user.status}</div></div>
            <div><label style={{fontWeight:'bold'}}>Role:</label><div>{Array.isArray(user.roles) ? user.roles.join(', ') : user.roles}</div></div>
            <div><label style={{fontWeight:'bold'}}>Total Score:</label><div>{user.totalScore}</div></div>
            <div><label style={{fontWeight:'bold'}}>Bio:</label><div>{user.bio}</div></div>
            <div><label style={{fontWeight:'bold'}}>Email Verified:</label><div>{user.isEmailVerified ? '✔️' : '❌'}</div></div>
            <div><label style={{fontWeight:'bold'}}>Login Fail:</label><div>{user.loginFailCount}</div></div>
            <div><label style={{fontWeight:'bold'}}>Created At:</label><div>{user.createdAt ? new Date(user.createdAt).toLocaleString() : '-'}</div></div>
          </div>
        </div>
      ) : <p>Không tìm thấy user.</p>}
    </div>
  );
};

export default UserDetail;
