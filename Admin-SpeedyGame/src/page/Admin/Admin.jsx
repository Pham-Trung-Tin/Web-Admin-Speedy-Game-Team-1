import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../../services/authService'
import CreateUser from './user/CreateUser'
import AdminLeaderBoard from './leaderboard/AdminLeaderBoard'
import UserList from './user/UserList'
import UserManagement from './user/UserManagement'
import CreateRoom from './gameRooms/CreateRoom'
import RoomDetail from './gameRooms/RoomDetail'
import ListRooms from './gameRooms/ListRooms'
import FilterByRoom from "./FilterByRoom";
import FilterByPlayer from "./FilterByPlayer";
import './Admin.css'
import ListSessions from './ListSessions'

// ---- Config: quyền hạn cho admin ----
const ALLOWED_ROLES = ["ADMIN", "staff"];
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Hàm kiểm tra quyền hạn
const getUserRoles = () => {
  try {
    const raw = localStorage.getItem('user_profile');
    if (raw) {
      const p = JSON.parse(raw);
      return p.role || p.roles || [];
    }
  } catch {}
  
  const rawGlobal = (typeof window !== "undefined" &&
    (window.__USER__?.roles || window.APP_USER?.roles)) || [];
  return Array.isArray(rawGlobal) ? rawGlobal : [];
};

const hasAccessByRoles = (roles) => {
  const norm = roles.map((r) => String(r).toUpperCase());
  return norm.some((r) =>
    ALLOWED_ROLES.map((x) => String(x).toUpperCase()).includes(r)
  );
};

// --- API fetch functions ---
const fetchDashboardStats = async () => {
  const token = localStorage.getItem('access_token');
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  // Parallel fetch for all stats
  const [users, rooms, sessions, completed] = await Promise.all([
    fetch(`${API_BASE_URL}/admin/users`, { headers }).then(r => r.json()).catch(() => ({})),
    fetch(`${API_BASE_URL}/admin/game-rooms`, { headers }).then(r => r.json()).catch(() => ({})),
    fetch(`${API_BASE_URL}/game-sessions`, { headers }).then(r => r.json()).catch(() => ({})),
    fetch(`${API_BASE_URL}/game-sessions?status=completed`, { headers }).then(r => r.json()).catch(() => ({})),
  ]);
  return {
    users: users.total || (Array.isArray(users.items) ? users.items.length : 0),
    rooms: rooms.total || (Array.isArray(rooms.items) ? rooms.items.length : 0),
    sessions: sessions.total || (Array.isArray(sessions.items) ? sessions.items.length : 0),
    completed: completed.total || (Array.isArray(completed.items) ? completed.items.length : 0),
  };
};

// Fetch user activity trends (7 days)
const fetchUserActivityTrends = async () => {
  const token = localStorage.getItem('access_token');
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  // TODO: Replace with real API if available
  // const res = await fetch(`${API_BASE_URL}/admin/users/activity?period=7d`, { headers });
  // const data = await res.json();
  // return data.days; // [{day: 'Mon', count: 123}, ...]
  // Mock data:
  return [
    { day: 'Mon', count: 120 },
    { day: 'Tue', count: 180 },
    { day: 'Wed', count: 90 },
    { day: 'Thu', count: 200 },
    { day: 'Fri', count: 150 },
    { day: 'Sat', count: 170 },
    { day: 'Sun', count: 210 }
  ];
};

// Fetch room types distribution
const fetchRoomTypesDistribution = async () => {
  const token = localStorage.getItem('access_token');
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  // Fetch all rooms and group by status
  const res = await fetch(`${API_BASE_URL}/admin/game-rooms`, { headers });
  const data = await res.json();
  const items = data.items || [];
  const counts = { active: 0, waiting: 0, live: 0 };
  items.forEach(room => {
    if (room.status === 'active') counts.active += 1;
    else if (room.status === 'waiting') counts.waiting += 1;
    else if (room.status === 'live') counts.live += 1;
  });
  return counts;
};

