
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserList, deleteUser } from '../../../services/userService';
import './UserList.css';

const UserList = () => {
  // Khôi phục trạng thái nếu có
  const userListState = (() => {
    try {
      return JSON.parse(localStorage.getItem("userListState"));
    } catch { return null; }
  })();
  const [usersData, setUsersData] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [userError, setUserError] = useState(null);
  const [limit, setLimit] = useState(userListState?.limit || 10); // tổng số user muốn xem
  const LIMIT_OPTIONS = [10, 20, 30, 50, 75, 100];
  const [currentPage, setCurrentPage] = useState(userListState?.currentPage || 1);
  const [searchText, setSearchText] = useState(userListState?.searchText || "");
  const [statusFilter, setStatusFilter] = useState(userListState?.statusFilter || "");
  const [levelFilter, setLevelFilter] = useState(userListState?.levelFilter || "");
  const navigate = useNavigate();

  // Fetch users with pagination
  const [totalUsers, setTotalUsers] = useState(0);
  useEffect(() => {
    setLoadingUsers(true);
    setUserError(null);
    getUserList({ page: 1, limit })
      .then(data => {
        setUsersData(Array.isArray(data?.items) ? data.items : (Array.isArray(data) ? data : []));
        setTotalUsers(Number(data?.total) || 0);
        // Nếu có userListState thì giữ nguyên currentPage, nếu không thì về 1
        if (!userListState) setCurrentPage(1);
      })
      .catch(err => setUserError('Lỗi tải danh sách user'))
      .finally(() => setLoadingUsers(false));
    // Xóa state sau khi khôi phục để lần sau không bị giữ lại
    if (userListState) localStorage.removeItem("userListState");
  }, [limit]);

  // Tính số trang dựa trên limit, mỗi trang 10 user
  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(Math.min(limit, totalUsers) / pageSize));
  // (Đã khai báo paged sau khi filter ở dưới)

  // Áp dụng filter trước khi phân trang
  let filtered = usersData;
  if (searchText.trim()) {
    const s = searchText.trim().toLowerCase();
    filtered = filtered.filter(u =>
      (u.username && u.username.toLowerCase().includes(s)) ||
      (u.email && u.email.toLowerCase().includes(s)) ||
      (u.name && u.name.toLowerCase().includes(s))
    );
  }
  // Sau khi filter, phân trang
  const paged = Array.isArray(filtered)
    ? filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : [];

  // Lưu trạng thái filter, trang, limit khi chuyển tab
  const saveUserListState = (user) => {
    localStorage.setItem("selectedUserId", user._id || user.id);
    localStorage.setItem("userListState", JSON.stringify({
      currentPage,
      limit,
      searchText,
      statusFilter,
      levelFilter
    }));
  };

  const handleViewUser = (user) => {
    saveUserListState(user);
    window.dispatchEvent(new CustomEvent("changeAdminTab", { detail: "UserDetails" }));
  };

  const handleEditUser = (user) => {
    saveUserListState(user);
    window.dispatchEvent(new CustomEvent("changeAdminTab", { detail: "EditUser" }));
  };

  const handleDeleteUser = async (user) => {
    if(window.confirm(`Bạn có chắc muốn xóa user: ${user.username || user.name}?`)) {
      try {
        await deleteUser(user._id || user.id);
        alert('Đã xóa user thành công');
        // Refresh the user list
        setLoadingUsers(true);
        setUserError(null);
        getUserList()
          .then(data => {
            setUsersData(Array.isArray(data) ? data : (data?.items || []));
            setCurrentPage(1);
          })
          .catch(err => setUserError('Lỗi tải danh sách user'))
          .finally(() => setLoadingUsers(false));
      } catch (error) {
        alert('Lỗi khi xóa user: ' + (error.message || 'Không xác định'));
      }
    }
  };

  return (
    <div className="user-list-wrapper">
      <div className="user-list-header">
        <input
          type="text"
          className="filter-input"
          placeholder="Tìm kiếm theo tên, email..."
          value={searchText}
          onChange={e => { setSearchText(e.target.value); setCurrentPage(1); }}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontWeight: 500, color: '#374151' }}>Xem:</span>
          <select
            className="filter-select"
            value={limit}
            onChange={e => setLimit(Number(e.target.value))}
            style={{ minWidth: 80, fontWeight: 500 }}
          >
            {LIMIT_OPTIONS.map(n => (
              <option key={n} value={n}>{n} User </option>
            ))}
          </select>
        </div>
      </div>

      {loadingUsers ? (
        <div className="loading-state">
          <p>Đang tải danh sách người dùng...</p>
        </div>
      ) : userError ? (
        <div className="error-message">{userError}</div>
  ) : paged.length > 0 ? (
        <>
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Score</th>
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
                      <div className="user-info">
                        <span className="user-username">{user.username}</span>
                        <span className="user-id">ID: {user._id || user.id}</span>
                      </div>
                    </td>
                    <td title={user.email}>{user.email}</td>
                    <td title={String(user.totalScore)}>
                      <span className="user-score">{user.totalScore}</span>
                    </td>
                    <td title={Array.isArray(user.roles) ? user.roles.join(', ') : user.roles}>
                      <div className="user-role-badges">
                        {Array.isArray(user.roles) ? 
                          user.roles.map((role, idx) => (
                            <span key={idx} className={`user-role-badge ${role.toLowerCase()}`}>
                              {role}
                            </span>
                          )) :
                          <span className={`user-role-badge ${(user.roles || '').toLowerCase()}`}>
                            {user.roles}
                          </span>
                        }
                      </div>
                    </td>
                    <td title={user.level}>
                      <span className="user-level-badge">{user.level}</span>
                    </td>
                    <td title={user.avatar}>
                      {user.avatar ? (
                        <div className="user-avatar-cell">
                          <img src={user.avatar} alt="avatar" className="user-avatar-image" />
                        </div>
                      ) : (
                        <span>👤</span>
                      )}
                    </td>
                    <td title={user.bio}>{user.bio || '-'}</td>
                    <td title={user.isEmailVerified ? 'Đã xác thực' : 'Chưa xác thực'}>
                      <span className={user.isEmailVerified ? 'user-status-verified' : 'user-status-unverified'}>
                        {user.isEmailVerified ? '✔️' : '❌'}
                      </span>
                    </td>
                    <td title={user.status}>
                      {user.status && (
                        <span className={`status-badge ${(user.status || '').toLowerCase()}`}>
                          {user.status}
                        </span>
                      )}
                    </td>
                    <td title={String(user.loginFailCount)}>{user.loginFailCount || 0}</td>
                    <td title={user.createdAt ? new Date(user.createdAt).toLocaleString() : '-'}>
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-action" title="Xem" onClick={() => handleViewUser(user)}>
                          View
                        </button>
                        <button className="btn-action" title="Sửa" onClick={() => handleEditUser(user)}>
                          Edit
                        </button>
                        {/* <button
                          className="btn-action danger"
                          title="Xóa user"
                          onClick={() => handleDeleteUser(user)}
                        >
                          🗑️
                        </button> */}
                        <button
                          className="btn-action danger"
                          title="Chặn/Gỡ chặn user"
                          onClick={() => {
                            saveUserListState(user);
                            window.dispatchEvent(new CustomEvent("changeAdminTab", { detail: "BanUser" }));
                          }}
                        >
                          Ban
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="pagination">
            <button
              onClick={() => setCurrentPage(p => Math.max(p-1, 1))}
              disabled={currentPage === 1}
            >
              ← Trước
            </button>
            <span>
              Trang {currentPage} / {totalPages} &nbsp;|&nbsp; Tổng: {Math.min(limit, totalUsers)} user
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(p+1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Tiếp →
            </button>
          </div>
        </>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">👥</div>
          <h3>Không có người dùng nào</h3>
          <p>Hiện tại chưa có người dùng nào trong hệ thống hoặc không khớp với bộ lọc.</p>
          <button className="btn btn-primary">Thêm người dùng mới</button>
        </div>
      )}
    </div>
  );
};

export default UserList;