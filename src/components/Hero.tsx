import React, { useState } from 'react';
import './Hero.css';
import mfcLogo from '../assets/images/MFC__Main_Logo.jpg';

const Hero: React.FC = () => {
  const [currentHero, setCurrentHero] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const heroes = [
    {
      id: 1,
      title: "DREAM",
      subtitle: "RIGHT TO",
      description: "Every child deserves the opportunity to pursue their dreams through football, education, and character development.",
      cta: "DISCOVER OUR MISSION",
      background: "linear-gradient(135deg, var(--background-color) 0%, #1a1a1a 50%, var(--secondary-color) 100%)",
      accent: "var(--primary-color)",
      showLogo: true
    },
    {
      id: 2,
      title: "EXCELLENCE",
      subtitle: "PURSUING",
      description: "Through our holistic approach, we nurture talent and build character that transforms lives and communities.",
      cta: "OUR APPROACH",
      background: "linear-gradient(125deg, var(--background-color) 0%, var(--secondary-color) 50%, #2a2a2a 100%)",
      accent: "var(--secondary-color)",
      showLogo: false
    },
    {
      id: 3,
      title: "FUTURE",
      subtitle: "BUILDING THE",
      description: "Join us in creating pathways to success for the next generation of dreamers, leaders, and champions.",
      cta: "JOIN OUR FAMILY",
      background: "linear-gradient(45deg, var(--background-color) 0%, #2a1f0a 50%, var(--primary-color) 100%)",
      accent: "var(--primary-color)",
      showLogo: false
    }
  ];

  const handleHeroChange = (index: number) => {
    if (index !== currentHero && !isTransitioning) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentHero(index);
        setIsTransitioning(false);
      }, 500);
    }
  };

  const currentHeroData = heroes[currentHero];

  return (
    <section className="hero-section" data-hero-id={currentHero}>
      {/* Background Layers */}
      <div className="hero-backgrounds">
        {heroes.map((hero, index) => (
          <div
            key={hero.id}
            className={`hero-background ${index === currentHero ? 'active' : ''}`}
            style={{
              background: hero.background
            }}
          />
        ))}
      </div>

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
        ) : (
          /* Regular layout for other slides */
          <div className="hero-content">
            {/* Text Content */}
            <div className={`hero-text ${isTransitioning ? 'transitioning' : ''}`}>
              <div className="hero-subtitle" style={{ color: currentHeroData.accent }}>
                {currentHeroData.subtitle}
              </div>
              <h1 className="hero-title">
                {currentHeroData.title}
              </h1>
              <p className="hero-description">
                {currentHeroData.description}
              </p>
              <button 
                className="hero-cta"
                style={{ 
                  borderColor: currentHeroData.accent,
                  color: currentHeroData.accent
                }}
              >
                {currentHeroData.cta}
                <svg className="cta-arrow" width="20" height="12" viewBox="0 0 20 12">
                  <path 
                    d="M1 6h16m-6-5l5 5-5 5" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    fill="none"
                  />
                </svg>
              </button>
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

        {/* Navigation Dots */}
        <div className="hero-navigation">
          {heroes.map((_, index) => (
            <button
              key={index}
              className={`nav-dot ${index === currentHero ? 'active' : ''}`}
              onClick={() => handleHeroChange(index)}
              style={{
                backgroundColor: index === currentHero ? currentHeroData.accent : 'rgba(255,255,255,0.3)'
              }}
            />
          ))}
        </div>
      </div>

      {/* Floating Elements */}
      <div className="floating-elements">
        <div className="float-element" style={{ backgroundColor: currentHeroData.accent }}></div>
        <div className="float-element" style={{ backgroundColor: 'var(--secondary-color)' }}></div>
        <div className="float-element" style={{ backgroundColor: currentHeroData.accent }}></div>
      </div>
    </section>
  );
};

export default Hero; 