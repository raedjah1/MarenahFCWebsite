import { Link } from 'react-router-dom';
import logoImage from '../assets/images/Logo.png';
import './Footer.css';

export const Footer = () => {
  return (
    <footer className="footer-container">
      {/* Glassmorphism Overlay */}
      <div className="footer-overlay"></div>
      
        <div className="footer-content">
        {/* Logo Section */}
        <div className="footer-logo-section">
          <div className="footer-logo">
            <img src={logoImage} alt="Marenah Futbol Club" />
          </div>
          <h3 className="footer-club-name">MARENAH FUTBOL CLUB</h3>
          <p className="footer-tagline">Redefining Football Excellence</p>
            </div>
        
        {/* Navigation Links */}
        <div className="footer-navigation">
          <div className="footer-section">
            <h4>TEAM</h4>
            <ul>
              <li><Link to="/team">SQUAD</Link></li>
              <li><Link to="/team/coaching">COACHING STAFF</Link></li>
              <li><Link to="/team/management">MANAGEMENT</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>MATCHES</h4>
            <ul>
              <li><Link to="/matches">FIXTURES</Link></li>
              <li><Link to="/matches/results">RESULTS</Link></li>
              <li><Link to="/matches/statistics">STATISTICS</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>FACILITY</h4>
            <ul>
              <li><Link to="/facility">FUTURE COMPLEX</Link></li>
              <li><Link to="/facility/academy">ACADEMY</Link></li>
              <li><Link to="/facility/tours">VIRTUAL TOURS</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>STORE</h4>
            <ul>
              <li><Link to="/store">MERCHANDISE</Link></li>
              <li><Link to="/store/jerseys">JERSEYS</Link></li>
              <li><Link to="/store/accessories">ACCESSORIES</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>PARTNERS</h4>
            <ul>
              <li><Link to="/sponsorship">BECOME A SPONSOR</Link></li>
              <li><Link to="/sponsorship#current-partners">CURRENT PARTNERS</Link></li>
              <li><Link to="/sponsorship#opportunities">OPPORTUNITIES</Link></li>
            </ul>
          </div>
        </div>

        {/* Contact & Social */}
        <div className="footer-contact-section">
          <h4>CONNECT WITH US</h4>
          <div className="contact-info">
            <p><i className="fas fa-map-marker-alt"></i> Marenah, Gambia</p>
            <p><i className="fas fa-envelope"></i> info@marenahfc.com</p>
            <p><i className="fas fa-phone"></i> +221 XX XXX XXXX</p>
          </div>
          
          <div className="social-links">
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-link">
              <i className="fab fa-youtube"></i>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link">
              <i className="fab fa-facebook"></i>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="social-link">
              <i className="fab fa-tiktok"></i>
            </a>
          </div>
        </div>
      </div>
      
      {/* Bottom Section */}
        <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p className="footer-copyright">© 2024 Marenah Futbol Club. All Rights Reserved.</p>
          <div className="footer-legal">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
            <Link to="/admin" className="admin-link">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};