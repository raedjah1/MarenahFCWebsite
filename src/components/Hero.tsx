import React, { useState, useEffect } from 'react';
import './Hero.css';
import createImage from '../assets/images/create.jpeg';
import spectatorImage from '../assets/images/Spectator.png';

const Hero: React.FC = () => {
  const [currentText, setCurrentText] = useState(0);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  
  useEffect(() => {
    const interval = setInterval(() => {
      if (!showOptions) {
        setCurrentText((prev) => (prev + 1) % 3);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [showOptions]);
  
  const handleAppButtonClick = () => {
    setButtonClicked(true);
    setTimeout(() => {
      setButtonClicked(false);
      setShowOptions(true);
    }, 1000);
  };

  return (
    <section className="hero-unit">
      <div className="hero-dots"></div>
      <div className="hero-background">
        <div className="hero-overlay"></div>
      </div>
      
      <div className="hero-content-wrapper">
        {/* Left Column - Modern iPhone */}
        <div className="hero-left">
          <div className="iphone-image-container">
            <div className="iphone-frame">
              <div className="iphone-notch"></div>
              <div className="iphone-screen">
                <div className={`screen-content ${showOptions ? 'options-visible' : ''}`}>
                  {!showOptions ? (
                    <>
                      <div className="app-logo">
                        <span>POV</span>
                      </div>
                      <div className="screen-text">
                        <span className={currentText === 0 ? 'active' : ''}>Record</span>
                        <span className={currentText === 1 ? 'active' : ''}>Share</span>
                        <span className={currentText === 2 ? 'active' : ''}>Inspire</span>
                      </div>
                      <button 
                        className={`app-button ${buttonClicked ? 'clicked' : ''}`}
                        onClick={handleAppButtonClick}
                      >
                        {buttonClicked ? 'Starting...' : 'Begin'}
                      </button>
                    </>
                  ) : (
                    <div className="options-container">
                      <h3 className="options-title">Choose Your Experience</h3>
                      <div className="options-buttons">
                        <div className="option-card">
                          <img src={createImage} alt="Create" className="option-image" />
                          <span className="option-label">Create</span>
                        </div>
                        <div className="option-card">
                          <img src={spectatorImage} alt="Spectate" className="option-image" />
                          <span className="option-label">Spectate</span>
                        </div>
                      </div>
                      <button 
                        className="back-button"
                        onClick={() => setShowOptions(false)}
                      >
                        Back
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="iphone-home-indicator"></div>
            </div>
          </div>
        </div>
        
        {/* Right Column - Text content */}
        <div className="hero-right">
          <div className="hero-text-content">
            <h1 className="hero-title">Capture Your Perspective</h1>
            <h2 className="hero-subtitle">Share your unique view of the world</h2>
            <p className="hero-description">
              POV is a revolutionary platform that lets you record and share your perspective with the world. Join our community of creators and start sharing your unique point of view today.
            </p>
            <div className="hero-cta-buttons">
              <button className="primary-button">Get Started</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero; 