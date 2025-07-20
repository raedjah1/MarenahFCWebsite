import React, { useState } from "react";
import "./TeamPage.css";
import { useTeamMembersByRole } from "../hooks/useFirebase";
import { LoadingSpinner } from "../components/LoadingSpinner";
import type { TeamMember } from "../firebase/types";

export const TeamPage = () => {
  const [activeTab, setActiveTab] = useState<
    "management" | "coaching" | "players"
  >("management");
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  // Fetch team members by role using Firebase
  const {
    data: managementTeam,
    loading: managementLoading,
    error: managementError,
  } = useTeamMembersByRole("management");
  const {
    data: coachingStaff,
    loading: coachingLoading,
    error: coachingError,
  } = useTeamMembersByRole("coach");
  const {
    data: players,
    loading: playersLoading,
    error: playersError,
  } = useTeamMembersByRole("player");

  const renderStaffCard = (member: TeamMember) => (
    <div
      key={member.id}
      className={`staff-card ${member.role === 'player' ? 'player-card' : ''}`}
      onClick={member.role === 'player' ? () => setSelectedMember(member) : undefined}
    >
      <div className="staff-image-container">
        <div className="staff-image">
          {member.photoURL ? (
            <img src={member.photoURL} alt={member.name} />
          ) : (
            <div className="staff-placeholder">
              <i className={`fas ${member.role === 'player' ? 'fa-running' : 'fa-user'}`}></i>
            </div>
          )}
        </div>
        {member.jerseyNumber && (
          <div className="jersey-badge">#{member.jerseyNumber}</div>
        )}
        {member.role === 'player' && (
          <div className="card-overlay">
            <i className="fas fa-eye"></i>
            <span>View Details</span>
          </div>
        )}
      </div>

      <div className="staff-info">
        <div className="staff-header">
          <h3>{member.name}</h3>
          {member.nationality && (
            <div className="nationality-flag">
              <i className="fas fa-flag"></i>
              <span>{member.nationality}</span>
            </div>
          )}
        </div>

        <h4 className="staff-position">{member.title || member.position || "Team Member"}</h4>

        {member.role === "player" && member.stats && (
          <div className="quick-stats">
            <div className="stat-item">
              <span className="stat-value">{member.stats.goals || 0}</span>
              <span className="stat-label">Goals</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{member.stats.assists || 0}</span>
              <span className="stat-label">Assists</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{member.stats.gamesPlayed || 0}</span>
              <span className="stat-label">Games</span>
            </div>
          </div>
        )}

        {member.role === 'player' && member.bio && (
          <p className="staff-bio">{member.bio}</p>
        )}

        {member.role === 'player' && member.socialMedia && (
          <div className="social-media">
            {member.socialMedia.instagram && (
              <a
                href={member.socialMedia.instagram}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                <i className="fab fa-instagram"></i>
              </a>
            )}
            {member.socialMedia.twitter && (
              <a
                href={member.socialMedia.twitter}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                <i className="fab fa-twitter"></i>
              </a>
            )}
            {member.socialMedia.facebook && (
              <a
                href={member.socialMedia.facebook}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                <i className="fab fa-facebook"></i>
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="team-page">
      {/* Navigation Tabs */}
      <div className="team-navigation">
        <div className="team-nav-container">
          <button
            className={`team-nav-tab ${activeTab === "management" ? "active" : ""}`}
            onClick={() => setActiveTab("management")}
          >
            <i className="fas fa-building"></i>
            MANAGEMENT
          </button>
          <button
            className={`team-nav-tab ${activeTab === "coaching" ? "active" : ""}`}
            onClick={() => setActiveTab("coaching")}
          >
            <i className="fas fa-clipboard-list"></i>
            COACHING STAFF
          </button>
          <button
            className={`team-nav-tab ${activeTab === "players" ? "active" : ""}`}
            onClick={() => setActiveTab("players")}
          >
            <i className="fas fa-users"></i>
            PLAYERS
          </button>
        </div>
      </div>

      {/* Content Sections */}
      <div className="team-content">
        {activeTab === "management" && (
          <div className="management-section">
            <div className="section-header">
              <h2>MANAGEMENT TEAM</h2>
              <p>Leadership driving our vision forward</p>
            </div>
            {managementLoading ? (
              <div className="loading-container">
                <LoadingSpinner />
                <p>Loading management team...</p>
              </div>
            ) : managementError ? (
              <div className="error-container">
                <p>Error loading management team: {managementError}</p>
              </div>
            ) : managementTeam.length === 0 ? (
              <div className="empty-state">
                <p>No management team members found.</p>
              </div>
            ) : (
              <div className="staff-grid">
                {managementTeam.map(renderStaffCard)}
              </div>
            )}
          </div>
        )}

        {activeTab === "coaching" && (
          <div className="coaching-section">
            <div className="section-header">
              <h2>COACHING STAFF</h2>
              <p>Expert guidance for player development</p>
            </div>
            {coachingLoading ? (
              <div className="loading-container">
                <LoadingSpinner />
                <p>Loading coaching staff...</p>
              </div>
            ) : coachingError ? (
              <div className="error-container">
                <p>Error loading coaching staff: {coachingError}</p>
              </div>
            ) : coachingStaff.length === 0 ? (
              <div className="empty-state">
                <p>No coaching staff found.</p>
              </div>
            ) : (
              <div className="staff-grid">
                {coachingStaff.map(renderStaffCard)}
              </div>
            )}
          </div>
        )}

        {activeTab === "players" && (
          <div className="players-section">
            <div className="section-header">
              <h2>PLAYERS</h2>
              <p>Our talented squad</p>
            </div>
            {playersLoading ? (
              <div className="loading-container">
                <LoadingSpinner />
                <p>Loading players...</p>
              </div>
            ) : playersError ? (
              <div className="error-container">
                <p>Error loading players: {playersError}</p>
              </div>
            ) : players.length === 0 ? (
              <div className="players-empty-state">
                <div className="empty-state-content">
                  <div className="empty-state-icon">
                    <i className="fas fa-users"></i>
                  </div>
                  <h3 className="empty-state-title">Coming Soon</h3>
                  <p className="empty-state-subtitle">
                    Our talented squad is being assembled. Stay tuned for player announcements and roster updates as we build our championship team.
                  </p>
                  <div className="empty-state-features">
                    <div className="empty-state-feature">
                      <i className="fas fa-star"></i>
                      <span>Elite Players</span>
                    </div>
                    <div className="empty-state-feature">
                      <i className="fas fa-trophy"></i>
                      <span>Championship Ready</span>
                    </div>
                    <div className="empty-state-feature">
                      <i className="fas fa-globe"></i>
                      <span>International Talent</span>
                    </div>
                  </div>
                  <div className="empty-state-cta">
                    Follow for Updates
                  </div>
                </div>
              </div>
            ) : (
              <div className="staff-grid players-grid">
                {players
                  .sort(
                    (a, b) => (a.jerseyNumber || 99) - (b.jerseyNumber || 99),
                  )
                  .map(renderStaffCard)}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Member Detail Modal */}
      {selectedMember && (
        <div
          className="member-modal-overlay"
          onClick={() => setSelectedMember(null)}
        >
          <div className="member-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-member-info">
                <div className="modal-member-image">
                  {selectedMember.photoURL ? (
                    <img src={selectedMember.photoURL} alt={selectedMember.name} />
                  ) : (
                    <div className="modal-placeholder">
                      <i className={`fas ${selectedMember.role === 'player' ? 'fa-running' : 'fa-user'}`}></i>
                    </div>
                  )}
                </div>
                <div className="modal-member-details">
                  <h2>{selectedMember.name}</h2>
                  <p className="modal-position">{selectedMember.title || selectedMember.position || "Team Member"}</p>
                  {selectedMember.jerseyNumber && (
                    <div className="modal-jersey">#{selectedMember.jerseyNumber}</div>
                  )}
                </div>
              </div>
              <button
                className="close-button"
                onClick={() => setSelectedMember(null)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="black-modal-content modal-content" >
              {selectedMember.nationality && (
                <div className="modal-section">
                  <h4>Nationality</h4>
                  <p><i className="fas fa-flag"></i> {selectedMember.nationality}</p>
                </div>
              )}

              {selectedMember.bio && (
                <div className="modal-section">
                  <h4>Biography</h4>
                  <p>{selectedMember.bio}</p>
                </div>
              )}

              {selectedMember.role === "player" && selectedMember.stats && (
                <div className="modal-section">
                  <h4>Season Statistics</h4>
                  <div className="modal-stats-grid">
                    <div className="modal-stat">
                      <span className="modal-stat-value">{selectedMember.stats.goals || 0}</span>
                      <span className="modal-stat-label">Goals</span>
                    </div>
                    <div className="modal-stat">
                      <span className="modal-stat-value">{selectedMember.stats.assists || 0}</span>
                      <span className="modal-stat-label">Assists</span>
                    </div>
                    <div className="modal-stat">
                      <span className="modal-stat-value">{selectedMember.stats.gamesPlayed || 0}</span>
                      <span className="modal-stat-label">Games Played</span>
                    </div>
                    {selectedMember.stats.yellowCards !== undefined && (
                      <div className="modal-stat">
                        <span className="modal-stat-value">{selectedMember.stats.yellowCards}</span>
                        <span className="modal-stat-label">Yellow Cards</span>
                      </div>
                    )}
                    {selectedMember.stats.redCards !== undefined && (
                      <div className="modal-stat">
                        <span className="modal-stat-value">{selectedMember.stats.redCards}</span>
                        <span className="modal-stat-label">Red Cards</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {selectedMember.socialMedia && (
                <div className="modal-section">
                  <h4>Social Media</h4>
                  <div className="modal-social-media">
                    {selectedMember.socialMedia.instagram && (
                      <a
                        href={selectedMember.socialMedia.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-link instagram"
                      >
                        <i className="fab fa-instagram"></i>
                        <span>Instagram</span>
                      </a>
                    )}
                    {selectedMember.socialMedia.twitter && (
                      <a
                        href={selectedMember.socialMedia.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-link twitter"
                      >
                        <i className="fab fa-twitter"></i>
                        <span>Twitter</span>
                      </a>
                    )}
                    {selectedMember.socialMedia.facebook && (
                      <a
                        href={selectedMember.socialMedia.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-link facebook"
                      >
                        <i className="fab fa-facebook"></i>
                        <span>Facebook</span>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
