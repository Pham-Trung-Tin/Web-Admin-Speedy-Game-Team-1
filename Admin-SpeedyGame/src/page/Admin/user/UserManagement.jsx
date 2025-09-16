import React, { useState, useEffect } from 'react';
import { getUserList } from '../../../services/userService';
import { deleteUser } from '../../../services/userService';

export default function UserManagement() {
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async (user) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa user ${user.username || user.email}?`)) return;
    try {
      await deleteUser(user._id || user.id);
      setUsers(prev => prev.filter(u => (u._id || u.id) !== (user._id || user.id)));
    } catch (err) {
      alert(err.message || 'Xóa user thất bại!');
    }
  };

  useEffect(() => {
    setLoading(true);
    setError('');
    getUserList()
      .then(data => setUsers(Array.isArray(data) ? data : (data.items || data.users || [])))
      .catch(err => setError('Lỗi tải danh sách user'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter(u =>
    (u.username || '').toLowerCase().includes(search.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-content" style={{padding: 24}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24}}>
        <h2 style={{margin:0,color:'#222'}}>Quản lý User</h2>
        <input
          type="text"
          placeholder="Tìm kiếm theo tên hoặc email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{padding:8,borderRadius:6,border:'1px solid #ccc',minWidth:220}}
        />
      </div>
      <div style={{background:'#fff',borderRadius:12,boxShadow:'0 2px 16px #0001',overflow:'auto'}}>
        {loading ? (
          <div style={{padding:24,textAlign:'center'}}>Đang tải danh sách user...</div>
        ) : error ? (
          <div style={{padding:24,color:'red',textAlign:'center'}}>{error}</div>
        ) : (
          <table style={{width:'100%',minWidth:700,borderCollapse:'collapse'}}>
            <thead>
              <tr style={{background:'#f9fbfd'}}>
                <th style={{padding:12,textAlign:'left',color:'#333'}}>Tên</th>
                <th style={{padding:12,textAlign:'left',color:'#333'}}>Email</th>
                <th style={{padding:12,textAlign:'center',color:'#333'}}>Vai trò</th>
                <th style={{padding:12,textAlign:'center',color:'#333'}}>Cấp độ</th>
                <th style={{padding:12,textAlign:'center',color:'#333'}}>Trạng thái</th>
                <th style={{padding:12,textAlign:'center',color:'#333'}}>Ngày tạo</th>
                <th style={{padding:12,textAlign:'center',color:'#333'}}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} style={{textAlign:'center',padding:24}}>Không tìm thấy user nào</td></tr>
              ) : filtered.map(user => (
                <tr key={user._id || user.id} style={{borderBottom:'1px solid #f0f0f0'}}>
                  <td style={{padding:12}}>
                    <div style={{fontWeight:600}}>{user.username}</div>
                    <div style={{fontSize:12,color:'#888'}}>ID: {user._id || user.id}</div>
                  </td>
                  <td style={{padding:12}}>{user.email}</td>
                  <td style={{padding:12,textAlign:'center'}}>{Array.isArray(user.roles) ? user.roles.join(', ') : user.roles}</td>
                  <td style={{padding:12,textAlign:'center'}}>{user.level}</td>
                  <td style={{padding:12,textAlign:'center'}}>
                    {user.status === 'active' || user.status === 'Active' ? <span style={{background:'#d1fae5',color:'#059669',padding:'2px 10px',borderRadius:8,fontWeight:500}}>Active</span> : <span style={{background:'#fee2e2',color:'#dc2626',padding:'2px 10px',borderRadius:8,fontWeight:500}}>{user.status || 'Banned'}</span>}
                  </td>
                  <td style={{padding:12,textAlign:'center'}}>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}</td>
                  <td style={{padding:12,textAlign:'center'}}>
                    <button style={{marginRight:8,padding:'4px 10px',borderRadius:6,border:'none',background:'#3b82f6',color:'#fff',fontWeight:500,cursor:'pointer'}}>Sửa</button>
                    <button style={{padding:'4px 10px',borderRadius:6,border:'none',background:'#ef4444',color:'#fff',fontWeight:500,cursor:'pointer'}} onClick={() => handleDelete(user)}>Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}