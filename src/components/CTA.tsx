import { useState, useEffect } from 'react';
import './CTA.css';
import appScreenshot1 from '../assets/images/app-screenshot-1.png';
import appScreenshot2 from '../assets/images/app-screenshot-2.png';
import appScreenshot3 from '../assets/images/app-screenshot-3.png';

export const CTA = () => {
  const screenshots = [appScreenshot1, appScreenshot2, appScreenshot3];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % screenshots.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [screenshots.length]);

  return (
    <section id="cta-section" className="full-width">
      <a id="cta"></a>
      
      {/* Enhanced background animation */}
      <div className="animated-background">
        <div className="particles">
          <div className="particle particle-1"></div>
          <div className="particle particle-2"></div>
          <div className="particle particle-3"></div>
          <div className="particle particle-4"></div>
          <div className="particle particle-5"></div>
          <div className="particle particle-6"></div>
          <div className="particle particle-7"></div>
          <div className="particle particle-8"></div>
        </div>
        <div className="gradient-overlay"></div>
      </div>
      
      <div className="container">
        <div className="row cta-card">
          {/* iPhone on the left */}
          <div className="col-lg-5 col-md-12">
            <div className="phone-container">
              <div className="phone">
                <div className="buttons">
                  <div className="left">
                    <div className="button"></div>
                    <div className="button"></div>
                    <div className="button"></div>
                  </div>
                  <div className="right">
                    <div className="button"></div>
                  </div>
                </div>
                <div className="screen-container">
                  <div className="camera"></div>
                  <div className="notch-container">
                    <div className="notch">
                      <div className="content">
                        <div className="left">
                          <div className="tile"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="notch-blur"></div>
                  <div className="screen">
                    <div className="screenshot-slideshow">
                      {screenshots.map((screenshot, index) => (
                        <img 
                          key={index}
                          src={screenshot}
                          alt={`App Screenshot ${index + 1}`}
                          className={`screenshot-image ${index === currentImageIndex ? 'active' : ''}`}
                          loading="lazy"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Content on the right */}
          <div className="col-lg-7 col-md-12">
            <div className="cta-content">
              <h1 className="text-reveal">GET STARTED NOW</h1>
              <p className="text-reveal">
                Join the future of social interaction. POV-Reality brings people together in ways never before possible. 
                Experience immersive social connections, attend virtual events, and create lasting memories in VR.
              </p>
              
              <div className="cta-container">
                <div className="cta-left-content">
                  <div className="features-list">
                    <div className="feature-item">
                      <i className="fas fa-vr-cardboard"></i>
                      <span>Immersive VR</span>
                    </div>
                    <div className="feature-item">
                      <i className="fas fa-users"></i>
                      <span>Social Connections</span>
                    </div>
                    <div className="feature-item">
                      <i className="fas fa-calendar-alt"></i>
                      <span>Virtual Events</span>
                    </div>
                  </div>
                </div>
                
                <div className="cta-right-content">
                  
                  <div className="store-buttons">
                    <a href="#" className="store-button apple-store">
                      <div className="store-button-content">
                        <div className="store-icon">
                          <i className="fab fa-apple"></i>
                        </div>
                        <div className="store-text">
                          <span className="store-label">Download on the</span>
                          <span className="store-name">App Store</span>
                        </div>
                      </div>
                    </a>
                    <a href="#" className="store-button google-play">
                      <div className="store-button-content">
                        <div className="store-icon">
                          <i className="fab fa-google-play"></i>
                        </div>
                        <div className="store-text">
                          <span className="store-label">GET IT ON</span>
                          <span className="store-name">Google Play</span>
                        </div>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}; 