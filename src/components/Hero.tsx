import React from 'react';
import './Hero.css';
import mfcLogo from '../assets/images/MFC__Main_Logo.jpg';
import teamImage from '../assets/images/team.JPG';
import coachImage from '../assets/images/coach_image.JPG';

const Hero: React.FC = () => {
  const currentHero = 0; // Always show the first slide

  const heroes = [
    {
      id: 1,
      title: "DREAM",
      subtitle: "RIGHT TO",
      description: "Every child deserves the opportunity to pursue their dreams through football, education, and character development.",
      background: "linear-gradient(135deg, var(--background-color) 0%, #1a1a1a 50%, var(--secondary-color) 100%)",
      accent: "var(--primary-color)",
      showLogo: true,
      showTeam: false
    },
    {
      id: 2,
      title: "EXCELLENCE",
      subtitle: "STRIVING FOR",
      description: "We nurture talent and build character that transforms lives and communities.",
      background: "linear-gradient(125deg, var(--background-color) 0%, var(--secondary-color) 50%, #2a2a2a 100%)",
      accent: "var(--secondary-color)",
      showLogo: false,
      showTeam: true
    },
    {
      id: 3,
      title: "FUTURE",
      subtitle: "BUILDING THE",
      description: "Join us in creating pathways to success for the next generation of dreamers, leaders, and champions.",
      background: "linear-gradient(45deg, var(--background-color) 0%, #2a1f0a 50%, var(--primary-color) 100%)",
      accent: "var(--primary-color)",
      showLogo: false,
      showTeam: false
    }
  ];

  const currentHeroData = heroes[currentHero];

  return (
    <section className="hero-section" data-hero-id={currentHero}>
      {/* Background Layer */}
      <div className="hero-background" style={{
        background: currentHeroData.background
      }} />

      {/* Overlay Pattern */}
      <div className="hero-overlay-pattern"></div>

      {/* Content Container */}
      <div className="hero-container">
        {currentHeroData.showLogo ? (
          /* Logo-centered layout for first slide */
          <div className="hero-logo-layout">
            <div className="hero-logo-section">
              <div className="hero-logo-circle">
                <img 
                  src={mfcLogo} 
                  alt="MFC Main Logo" 
                  className="hero-logo-image-large"
                />
              </div>
              <div className="hero-club-info">
                <h1 className="hero-club-name">Marenah Futbol Club</h1>
                <p className="hero-club-quote">Redefining Football Excellence</p>
              </div>
            </div>
          </div>
        ) : currentHeroData.showTeam ? (
          /* Team and coach layout for second slide */
          <div className="hero-team-layout">
            <div className="hero-team-content">
              <div className="hero-team-header">
                <div className="hero-subtitle" style={{ color: currentHeroData.accent }}>
                  {currentHeroData.subtitle}
                </div>
                <h1 className="hero-title">
                  {currentHeroData.title}
                </h1>
              </div>
              
              <div className="hero-team-images">
                <div className="team-image-card">
                  <img 
                    src={teamImage} 
                    alt="Marenah FC Team" 
                    className="team-image"
                  />
                  <div className="image-label">
                    <span>Our Squad</span>
                  </div>
                </div>
                
                <div className="team-image-card">
                  <img 
                    src={coachImage} 
                    alt="Team Coaches" 
                    className="team-image"
                  />
                  <div className="image-label">
                    <span>Our Coaches</span>
                  </div>
                </div>
              </div>
              
              <div className="hero-team-description">
                <p>{currentHeroData.description}</p>
              </div>
            </div>
          </div>
        ) : (
          /* Regular layout for other slides */
          <div className="hero-content">
            {/* Text Content */}
            <div className="hero-text">
              <div className="hero-subtitle" style={{ color: currentHeroData.accent }}>
                {currentHeroData.subtitle}
              </div>
              <h1 className="hero-title">
                {currentHeroData.title}
              </h1>
              <p className="hero-description">
                {currentHeroData.description}
              </p>
            </div>

            {/* Visual Element */}
            <div className="hero-visual">
              <div className="hero-accent-circle" style={{ backgroundColor: currentHeroData.accent }}>
                <div className="circle-content">
                  <span className="circle-number">{String(currentHero + 1).padStart(2, '0')}</span>
                  <span className="circle-total">/{String(heroes.length).padStart(2, '0')}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Hero; 