import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          {/* About Column */}
          <div className="footer-column">
            <h4 className="footer-logo">
              <span>POV.r</span>
            </h4>
            <p className="footer-description">
              Transform your reality through immersive virtual experiences. 
              Connect, explore, and create in ways never before possible.
            </p>
            <div className="footer-social">
              <a 
                href="https://facebook.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
                aria-label="Facebook"
              >
                <i className="fab fa-facebook-f"></i>
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
                aria-label="Twitter"
              >
                <i className="fab fa-twitter"></i>
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
                aria-label="Instagram"
              >
                <i className="fab fa-instagram"></i>
              </a>
              <a 
                href="https://discord.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
                aria-label="Discord"
              >
                <i className="fab fa-discord"></i>
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="footer-column">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li>
                <Link to="/store">
                  <i className="fas fa-shopping-cart"></i> Store
                </Link>
              </li>
              <li>
                <Link to="/#features">
                  <i className="fas fa-star"></i> Features
                </Link>
              </li>
              <li>
                <Link to="/team">
                  <i className="fas fa-users"></i> Our Team
                </Link>
              </li>
              <li>
                <Link to="/support">
                  <i className="fas fa-headset"></i> Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Column */}
          <div className="footer-column">
            <h4>Resources</h4>
            <ul className="footer-links">
              <li>
                <Link to="/privacy">
                  <i className="fas fa-shield-alt"></i> Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms">
                  <i className="fas fa-file-contract"></i> Terms of Use
                </Link>
              </li>
              <li>
                <Link to="/blog">
                  <i className="fas fa-rss"></i> Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div className="footer-column">
            <h4>Contact Us</h4>
            <ul className="footer-links">
              <li>
                <a href="mailto:admin@pov-reality.com">
                  <i className="fas fa-envelope"></i> admin@pov-reality.com
                </a>
              </li>
              <li>
                <a href="tel:+447704659886">
                  <i className="fas fa-phone"></i> +44 7704 659886
                </a>
              </li>
              <li>
                <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer">
                  <i className="fas fa-map-marker-alt"></i> England and Wales
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            &copy; {currentYear} POV Reality Limited. All rights reserved.
          </p>
          <div className="footer-legal">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
            <Link to="/support">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};