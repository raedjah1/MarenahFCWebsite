import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import logoImage from '../assets/images/Logo.png';
import './Footer.css';

export const Footer = () => {

  const { t } = useTranslation();



  return (
    <footer className="footer-container">
      <div className="footer-overlay"></div>
      
        <div className="footer-content">
        {/* Logo Section */}
        <div className="footer-logo-section">
          <div className="footer-logo">
            <img src={logoImage} alt="Marenah Futbol Club" />
          </div>
          <h3 className="footer-club-name">{t('footer.club_name')}</h3>
          <p className="footer-tagline">{t('footer.tagline')}</p>
            </div>
        
        {/* Navigation Links */}
        <div className="footer-navigation">
          <div className="footer-section">
            <Link to="/team" onClick={() => window.scrollTo(0, 0)}>
              <h4>{t('navigation.team')}</h4>
            </Link>
          </div>

          <div className="footer-section">
            <Link to="/matches" onClick={() => window.scrollTo(0, 0)}>
              <h4>{t('navigation.matches')}</h4>
            </Link>
          </div>

          <div className="footer-section">
            <Link to="/facility" onClick={() => window.scrollTo(0, 0)}>
              <h4>{t('navigation.facility')}</h4>
            </Link>
          </div>

          <div className="footer-section">
            <Link to="/store" onClick={() => window.scrollTo(0, 0)}>
              <h4>{t('navigation.store')}</h4>
            </Link>
          </div>

          <div className="footer-section">
            <Link to="/sponsorship" onClick={() => window.scrollTo(0, 0)}>
              <h4>{t('navigation.partners')}</h4>
            </Link>
          </div>
        </div>

        {/* Contact & Social */}
        <div className="footer-contact-section">
          <h4>{t('footer.connect')}</h4>
          <div className="contact-info">
            <p><i className="fas fa-map-marker-alt"></i> {t('footer.location')}</p>
            <p><i className="fas fa-envelope"></i> {t('footer.email')}</p>
            <p><i className="fas fa-phone"></i> {t('footer.phone')}</p>
          </div>
          
          <div className="social-links">
            <a href="https://www.instagram.com/marenahfc/" target="_blank" rel="noopener noreferrer" className="social-link">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link">
              <i className="fab fa-facebook"></i>
            </a>
          </div>
        </div>
      </div>
      
      {/* Bottom Section */}
        <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p className="footer-copyright">{t('footer.copyright')}</p>
          <div className="footer-legal">
            <Link to="/privacy" onClick={() => window.scrollTo(0, 0)}>{t('footer.privacy')}</Link>
            <Link to="/terms" onClick={() => window.scrollTo(0, 0)}>{t('footer.terms')}</Link>
            <Link to="/admin" onClick={() => window.scrollTo(0, 0)} className="admin-link">{t('footer.admin')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};