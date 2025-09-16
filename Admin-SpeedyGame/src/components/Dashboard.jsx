import React from 'react';

const Dashboard = () => {
  const styles = {
    dashboard: {
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
      backgroundColor: '#f8f9fa'
    },
    header: {
      background: 'white',
      borderBottom: '1px solid #e9ecef',
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    headerLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '2rem'
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem'
    },
    logoIcon: {
      width: '32px',
      height: '32px',
      background: '#6f42c1',
      borderRadius: '6px'
    },
    logoText: {
      fontSize: '1.5rem',
      fontWeight: '700',
      color: '#212529'
    },
    pageTitle: {
      fontSize: '1.75rem',
      fontWeight: '600',
      color: '#495057'
    },
    headerRight: {
      display: 'flex',
      alignItems: 'center',
      gap: '1.5rem'
    },
    searchBar: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center'
    },
    searchIcon: {
      position: 'absolute',
      left: '12px',
      color: '#6c757d',
      fontSize: '1rem',
      zIndex: 1
    },
    searchInput: {
      padding: '0.5rem 1rem 0.5rem 2.5rem',
      border: '1px solid #ced4da',
      borderRadius: '6px',
      width: '250px',
      fontSize: '0.9rem',
      outline: 'none'
    },
    notifications: {
      width: '40px',
      height: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '50%',
      background: '#f8f9fa',
      cursor: 'pointer',
      transition: 'background-color 0.2s'
    },
    userProfile: {
      width: '40px',
      height: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '50%',
      background: '#f8f9fa',
      cursor: 'pointer',
      transition: 'background-color 0.2s'
    },
    mainContent: {
      display: 'flex',
      flex: 1
    },
    sidebar: {
      width: '250px',
      background: 'white',
      borderRight: '1px solid #e9ecef',
      padding: '2rem 0'
    },
    navMenu: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem'
    },
    navItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '0.75rem 1.5rem',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
      color: '#6c757d'
    },
    navItemActive: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '0.75rem 1.5rem',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
      background: '#f8f9fa',
      color: '#495057',
      fontWeight: '500'
    },
    navIcon: {
      fontSize: '1.1rem',
      width: '20px',
      textAlign: 'center'
    },
    navText: {
      fontSize: '0.9rem'
    },
    content: {
      flex: 1,
      padding: '2rem',
      background: '#f8f9fa'
    },
    metricsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '1.5rem',
      marginBottom: '2rem'
    },
    metricCard: {
      background: 'white',
      padding: '1.5rem',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      display: 'flex',
      alignItems: 'center',
      gap: '1rem'
    },
    metricIcon: {
      fontSize: '2rem',
      width: '60px',
      height: '60px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f8f9fa',
      borderRadius: '8px'
    },
    metricContent: {
      flex: 1
    },
    metricTitle: {
      fontSize: '0.9rem',
      color: '#6c757d',
      marginBottom: '0.5rem',
      fontWeight: '500',
      margin: 0
    },
    metricValue: {
      fontSize: '1.75rem',
      fontWeight: '700',
      color: '#212529',
      marginBottom: '0.25rem'
    },
    metricChange: {
      fontSize: '0.8rem',
      fontWeight: '500'
    },
    metricChangePositive: {
      fontSize: '0.8rem',
      fontWeight: '500',
      color: '#28a745'
    },
    metricChangeNegative: {
      fontSize: '0.8rem',
      fontWeight: '500',
      color: '#dc3545'
    },
    chartsGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '1.5rem',
      marginBottom: '2rem'
    },
    chartCard: {
      background: 'white',
      padding: '1.5rem',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    chartTitle: {
      fontSize: '1.1rem',
      fontWeight: '600',
      color: '#212529',
      marginBottom: '1rem',
      margin: 0
    },
    chartPlaceholder: {
      height: '200px',
      background: '#f8f9fa',
      border: '2px dashed #dee2e6',
      borderRadius: '6px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#6c757d',
      fontSize: '0.9rem'
    },
    bottomSection: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '1.5rem'
    },
    recentPlayers: {
      background: 'white',
      padding: '1.5rem',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    liveGames: {
      background: 'white',
      padding: '1.5rem',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    sectionTitle: {
      fontSize: '1.1rem',
      fontWeight: '600',
      color: '#212529',
      marginBottom: '1rem',
      margin: 0
    },
    tableContainer: {
      overflowX: 'auto'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse'
    },
    th: {
      textAlign: 'left',
      padding: '0.75rem 0',
      fontSize: '0.8rem',
      fontWeight: '600',
      color: '#6c757d',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      borderBottom: '1px solid #e9ecef'
    },
    td: {
      padding: '0.75rem 0',
      borderBottom: '1px solid #f8f9fa',
      fontSize: '0.9rem',
      color: '#495057'
    },
    playerInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    playerAvatar: {
      width: '32px',
      height: '32px',
      background: '#f8f9fa',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '0.9rem'
    },
    status: {
      padding: '0.25rem 0.5rem',
      borderRadius: '4px',
      fontSize: '0.8rem',
      fontWeight: '500'
    },
    statusOnline: {
      padding: '0.25rem 0.5rem',
      borderRadius: '4px',
      fontSize: '0.8rem',
      fontWeight: '500',
      background: '#d4edda',
      color: '#155724'
    },
    statusOffline: {
      padding: '0.25rem 0.5rem',
      borderRadius: '4px',
      fontSize: '0.8rem',
      fontWeight: '500',
      background: '#f8d7da',
      color: '#721c24'
    },
    gamesGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '1rem'
    },
    gameCard: {
      padding: '1rem',
      border: '1px solid #e9ecef',
      borderRadius: '6px',
      background: '#f8f9fa'
    },
    gameTitle: {
      fontSize: '0.9rem',
      fontWeight: '600',
      color: '#212529',
      marginBottom: '0.5rem',
      margin: 0
    },
    gameStatus: {
      display: 'inline-block',
      padding: '0.25rem 0.5rem',
      borderRadius: '4px',
      fontSize: '0.75rem',
      fontWeight: '500',
      marginBottom: '0.5rem'
    },
    gameStatusLive: {
      display: 'inline-block',
      padding: '0.25rem 0.5rem',
      borderRadius: '4px',
      fontSize: '0.75rem',
      fontWeight: '500',
      marginBottom: '0.5rem',
      background: '#d4edda',
      color: '#155724'
    },
    gameStatusStarting: {
      display: 'inline-block',
      padding: '0.25rem 0.5rem',
      borderRadius: '4px',
      fontSize: '0.75rem',
      fontWeight: '500',
      marginBottom: '0.5rem',
      background: '#fff3cd',
      color: '#856404'
    },
    gamePlayers: {
      fontSize: '0.8rem',
      color: '#6c757d',
      marginBottom: '0.75rem'
    },
    progressBar: {
      width: '100%',
      height: '6px',
      background: '#e9ecef',
      borderRadius: '3px',
      overflow: 'hidden'
    },
    progressFill: {
      height: '100%',
      background: '#6f42c1',
      borderRadius: '3px',
      transition: 'width 0.3s ease'
    }
  };

  return (
    <div style={styles.dashboard}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.logo}>
            <div style={styles.logoIcon}></div>
            <span style={styles.logoText}>GameHub</span>
          </div>
          <h1 style={styles.pageTitle}>Dashboard</h1>
        </div>
        <div style={styles.headerRight}>
          <div style={styles.searchBar}>
            <span style={styles.searchIcon}>🔍</span>
            <input 
              type="text" 
              placeholder="Search..." 
              style={styles.searchInput}
            />
          </div>
          <div style={styles.notifications}>
            <span>🔔</span>
          </div>
          <div style={styles.userProfile}>
            <span>👤</span>
          </div>
        </div>
      </header>

      <div style={styles.mainContent}>
        {/* Sidebar */}
        <aside style={styles.sidebar}>
          <nav style={styles.navMenu}>
            <div style={styles.navItemActive}>
              <span style={styles.navIcon}>📊</span>
              <span style={styles.navText}>Dashboard</span>
            </div>
            <div style={styles.navItem}>
              <span style={styles.navIcon}>👥</span>
              <span style={styles.navText}>Players</span>
            </div>
            <div style={styles.navItem}>
              <span style={styles.navIcon}>🎮</span>
              <span style={styles.navText}>Games</span>
            </div>
            <div style={styles.navItem}>
              <span style={styles.navIcon}>💰</span>
              <span style={styles.navText}>Revenue</span>
            </div>
            <div style={styles.navItem}>
              <span style={styles.navIcon}>⚙️</span>
              <span style={styles.navText}>Settings</span>
            </div>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main style={styles.content}>
          {/* Key Metrics Cards */}
          <div style={styles.metricsGrid}>
            <div style={styles.metricCard}>
              <div style={styles.metricIcon}>👥</div>
              <div style={styles.metricContent}>
                <h3 style={styles.metricTitle}>Total Players</h3>
                <div style={styles.metricValue}>12,847</div>
                <div style={styles.metricChangePositive}>+12% from last month</div>
              </div>
            </div>
            <div style={styles.metricCard}>
              <div style={styles.metricIcon}>🎮</div>
              <div style={styles.metricContent}>
                <h3 style={styles.metricTitle}>Active Games</h3>
                <div style={styles.metricValue}>234</div>
                <div style={styles.metricChangePositive}>+8% from last month</div>
              </div>
            </div>
            <div style={styles.metricCard}>
              <div style={styles.metricIcon}>💰</div>
              <div style={styles.metricContent}>
                <h3 style={styles.metricTitle}>Monthly Revenue</h3>
                <div style={styles.metricValue}>$45,231</div>
                <div style={styles.metricChangeNegative}>-3% from last month</div>
              </div>
            </div>
            <div style={styles.metricCard}>
              <div style={styles.metricIcon}>🏆</div>
              <div style={styles.metricContent}>
                <h3 style={styles.metricTitle}>Tournaments</h3>
                <div style={styles.metricValue}>18</div>
                <div style={styles.metricChangePositive}>+5% from last month</div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div style={styles.chartsGrid}>
            <div style={styles.chartCard}>
              <h3 style={styles.chartTitle}>Revenue Trends</h3>
              <div style={styles.chartPlaceholder}>
                Line Chart - Revenue Over Time
              </div>
            </div>
            <div style={styles.chartCard}>
              <h3 style={styles.chartTitle}>Player Distribution</h3>
              <div style={styles.chartPlaceholder}>
                Donut Chart - Player Categories
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div style={styles.bottomSection}>
            {/* Recent Players */}
            <div style={styles.recentPlayers}>
              <h3 style={styles.sectionTitle}>Recent Players</h3>
              <div style={styles.tableContainer}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>PLAYER</th>
                      <th style={styles.th}>STATUS</th>
                      <th style={styles.th}>JOINED</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={styles.td}>
                        <div style={styles.playerInfo}>
                          <span style={styles.playerAvatar}>👤</span>
                          <span>Alex Johnson</span>
                        </div>
                      </td>
                      <td style={styles.td}>
                        <span style={styles.statusOnline}>Online</span>
                      </td>
                      <td style={styles.td}>Jan 15, 2025</td>
                    </tr>
                    <tr>
                      <td style={styles.td}>
                        <div style={styles.playerInfo}>
                          <span style={styles.playerAvatar}>👤</span>
                          <span>Sarah Chen</span>
                        </div>
                      </td>
                      <td style={styles.td}>
                        <span style={styles.statusOffline}>Offline</span>
                      </td>
                      <td style={styles.td}>Jan 14, 2025</td>
                    </tr>
                    <tr>
                      <td style={styles.td}>
                        <div style={styles.playerInfo}>
                          <span style={styles.playerAvatar}>👤</span>
                          <span>Mike Wilson</span>
                        </div>
                      </td>
                      <td style={styles.td}>
                        <span style={styles.statusOnline}>Online</span>
                      </td>
                      <td style={styles.td}>Jan 13, 2025</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Live Games */}
            <div style={styles.liveGames}>
              <h3 style={styles.sectionTitle}>Live Games</h3>
              <div style={styles.gamesGrid}>
                <div style={styles.gameCard}>
                  <h4 style={styles.gameTitle}>Battle Royale</h4>
                  <div style={styles.gameStatusLive}>Live</div>
                  <div style={styles.gamePlayers}>Players: 45/50</div>
                  <div style={styles.progressBar}>
                    <div style={{...styles.progressFill, width: '90%'}}></div>
                  </div>
                </div>
                <div style={styles.gameCard}>
                  <h4 style={styles.gameTitle}>Racing Championship</h4>
                  <div style={styles.gameStatusLive}>Live</div>
                  <div style={styles.gamePlayers}>Players: 12/16</div>
                  <div style={styles.progressBar}>
                    <div style={{...styles.progressFill, width: '75%'}}></div>
                  </div>
                </div>
                <div style={styles.gameCard}>
                  <h4 style={styles.gameTitle}>Strategy War</h4>
                  <div style={styles.gameStatusStarting}>Starting</div>
                  <div style={styles.gamePlayers}>Players: 8/20</div>
                  <div style={styles.progressBar}>
                    <div style={{...styles.progressFill, width: '40%'}}></div>
                  </div>
                </div>
                <div style={styles.gameCard}>
                  <h4 style={styles.gameTitle}>Puzzle Challenge</h4>
                  <div style={styles.gameStatusLive}>Live</div>
                  <div style={styles.gamePlayers}>Players: 30/30</div>
                  <div style={styles.progressBar}>
                    <div style={{...styles.progressFill, width: '100%'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
