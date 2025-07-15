import React from 'react';
import './FacilityPage.css';
import futureFacilityImage from '../assets/images/futurefacility.png';

export const FacilityPage = () => {
  return (
    <div className="facility-page">
      <div className="facility-content">
        <div className="academy-section">
          <div className="section-header">
            <h2>MARENAH FC ACADEMY</h2>
            <p>Developing the next generation of Gambian football talent</p>
          </div>

          {/* Future Facility Showcase */}
          <div className="future-facility-showcase">
            <div className="facility-image-container">
              <img 
                src={futureFacilityImage} 
                alt="Future Marenah FC Facility" 
                className="facility-image"
              />
              <div className="facility-overlay">
                <h3>Future Marenah FC Complex</h3>
                <p>Architectural vision of our world-class facility</p>
              </div>
            </div>
            <div className="academy-facilities">
              <h3>Academy Facilities</h3>
              <div className="academy-features">
                <div className="academy-feature">
                  <i className="fas fa-futbol"></i>
                  <div>
                    <h4>Training Pitches</h4>
                    <p>Modern drainage and lighting systems</p>
                  </div>
                </div>
                
                <div className="academy-feature">
                  <i className="fas fa-home"></i>
                  <div>
                    <h4>Accommodation</h4>
                    <p>Modern dormitories with study areas</p>
                  </div>
                </div>
                
                <div className="academy-feature">
                  <i className="fas fa-book"></i>
                  <div>
                    <h4>Education Center</h4>
                    <p>Dedicated learning facilities</p>
                  </div>
                </div>
                
                <div className="academy-feature">
                  <i className="fas fa-heartbeat"></i>
                  <div>
                    <h4>Medical Center</h4>
                    <p>Sports medicine specialists</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="vision-section">
            <div className="vision-content">
              <div className="vision-header">
                <h3>Our Vision</h3>
                <p>To create a world-class youth development program that combines football excellence with education, producing well-rounded individuals who can compete at the highest levels of international football while representing Gambian values and culture.</p>
              </div>
              
              <div className="programs-container">
                <h4>Development Programs</h4>
                <div className="programs-grid">
                  <div className="program-card">
                    <div className="program-icon">
                      <i className="fas fa-child"></i>
                    </div>
                    <div className="program-content">
                      <h4>Youth Development</h4>
                      <p>Foundational skills development with emphasis on technical ability</p>
                      <ul className="program-features">
                        <li><i className="fas fa-check"></i>Ages 8-14</li>
                        <li><i className="fas fa-check"></i>Technical fundamentals</li>
                        <li><i className="fas fa-check"></i>Physical literacy</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="program-card">
                    <div className="program-icon">
                      <i className="fas fa-user-graduate"></i>
                    </div>
                    <div className="program-content">
                      <h4>Pre-Professional</h4>
                      <p>Advanced training preparing players for professional pathways</p>
                      <ul className="program-features">
                        <li><i className="fas fa-check"></i>Ages 15-17</li>
                        <li><i className="fas fa-check"></i>Tactical development</li>
                        <li><i className="fas fa-check"></i>Competition focus</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="program-card">
                    <div className="program-icon">
                      <i className="fas fa-trophy"></i>
                    </div>
                    <div className="program-content">
                      <h4>Elite Pathway</h4>
                      <p>Direct route to Marenah FC first team opportunities</p>
                      <ul className="program-features">
                        <li><i className="fas fa-check"></i>Ages 18-21</li>
                        <li><i className="fas fa-check"></i>Professional integration</li>
                        <li><i className="fas fa-check"></i>Elite competition</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 