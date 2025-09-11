import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Admin.css'

const Admin = () => {
  const [activeTab, setActiveTab] = useState('Dashboard')
  const navigate = useNavigate()

  const handleLogout = () => {
    // Handle logout logic here
    navigate('/login')
  }

  const statsData = [
    {
      icon: '👥',
      iconClass: 'players',
      value: '24,847',
      label: 'Total Players',
      change: '+12%',
      changeType: 'positive'
    },
    {
      icon: '🎮',
      iconClass: 'games',
      value: '1,429',
      label: 'Active Games',
      change: '+8%',
      changeType: 'positive'
    },
    {
      icon: '$',
      iconClass: 'revenue',
      value: '$89,247',
      label: 'Monthly Revenue',
      change: '+23%',
      changeType: 'positive'
    },
    {
      icon: '🏆',
      iconClass: 'tournaments',
      value: '847',
      label: 'Tournaments',
      change: '-3%',
      changeType: 'negative'
    }
  ]

  const recentPlayers = [
    {
      id: 1,
      name: 'Sarah Johnson',
      level: 'Level 47',
      avatar: '👩',
      status: 'online'
    },
    {
      id: 2,
      name: 'Mike Chen',
      level: 'Level 32',
      avatar: '👨',
      status: 'offline'
    },
    {
      id: 3,
      name: 'Emma Davis',
      level: 'Level 28',
      avatar: '👩',
      status: 'online'
    }
  ]

  const liveGames = [
    {
      id: 1,
      name: 'Speed Race #1429',
      players: '8 Players',
      time: '2:34 remaining',
      status: 'live'
    },
    {
      id: 2,
      name: 'Tournament Final',
      players: '16 Players',
      time: '0:47 remaining',
      status: 'critical'
    },
    {
      id: 3,
      name: 'Quick Match #847',
      players: '4 Players',
      time: 'Starting soon',
      status: 'starting'
    }
  ]

  const sidebarItems = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard', active: activeTab === 'Dashboard' },
    { id: 'players', icon: '👥', label: 'Players', active: activeTab === 'Players' },
    { id: 'games', icon: '🎮', label: 'Games', active: activeTab === 'Games' },
    { id: 'revenue', icon: '$', label: 'Revenue', active: activeTab === 'Revenue' },
    { id: 'settings', icon: '⚙️', label: 'Settings', active: activeTab === 'Settings' }
  ]

  // Mock data for different sections
  const playersData = [
    { id: 1, name: 'Sarah Johnson', email: 'sarah@email.com', level: 47, totalGames: 234, winRate: '73%', status: 'online', joinDate: '2024-01-15' },
    { id: 2, name: 'Mike Chen', email: 'mike@email.com', level: 32, totalGames: 156, winRate: '68%', status: 'offline', joinDate: '2024-02-20' },
    { id: 3, name: 'Emma Davis', email: 'emma@email.com', level: 28, totalGames: 89, winRate: '71%', status: 'online', joinDate: '2024-03-10' },
    { id: 4, name: 'John Smith', email: 'john@email.com', level: 55, totalGames: 312, winRate: '76%', status: 'online', joinDate: '2023-12-05' },
    { id: 5, name: 'Lisa Wong', email: 'lisa@email.com', level: 41, totalGames: 198, winRate: '69%', status: 'offline', joinDate: '2024-01-28' }
  ]

  const gamesData = [
    { id: 1, name: 'Speed Race Championship', type: 'Tournament', players: 64, maxPlayers: 64, status: 'active', prize: '$5,000', startTime: '14:30' },
    { id: 2, name: 'Quick Match #1429', type: 'Casual', players: 8, maxPlayers: 12, status: 'waiting', prize: '$50', startTime: '15:00' },
    { id: 3, name: 'Pro League Final', type: 'Ranked', players: 16, maxPlayers: 16, status: 'live', prize: '$10,000', startTime: '13:45' },
    { id: 4, name: 'Beginner Tournament', type: 'Tournament', players: 32, maxPlayers: 48, status: 'active', prize: '$1,000', startTime: '16:15' },
    { id: 5, name: 'Private Match #847', type: 'Private', players: 4, maxPlayers: 6, status: 'waiting', prize: '$0', startTime: '17:00' }
  ]

  const revenueData = [
    { month: 'January', revenue: 85420, transactions: 1234, avgPerUser: 69.2, growth: '+12%' },
    { month: 'February', revenue: 92150, transactions: 1456, avgPerUser: 63.3, growth: '+8%' },
    { month: 'March', revenue: 78930, transactions: 1189, avgPerUser: 66.4, growth: '-14%' },
    { month: 'April', revenue: 95670, transactions: 1567, avgPerUser: 61.0, growth: '+21%' },
    { month: 'May', revenue: 103240, transactions: 1678, avgPerUser: 61.5, growth: '+8%' },
    { month: 'June', revenue: 89247, transactions: 1432, avgPerUser: 62.3, growth: '-14%' }
  ]

  // Render functions for different tabs
  const renderDashboard = () => (
    <>
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard Overview</h1>
        <p className="dashboard-subtitle">Monitor your game performance and player statistics</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        {statsData.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-header">
              <div className={`stat-icon ${stat.iconClass}`}>
                {stat.icon}
              </div>
              <span className={`stat-change ${stat.changeType}`}>
                {stat.change}
              </span>
            </div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Revenue Trends</h3>
            <button className="chart-menu">⋯</button>
          </div>
          <div className="chart-placeholder">
            <span>📈 Revenue Chart (10k, 7.5k, 5k, 2.5k, 0 - Jan to Jun)</span>
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Player Distribution</h3>
            <button className="chart-menu">⋯</button>
          </div>
          <div className="pie-chart-placeholder"></div>
        </div>
      </div>

      {/* Data Tables */}
      <div className="data-grid">
        <div className="data-card">
          <div className="data-header">
            <h3 className="data-title">Recent Players</h3>
            <button className="chart-menu">⋯</button>
          </div>
          <ul className="data-list">
            {recentPlayers.map(player => (
              <li key={player.id} className="data-item">
                <div className="player-avatar">{player.avatar}</div>
                <div className="player-info">
                  <div className="player-name">{player.name}</div>
                  <div className="player-level">{player.level}</div>
                </div>
                <span className={`player-status ${player.status}`}>
                  {player.status === 'online' ? 'Online' : 'Offline'}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="data-card">
          <div className="data-header">
            <h3 className="data-title">Live Games</h3>
            <button className="chart-menu">⋯</button>
          </div>
          <ul className="data-list">
            {liveGames.map(game => (
              <li key={game.id} className="game-item">
                <div className="game-info">
                  <div className="game-name">{game.name}</div>
                  <div className="game-players">{game.players}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="game-players">{game.time}</div>
                  <span className={`game-status ${game.status}`}>
                    {game.status === 'live' ? 'Live' : 
                     game.status === 'critical' ? 'Critical' : 'Starting'}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  )

  const renderPlayers = () => (
    <>
      <div className="page-header">
        <div className="page-title-section">
          <h1 className="page-title">Players Management</h1>
          <p className="page-subtitle">Manage and monitor all registered players</p>
        </div>
        <div className="page-actions">
          <button className="action-btn secondary">Export Players</button>
          <button className="action-btn primary">Add New Player</button>
        </div>
      </div>

      <div className="players-stats">
        <div className="mini-stat-card">
          <div className="mini-stat-icon">👥</div>
          <div className="mini-stat-info">
            <div className="mini-stat-value">24,847</div>
            <div className="mini-stat-label">Total Players</div>
          </div>
        </div>
        <div className="mini-stat-card">
          <div className="mini-stat-icon">🟢</div>
          <div className="mini-stat-info">
            <div className="mini-stat-value">8,943</div>
            <div className="mini-stat-label">Online Now</div>
          </div>
        </div>
        <div className="mini-stat-card">
          <div className="mini-stat-icon">📈</div>
          <div className="mini-stat-info">
            <div className="mini-stat-value">+247</div>
            <div className="mini-stat-label">New Today</div>
          </div>
        </div>
      </div>

      <div className="table-container">
        <div className="table-header">
          <div className="table-filters">
            <input type="text" placeholder="Search players..." className="search-table" />
            <select className="filter-select">
              <option>All Status</option>
              <option>Online</option>
              <option>Offline</option>
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
        
        <table className="data-table">
          <thead>
            <tr>
              <th>Player</th>
              <th>Email</th>
              <th>Level</th>
              <th>Total Games</th>
              <th>Win Rate</th>
              <th>Status</th>
              <th>Join Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {playersData.map(player => (
              <tr key={player.id}>
                <td>
                  <div className="player-cell">
                    <div className="player-avatar">👤</div>
                    <div className="player-name">{player.name}</div>
                  </div>
                </td>
                <td>{player.email}</td>
                <td>
                  <span className="level-badge">Level {player.level}</span>
                </td>
                <td>{player.totalGames}</td>
                <td>
                  <span className="win-rate">{player.winRate}</span>
                </td>
                <td>
                  <span className={`status-badge ${player.status}`}>
                    {player.status === 'online' ? 'Online' : 'Offline'}
                  </span>
                </td>
                <td>{player.joinDate}</td>
                <td>
                  <div className="action-buttons">
                    <button className="action-btn-small">View</button>
                    <button className="action-btn-small">Edit</button>
                    <button className="action-btn-small danger">Ban</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )

  const renderGames = () => (
    <>
      <div className="page-header">
        <div className="page-title-section">
          <h1 className="page-title">Games Management</h1>
          <p className="page-subtitle">Monitor and manage all active and scheduled games</p>
        </div>
        <div className="page-actions">
          <button className="action-btn secondary">Game History</button>
          <button className="action-btn primary">Create New Game</button>
        </div>
      </div>

      <div className="games-stats">
        <div className="mini-stat-card">
          <div className="mini-stat-icon">🎮</div>
          <div className="mini-stat-info">
            <div className="mini-stat-value">1,429</div>
            <div className="mini-stat-label">Active Games</div>
          </div>
        </div>
        <div className="mini-stat-card">
          <div className="mini-stat-icon">🔴</div>
          <div className="mini-stat-info">
            <div className="mini-stat-value">247</div>
            <div className="mini-stat-label">Live Now</div>
          </div>
        </div>
        <div className="mini-stat-card">
          <div className="mini-stat-icon">⏳</div>
          <div className="mini-stat-info">
            <div className="mini-stat-value">156</div>
            <div className="mini-stat-label">Waiting</div>
          </div>
        </div>
      </div>

      <div className="table-container">
        <div className="table-header">
          <div className="table-filters">
            <input type="text" placeholder="Search games..." className="search-table" />
            <select className="filter-select">
              <option>All Types</option>
              <option>Tournament</option>
              <option>Casual</option>
              <option>Ranked</option>
              <option>Private</option>
            </select>
            <select className="filter-select">
              <option>All Status</option>
              <option>Active</option>
              <option>Live</option>
              <option>Waiting</option>
              <option>Completed</option>
            </select>
          </div>
        </div>
        
        <table className="data-table">
          <thead>
            <tr>
              <th>Game Name</th>
              <th>Type</th>
              <th>Players</th>
              <th>Status</th>
              <th>Prize Pool</th>
              <th>Start Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {gamesData.map(game => (
              <tr key={game.id}>
                <td>
                  <div className="game-cell">
                    <div className="game-icon">🎮</div>
                    <div className="game-name">{game.name}</div>
                  </div>
                </td>
                <td>
                  <span className={`type-badge ${game.type.toLowerCase()}`}>
                    {game.type}
                  </span>
                </td>
                <td>
                  <span className="players-count">
                    {game.players}/{game.maxPlayers}
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${game.status}`}>
                    {game.status === 'live' ? 'Live' : 
                     game.status === 'active' ? 'Active' : 
                     game.status === 'waiting' ? 'Waiting' : 'Completed'}
                  </span>
                </td>
                <td>
                  <span className="prize-amount">{game.prize}</span>
                </td>
                <td>{game.startTime}</td>
                <td>
                  <div className="action-buttons">
                    <button className="action-btn-small">View</button>
                    <button className="action-btn-small">Edit</button>
                    <button className="action-btn-small danger">Cancel</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )

  const renderRevenue = () => (
    <>
      <div className="page-header">
        <div className="page-title-section">
          <h1 className="page-title">Revenue Analytics</h1>
          <p className="page-subtitle">Track and analyze financial performance</p>
        </div>
        <div className="page-actions">
          <button className="action-btn secondary">Download Report</button>
          <button className="action-btn primary">Create Invoice</button>
        </div>
      </div>

      <div className="revenue-overview">
        <div className="revenue-card total">
          <div className="revenue-icon">💰</div>
          <div className="revenue-info">
            <div className="revenue-amount">$542,789</div>
            <div className="revenue-label">Total Revenue</div>
            <div className="revenue-change positive">+18% from last month</div>
          </div>
        </div>
        <div className="revenue-card monthly">
          <div className="revenue-icon">📊</div>
          <div className="revenue-info">
            <div className="revenue-amount">$89,247</div>
            <div className="revenue-label">This Month</div>
            <div className="revenue-change negative">-14% from last month</div>
          </div>
        </div>
        <div className="revenue-card avg">
          <div className="revenue-icon">👤</div>
          <div className="revenue-info">
            <div className="revenue-amount">$62.30</div>
            <div className="revenue-label">Avg Per User</div>
            <div className="revenue-change positive">+5% from last month</div>
          </div>
        </div>
      </div>

      <div className="revenue-chart-container">
        <div className="chart-card full-width">
          <div className="chart-header">
            <h3 className="chart-title">Monthly Revenue Breakdown</h3>
            <div className="chart-controls">
              <select className="chart-select">
                <option>Last 6 Months</option>
                <option>Last 12 Months</option>
                <option>This Year</option>
              </select>
            </div>
          </div>
          <div className="revenue-chart">
            <div className="chart-bars">
              {revenueData.map((data, index) => (
                <div key={index} className="bar-container">
                  <div 
                    className="revenue-bar" 
                    style={{ height: `${(data.revenue / 120000) * 100}%` }}
                  ></div>
                  <div className="bar-label">{data.month.slice(0, 3)}</div>
                  <div className="bar-value">${(data.revenue / 1000).toFixed(0)}k</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="table-container">
        <div className="table-header">
          <h3>Revenue Details</h3>
        </div>
        
        <table className="data-table">
          <thead>
            <tr>
              <th>Month</th>
              <th>Revenue</th>
              <th>Transactions</th>
              <th>Avg Per User</th>
              <th>Growth</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {revenueData.map((data, index) => (
              <tr key={index}>
                <td>
                  <span className="month-name">{data.month}</span>
                </td>
                <td>
                  <span className="revenue-amount">${data.revenue.toLocaleString()}</span>
                </td>
                <td>
                  <span className="transaction-count">{data.transactions.toLocaleString()}</span>
                </td>
                <td>
                  <span className="avg-amount">${data.avgPerUser}</span>
                </td>
                <td>
                  <span className={`growth ${data.growth.startsWith('+') ? 'positive' : 'negative'}`}>
                    {data.growth}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="action-btn-small">Details</button>
                    <button className="action-btn-small">Export</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )

  const renderSettings = () => (
    <>
      <div className="page-header">
        <div className="page-title-section">
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Manage system configuration and preferences</p>
        </div>
      </div>

      <div className="settings-container">
        <div className="settings-grid">
          <div className="settings-card">
            <div className="settings-header">
              <h3>General Settings</h3>
              <p>Basic system configuration</p>
            </div>
            <div className="settings-content">
              <div className="setting-item">
                <label>Platform Name</label>
                <input type="text" value="SpeedyGame" className="setting-input" />
              </div>
              <div className="setting-item">
                <label>Default Game Mode</label>
                <select className="setting-select">
                  <option>Tournament</option>
                  <option>Casual</option>
                  <option>Ranked</option>
                </select>
              </div>
              <div className="setting-item">
                <label>Max Players Per Game</label>
                <input type="number" value="64" className="setting-input" />
              </div>
            </div>
          </div>

          <div className="settings-card">
            <div className="settings-header">
              <h3>Game Settings</h3>
              <p>Configure game-specific options</p>
            </div>
            <div className="settings-content">
              <div className="setting-item">
                <label>Default Game Duration (minutes)</label>
                <input type="number" value="15" className="setting-input" />
              </div>
              <div className="setting-item">
                <label>Auto-start Games</label>
                <div className="toggle-switch">
                  <input type="checkbox" id="autostart" defaultChecked />
                  <label htmlFor="autostart" className="toggle-label"></label>
                </div>
              </div>
              <div className="setting-item">
                <label>Enable Spectator Mode</label>
                <div className="toggle-switch">
                  <input type="checkbox" id="spectator" defaultChecked />
                  <label htmlFor="spectator" className="toggle-label"></label>
                </div>
              </div>
            </div>
          </div>

          <div className="settings-card">
            <div className="settings-header">
              <h3>Payment Settings</h3>
              <p>Configure payment and prize options</p>
            </div>
            <div className="settings-content">
              <div className="setting-item">
                <label>Platform Fee (%)</label>
                <input type="number" value="10" className="setting-input" />
              </div>
              <div className="setting-item">
                <label>Minimum Prize Pool</label>
                <input type="number" value="50" className="setting-input" />
              </div>
              <div className="setting-item">
                <label>Auto Payout</label>
                <div className="toggle-switch">
                  <input type="checkbox" id="autopayout" />
                  <label htmlFor="autopayout" className="toggle-label"></label>
                </div>
              </div>
            </div>
          </div>

          <div className="settings-card">
            <div className="settings-header">
              <h3>Notification Settings</h3>
              <p>Manage system notifications</p>
            </div>
            <div className="settings-content">
              <div className="setting-item">
                <label>Email Notifications</label>
                <div className="toggle-switch">
                  <input type="checkbox" id="email" defaultChecked />
                  <label htmlFor="email" className="toggle-label"></label>
                </div>
              </div>
              <div className="setting-item">
                <label>SMS Notifications</label>
                <div className="toggle-switch">
                  <input type="checkbox" id="sms" />
                  <label htmlFor="sms" className="toggle-label"></label>
                </div>
              </div>
              <div className="setting-item">
                <label>Push Notifications</label>
                <div className="toggle-switch">
                  <input type="checkbox" id="push" defaultChecked />
                  <label htmlFor="push" className="toggle-label"></label>
                </div>
              </div>
            </div>
          </div>

          <div className="settings-card">
            <div className="settings-header">
              <h3>Security Settings</h3>
              <p>Manage security and access control</p>
            </div>
            <div className="settings-content">
              <div className="setting-item">
                <label>Two-Factor Authentication</label>
                <div className="toggle-switch">
                  <input type="checkbox" id="2fa" defaultChecked />
                  <label htmlFor="2fa" className="toggle-label"></label>
                </div>
              </div>
              <div className="setting-item">
                <label>Session Timeout (minutes)</label>
                <input type="number" value="30" className="setting-input" />
              </div>
              <div className="setting-item">
                <label>IP Whitelist</label>
                <textarea className="setting-textarea" placeholder="Enter IP addresses, one per line"></textarea>
              </div>
            </div>
          </div>

          <div className="settings-card">
            <div className="settings-header">
              <h3>API Settings</h3>
              <p>Configure API access and limits</p>
            </div>
            <div className="settings-content">
              <div className="setting-item">
                <label>API Rate Limit (requests/hour)</label>
                <input type="number" value="1000" className="setting-input" />
              </div>
              <div className="setting-item">
                <label>API Key</label>
                <div className="api-key-container">
                  <input type="password" value="sk-1234567890abcdef" className="setting-input" readOnly />
                  <button className="regenerate-btn">Regenerate</button>
                </div>
              </div>
              <div className="setting-item">
                <label>Enable API Access</label>
                <div className="toggle-switch">
                  <input type="checkbox" id="api" defaultChecked />
                  <label htmlFor="api" className="toggle-label"></label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="settings-actions">
          <button className="action-btn secondary">Reset to Defaults</button>
          <button className="action-btn primary">Save Changes</button>
        </div>
      </div>
    </>
  )

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header className="header">
        <div className="header-left">
          <div className="logo">
            <span className="logo-icon">🎮</span>
            <span>SpeedyGame</span>
          </div>
          {/* <nav className="nav-links">
            <a href="#dashboard" className="nav-link active">Dashboard</a>
            <a href="#players" className="nav-link">Players</a>
            <a href="#games" className="nav-link">Games</a>
            <a href="#revenue" className="nav-link">Revenue</a>
          </nav> */}
        </div>
        <div className="header-right">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search..."
              className="search-input"
            />
            <button className="search-button">🔍</button>
          </div>
          <div className="notification-icon">🔔</div>
          <div className="profile-avatar" onClick={handleLogout}>
            JD
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="main-layout">
        {/* Sidebar */}
        <aside className="sidebar">
          {sidebarItems.map(item => (
            <button
              key={item.id}
              className={`sidebar-item ${item.active ? 'active' : ''}`}
              onClick={() => setActiveTab(item.label)}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </aside>

        {/* Content */}
        <main className="content">
          {activeTab === 'Dashboard' && renderDashboard()}
          {activeTab === 'Players' && renderPlayers()}
          {activeTab === 'Games' && renderGames()}
          {activeTab === 'Revenue' && renderRevenue()}
          {activeTab === 'Settings' && renderSettings()}
        </main>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div>© 2024 SpeedyGame. All rights reserved.</div>
        <div className="footer-links">
          <a href="#privacy">Privacy Policy</a>
        </div>
      </footer>
    </div>
  )
}

export default Admin