const fetchRecentActivities = async () => {
  const token = localStorage.getItem('access_token');
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  // Fetch data song song
  const [rooms, users, sessions, leaderboard] = await Promise.all([
    fetch(`${API_BASE_URL}/admin/game-rooms?sort=createdAt:desc&limit=1`, { headers }).then(r => r.json()).catch(() => ({})),
    fetch(`${API_BASE_URL}/admin/users?sort=createdAt:desc&limit=1`, { headers }).then(r => r.json()).catch(() => ({})),
    fetch(`${API_BASE_URL}/game-sessions?status=completed&sort=endedAt:desc&limit=1`, { headers }).then(r => r.json()).catch(() => ({})),
    fetch(`${API_BASE_URL}/leaderboard/top-period?period=week`, { headers }).then(r => r.json()).catch(() => ({})),
  ]);

  const activities = [];

  // New room created
  if (rooms.items && rooms.items[0]) {
    activities.push({
      id: 'room',
      type: 'room',
      message: `New room "${rooms.items[0].name}" created`,
      time: rooms.items[0].createdAt ? new Date(rooms.items[0].createdAt).toLocaleString() : '',
      user: rooms.items[0].createdBy || 'Admin'
    });
  }

  // New user joined
  if (users.items && users.items[0]) {
    activities.push({
      id: 'user',
      type: 'user',
      message: `User "${users.items[0].username || users.items[0].email}" joined the platform`,
      time: users.items[0].createdAt ? new Date(users.items[0].createdAt).toLocaleString() : '',
      user: 'System'
    });
  }

  // Game session completed
  if (sessions.items && sessions.items[0]) {
    activities.push({
      id: 'session',
      type: 'session',
      message: `Game session #${sessions.items[0].id} completed`,
      time: sessions.items[0].endedAt ? new Date(sessions.items[0].endedAt).toLocaleString() : '',
      user: 'System'
    });
  }

  // New weekly champion
  if (leaderboard.items && leaderboard.items[0]) {
    activities.push({
      id: 'leaderboard',
      type: 'leaderboard',
      message: `New weekly champion: ${leaderboard.items[0].username || leaderboard.items[0].name}`,
      time: new Date().toLocaleString(),
      user: 'System'
    });
  }

  return activities;
};

