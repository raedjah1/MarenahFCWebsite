import React, { useState } from 'react';
import './MatchesPage.css';

interface Match {
  id: number;
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
  date: string;
  time: string;
  competition: string;
  status: 'upcoming' | 'live' | 'finished';
  venue: string;
  isHome: boolean;
}

interface MatchStats {
  possession: { home: number; away: number };
  shots: { home: number; away: number };
  shotsOnTarget: { home: number; away: number };
  corners: { home: number; away: number };
  fouls: { home: number; away: number };
}

export const MatchesPage = () => {
  const [activeTab, setActiveTab] = useState<'fixtures' | 'results' | 'statistics'>('fixtures');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'home' | 'away'>('all');
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

  const matches: Match[] = [
    // Upcoming Matches
    {
      id: 1,
      homeTeam: "Marenah FC",
      awayTeam: "AS Douanes",
      date: "2024-02-15",
      time: "16:00",
      competition: "Ligue 1 Senegal",
      status: "upcoming",
      venue: "Stade Marenah",
      isHome: true
    },
    {
      id: 2,
      homeTeam: "Casa Sports",
      awayTeam: "Marenah FC",
      date: "2024-02-22",
      time: "18:30",
      competition: "Ligue 1 Senegal",
      status: "upcoming",
      venue: "Stade Aline Sitoe Diatta",
      isHome: false
    },
    // Live Match
    {
      id: 3,
      homeTeam: "Marenah FC",
      awayTeam: "Teungueth FC",
      homeScore: 2,
      awayScore: 1,
      date: "2024-02-08",
      time: "20:00",
      competition: "Coupe du Senegal",
      status: "live",
      venue: "Stade Marenah",
      isHome: true
    },
    // Finished Matches
    {
      id: 4,
      homeTeam: "Marenah FC",
      awayTeam: "Diambars FC",
      homeScore: 3,
      awayScore: 1,
      date: "2024-02-01",
      time: "16:00",
      competition: "Ligue 1 Senegal",
      status: "finished",
      venue: "Stade Marenah",
      isHome: true
    },
    {
      id: 5,
      homeTeam: "Jaraaf",
      awayTeam: "Marenah FC",
      homeScore: 0,
      awayScore: 2,
      date: "2024-01-25",
      time: "18:30",
      competition: "Ligue 1 Senegal",
      status: "finished",
      venue: "Stade Demba Diop",
      isHome: false
    }
  ];

  const liveMatchStats: MatchStats = {
    possession: { home: 65, away: 35 },
    shots: { home: 12, away: 8 },
    shotsOnTarget: { home: 6, away: 3 },
    corners: { home: 7, away: 4 },
    fouls: { home: 8, away: 12 }
  };

  const filteredMatches = matches.filter(match => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'home') return match.isHome;
    if (selectedFilter === 'away') return !match.isHome;
    return true;
  });

  const upcomingMatches = filteredMatches.filter(m => m.status === 'upcoming');
  const liveMatches = filteredMatches.filter(m => m.status === 'live');
  const finishedMatches = filteredMatches.filter(m => m.status === 'finished');

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const renderMatchCard = (match: Match) => (
    <div 
      key={match.id} 
      className={`match-card ${match.status}`}
      onClick={() => setSelectedMatch(match)}
    >
      <div className="match-header">
        <span className="competition">{match.competition}</span>
        {match.status === 'live' && <span className="live-badge">LIVE</span>}
      </div>
      
      <div className="match-teams">
        <div className="team home">
          <div className="team-logo">
            {match.homeTeam === 'Marenah FC' ? (
              <div className="mfc-logo">MFC</div>
            ) : (
              <i className="fas fa-shield-alt"></i>
            )}
          </div>
          <span className="team-name">{match.homeTeam}</span>
        </div>
        
        <div className="match-score">
          {match.status === 'upcoming' ? (
            <div className="match-time">
              <span className="time">{match.time}</span>
              <span className="date">{formatDate(match.date)}</span>
            </div>
          ) : (
            <div className="score">
              <span className="home-score">{match.homeScore}</span>
              <span className="separator">-</span>
              <span className="away-score">{match.awayScore}</span>
            </div>
          )}
        </div>
        
        <div className="team away">
          <div className="team-logo">
            {match.awayTeam === 'Marenah FC' ? (
              <div className="mfc-logo">MFC</div>
            ) : (
              <i className="fas fa-shield-alt"></i>
            )}
          </div>
          <span className="team-name">{match.awayTeam}</span>
        </div>
      </div>
      
      <div className="match-footer">
        <span className="venue">
          <i className="fas fa-map-marker-alt"></i>
          {match.venue}
        </span>
        {match.isHome && <span className="home-indicator">HOME</span>}
      </div>
    </div>
  );

  const renderLiveStats = () => (
    <div className="live-stats">
      <h3>Match Statistics</h3>
      <div className="stats-grid">
        <div className="stat-row">
          <span className="stat-label">Possession</span>
          <div className="stat-bar">
            <div className="stat-home" style={{ width: `${liveMatchStats.possession.home}%` }}>
              {liveMatchStats.possession.home}%
            </div>
            <div className="stat-away" style={{ width: `${liveMatchStats.possession.away}%` }}>
              {liveMatchStats.possession.away}%
            </div>
          </div>
        </div>
        
        <div className="stat-row">
          <span className="stat-label">Shots</span>
          <div className="stat-numbers">
            <span className="home-stat">{liveMatchStats.shots.home}</span>
            <span className="away-stat">{liveMatchStats.shots.away}</span>
          </div>
        </div>
        
        <div className="stat-row">
          <span className="stat-label">Shots on Target</span>
          <div className="stat-numbers">
            <span className="home-stat">{liveMatchStats.shotsOnTarget.home}</span>
            <span className="away-stat">{liveMatchStats.shotsOnTarget.away}</span>
          </div>
        </div>
        
        <div className="stat-row">
          <span className="stat-label">Corners</span>
          <div className="stat-numbers">
            <span className="home-stat">{liveMatchStats.corners.home}</span>
            <span className="away-stat">{liveMatchStats.corners.away}</span>
          </div>
        </div>
        
        <div className="stat-row">
          <span className="stat-label">Fouls</span>
          <div className="stat-numbers">
            <span className="home-stat">{liveMatchStats.fouls.home}</span>
            <span className="away-stat">{liveMatchStats.fouls.away}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="matches-page">
      {/* Navigation Tabs */}
      <div className="matches-navigation">
        <div className="matches-nav-container">
          <button 
            className={`matches-nav-tab ${activeTab === 'fixtures' ? 'active' : ''}`}
            onClick={() => setActiveTab('fixtures')}
          >
            <i className="fas fa-calendar-alt"></i>
            FIXTURES
          </button>
          <button 
            className={`matches-nav-tab ${activeTab === 'results' ? 'active' : ''}`}
            onClick={() => setActiveTab('results')}
          >
            <i className="fas fa-chart-line"></i>
            RESULTS
          </button>
          <button 
            className={`matches-nav-tab ${activeTab === 'statistics' ? 'active' : ''}`}
            onClick={() => setActiveTab('statistics')}
          >
            <i className="fas fa-chart-bar"></i>
            STATISTICS
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="matches-filters">
        <div className="filter-container">
          <button 
            className={`filter-btn ${selectedFilter === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedFilter('all')}
          >
            ALL MATCHES
          </button>
          <button 
            className={`filter-btn ${selectedFilter === 'home' ? 'active' : ''}`}
            onClick={() => setSelectedFilter('home')}
          >
            HOME
          </button>
          <button 
            className={`filter-btn ${selectedFilter === 'away' ? 'active' : ''}`}
            onClick={() => setSelectedFilter('away')}
          >
            AWAY
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="matches-content">
        {activeTab === 'fixtures' && (
          <div className="fixtures-section">
            {/* Live Matches */}
            {liveMatches.length > 0 && (
              <div className="matches-group">
                <h2><i className="fas fa-circle live-dot"></i> LIVE NOW</h2>
                <div className="matches-grid">
                  {liveMatches.map(renderMatchCard)}
                </div>
                {renderLiveStats()}
              </div>
            )}

            {/* Upcoming Matches */}
            <div className="matches-group">
              <h2><i className="fas fa-clock"></i> UPCOMING FIXTURES</h2>
              <div className="matches-grid">
                {upcomingMatches.map(renderMatchCard)}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'results' && (
          <div className="results-section">
            <div className="matches-group">
              <h2><i className="fas fa-check-circle"></i> RECENT RESULTS</h2>
              <div className="matches-grid">
                {finishedMatches.map(renderMatchCard)}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'statistics' && (
          <div className="statistics-section">
            <div className="stats-overview">
              <h2>SEASON STATISTICS</h2>
              <div className="stats-cards">
                <div className="stat-card">
                  <div className="stat-icon">
                    <i className="fas fa-futbol"></i>
                  </div>
                  <div className="stat-info">
                    <span className="stat-number">24</span>
                    <span className="stat-label">Matches Played</span>
                  </div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-icon">
                    <i className="fas fa-trophy"></i>
                  </div>
                  <div className="stat-info">
                    <span className="stat-number">18</span>
                    <span className="stat-label">Wins</span>
                  </div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-icon">
                    <i className="fas fa-handshake"></i>
                  </div>
                  <div className="stat-info">
                    <span className="stat-number">4</span>
                    <span className="stat-label">Draws</span>
                  </div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-icon">
                    <i className="fas fa-times-circle"></i>
                  </div>
                  <div className="stat-info">
                    <span className="stat-number">2</span>
                    <span className="stat-label">Losses</span>
                  </div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-icon">
                    <i className="fas fa-bullseye"></i>
                  </div>
                  <div className="stat-info">
                    <span className="stat-number">58</span>
                    <span className="stat-label">Goals Scored</span>
                  </div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-icon">
                    <i className="fas fa-shield-alt"></i>
                  </div>
                  <div className="stat-info">
                    <span className="stat-number">18</span>
                    <span className="stat-label">Goals Conceded</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Match Detail Modal */}
      {selectedMatch && (
        <div className="match-modal-overlay" onClick={() => setSelectedMatch(null)}>
          <div className="match-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Match Details</h3>
              <button 
                className="close-btn"
                onClick={() => setSelectedMatch(null)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-content">
              <div className="match-info">
                <div className="teams-display">
                  <div className="team-display">
                    <div className="team-logo-large">
                      {selectedMatch.homeTeam === 'Marenah FC' ? 'MFC' : 'OPP'}
                    </div>
                    <span className="team-name-large">{selectedMatch.homeTeam}</span>
                  </div>
                  
                  <div className="score-display">
                    {selectedMatch.status === 'upcoming' ? (
                      <div className="upcoming-time">
                        <span className="time-large">{selectedMatch.time}</span>
                        <span className="date-large">{formatDate(selectedMatch.date)}</span>
                      </div>
                    ) : (
                      <div className="score-large">
                        <span className="score-number">{selectedMatch.homeScore}</span>
                        <span className="score-separator">-</span>
                        <span className="score-number">{selectedMatch.awayScore}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="team-display">
                    <div className="team-logo-large">
                      {selectedMatch.awayTeam === 'Marenah FC' ? 'MFC' : 'OPP'}
                    </div>
                    <span className="team-name-large">{selectedMatch.awayTeam}</span>
                  </div>
                </div>
                
                <div className="match-details">
                  <p><strong>Competition:</strong> {selectedMatch.competition}</p>
                  <p><strong>Venue:</strong> {selectedMatch.venue}</p>
                  <p><strong>Date:</strong> {formatDate(selectedMatch.date)} at {selectedMatch.time}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 