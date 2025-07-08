import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logoImage from '../assets/images/logo_test.png';
import './Navigation.css';

interface NavigationProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ isDarkMode, onToggleTheme }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Update title based on current route
    const baseTitle = 'POV-Reality';
    let pageTitle = baseTitle;

    switch (location.pathname) {
      case '/':
        pageTitle = `Home | ${baseTitle}`;
        break;
      case '/store':
        pageTitle = `Store | ${baseTitle}`;
        break;
      case '/signin':
        pageTitle = `Sign In | ${baseTitle}`;
        break;
      case '/signup':
        pageTitle = `Sign Up | ${baseTitle}`;
        break;
      default:
        pageTitle = baseTitle;
    }

    document.title = pageTitle;
  }, [location.pathname]);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="main-header">
      <div className="header-container">
        <div className="logo-section">
          <Link to="/" className="logo-wrapper" onClick={closeMenu}>
            <img 
              src={logoImage}
              alt="POV-Reality" 
              className="logo-image"
            />
            <span className="brand-name">POV-Reality</span>
          </Link>
        </div>

        <input 
          type="checkbox" 
          id="nav-toggle" 
          className="nav-toggle"
          checked={isMenuOpen}
          onChange={() => setIsMenuOpen(!isMenuOpen)}
        />
        <label htmlFor="nav-toggle" className="nav-toggle-label">
          <span></span>
        </label>

        <div className="theme-toggle" onClick={onToggleTheme}>
          <div className={`theme-toggle-icon ${isDarkMode ? 'moon' : 'sun'}`} />
        </div>

        <nav className="main-nav">
          <ul className="nav-links">
            <li className={location.pathname === '/' ? 'active' : ''}>
              <Link 
                to="/" 
                onClick={closeMenu}
              >
                Home
              </Link>
            </li>
            <li className={location.pathname === '/store' ? 'active' : ''}>
              <Link 
                to="/store" 
                onClick={closeMenu}
              >
                Store
              </Link>
            </li>
            <li className={location.pathname === '/team' ? 'active' : ''}>
              <Link 
                to="/team" 
                onClick={closeMenu}
              >
                Our Team
              </Link>
            </li>
            <li className={location.pathname === '/support' ? 'active' : ''}>
              <Link 
                to="/support" 
                onClick={closeMenu}
              >
                Support
              </Link>
            </li>
            <li className={location.pathname === '/blog' ? 'active' : ''}>
              <Link 
                to="/blog" 
                onClick={closeMenu}
              >
                Blog
              </Link>
            </li>
            <li>
              <Link 
                to="/signin" 
                onClick={closeMenu} 
                className="nav-button"
                aria-label="Sign in to your account"
              >
                Sign In
              </Link>
            </li>
            <li>
              <Link 
                to="/signup" 
                onClick={closeMenu} 
                className="nav-button primary"
                aria-label="Create new account"
              >
                Sign Up
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};