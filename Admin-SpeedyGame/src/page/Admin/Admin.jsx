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
    { id: 'dashboard', icon: '📊', label: 'Dashboard', active: true },
    { id: 'players', icon: '👥', label: 'Players' },
    { id: 'games', icon: '🎮', label: 'Games' },
    { id: 'revenue', icon: '$', label: 'Revenue' },
    { id: 'settings', icon: '⚙️', label: 'Settings' }
  ]

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header className="header">
        <div className="header-left">
          <div className="logo">
            <span className="logo-icon">🎮</span>
            <span>SpeedyGame</span>
          </div>
          <nav className="nav-links">
            <a href="#dashboard" className="nav-link active">Dashboard</a>
            <a href="#players" className="nav-link">Players</a>
            <a href="/games" className="nav-link">Games</a>
            <a href="#revenue" className="nav-link">Revenue</a>
          </nav>
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