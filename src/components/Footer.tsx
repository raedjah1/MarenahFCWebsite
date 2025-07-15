import { Link, useNavigate } from 'react-router-dom';
import logoImage from '../assets/images/Logo.png';
import './Footer.css';

export const Footer = () => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    // Instant scroll to top before navigation
    window.scrollTo(0, 0);
    navigate(path);
  };

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
            <Link to="/team" onClick={() => window.scrollTo(0, 0)}><h4>TEAM</h4></Link>
          </div>

          <div className="footer-section">
            <Link to="/matches" onClick={() => window.scrollTo(0, 0)}><h4>MATCHES</h4></Link>
          </div>

          <div className="footer-section">
            <Link to="/facility" onClick={() => window.scrollTo(0, 0)}><h4>FACILITY</h4></Link>
          </div>

          <div className="footer-section">
            <Link to="/store" onClick={() => window.scrollTo(0, 0)}><h4>STORE</h4></Link>
          </div>

          <div className="footer-section">
            <Link to="/sponsorship" onClick={() => window.scrollTo(0, 0)}><h4>PARTNERS</h4></Link>
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
            <a href="https://www.instagram.com/marenahfc/" target="_blank" rel="noopener noreferrer" className="social-link">
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
            <Link to="/privacy" onClick={() => window.scrollTo(0, 0)}>Privacy Policy</Link>
            <Link to="/terms" onClick={() => window.scrollTo(0, 0)}>Terms of Service</Link>
            <Link to="/admin" onClick={() => window.scrollTo(0, 0)} className="admin-link">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};