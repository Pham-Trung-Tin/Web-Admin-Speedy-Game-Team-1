import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../../services/authService'
import AdminLeaderBoard from './leaderboard/AdminLeaderBoard'
import './Admin.css'

const Admin = () => {
  const [activeTab, setActiveTab] = useState('Dashboard')
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      // Xóa dữ liệu xác thực
      authService.logout()
      localStorage.removeItem('authData')
      
      // Redirect về trang login
      navigate('/login')
    }
  }

  // Navigation menu structure based on API endpoints
  const menuGroups = [
    {
      title: 'Overview',
      items: [
        { id: 'Dashboard', icon: '📊', label: 'Dashboard', active: activeTab === 'Dashboard' }
      ]
    },
    {
      title: 'Game Rooms (Admin)',
      items: [
        { id: 'GameRooms', icon: '🏠', label: 'List Rooms', active: activeTab === 'GameRooms' },
        { id: 'CreateRoom', icon: '➕', label: 'Create Room', active: activeTab === 'CreateRoom' },
        { id: 'RoomDetails', icon: '📋', label: 'Room Details', active: activeTab === 'RoomDetails' }
      ]
    },
    {
      title: 'Game Sessions',
      items: [
        { id: 'GameSessions', icon: '🎮', label: 'List Sessions', active: activeTab === 'GameSessions' },
        { id: 'SessionsByRoom', icon: '🏠', label: 'Filter by Room', active: activeTab === 'SessionsByRoom' },
        { id: 'SessionsByPlayer', icon: '👤', label: 'Filter by Player', active: activeTab === 'SessionsByPlayer' }
      ]
    },
    {
      title: 'Users (Admin)',
      items: [
        { id: 'Users', icon: '👥', label: 'User List', active: activeTab === 'Users' },
        { id: 'CreateUser', icon: '👤', label: 'Create User', active: activeTab === 'CreateUser' },
        { id: 'UserManagement', icon: '⚙️', label: 'User Management', active: activeTab === 'UserManagement' }
      ]
    },
    {
      title: 'Auth Management',
      items: [
        { id: 'AuthSettings', icon: '🔐', label: 'Auth Settings', active: activeTab === 'AuthSettings' },
        { id: 'PasswordReset', icon: '🔑', label: 'Reset Password', active: activeTab === 'PasswordReset' }
      ]
    },
    {
      title: 'Leaderboard',
      items: [
        { id: 'AllTimeLeaders', icon: '🏆', label: 'Top All-time', active: activeTab === 'AllTimeLeaders' },
        { id: 'WeeklyLeaders', icon: '📅', label: 'Weekly/Monthly', active: activeTab === 'WeeklyLeaders' },
        { id: 'PlayerSessions', icon: '🎯', label: 'Player Sessions', active: activeTab === 'PlayerSessions' }
      ]
    }
  ]

  // Mock data for different sections
  const dashboardStats = [
    { icon: '👥', value: '12,847', label: 'Active Users', change: '+12.5%', color: 'blue' },
    { icon: '🏠', value: '1,429', label: 'Active Rooms', change: '+8.2%', color: 'green' },
    { icon: '🎮', value: '3,247', label: 'Game Sessions', change: '+15.3%', color: 'purple' },
    { icon: '🏆', value: '847', label: 'Completed Games', change: '+23.1%', color: 'orange' }
  ]

  const recentActivities = [
    { id: 1, type: 'room', message: 'New room "Speed Championship" created', time: '5 min ago', user: 'Admin' },
    { id: 2, type: 'user', message: 'User "SpeedMaster99" joined the platform', time: '12 min ago', user: 'System' },
    { id: 3, type: 'session', message: 'Game session #1429 completed', time: '18 min ago', user: 'System' },
    { id: 4, type: 'leaderboard', message: 'New weekly champion: FastClicker', time: '25 min ago', user: 'System' }
  ]

  // Sample data for game rooms
  const gameRoomsData = [
    { id: 1, name: 'Speed Championship', code: 'SC001', players: 24, maxPlayers: 32, status: 'active', created: '2024-09-10', creator: 'Admin' },
    { id: 2, name: 'Quick Match Arena', code: 'QM002', players: 8, maxPlayers: 16, status: 'waiting', created: '2024-09-10', creator: 'ProGamer' },
    { id: 3, name: 'Tournament Final', code: 'TF003', players: 16, maxPlayers: 16, status: 'live', created: '2024-09-09', creator: 'Admin' },
    { id: 4, name: 'Practice Room', code: 'PR004', players: 3, maxPlayers: 8, status: 'active', created: '2024-09-09', creator: 'Newbie123' }
  ]

  const gameSessionsData = [
    { id: 1, roomName: 'Speed Championship', player: 'SpeedMaster99', score: 2847, duration: '15:23', status: 'completed', startTime: '14:30' },
    { id: 2, roomName: 'Quick Match Arena', player: 'FastClicker', score: 1592, duration: '08:45', status: 'ongoing', startTime: '15:15' },
    { id: 3, roomName: 'Tournament Final', player: 'ProGamer', score: 3156, duration: '12:11', status: 'completed', startTime: '13:45' },
    { id: 4, roomName: 'Practice Room', player: 'Newbie123', score: 845, duration: '05:33', status: 'ongoing', startTime: '15:45' }
  ]

  const usersData = [
    { id: 1, username: 'SpeedMaster99', email: 'speed@example.com', level: 47, totalClicks: 234567, status: 'active', joinDate: '2024-01-15', lastActive: '2 min ago' },
    { id: 2, username: 'FastClicker', email: 'fast@example.com', level: 32, totalClicks: 156789, status: 'active', joinDate: '2024-02-20', lastActive: '5 min ago' },
    { id: 3, username: 'ProGamer', email: 'pro@example.com', level: 55, totalClicks: 445632, status: 'active', joinDate: '2023-12-05', lastActive: '1 hour ago' },
    { id: 4, username: 'Newbie123', email: 'newbie@example.com', level: 8, totalClicks: 12456, status: 'banned', joinDate: '2024-03-10', lastActive: '2 days ago' }
  ]

  // Render functions for different sections
  const renderDashboard = () => (
    <div className="dashboard-overview">
      <div className="page-header">
        <div className="page-title-section">
          <h1 className="page-title">Dashboard Overview</h1>
          <p className="page-subtitle">Monitor your Speedy Clicker game performance and user activity</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-secondary">📊 View Reports</button>
          <button className="btn btn-primary">🔄 Refresh Data</button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        {dashboardStats.map((stat, index) => (
          <div key={index} className={`stat-card ${stat.color}`}>
            <div className="stat-header">
              <div className="stat-icon">{stat.icon}</div>
              <span className="stat-change positive">{stat.change}</span>
            </div>
            <div className="stat-content">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="chart-container">
          <div className="chart-header">
            <h3>User Activity Trends</h3>
            <select className="chart-filter">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Last 90 Days</option>
            </select>
          </div>
          <div className="chart-placeholder">
            <div className="bar-chart">
              <div className="bar" style={{height: '60%'}}><span>Mon</span></div>
              <div className="bar" style={{height: '80%'}}><span>Tue</span></div>
              <div className="bar" style={{height: '45%'}}><span>Wed</span></div>
              <div className="bar" style={{height: '90%'}}><span>Thu</span></div>
              <div className="bar" style={{height: '70%'}}><span>Fri</span></div>
              <div className="bar" style={{height: '85%'}}><span>Sat</span></div>
              <div className="bar" style={{height: '95%'}}><span>Sun</span></div>
            </div>
          </div>
        </div>

        <div className="chart-container">
          <div className="chart-header">
            <h3>Room Types Distribution</h3>
          </div>
          <div className="pie-chart">
            <div className="pie-center">
              <div className="pie-value">1,429</div>
              <div className="pie-label">Total Rooms</div>
            </div>
            <div className="pie-legend">
              <div className="legend-item">
                <span className="legend-color active"></span>
                <span>Active (60%)</span>
              </div>
              <div className="legend-item">
                <span className="legend-color waiting"></span>
                <span>Waiting (25%)</span>
              </div>
              <div className="legend-item">
                <span className="legend-color live"></span>
                <span>Live (15%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="recent-activities">
        <div className="activity-header">
          <h3>Recent Activities</h3>
          <button className="btn-link">View All</button>
        </div>
        <div className="activity-list">
          {recentActivities.map(activity => (
            <div key={activity.id} className="activity-item">
              <div className={`activity-icon ${activity.type}`}>
                {activity.type === 'room' ? '🏠' : 
                 activity.type === 'user' ? '👤' : 
                 activity.type === 'session' ? '🎮' : '🏆'}
              </div>
              <div className="activity-content">
                <div className="activity-message">{activity.message}</div>
                <div className="activity-meta">
                  <span className="activity-user">{activity.user}</span>
                  <span className="activity-time">{activity.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderGameRooms = () => (
    <div className="page-content">
      <div className="page-header">
        <div className="page-title-section">
          <h1 className="page-title">Game Rooms Management</h1>
          <p className="page-subtitle">Manage and monitor all game rooms</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-secondary">📤 Export</button>
          <button className="btn btn-primary">➕ Create New Room</button>
        </div>
      </div>

      <div className="content-section">
        <div className="table-header">
          <div className="table-filters">
            <input type="text" placeholder="🔍 Search rooms..." className="search-input" />
            <select className="filter-select">
              <option>All Status</option>
              <option>Active</option>
              <option>Waiting</option>
              <option>Live</option>
              <option>Completed</option>
            </select>
            <select className="filter-select">
              <option>All Types</option>
              <option>Tournament</option>
              <option>Casual</option>
              <option>Practice</option>
            </select>
          </div>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Room Name</th>
                <th>Room Code</th>
                <th>Players</th>
                <th>Status</th>
                <th>Created</th>
                <th>Creator</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {gameRoomsData.map(room => (
                <tr key={room.id}>
                  <td>
                    <div className="room-info">
                      <div className="room-icon">🏠</div>
                      <div className="room-name">{room.name}</div>
                    </div>
                  </td>
                  <td><span className="room-code">{room.code}</span></td>
                  <td>
                    <span className="player-count">
                      {room.players}/{room.maxPlayers}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${room.status}`}>
                      {room.status}
                    </span>
                  </td>
                  <td>{room.created}</td>
                  <td>{room.creator}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-action">👁️</button>
                      <button className="btn-action">✏️</button>
                      <button className="btn-action danger">🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <button className="btn btn-secondary">Previous</button>
          <span className="pagination-info">Showing 1-4 of 1,429 rooms</span>
          <button className="btn btn-secondary">Next</button>
        </div>
      </div>
    </div>
  )

  const renderGameSessions = () => (
    <div className="page-content">
      <div className="page-header">
        <div className="page-title-section">
          <h1 className="page-title">Game Sessions</h1>
          <p className="page-subtitle">Monitor all active and completed game sessions</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-secondary">📊 Analytics</button>
          <button className="btn btn-primary">🔄 Refresh</button>
        </div>
      </div>

      <div className="content-section">
        <div className="table-header">
          <div className="table-filters">
            <input type="text" placeholder="🔍 Search sessions..." className="search-input" />
            <select className="filter-select">
              <option>All Status</option>
              <option>Ongoing</option>
              <option>Completed</option>
              <option>Paused</option>
            </select>
            <select className="filter-select">
              <option>All Rooms</option>
              <option>Speed Championship</option>
              <option>Quick Match Arena</option>
              <option>Tournament Final</option>
            </select>
          </div>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Session ID</th>
                <th>Room</th>
                <th>Player</th>
                <th>Score</th>
                <th>Duration</th>
                <th>Status</th>
                <th>Start Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {gameSessionsData.map(session => (
                <tr key={session.id}>
                  <td><span className="session-id">#{session.id}</span></td>
                  <td>{session.roomName}</td>
                  <td>
                    <div className="player-info">
                      <div className="player-avatar">👤</div>
                      <span>{session.player}</span>
                    </div>
                  </td>
                  <td><span className="score">{session.score.toLocaleString()}</span></td>
                  <td>{session.duration}</td>
                  <td>
                    <span className={`status-badge ${session.status}`}>
                      {session.status}
                    </span>
                  </td>
                  <td>{session.startTime}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-action">👁️</button>
                      <button className="btn-action">📊</button>
                      <button className="btn-action">📤</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  const renderUsers = () => (
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

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Level</th>
                <th>Total Clicks</th>
                <th>Status</th>
                <th>Join Date</th>
                <th>Last Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {usersData.map(user => (
                <tr key={user.id}>
                  <td>
                    <div className="user-info">
                      <div className="user-avatar">👤</div>
                      <div className="user-details">
                        <div className="username">{user.username}</div>
                        <div className="user-id">ID: {user.id}</div>
                      </div>
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td><span className="level-badge">Level {user.level}</span></td>
                  <td><span className="click-count">{user.totalClicks.toLocaleString()}</span></td>
                  <td>
                    <span className={`status-badge ${user.status}`}>
                      {user.status}
                    </span>
                  </td>
                  <td>{user.joinDate}</td>
                  <td>{user.lastActive}</td>
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
      </div>
    </div>
  )

  const renderAllTimeLeaders = () => (
    <AdminLeaderBoard />
  )

  const renderDefaultContent = () => (
    <div className="page-content">
      <div className="page-header">
        <div className="page-title-section">
          <h1 className="page-title">{activeTab}</h1>
          <p className="page-subtitle">This section is under development</p>
        </div>
      </div>
      <div className="content-section">
        <div className="placeholder-content">
          <div className="placeholder-icon">🚧</div>
          <h3>Coming Soon</h3>
          <p>This feature is currently being developed and will be available soon.</p>
        </div>
      </div>
    </div>
  )

  return (
    <div className="admin-container">
      {/* Header */}
      <header className="admin-header">
        <div className="header-left">
          <div className="logo">
            <span className="logo-icon">⚡</span>
            <span className="logo-text">Speedy Clicker</span>
          </div>
        </div>
        
        <div className="header-right">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search..."
              className="search-input"
            />
            <button className="search-btn">🔍</button>
          </div>
          
          <div className="header-icons">
            <button className="icon-btn">🔔</button>
          </div>
          
          <div className="admin-profile" onClick={() => setShowProfileDropdown(!showProfileDropdown)}>
            <div className="profile-avatar">
              <span>JD</span>
            </div>
            {showProfileDropdown && (
              <div className="profile-dropdown">
                <div className="dropdown-item">👤 Profile</div>
                <div className="dropdown-item">⚙️ Settings</div>
                <div className="dropdown-divider"></div>
                <div className="dropdown-item" onClick={handleLogout}>🚪 Logout</div>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="admin-layout">
        {/* Sidebar */}
        <aside className="sidebar">
          <nav className="sidebar-nav">
            {menuGroups.map((group, groupIndex) => (
              <div key={groupIndex} className="nav-group">
                <div className="nav-group-title">{group.title}</div>
                {group.items.map(item => (
                  <button
                    key={item.id}
                    className={`nav-item ${item.active ? 'active' : ''}`}
                    onClick={() => setActiveTab(item.id)}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    <span className="nav-label">{item.label}</span>
                  </button>
                ))}
              </div>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          {activeTab === 'Dashboard' && renderDashboard()}
          {activeTab === 'GameRooms' && renderGameRooms()}
          {activeTab === 'GameSessions' && renderGameSessions()}
          {activeTab === 'Users' && renderUsers()}
          {activeTab === 'AllTimeLeaders' && renderAllTimeLeaders()}
          {!['Dashboard', 'GameRooms', 'GameSessions', 'Users', 'AllTimeLeaders'].includes(activeTab) && renderDefaultContent()}
        </main>
      </div>
    </div>
  )
}

export default Admin
