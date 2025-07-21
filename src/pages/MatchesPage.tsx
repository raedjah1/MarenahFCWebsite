import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import "./MatchesPage.css";
import { useUpcomingMatches, useMatches } from "../hooks/useFirebase";
import { LoadingSpinner } from "../components/LoadingSpinner";
import {
  formatMatchDate,
  formatMatchScore,
  getMatchResultType,
} from "../firebase";
import type { Match } from "../firebase/types";
import logoImage from "../assets/images/Logo.png";

export const MatchesPage = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<
    "fixtures" | "results" | "statistics"
  >("fixtures");
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

  // Fetch upcoming matches
  const {
    data: upcomingMatches,
    loading: upcomingLoading,
    error: upcomingError,
  } = useUpcomingMatches(10);

  // Memoize the date range to prevent infinite re-renders
  const pastMatchesDateRange = useMemo(() => ({
    start: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), // Last year
    end: new Date(),
  }), []); // Empty dependency array since we want this to be calculated once

  // Fetch past matches (results)
  const {
    data: pastMatches,
    loading: pastLoading,
    error: pastError,
  } = useMatches({
    dateRange: pastMatchesDateRange,
    orderBy: "date",
    orderDirection: "desc",
    limit: 20,
  });

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

  const renderMatchCard = (match: Match) => {
    const isUpcoming = match.status === "scheduled";
    const resultType = getMatchResultType(match);
    const matchTime = new Date(match.date.seconds * 1000);

    return (
      <div
        key={match.id}
        className={`match-card ${match.status} ${resultType || ""} ${isUpcoming ? 'upcoming' : 'completed'}`}
        onClick={() => setSelectedMatch(match)}
      >
        <div className="match-header">
          <div className="competition-badge">
            <i className="fas fa-trophy"></i>
            <span>{match.competition || t('matches.friendly')}</span>
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
              <span className="team-label">{match.isHome ? t('matches.home') : t('matches.away')}</span>
            </div>
            {match.result && (
              <div className="team-score">
                {match.isHome ? match.result.homeScore : match.result.awayScore}
              </div>
            )}
          </div>

          <div className="match-center">
            {isUpcoming ? (
              <div className="vs-indicator">
                <span className="vs-text">{t('matches.vs')}</span>
                <div className="match-countdown">
                  <i className="fas fa-clock"></i>
                </div>
              </div>
            ) : (
              <div className="final-score">
                <span className="score-display">{formatMatchScore(match)}</span>
                <span className="final-text">{t('matches.final')}</span>
              </div>
            )}
          </div>

          <div className="team-section away-team">
            {match.result && (
              <div className="team-score">
                {match.isHome ? match.result.awayScore : match.result.homeScore}
              </div>
            )}
            <div className="team-info">
              <span className="team-name">{match.opponent}</span>
              <span className="team-label">{!match.isHome ? t('matches.home') : t('matches.away')}</span>
            </div>
            {getTeamLogo(match.opponent, false, match.opponentLogo)}
          </div>
        </div>

        <div className="match-footer">
          <div className="venue-info">
            <i className={`fas ${match.isHome ? "fa-home" : "fa-plane"}`}></i>
            <span>{match.location}</span>
          </div>
          
          {match.result && resultType && (
            <div className={`result-badge ${resultType}`}>
              <span className="result-text">
                {resultType === "win" ? t('matches.victory') : 
                 resultType === "draw" ? t('matches.draw') : t('matches.defeat')}
              </span>
            </div>
          )}
          
          {isUpcoming && (
            <div className="upcoming-badge">
              <i className="fas fa-calendar-alt"></i>
              <span>{t('news.upcoming')}</span>
            </div>
          )}
        </div>

        <div className="match-hover-overlay">
          <i className="fas fa-eye"></i>
          <span>{t('news.view_details')}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="matches-page">
      {/* Navigation Tabs */}
      <div className="matches-navigation">
        <div className="matches-nav-container">
          <button
            className={`matches-nav-tab ${activeTab === "fixtures" ? "active" : ""}`}
            onClick={() => setActiveTab("fixtures")}
          >
            <i className="fas fa-calendar-plus"></i>
            {t('matches.fixtures')}
          </button>
          <button
            className={`matches-nav-tab ${activeTab === "results" ? "active" : ""}`}
            onClick={() => setActiveTab("results")}
          >
            <i className="fas fa-trophy"></i>
            {t('matches.results')}
          </button>
          <button
            className={`matches-nav-tab ${activeTab === "statistics" ? "active" : ""}`}
            onClick={() => setActiveTab("statistics")}
          >
            <i className="fas fa-chart-line"></i>
            {t('matches.statistics')}
          </button>
        </div>
      </div>

      {/* Content Sections */}
      <div className="matches-content">
        {activeTab === "fixtures" && (
          <div className="fixtures-section">
            <div className="section-header">
              <h2>{t('matches.upcoming_fixtures')}</h2>
              <p>{t('matches.scheduled_matches')}</p>
            </div>

            {upcomingLoading ? (
              <div className="loading-container">
                <LoadingSpinner />
                <p>{t('news.loading')}</p>
              </div>
            ) : upcomingError ? (
              <div className="error-container">
                <p>{t('news.error')}: {upcomingError}</p>
              </div>
            ) : upcomingMatches.length === 0 ? (
              <div className="empty-state">
                <i className="fas fa-calendar-times"></i>
                <p>{t('news.no_fixtures')}</p>
              </div>
            ) : (
              <div className="matches-grid">
                {upcomingMatches.map(renderMatchCard)}
              </div>
            )}
          </div>
        )}

        {activeTab === "results" && (
          <div className="results-section">
            <div className="section-header">
              <h2>{t('matches.recent_results')}</h2>
              <p>{t('matches.latest_outcomes')}</p>
            </div>

            {pastLoading ? (
              <div className="loading-container">
                <LoadingSpinner />
                <p>{t('news.loading')}</p>
              </div>
            ) : pastError ? (
              <div className="error-container">
                <p>{t('news.error')}: {pastError}</p>
              </div>
            ) : pastMatches.length === 0 ? (
              <div className="empty-state">
                <i className="fas fa-trophy"></i>
                <p>{t('news.no_fixtures')}</p>
              </div>
            ) : (
              <div className="matches-grid">
                {pastMatches.map(renderMatchCard)}
              </div>
            )}
          </div>
        )}

        {activeTab === "statistics" && (
          <div className="statistics-section">
            <div className="section-header">
              <h2>{t('matches.season_statistics')}</h2>
              <p>{t('matches.performance_overview')}</p>
            </div>

            <div className="stats-overview">
              <div className="stat-card wins">
                <div className="stat-icon">
                  <i className="fas fa-trophy"></i>
                </div>
                <div className="stat-content">
                  <h3>{pastMatches.filter((m) => getMatchResultType(m) === "win").length}</h3>
                  <p>{t('matches.wins')}</p>
                </div>
              </div>
              <div className="stat-card draws">
                <div className="stat-icon">
                  <i className="fas fa-handshake"></i>
                </div>
                <div className="stat-content">
                  <h3>{pastMatches.filter((m) => getMatchResultType(m) === "draw").length}</h3>
                  <p>{t('matches.draws')}</p>
                </div>
              </div>
              <div className="stat-card losses">
                <div className="stat-icon">
                  <i className="fas fa-times-circle"></i>
                </div>
                <div className="stat-content">
                  <h3>{pastMatches.filter((m) => getMatchResultType(m) === "loss").length}</h3>
                  <p>{t('matches.losses')}</p>
                </div>
              </div>
              <div className="stat-card total">
                <div className="stat-icon">
                  <i className="fas fa-futbol"></i>
                </div>
                <div className="stat-content">
                  <h3>{pastMatches.length}</h3>
                  <p>{t('matches.total_games')}</p>
                </div>
              </div>
            </div>

            {pastMatches.length > 0 && (
              <div className="additional-stats">
                <div className="stat-row">
                  <div className="stat-item">
                    <span className="stat-label">{t('matches.win_rate')}</span>
                    <span className="stat-value">
                      {Math.round((pastMatches.filter((m) => getMatchResultType(m) === "win").length / pastMatches.length) * 100)}%
                    </span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">{t('matches.goals_scored')}</span>
                    <span className="stat-value">
                      {pastMatches.reduce((total, match) => {
                        if (match.result) {
                          return total + (match.isHome ? match.result.homeScore : match.result.awayScore);
                        }
                        return total;
                      }, 0)}
                    </span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">{t('matches.goals_conceded')}</span>
                    <span className="stat-value">
                      {pastMatches.reduce((total, match) => {
                        if (match.result) {
                          return total + (match.isHome ? match.result.awayScore : match.result.homeScore);
                        }
                        return total;
                      }, 0)}
                    </span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">{t('matches.goal_difference')}</span>
                    <span className="stat-value">
                      {pastMatches.reduce((total, match) => {
                        if (match.result) {
                          const scored = match.isHome ? match.result.homeScore : match.result.awayScore;
                          const conceded = match.isHome ? match.result.awayScore : match.result.homeScore;
                          return total + (scored - conceded);
                        }
                        return total;
                      }, 0)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Enhanced Match Detail Modal */}
      {selectedMatch && (
        <div
          className="match-modal-overlay"
          onClick={() => setSelectedMatch(null)}
        >
          <div className="match-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-competition">
                <i className="fas fa-trophy"></i>
                <span>{selectedMatch.competition || t('matches.friendly')}</span>
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
                    <span className="modal-team-label">{selectedMatch.isHome ? t('matches.home') : t('matches.away')}</span>
                  </div>
                  {selectedMatch.result && (
                    <div className="modal-team-score">
                      {selectedMatch.isHome ? selectedMatch.result.homeScore : selectedMatch.result.awayScore}
                    </div>
                  )}
                </div>

                <div className="modal-match-center">
                  {selectedMatch.status === "scheduled" ? (
                    <div className="modal-upcoming">
                      <span className="modal-vs">{t('matches.vs')}</span>
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
                  ) : (
                    <div className="modal-result">
                      <span className="modal-final-score">{formatMatchScore(selectedMatch)}</span>
                      <span className="modal-final-text">{t('matches.final')}</span>
                    </div>
                  )}
                </div>

                <div className="modal-team">
                  {getTeamLogo(selectedMatch.opponent, false, selectedMatch.opponentLogo)}
                  <div className="modal-team-info">
                    <h3>{selectedMatch.opponent}</h3>
                    <span className="modal-team-label">{!selectedMatch.isHome ? t('matches.home') : t('matches.away')}</span>
                  </div>
                  {selectedMatch.result && (
                    <div className="modal-team-score">
                      {selectedMatch.isHome ? selectedMatch.result.awayScore : selectedMatch.result.homeScore}
                    </div>
                  )}
                </div>
              </div>

              <div className="modal-match-details">
                <div className="modal-detail-item">
                  <i className={`fas ${selectedMatch.isHome ? "fa-home" : "fa-plane"}`}></i>
                  <div className="modal-detail-content">
                    <span className="modal-detail-label">{t('matches.venue')}</span>
                    <span className="modal-detail-value">{selectedMatch.location}</span>
                  </div>
                </div>

                <div className="modal-detail-item">
                  <i className="fas fa-calendar-alt"></i>
                  <div className="modal-detail-content">
                    <span className="modal-detail-label">{t('matches.date_time')}</span>
                    <span className="modal-detail-value">
                      {formatMatchDate(selectedMatch.date)} at {new Date(selectedMatch.date.seconds * 1000).toLocaleTimeString('en-US', { 
                        hour: '2-digit', 
                        minute: '2-digit',
                        hour12: true 
                      })}
                    </span>
                  </div>
                </div>

                {selectedMatch.result && (
                  <div className="modal-detail-item">
                    <i className="fas fa-futbol"></i>
                    <div className="modal-detail-content">
                      <span className="modal-detail-label">{t('matches.result')}</span>
                      <span className="modal-detail-value">
                        {getMatchResultType(selectedMatch) === "win" ? t('matches.victory') : 
                         getMatchResultType(selectedMatch) === "draw" ? t('matches.draw') : t('matches.defeat')}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {selectedMatch.notes && (
                <div className="modal-notes">
                  <h4>{t('matches.match_notes')}</h4>
                  <p>{selectedMatch.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
