import React from 'react';
import { useTranslation } from 'react-i18next';
import './Hero.css';
import mfcLogo from '../assets/images/MFC__Main_Logo.jpg';
import teamImage from '../assets/images/team.JPG';
import coachImage from '../assets/images/coach_image.JPG';

const Hero: React.FC = () => {
  const { t } = useTranslation();
  const currentHero = 0; // Always show the first slide

  const heroes = [
    {
      id: 1,
      title: t('hero.dream.title'),
      subtitle: t('hero.dream.subtitle'),
      description: t('hero.dream.description'),
      background: "linear-gradient(135deg, var(--background-color) 0%, #1a1a1a 50%, var(--secondary-color) 100%)",
      accent: "var(--primary-color)",
      showLogo: true,
      showTeam: false
    },
    {
      id: 2,
      title: t('hero.excellence.title'),
      subtitle: t('hero.excellence.subtitle'),
      description: t('hero.excellence.description'),
      background: "linear-gradient(125deg, var(--background-color) 0%, var(--secondary-color) 50%, #2a2a2a 100%)",
      accent: "var(--secondary-color)",
      showLogo: false,
      showTeam: true
    },
    {
      id: 3,
      title: t('hero.future.title'),
      subtitle: t('hero.future.subtitle'),
      description: t('hero.future.description'),
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
                  alt={t('hero.club_name')} 
                  className="hero-logo-image-large"
                />
              </div>
              <div className="hero-club-info">
                <h1 className="hero-club-name">{t('hero.club_name')}</h1>
                <p className="hero-club-quote">{t('hero.tagline')}</p>
                
                {/* Social Media Buttons */}
                <div className="hero-social-links">
                  <a 
                    href="https://instagram.com/marenahfc" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="hero-social-link"
                    aria-label="Follow us on Instagram"
                  >
                    <i className="fab fa-instagram"></i>
                  </a>
                  <a 
                    href="https://facebook.com/marenahfc" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="hero-social-link"
                    aria-label="Follow us on Facebook"
                  >
                    <i className="fab fa-facebook-f"></i>
                  </a>
                </div>
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