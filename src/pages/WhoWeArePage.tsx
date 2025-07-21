import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './WhoWeArePage.css';
// Import the who we are image
import whoWeAreImage from '../assets/images/whowearemarenah.png';

export const WhoWeArePage = () => {
  const { t } = useTranslation();
  const [activePillar, setActivePillar] = useState(0);

  const pillars = [
    {
      id: 0,
      title: t('who_we_are.education.title'),
      subtitle: t('who_we_are.education.subtitle'),
      description: t('who_we_are.education.description'),
      icon: "fas fa-graduation-cap",
      color: "#E6A64C"
    },
    {
      id: 1,
      title: t('who_we_are.football.title'),
      subtitle: t('who_we_are.football.subtitle'),
      description: t('who_we_are.football.description'),
      icon: "fas fa-futbol",
      color: "#76572B"
    },
    {
      id: 2,
      title: t('who_we_are.character.title'),
      subtitle: t('who_we_are.character.subtitle'),
      description: t('who_we_are.character.description'),
      icon: "fas fa-star",
      color: "#E6A64C"
    }
  ];

  // Auto-rotate pillars every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActivePillar((prev) => (prev + 1) % pillars.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="who-we-are-page">
      <div className="page-container">
        {/* Header Section */}
        <header className="page-header">
          <h1 className="main-title">{t('who_we_are.title')}</h1>
          <p className="main-subtitle">
            {t('who_we_are.subtitle')}
          </p>
        </header>

        {/* Hero Team Photo */}
        <div className="hero-image-section">
          <div className="team-photo-container">
            <div className="team-photo">
              <img src={whoWeAreImage} alt={t('who_we_are.photo_title')} />
              <div className="photo-overlay">
                <div className="photo-info">
                  <h3 className="photo-title">{t('who_we_are.photo_title')}</h3>
                  <p className="photo-subtitle">{t('who_we_are.photo_subtitle')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="content-grid">
          {/* Left Side - Pillars */}
          <div className="pillars-container">
            <h2 className="pillars-heading">{t('pillars.title')}</h2>
            <div className="pillars-list">
              {pillars.map((pillar, index) => (
                <div 
                  key={pillar.id}
                  className={`pillar-item ${activePillar === index ? 'active' : ''}`}
                  onClick={() => setActivePillar(index)}
                >
                  <div className="pillar-icon">
                    <i className={pillar.icon}></i>
                  </div>
                  <div className="pillar-content">
                    <h3 className="pillar-title">{pillar.title}</h3>
                    <p className="pillar-subtitle">{pillar.subtitle}</p>
                  </div>
                  <div className="pillar-indicator"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Active Pillar Details */}
          <div className="pillar-details">
            <div className="active-pillar-content">
              <div className="pillar-header">
                <div 
                  className="pillar-accent" 
                  style={{ backgroundColor: pillars[activePillar].color }}
                ></div>
                <h3 className="active-pillar-title">{pillars[activePillar].title}</h3>
              </div>
              <h4 className="active-pillar-subtitle">{pillars[activePillar].subtitle}</h4>
              <p className="active-pillar-description">{pillars[activePillar].description}</p>
              
              {/* Progress indicators */}
              <div className="pillar-progress">
                {pillars.map((_, index) => (
                  <div 
                    key={index}
                    className={`progress-dot ${activePillar === index ? 'active' : ''}`}
                    onClick={() => setActivePillar(index)}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Mission Statement */}
        <footer className="mission-footer">
          <div className="mission-content">
            <h3>{t('who_we_are.mission_title')}</h3>
            <p>{t('who_we_are.mission_text')}</p>
          </div>
        </footer>
      </div>
    </div>
  );
}; 