const Admin = () => {
  const [activeTab, setActiveTab] = useState('Dashboard')
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const [userProfile, setUserProfile] = useState(null)
  const [dashboardStats, setDashboardStats] = useState([
    { icon: '👥', value: '...', label: 'Active Users', change: '', color: 'blue' },
    { icon: '🏠', value: '...', label: 'Active Rooms', change: '', color: 'green' },
    { icon: '🎮', value: '...', label: 'Game Sessions', change: '', color: 'purple' },
    { icon: '🏆', value: '...', label: 'Completed Games', change: '', color: 'orange' }
  ]);
  const [loadingStats, setLoadingStats] = useState(false);
  const [userTrends, setUserTrends] = useState([]);
  const [roomTypes, setRoomTypes] = useState({ active: 0, waiting: 0, live: 0 });
  const [recentActivities, setRecentActivities] = useState([]);
  const navigate = useNavigate()

  // Kiểm tra quyền hạn
  const roles = getUserRoles();
  const hasAccess = hasAccessByRoles(roles);

  // Load user profile từ localStorage
  useEffect(() => {
    try {
      const userProfileData = localStorage.getItem('user_profile');
      if (userProfileData) {
        const profile = JSON.parse(userProfileData);
        setUserProfile(profile);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  }, []);

  // Lắng nghe sự kiện thay đổi tab từ các component con
  useEffect(() => {
    const handleTabChange = (event) => {
      setActiveTab(event.detail);
    };

    window.addEventListener("changeAdminTab", handleTabChange);
    
    return () => {
      window.removeEventListener("changeAdminTab", handleTabChange);
    };
  }, []);

  // Fetch dashboard stats on mount or refresh
  const loadStats = async () => {
    setLoadingStats(true);
    const stats = await fetchDashboardStats();
    setDashboardStats([
      { icon: '👥', value: stats.users.toLocaleString(), label: 'Active Users', change: '', color: 'blue' },
      { icon: '🏠', value: stats.rooms.toLocaleString(), label: 'Active Rooms', change: '', color: 'green' },
      { icon: '🎮', value: stats.sessions.toLocaleString(), label: 'Game Sessions', change: '', color: 'purple' },
      { icon: '🏆', value: stats.completed.toLocaleString(), label: 'Completed Games', change: '', color: 'orange' }
    ]);
    setLoadingStats(false);
  };

  // Fetch charts data
  useEffect(() => {
    fetchUserActivityTrends().then(setUserTrends);
    fetchRoomTypesDistribution().then(setRoomTypes);
  }, []);

  // Fetch recent activities
  useEffect(() => {
    fetchRecentActivities().then(setRecentActivities);
  }, []);

  useEffect(() => {
    if (activeTab === 'Dashboard') {
      loadStats();
    }
    // eslint-disable-next-line
  }, [activeTab]);

  // Nếu không có quyền, hiển thị thông báo
  if (!hasAccess) {
    return (
      <div className="access-denied">
        <div className="access-denied-icon">🔒</div>
        <h1>Access Denied</h1>
        <p>You don't have permission to access the Admin Panel.</p>
        <p>Required roles: <strong>ADMIN</strong> or <strong>staff</strong></p>
        <button 
          className="btn btn-primary" 
          onClick={() => navigate('/login')}
        >
          Back to Login
        </button>
      </div>
    );
  }

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
        { id: 'CreateRoom', icon: '➕', label: 'Create Room', active: activeTab === 'CreateRoom' }
        
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
      title: 'Leaderboard',
      items: [
        { id: 'AllTimeLeaders', icon: '🏆', label: 'Top All-time', active: activeTab === 'AllTimeLeaders' }
       
      ]
    }
  ]

  // Recent activities vẫn dùng mock, bạn có thể fetch thêm nếu muốn
  const recentActivitiesMock = [
    { id: 1, type: 'room', message: 'New room "Speed Championship" created', time: '5 min ago', user: 'Admin' },
    { id: 2, type: 'user', message: 'User "SpeedMaster99" joined the platform', time: '12 min ago', user: 'System' },
    { id: 3, type: 'session', message: 'Game session #1429 completed', time: '18 min ago', user: 'System' },
    { id: 4, type: 'leaderboard', message: 'New weekly champion: FastClicker', time: '25 min ago', user: 'System' }
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
          <button className="btn btn-primary" onClick={loadStats} disabled={loadingStats}>
            {loadingStats ? 'Loading...' : '🔄 Refresh Data'}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        {dashboardStats.map((stat, index) => (
          <div key={index} className={`stat-card ${stat.color}`}>
            <div className="stat-header">
              <div className="stat-icon">{stat.icon}</div>
              {stat.change && <span className="stat-change positive">{stat.change}</span>}
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
              {userTrends.map((item, idx) => (
                <div
                  key={item.day}
                  className="bar"
                  style={{
                    height: `${Math.max(10, (item.count / Math.max(...userTrends.map(u => u.count), 1)) * 100)}%`
                  }}
                >
                  <span>{item.day}</span>
                  <div className="bar-value">{item.count}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="chart-container">
          <div className="chart-header">
            <h3>Room Types Distribution</h3>
          </div>
          <div className="pie-chart">
            <div className="pie-center">
              <div className="pie-value">
                {roomTypes.active + roomTypes.waiting + roomTypes.live}
              </div>
              <div className="pie-label">Total Rooms</div>
            </div>
            {/* Pie chart can be improved with a real chart lib, here is a simple legend */}
            <div className="pie-legend">
              <div className="legend-item">
                <span className="legend-color active"></span>
                <span>
                  Active ({roomTypes.active} - {Math.round((roomTypes.active / Math.max(1, roomTypes.active + roomTypes.waiting + roomTypes.live)) * 100)}%)
                </span>
              </div>
              <div className="legend-item">
                <span className="legend-color waiting"></span>
                <span>
                  Waiting ({roomTypes.waiting} - {Math.round((roomTypes.waiting / Math.max(1, roomTypes.active + roomTypes.waiting + roomTypes.live)) * 100)}%)
                </span>
              </div>
              <div className="legend-item">
                <span className="legend-color live"></span>
                <span>
                  Live ({roomTypes.live} - {Math.round((roomTypes.live / Math.max(1, roomTypes.active + roomTypes.waiting + roomTypes.live)) * 100)}%)
                </span>
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
          {recentActivities.length > 0 ? recentActivities.map(activity => (
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
          )) : (
            <div className="no-activities">
              <p>No recent activities found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  const renderGameRooms = () => (
    <ListRooms />
  )

  const renderCreateRoom = () => (
    <CreateRoom />
  )

  const renderRoomDetails = () => (
    <RoomDetail />
  )

  const renderGameSessions = () => (
   <ListSessions/>
  )

  const renderUsers = () => (
    <UserList />
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
            {userProfile?.avatar ? (
              <img 
                src={userProfile.avatar} 
                alt={userProfile.username || userProfile.fullName || 'User'}
                className="profile-avatar-img"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div 
              className="profile-avatar" 
              style={{ display: userProfile?.avatar ? 'none' : 'flex' }}
            >
              <span>
                {userProfile?.fullName?.charAt(0)?.toUpperCase() || 
                 userProfile?.username?.charAt(0)?.toUpperCase() || 
                 'A'}
              </span>
            </div>
            {showProfileDropdown && (
              <div className="profile-dropdown">
                <div className="dropdown-item" onClick={() => {navigate('/admin/profile'); setShowProfileDropdown(false)}}>👤 Profile</div>
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
          {activeTab === 'CreateRoom' && renderCreateRoom()}
          {activeTab === 'RoomDetails' && renderRoomDetails()}
          {activeTab === 'GameSessions' && renderGameSessions()}
          {activeTab === 'SessionsByRoom' && <FilterByRoom />}
          {activeTab === 'SessionsByPlayer' && <FilterByPlayer />}
          {activeTab === 'Users' && renderUsers()}
          {activeTab === 'AllTimeLeaders' && renderAllTimeLeaders()}
          {activeTab === 'CreateUser' && <CreateUser onSuccess={() => setActiveTab('Users')} />}
          {activeTab === 'UserManagement' && <UserManagement />}
          {!['Dashboard', 'GameRooms', 'CreateRoom', 'RoomDetails', 'GameSessions', 'SessionsByRoom','SessionsByPlayer','Users', 'AllTimeLeaders', 'CreateUser', 'UserManagement'].includes(activeTab) && renderDefaultContent()}
        </main>
      </div>
    </div>
  )
}

export default Admin
