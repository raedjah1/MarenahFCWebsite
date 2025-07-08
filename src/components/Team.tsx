import './Team.css';

export const Team = () => {
  return (
    <section id="team-section" className="full-width">
      <a id="team"></a>
      
      {/* Background particles */}
      <div className="particles">
        <div className="particle particle-1"></div>
        <div className="particle particle-2"></div>
        <div className="particle particle-3"></div>
        <div className="particle particle-4"></div>
      </div>
      
      <div className="container">
        <div className="team-grid">
          {/* Founder */}
          <div className="team-card">
            <div className="team-card-inner">
              <div className="team-image-container">
                <div className="team-image-placeholder">
                  <i className="fas fa-user"></i>
                </div>
                <div className="team-image-glow"></div>
              </div>
              <div className="team-info">
                <h3 className="team-name">Jamal Facey</h3>
                <p className="team-role">Co-Founder</p>
                <p className="team-bio">
                  Visionary entrepreneur with a passion for creating immersive social experiences that connect people across the globe.
                </p>
                <div className="team-social">
                  <a href="#" className="team-social-link">
                    <i className="fab fa-linkedin"></i>
                  </a>
                  <a href="#" className="team-social-link">
                    <i className="fab fa-twitter"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          {/* Technical Co-Founder 1 */}
          <div className="team-card">
            <div className="team-card-inner">
              <div className="team-image-container">
                <div className="team-image-placeholder">
                  <i className="fas fa-user"></i>
                </div>
                <div className="team-image-glow"></div>
              </div>
              <div className="team-info">
                <h3 className="team-name">Raed Jah</h3>
                <p className="team-role">Technical Co-Founder</p>
                <p className="team-bio">
                  Innovative developer with expertise in VR technologies, focused on creating seamless and immersive virtual experiences.
                </p>
                <div className="team-social">
                  <a href="#" className="team-social-link">
                    <i className="fab fa-github"></i>
                  </a>
                  <a href="#" className="team-social-link">
                    <i className="fab fa-linkedin"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          {/* Technical Co-Founder 2 */}
          <div className="team-card">
            <div className="team-card-inner">
              <div className="team-image-container">
                <div className="team-image-placeholder">
                  <i className="fas fa-user"></i>
                </div>
                <div className="team-image-glow"></div>
              </div>
              <div className="team-info">
                <h3 className="team-name">Mothuso Malunga</h3>
                <p className="team-role">Technical Co-Founder</p>
                <p className="team-bio">
                  Talented engineer specializing in backend infrastructure and scalable systems for virtual reality applications.
                </p>
                <div className="team-social">
                  <a href="#" className="team-social-link">
                    <i className="fab fa-github"></i>
                  </a>
                  <a href="#" className="team-social-link">
                    <i className="fab fa-linkedin"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}; 