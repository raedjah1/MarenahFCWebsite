import { Link } from 'react-router-dom';
import logoImage from '../assets/images/Logo.png';
import './Footer.css';

export const Footer = () => {
  return (
    <div className="footer-container">
      <div className="footer-content">
        <div className="footer-logo">
          <img src={logoImage} alt="Right To Dream" />
        </div>
        
        <div className="footer-navigation">
          <div className="footer-section">
            <h4>WHO WE ARE</h4>
            <ul>
              <li><Link to="/about">OUR APPROACH</Link></li>
              <li><Link to="/dreamers">OUR DREAMERS</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>ACADEMIES & CLUBS</h4>
            <ul>
              <li><Link to="/news">NEWS</Link></li>
              <li><Link to="/partners">PARTNERS</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>PRESS & MEDIA</h4>
            <ul>
              <li><Link to="/team">MEET THE TEAM</Link></li>
              <li><Link to="/join">JOIN OUR FAMILY</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-right">
          <div className="social-links">
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-youtube"></i>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-facebook"></i>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-tiktok"></i>
            </a>
          </div>
          <p className="footer-copyright">© 2023 by Right To Dream.</p>
        </div>
      </div>
    </div>
  );
};