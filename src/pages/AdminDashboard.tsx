import React, { useState } from 'react';
import './AdminDashboard.css';
import logoImage from '../assets/images/Logo.png';

type Section = 'players' | 'coaching' | 'matches';

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState<Section>('players');

  return (
    <div className="admin-dashboard">
      {/* Glassmorphism Overlay */}
      <div className="admin-overlay"></div>

      {/* Sidebar Navigation */}
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <img src={logoImage} alt="Marenah FC" />
          <h2>ADMIN PANEL</h2>
        </div>
        <nav className="admin-nav">
          <button
            className={`nav-item ${activeSection === 'players' ? 'active' : ''}`}
            onClick={() => setActiveSection('players')}
          >
            <i className="fas fa-users"></i>
            <span>Players</span>
          </button>
          <button
            className={`nav-item ${activeSection === 'coaching' ? 'active' : ''}`}
            onClick={() => setActiveSection('coaching')}
          >
            <i className="fas fa-clipboard"></i>
            <span>Coaching Staff</span>
          </button>
          <button
            className={`nav-item ${activeSection === 'matches' ? 'active' : ''}`}
            onClick={() => setActiveSection('matches')}
          >
            <i className="fas fa-futbol"></i>
            <span>Matches</span>
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main">
        <header className="admin-header">
          <div className="header-content">
            <h1>{activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} Management</h1>
            <p className="header-subtitle">Manage your team's {activeSection}</p>
          </div>
          <button className="add-new-btn">
            <i className="fas fa-plus"></i>
            Add New {activeSection.slice(0, -1)}
          </button>
        </header>

        <div className="admin-content">
          {activeSection === 'players' && (
            <div className="players-grid">
              {/* Player Cards */}
              <div className="player-card">
                <div className="card-header">
                  <img src="placeholder.jpg" alt="Player" className="player-image" />
                  <div className="card-overlay">
                    <div className="player-number">#10</div>
                    <div className="edit-overlay">
                      <button className="edit-btn"><i className="fas fa-edit"></i></button>
                      <button className="delete-btn"><i className="fas fa-trash"></i></button>
                    </div>
                  </div>
                </div>
                <div className="card-content">
                  <h3>Player Name</h3>
                  <p className="player-position">Forward</p>
                  <div className="player-stats">
                    <span>Age: 23</span>
                    <span>Height: 1.85m</span>
                  </div>
                </div>
              </div>
              {/* Add more player cards here */}
            </div>
          )}

          {activeSection === 'coaching' && (
            <div className="staff-grid">
              {/* Staff Cards */}
              <div className="staff-card">
                <div className="card-header">
                  <img src="placeholder.jpg" alt="Staff" className="staff-image" />
                  <div className="card-overlay">
                    <div className="edit-overlay">
                      <button className="edit-btn"><i className="fas fa-edit"></i></button>
                      <button className="delete-btn"><i className="fas fa-trash"></i></button>
                    </div>
                  </div>
                </div>
                <div className="card-content">
                  <h3>Staff Name</h3>
                  <p className="staff-role">Head Coach</p>
                  <div className="staff-info">
                    <span>Experience: 15 years</span>
                    <span>Nationality: Senegalese</span>
                  </div>
                </div>
              </div>
              {/* Add more staff cards here */}
            </div>
          )}

          {activeSection === 'matches' && (
            <div className="matches-section">
              <div className="matches-filters">
                <button className="filter-btn active">Upcoming</button>
                <button className="filter-btn">Past</button>
              </div>
              <div className="matches-list">
                {/* Match Items */}
                <div className="match-item">
                  <div className="match-date">
                    <span className="date">24</span>
                    <span className="month">MAR</span>
                    <span className="year">2024</span>
                  </div>
                  <div className="match-details">
                    <div className="team home">
                      <span className="team-name">Marenah FC</span>
                      <img src={logoImage} alt="Marenah FC" className="team-logo" />
                    </div>
                    <div className="match-center">
                      <span className="vs">VS</span>
                      <span className="match-time">20:00</span>
                      <span className="match-venue">Marenah Stadium</span>
                    </div>
                    <div className="team away">
                      <img src="placeholder.jpg" alt="Opponent" className="team-logo" />
                      <span className="team-name">Opponent</span>
                    </div>
                  </div>
                  <div className="match-actions">
                    <button className="edit-btn"><i className="fas fa-edit"></i></button>
                    <button className="delete-btn"><i className="fas fa-trash"></i></button>
                  </div>
                </div>
                {/* Add more match items here */}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard; 