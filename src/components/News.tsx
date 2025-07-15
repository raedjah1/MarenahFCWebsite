import { useState } from 'react';
import './News.css';
import { useUpcomingMatches } from "../hooks/useFirebase";
import { LoadingSpinner } from "./LoadingSpinner";
import { formatMatchDate } from "../firebase";
import type { Match } from "../firebase/types";
import logoImage from "../assets/images/Logo.png";

export const News = () => {
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

  // Fetch upcoming matches
  const {
    data: upcomingMatches,
    loading: upcomingLoading,
    error: upcomingError,
  } = useUpcomingMatches(6); // Limit to 6 matches for the news section

  // Helper function to get team logo
  const getTeamLogo = (teamName: string, isMarenah: boolean = false, logoUrl?: string) => {
    if (isMarenah) {
      return (
        <div className="team-logo marenah-logo">
          <img
            src={logoImage}
            alt="Marenah FC"
            className="team-logo-img"
          />
        </div>
      );
    }

    if (logoUrl) {
      return (
        <div className="team-logo opponent-logo">
          <img
            src={logoUrl}
            alt={teamName}
            className="team-logo-img"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              const parent = target.parentElement;
              if (parent) {
                const initials = teamName
                  .split(' ')
                  .map(word => word.charAt(0))
                  .join('')
                  .substring(0, 3)
                  .toUpperCase();
                parent.innerHTML = `<span class="logo-text">${initials}</span>`;
              }
            }}
          />
        </div>
      );
    }

    const initials = teamName
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .substring(0, 3)
      .toUpperCase();

    return (
      <div className="team-logo opponent-logo">
        <span className="logo-text">{initials}</span>
      </div>
    );
  };



  // Helper function to render match card similar to MatchesPage
  const renderMatchCard = (match: Match) => {
    const matchTime = new Date(match.date.seconds * 1000); // Convert Firestore timestamp to Date

    return (
      <div
        key={match.id}
        className="match-card upcoming"
        onClick={() => setSelectedMatch(match)}
      >
        <div className="match-header">
          <div className="competition-badge">
            <i className="fas fa-trophy"></i>
            <span>{match.competition || "Friendly"}</span>
          </div>
          <div className="match-date-time">
            <span className="date">{formatMatchDate(match.date, true)}</span>
            <span className="time">{matchTime.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            })}</span>
          </div>
        </div>

        <div className="match-teams-container">
          <div className="team-section home-team">
            {getTeamLogo("Marenah FC", true)}
            <div className="team-info">
              <span className="team-name">Marenah FC</span>
              <span className="team-label">{match.isHome ? "HOME" : "AWAY"}</span>
            </div>
          </div>

          <div className="match-center">
            <div className="vs-indicator">
              <span className="vs-text">VS</span>
              <div className="match-countdown">
                <i className="fas fa-clock"></i>
              </div>
            </div>
          </div>

          <div className="team-section away-team">
            <div className="team-info">
              <span className="team-name">{match.opponent}</span>
              <span className="team-label">{!match.isHome ? "HOME" : "AWAY"}</span>
            </div>
            {getTeamLogo(match.opponent, false, match.opponentLogo)}
          </div>
        </div>

        <div className="match-footer">
          <div className="venue-info">
            <i className={`fas ${match.isHome ? "fa-home" : "fa-plane"}`}></i>
            <span>{match.location}</span>
          </div>

          <div className="upcoming-badge">
            <i className="fas fa-calendar-alt"></i>
            <span>UPCOMING</span>
          </div>
        </div>

        <div className="match-hover-overlay">
          <i className="fas fa-eye"></i>
          <span>View Details</span>
        </div>
      </div>
    );
  };

  return (
    <section className="news-section">
      <div className="container">
        <h2 className="news-title">UPCOMING MATCHES</h2>
        <p className="news-subtitle">MARK YOUR CALENDAR</p>

        {upcomingLoading ? (
          <div className="loading-container">
            <LoadingSpinner />
            <p>Loading upcoming fixtures...</p>
          </div>
        ) : upcomingError ? (
          <div className="error-container">
            <p>Error loading fixtures: {upcomingError}</p>
          </div>
        ) : upcomingMatches.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-calendar-times"></i>
            <p>No upcoming fixtures scheduled.</p>
          </div>
        ) : (
          <div className="matches-grid">
            {upcomingMatches.map(renderMatchCard)}
          </div>
        )}
      </div>

      {/* Match Detail Modal */}
      {selectedMatch && (
        <div
          className="match-modal-overlay"
          onClick={() => setSelectedMatch(null)}
        >
          <div className="match-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-competition">
                <i className="fas fa-trophy"></i>
                <span>{selectedMatch.competition || "Friendly"}</span>
              </div>
              <button
                className="close-button"
                onClick={() => setSelectedMatch(null)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="black-modal-content modal-content">
              <div className="modal-teams-display">
                <div className="modal-team">
                  {getTeamLogo("Marenah FC", true)}
                  <div className="modal-team-info">
                    <h3>Marenah FC</h3>
                    <span className="modal-team-label">{selectedMatch.isHome ? "HOME" : "AWAY"}</span>
                  </div>
                </div>

                <div className="modal-match-center">
                  <div className="modal-upcoming">
                    <span className="modal-vs">VS</span>
                    <div className="modal-match-time">
                      <span className="modal-date">{formatMatchDate(selectedMatch.date)}</span>
                      <span className="modal-time">
                        {new Date(selectedMatch.date.seconds * 1000).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="modal-team">
                  {getTeamLogo(selectedMatch.opponent, false, selectedMatch.opponentLogo)}
                  <div className="modal-team-info">
                    <h3>{selectedMatch.opponent}</h3>
                    <span className="modal-team-label">{!selectedMatch.isHome ? "HOME" : "AWAY"}</span>
                  </div>
                </div>
              </div>

              <div className="modal-match-details">
                <div className="modal-detail-item">
                  <i className={`fas ${selectedMatch.isHome ? "fa-home" : "fa-plane"}`}></i>
                  <div className="modal-detail-content">
                    <span className="modal-detail-label">Venue</span>
                    <span className="modal-detail-value">{selectedMatch.location}</span>
                  </div>
                </div>

                <div className="modal-detail-item">
                  <i className="fas fa-calendar-alt"></i>
                  <div className="modal-detail-content">
                    <span className="modal-detail-label">Date & Time</span>
                    <span className="modal-detail-value">
                      {formatMatchDate(selectedMatch.date)} at {new Date(selectedMatch.date.seconds * 1000).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {selectedMatch.notes && (
                <div className="modal-notes">
                  <h4>Match Notes</h4>
                  <p>{selectedMatch.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}; 