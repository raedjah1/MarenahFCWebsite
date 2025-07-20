
import './SponsorshipPage.css';

const SponsorshipPage = () => {
  return (
    <div className="sponsorship-page">
      {/* Main Content */}
      <div className="container">
        <div className="page-header">
          <h1>Partnership Opportunities</h1>
          <p>Join Marenah FC in our journey to excellence</p>
        </div>

        {/* Partnership Tiers */}
        <section className="partnership-tiers">
          <div className="tiers-grid">
            <div className="tier-card">
              <div className="tier-header">
                <h3>GOLD PARTNER</h3>
                <div className="tier-price">Premium</div>
              </div>
              <ul className="tier-features">
                <li>Main Jersey Sponsorship</li>
                <li>Stadium Naming Rights</li>
                <li>VIP Hospitality Access</li>
                <li>Digital Content Integration</li>
                <li>Exclusive Event Access</li>
              </ul>
              <button className="tier-cta">Contact Us</button>
            </div>
            <div className="tier-card featured">
              <div className="tier-header">
                <h3>PLATINUM PARTNER</h3>
                <div className="tier-price">Elite</div>
              </div>
              <ul className="tier-features">
                <li>All Gold Benefits</li>
                <li>Academy Naming Rights</li>
                <li>Global Marketing Rights</li>
                <li>Youth Program Integration</li>
                <li>Custom Partnership Programs</li>
              </ul>
              <button className="tier-cta">Contact Us</button>
            </div>
            <div className="tier-card">
              <div className="tier-header">
                <h3>SILVER PARTNER</h3>
                <div className="tier-price">Standard</div>
              </div>
              <ul className="tier-features">
                <li>Training Kit Sponsorship</li>
                <li>LED Board Advertising</li>
                <li>Match Day Activation</li>
                <li>Social Media Integration</li>
                <li>Networking Events Access</li>
              </ul>
              <button className="tier-cta">Contact Us</button>
            </div>
          </div>
        </section>

        {/* Current Partners */}
        <section className="current-partners" id="current-partners">
          <h2>Our Partners</h2>
          <div className="partners-grid">
            {/* Partner logos will be added here */}
            <div className="partner-placeholder">Partner Logo</div>
            <div className="partner-placeholder">Partner Logo</div>
            <div className="partner-placeholder">Partner Logo</div>
            <div className="partner-placeholder">Partner Logo</div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="contact-section">
          <div className="contact-content">
            <h2>Get in Touch</h2>
            <p>Ready to explore partnership opportunities? Our team is here to create a custom solution for your brand.</p>
            <div className="contact-info">
              <div className="contact-method">
                <i className="fas fa-envelope"></i>
                <h4>Email Us</h4>
                <p>partnerships@marenahfc.com</p>
              </div>
              <div className="contact-method">
                <i className="fas fa-phone"></i>
                <h4>Call Us</h4>
                <p>+221 XX XXX XXXX</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SponsorshipPage; 