import { useState, useEffect } from 'react';
import './WhoWeArePage.css';
// Import the who we are image
import whoWeAreImage from '../assets/images/whowearemarenah.png';

export const WhoWeArePage = () => {
  const [activePillar, setActivePillar] = useState(0);

  const pillars = [
    {
      id: 0,
      title: "EDUCATION",
      subtitle: "Foundation of Growth",
      description: "We believe education is the cornerstone of success. Our players receive formal schooling, trade skills, and life education that opens doors beyond football.",
      icon: "fas fa-graduation-cap",
      color: "#E6A64C"
    },
    {
      id: 1,
      title: "FOOTBALL",
      subtitle: "Excellence in Sport",
      description: "Elite training, professional coaching, and competitive play develop world-class athletes ready for international opportunities.",
      icon: "fas fa-futbol",
      color: "#76572B"
    },
    {
      id: 2,
      title: "CHARACTER",
      subtitle: "Building Leaders",
      description: "Discipline, integrity, and leadership shape our players into role models who inspire their communities and create positive change.",
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
          <h1 className="main-title">WHO WE ARE</h1>
          <p className="main-subtitle">
            Marenah FC is more than a football club. We are a catalyst for transformation, 
            building complete individuals through our three foundational pillars.
          </p>
        </header>

        {/* Hero Team Photo */}
        <div className="hero-image-section">
          <div className="team-photo-container">
            <div className="team-photo">
              <img src={whoWeAreImage} alt="Marenah FC Team" />
              <div className="photo-overlay">
                <div className="photo-info">
                  <h3 className="photo-title">Marenah FC</h3>
                  <p className="photo-subtitle">United in Purpose, Driven by Excellence</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="content-grid">
          {/* Left Side - Pillars */}
          <div className="pillars-container">
            <h2 className="pillars-heading">OUR PILLARS</h2>
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
            <h3>OUR MISSION</h3>
            <p>
              To develop young talent holistically, creating pathways to success both on and off the field 
              while uplifting communities across The Gambia and beyond.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}; 