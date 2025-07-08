import React, { useState } from 'react';
import './TeamPage.css';

interface Player {
  id: number;
  name: string;
  position: string;
  number: number;
  age: number;
  nationality: string;
  image?: string;
  stats: {
    goals: number;
    assists: number;
    appearances: number;
  };
  bio: string;
}

interface Staff {
  id: number;
  name: string;
  role: string;
  experience: string;
  image?: string;
  achievements: string[];
}

export const TeamPage = () => {
  const [activeTab, setActiveTab] = useState<'squad' | 'coaching' | 'management' | 'academy'>('squad');

  const players: Player[] = [
    // Goalkeepers
    {
      id: 1,
      name: "Alioune Dieng",
      position: "Goalkeeper",
      number: 1,
      age: 24,
      nationality: "Senegal",
      stats: { goals: 0, assists: 2, appearances: 28 },
      bio: "Commanding goalkeeper with excellent shot-stopping ability and distribution."
    },
    // Defenders
    {
      id: 2,
      name: "Mamadou Fall",
      position: "Centre-Back",
      number: 4,
      age: 26,
      nationality: "Senegal",
      stats: { goals: 3, assists: 1, appearances: 25 },
      bio: "Strong aerial presence and leader at the back with excellent passing range."
    },
    {
      id: 3,
      name: "Ibrahima Sarr",
      position: "Right-Back",
      number: 2,
      age: 22,
      nationality: "Senegal",
      stats: { goals: 2, assists: 8, appearances: 24 },
      bio: "Pacey full-back who loves to get forward and create attacking opportunities."
    },
    // Midfielders
    {
      id: 4,
      name: "Lamine Gueye",
      position: "Central Midfielder",
      number: 8,
      age: 25,
      nationality: "Senegal",
      stats: { goals: 6, assists: 12, appearances: 27 },
      bio: "Box-to-box midfielder with excellent vision and work rate."
    },
    {
      id: 5,
      name: "Cheikh Ba",
      position: "Attacking Midfielder",
      number: 10,
      age: 23,
      nationality: "Senegal",
      stats: { goals: 12, assists: 15, appearances: 26 },
      bio: "Creative playmaker with exceptional dribbling skills and goal-scoring ability."
    },
    // Forwards
    {
      id: 6,
      name: "Moussa Diouf",
      position: "Striker",
      number: 9,
      age: 24,
      nationality: "Senegal",
      stats: { goals: 18, assists: 6, appearances: 25 },
      bio: "Clinical finisher with great positioning and work rate in the final third."
    }
  ];

  const coachingStaff: Staff[] = [
    {
      id: 1,
      name: "Pape Sow",
      role: "Head Coach",
      experience: "15 years coaching experience",
      achievements: [
        "Led youth teams to 3 regional championships",
        "UEFA Pro License holder",
        "Former professional player"
      ]
    },
    {
      id: 2,
      name: "Omar Diallo",
      role: "Assistant Coach",
      experience: "8 years coaching experience",
      achievements: [
        "Specialized in tactical analysis",
        "UEFA A License holder",
        "Youth development expert"
      ]
    },
    {
      id: 3,
      name: "Fatou Niang",
      role: "Fitness Coach",
      experience: "10 years in sports science",
      achievements: [
        "MSc in Sports Science",
        "Injury prevention specialist",
        "Performance optimization expert"
      ]
    }
  ];

  const management: Staff[] = [
    {
      id: 1,
      name: "Abdoulaye Wade",
      role: "Club President",
      experience: "20 years in football administration",
      achievements: [
        "Former national team manager",
        "CAF coaching certification",
        "Community development advocate"
      ]
    },
    {
      id: 2,
      name: "Awa Thiam",
      role: "General Manager",
      experience: "12 years in sports management",
      achievements: [
        "MBA in Sports Management",
        "Player development specialist",
        "Youth academy architect"
      ]
    }
  ];

  const academyPlayers: Player[] = [
    {
      id: 11,
      name: "Ousmane Ndiaye",
      position: "Winger",
      number: 17,
      age: 18,
      nationality: "Senegal",
      stats: { goals: 8, assists: 12, appearances: 20 },
      bio: "Promising young talent with pace and skill, tipped for first team breakthrough."
    },
    {
      id: 12,
      name: "Aminata Seck",
      position: "Midfielder",
      number: 19,
      age: 17,
      nationality: "Senegal",
      stats: { goals: 5, assists: 9, appearances: 18 },
      bio: "Technical midfielder with excellent passing ability and football intelligence."
    }
  ];

  const renderPlayerCard = (player: Player) => (
    <div key={player.id} className="player-card">
      <div className="player-image">
        <div className="player-number">{player.number}</div>
        <div className="player-photo">
          <i className="fas fa-user"></i>
        </div>
      </div>
      <div className="player-info">
        <h3>{player.name}</h3>
        <p className="player-position">{player.position}</p>
        <div className="player-details">
          <span><i className="fas fa-birthday-cake"></i> {player.age} years</span>
          <span><i className="fas fa-flag"></i> {player.nationality}</span>
        </div>
        <div className="player-stats">
          <div className="stat">
            <span className="stat-value">{player.stats.goals}</span>
            <span className="stat-label">Goals</span>
          </div>
          <div className="stat">
            <span className="stat-value">{player.stats.assists}</span>
            <span className="stat-label">Assists</span>
          </div>
          <div className="stat">
            <span className="stat-value">{player.stats.appearances}</span>
            <span className="stat-label">Apps</span>
          </div>
        </div>
        <p className="player-bio">{player.bio}</p>
      </div>
    </div>
  );

  const renderStaffCard = (staff: Staff) => (
    <div key={staff.id} className="staff-card">
      <div className="staff-image">
        <i className="fas fa-user-tie"></i>
      </div>
      <div className="staff-info">
        <h3>{staff.name}</h3>
        <p className="staff-role">{staff.role}</p>
        <p className="staff-experience">{staff.experience}</p>
        <div className="staff-achievements">
          <h4>Key Achievements:</h4>
          <ul>
            {staff.achievements.map((achievement, index) => (
              <li key={index}>{achievement}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );

  return (
    <div className="team-page">
      {/* Navigation Tabs */}
      <div className="team-navigation">
        <div className="team-nav-container">
          <button 
            className={`team-nav-tab ${activeTab === 'squad' ? 'active' : ''}`}
            onClick={() => setActiveTab('squad')}
          >
            <i className="fas fa-users"></i>
            FIRST TEAM SQUAD
          </button>
          <button 
            className={`team-nav-tab ${activeTab === 'coaching' ? 'active' : ''}`}
            onClick={() => setActiveTab('coaching')}
          >
            <i className="fas fa-clipboard-list"></i>
            COACHING STAFF
          </button>
          <button 
            className={`team-nav-tab ${activeTab === 'management' ? 'active' : ''}`}
            onClick={() => setActiveTab('management')}
          >
            <i className="fas fa-building"></i>
            MANAGEMENT
          </button>
          <button 
            className={`team-nav-tab ${activeTab === 'academy' ? 'active' : ''}`}
            onClick={() => setActiveTab('academy')}
          >
            <i className="fas fa-star"></i>
            ACADEMY STARS
          </button>
        </div>
      </div>

      {/* Content Sections */}
      <div className="team-content">
        {activeTab === 'squad' && (
          <div className="squad-section">
            <div className="position-groups">
              <div className="position-group">
                <h3><i className="fas fa-hand-paper"></i> GOALKEEPERS</h3>
                <div className="players-grid">
                  {players.filter(p => p.position === 'Goalkeeper').map(renderPlayerCard)}
                </div>
              </div>
              
              <div className="position-group">
                <h3><i className="fas fa-shield-alt"></i> DEFENDERS</h3>
                <div className="players-grid">
                  {players.filter(p => p.position.includes('Back') || p.position.includes('Centre-Back')).map(renderPlayerCard)}
                </div>
              </div>
              
              <div className="position-group">
                <h3><i className="fas fa-running"></i> MIDFIELDERS</h3>
                <div className="players-grid">
                  {players.filter(p => p.position.includes('Midfielder')).map(renderPlayerCard)}
                </div>
              </div>
              
              <div className="position-group">
                <h3><i className="fas fa-bullseye"></i> FORWARDS</h3>
                <div className="players-grid">
                  {players.filter(p => p.position === 'Striker' || p.position === 'Winger').map(renderPlayerCard)}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'coaching' && (
          <div className="coaching-section">
            <div className="staff-grid">
              {coachingStaff.map(renderStaffCard)}
            </div>
          </div>
        )}

        {activeTab === 'management' && (
          <div className="management-section">
            <div className="staff-grid">
              {management.map(renderStaffCard)}
            </div>
          </div>
        )}

        {activeTab === 'academy' && (
          <div className="academy-section">
            <div className="players-grid">
              {academyPlayers.map(renderPlayerCard)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 