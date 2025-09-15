import { useState, useEffect } from 'react'
import { getUserList } from '../../../services/UserService'
import './UserList.css'

const UserList = () => {
  const [usersData, setUsersData] = useState([])
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [userError, setUserError] = useState(null)

  useEffect(() => {
    setLoadingUsers(true)
    setUserError(null)
    getUserList()
      .then(data => {
        setUsersData(Array.isArray(data) ? data : (data?.items || []))
      })
      .catch(err => setUserError('Lỗi tải danh sách user'))
      .finally(() => setLoadingUsers(false))
  }, [])

  return (
    <div className="page-content">
      <div className="page-header">
        <div className="page-title-section">
          <h1 className="page-title">Users Management</h1>
          <p className="page-subtitle">Manage and monitor all registered users</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-secondary">📤 Export Users</button>
          <button className="btn btn-primary">👤 Add New User</button>
        </div>
      </div>

      <div className="content-section">
        <div className="table-header">
          <div className="table-filters">
            <input type="text" placeholder="🔍 Search users..." className="search-input" />
            <select className="filter-select">
              <option>All Status</option>
              <option>Active</option>
              <option>Banned</option>
              <option>Inactive</option>
            </select>
            <select className="filter-select">
              <option>All Levels</option>
              <option>Beginner (1-10)</option>
              <option>Intermediate (11-30)</option>
              <option>Advanced (31-50)</option>
              <option>Expert (50+)</option>
            </select>
          </div>
        </div>

        {loadingUsers ? (
          <div style={{ padding: 24, textAlign: 'center' }}>Đang tải danh sách user...</div>
        ) : userError ? (
          <div style={{ color: 'red', padding: 24 }}>{userError}</div>
        ) : (
          <div className="table-container" style={{overflowX:'auto',overflowY:'auto',maxWidth:'100vw',maxHeight:'600px',height:'auto',paddingBottom:2}} onMouseEnter={e => {e.currentTarget.style.overflowX='auto'}} onMouseLeave={e => {e.currentTarget.style.overflowX='hidden'}}>
            <table className="data-table" style={{minWidth:'1200px'}}>
              <thead>
                <tr style={{position:'sticky',top:0,background:'#f9fbfd',zIndex:2}}>
                  <th style={{position:'sticky',top:0,background:'#f9fbfd',zIndex:2}}>User</th>
                  <th style={{position:'sticky',top:0,background:'#f9fbfd',zIndex:2}}>Email</th>
                  <th style={{position:'sticky',top:0,background:'#f9fbfd',zIndex:2}}>Total Score</th>
                  <th style={{position:'sticky',top:0,background:'#f9fbfd',zIndex:2}}>Roles</th>
                  <th style={{position:'sticky',top:0,background:'#f9fbfd',zIndex:2}}>Level</th>
                  <th style={{position:'sticky',top:0,background:'#f9fbfd',zIndex:2}}>Avatar</th>
                  <th style={{position:'sticky',top:0,background:'#f9fbfd',zIndex:2}}>Bio</th>
                  <th style={{position:'sticky',top:0,background:'#f9fbfd',zIndex:2}}>Email Verified</th>
                  <th style={{position:'sticky',top:0,background:'#f9fbfd',zIndex:2}}>Status</th>
                  <th style={{position:'sticky',top:0,background:'#f9fbfd',zIndex:2}}>Login Fail Count</th>
                  <th style={{position:'sticky',top:0,background:'#f9fbfd',zIndex:2}}>Created At</th>
                  <th style={{position:'sticky',top:0,background:'#f9fbfd',zIndex:2}}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {usersData.length === 0 ? (
                  <tr><td colSpan="13" style={{textAlign:'center'}}>Không có user nào</td></tr>
                ) : usersData.map(user => (
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
                    <td>
                      <div className="action-buttons">
                        <button className="btn-action">👁️</button>
                        <button className="btn-action">✏️</button>
                        <button className="btn-action danger">🚫</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default UserList