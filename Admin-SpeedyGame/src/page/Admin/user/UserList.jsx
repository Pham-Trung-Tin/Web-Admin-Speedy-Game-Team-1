
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserList } from '../../../services/userService';
import './UserList.css';

const UserList = () => {
  const [usersData, setUsersData] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [userError, setUserError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setLoadingUsers(true);
    setUserError(null);
    getUserList()
      .then(data => {
        setUsersData(Array.isArray(data) ? data : (data?.items || []));
        setCurrentPage(1);
      })
      .catch(err => setUserError('Lỗi tải danh sách user'))
      .finally(() => setLoadingUsers(false));
  }, []);

  let filtered = usersData;
  if (searchText.trim()) {
    const s = searchText.trim().toLowerCase();
    filtered = filtered.filter(u =>
      (u.username && u.username.toLowerCase().includes(s)) ||
      (u.email && u.email.toLowerCase().includes(s)) ||
      (u.name && u.name.toLowerCase().includes(s))
    );
  }

  const handleViewUser = (user) => {
    localStorage.setItem("selectedUserId", user._id || user.id);
    window.dispatchEvent(new CustomEvent("changeAdminTab", { detail: "UserDetails" }));
  };

  const handleEditUser = (user) => {
    localStorage.setItem("selectedUserId", user._id || user.id);
    window.dispatchEvent(new CustomEvent("changeAdminTab", { detail: "EditUser" }));
  };

  const handleDeleteUser = (user) => {
    if(window.confirm(`Bạn có chắc muốn xóa user: ${user.username || user.name}?`)) {
      alert('Đã xóa user (demo)');
      // Thực tế: gọi API xóa và cập nhật lại danh sách
    }
  };

  if (statusFilter) {
    filtered = filtered.filter(u => {
      const st = (u.status || '').toLowerCase();
      if (statusFilter === 'active') return st === 'active' || st === 'đang hoạt động';
      if (statusFilter === 'banned') return st === 'banned' || st === 'bị cấm';
      if (statusFilter === 'inactive') return st === 'inactive' || st === 'không hoạt động';
      if (statusFilter === 'deleted') return st === 'deleted' || st === 'đã xóa';
      return true;
    });
  }
  if (levelFilter) {
    filtered = filtered.filter(u => {
      if (levelFilter === 'Nhập Môn') return u.level >= 1 && u.level <= 10;
      if (levelFilter === 'Trung cấp') return u.level >= 11 && u.level <= 30;
      if (levelFilter === 'Nâng cao') return u.level >= 31 && u.level <= 50;
      if (levelFilter === 'Chuyên gia') return u.level > 50;
      return true;
    });
  }
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="user-list-wrapper">
      <div className="user-list-header" style={{display:'flex',alignItems:'center',gap:16,marginBottom:16}}>
        <input
          type="text"
          className="filter-input"
          placeholder="Tìm kiếm theo tên, email..."
          value={searchText}
          onChange={e => { setSearchText(e.target.value); setCurrentPage(1); }}
          style={{padding:'8px',borderRadius:4,border:'1px solid #ccc',minWidth:220}}
        />
        <select
          className="filter-select"
          value={statusFilter}
          onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }}
        >
          <option value="">Tất cả trạng thái</option>
          <option value="active">Đang hoạt động</option>
          <option value="banned">Bị cấm</option>
          <option value="inactive">Không hoạt động</option>
          <option value="deleted">Đã xóa</option>
        </select>
        <select
          className="filter-select"
          value={levelFilter}
          onChange={e => { setLevelFilter(e.target.value); setCurrentPage(1); }}
        >
          <option value="">Tất cả cấp độ</option>
          <option value="Nhập Môn">Nhập Môn (1-10)</option>
          <option value="Trung cấp">Trung cấp (11-30)</option>
          <option value="Nâng cao">Nâng cao (31-50)</option>
          <option value="Chuyên gia">Chuyên gia (50+)</option>
        </select>
        <button className="btn btn-primary">+ Thêm người dùng</button>
      </div>

      {loadingUsers ? (
        <p style={{ padding: 24, textAlign: 'center' }}>Đang tải danh sách người dùng...</p>
      ) : userError ? (
        <div style={{ color: 'red', padding: 24 }}>{userError}</div>
      ) : filtered.length > 0 ? (
        <>
          <div style={{overflowX:'auto', width:'100%', maxWidth:'100vw', borderRadius:8, background:'#fff', boxShadow:'0 2px 8px rgba(0,0,0,0.04)', margin:'0 auto'}}>
            <table className="data-table" style={{minWidth:'1100px', width:'100%', borderCollapse:'collapse', borderRadius:8}}>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Total Score</th>
                  <th>Role</th>
                  <th>Level</th>
                  <th>Avatar</th>
                  <th>Bio</th>
                  <th>Email Verified</th>
                  <th>Status</th>
                  <th>Login Fail</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paged.map(user => (
                  <tr key={user._id || user.id}>
                    <td title={(user.username || user.name || user.email) + ' | ID: ' + (user._id || user.id)}>
                      <div style={{display:'flex',flexDirection:'column'}}>
                        <span style={{fontWeight:'bold'}}>{user.username}</span>
                        <span style={{fontSize:'12px',color:'#888'}}>ID: {user._id || user.id}</span>
                      </div>
                    </td>
                    <td title={user.email}>{user.email}</td>
                    <td title={String(user.totalScore)}>{user.totalScore}</td>
                    <td title={Array.isArray(user.roles) ? user.roles.join(', ') : user.roles}>{Array.isArray(user.roles) ? user.roles.join(', ') : user.roles}</td>
                    <td title={user.level}>{user.level}</td>
                    <td title={user.avatar}>{user.avatar ? <img src={user.avatar} alt="avatar" style={{width:32,height:32,borderRadius:'50%'}} /> : 'N/A'}</td>
                    <td title={user.bio}>{user.bio}</td>
                    <td title={user.isEmailVerified ? 'Đã xác thực' : 'Chưa xác thực'}>{user.isEmailVerified ? '✔️' : '❌'}</td>
                    <td title={user.status}>{user.status && <span className={`status-badge ${user.status || ''}`}>{user.status}</span>}</td>
                    <td title={String(user.loginFailCount)}>{user.loginFailCount}</td>
                    <td title={user.createdAt ? new Date(user.createdAt).toLocaleString() : '-'}>{user.createdAt ? new Date(user.createdAt).toLocaleString() : '-'}</td>
                    <td style={{textAlign:'center', verticalAlign:'middle'}}>
                      <div className="action-buttons" style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:'10px',height:'100%'}}>
                        <button className="btn-action" title="Xem" onClick={() => handleViewUser(user)}>👁️</button>
                        <button className="btn-action" title="Sửa" onClick={() => handleEditUser(user)}>✏️</button>
                        <button
                          className="btn-action danger"
                          title="Chặn/Gỡ chặn user"
                          onClick={() => {
                            localStorage.setItem("selectedUserId", user._id || user.id);
                            window.dispatchEvent(new CustomEvent("changeAdminTab", { detail: "BanUser" }));
                          }}
                        >
                          🚫
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="pagination" style={{marginTop:16,display:'flex',alignItems:'center',justifyContent:'center',gap:16}}>
            <button
              onClick={() => setCurrentPage(p => Math.max(p-1, 1))}
              disabled={currentPage === 1}
              style={{padding:'6px 16px'}}>
              Trước
            </button>
            <span>
              Trang {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(p+1, totalPages))}
              disabled={currentPage === totalPages}
              style={{padding:'6px 16px'}}>
              Tiếp
            </button>
          </div>
        </>
      ) : (
        <div>
          <p>Không có người dùng nào.</p>
          <button className="btn btn-primary">Thêm người dùng mới</button>
        </div>
      )}
    </div>
  );
};

export default UserList;