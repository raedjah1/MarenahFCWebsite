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
            <p>Developing the next generation of Gambiaese football talent</p>
          </div>

          {/* Future Facility Image */}
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
          </div>

          <div className="academy-content">
            <div className="academy-overview">
              <div className="academy-vision">
                <h3>Our Vision</h3>
                <p>To create a world-class youth development program that combines football excellence with education, producing well-rounded individuals who can compete at the highest levels of international football while representing Gambiaese values and culture.</p>
              </div>

              <div className="academy-programs">
                <h3>Development Programs</h3>
                <div className="programs-grid">
                  <div className="program-card">
                    <div className="program-icon">
                      <i className="fas fa-child"></i>
                    </div>
                    <h4>Youth Development (12-16)</h4>
                    <p>Foundational skills development with emphasis on technical ability and game intelligence</p>
                  </div>
                  
                  <div className="program-card">
                    <div className="program-icon">
                      <i className="fas fa-user-graduate"></i>
                    </div>
                    <h4>Pre-Professional (17-19)</h4>
                    <p>Advanced training preparing players for professional football and higher education pathways</p>
                  </div>
                  
                  <div className="program-card">
                    <div className="program-icon">
                      <i className="fas fa-trophy"></i>
                    </div>
                    <h4>Elite Pathway</h4>
                    <p>Direct route to Marenah FC first team and international opportunities</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="academy-facilities">
              <h3>Academy Facilities</h3>
              <div className="academy-features">
                <div className="academy-feature">
                  <i className="fas fa-futbol"></i>
                  <div>
                    <h4>6 Training Pitches</h4>
                    <p>Age-appropriate sized pitches with modern drainage and lighting</p>
                  </div>
                </div>
                
                <div className="academy-feature">
                  <i className="fas fa-home"></i>
                  <div>
                    <h4>Residential Accommodation</h4>
                    <p>Modern dormitories for 200 academy players with study areas</p>
                  </div>
                </div>
                
                <div className="academy-feature">
                  <i className="fas fa-book"></i>
                  <div>
                    <h4>Educational Center</h4>
                    <p>Classrooms and learning facilities ensuring academic excellence</p>
                  </div>
                </div>
                
                <div className="academy-feature">
                  <i className="fas fa-heartbeat"></i>
                  <div>
                    <h4>Medical Center</h4>
                    <p>Dedicated healthcare facility with sports medicine specialists</p>
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