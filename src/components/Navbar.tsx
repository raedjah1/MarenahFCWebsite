import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="main-header">
      <div className="header-container">
        <div className="logo-section">
          <Link to="/" className="logo-wrapper" onClick={closeMenu}>
            <span className="brand-name">POV</span>
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

        <nav className="main-nav">
          <ul className="nav-links">
            <li className={location.pathname === '/' ? 'active' : ''}>
              <Link 
                to="/" 
                onClick={closeMenu}
                className={location.pathname === '/' ? 'active' : ''}
              >
                Home
              </Link>
            </li>
            <li className={location.pathname === '/store' ? 'active' : ''}>
              <Link 
                to="/store" 
                onClick={closeMenu}
                className={location.pathname === '/store' ? 'active' : ''}
              >
                Store
              </Link>
            </li>
            <li className={location.pathname === '/about' ? 'active' : ''}>
              <Link 
                to="/about"
                onClick={closeMenu}
                className={location.pathname === '/about' ? 'active' : ''}
              >
                About
              </Link>
            </li>
            <li className={location.pathname === '/team' ? 'active' : ''}>
              <Link 
                to="/team"
                onClick={closeMenu}
                className={location.pathname === '/team' ? 'active' : ''}
              >
                Our Team
              </Link>
            </li>
            <li className={location.pathname === '/blog' ? 'active' : ''}>
              <Link 
                to="/blog"
                onClick={closeMenu}
                className={location.pathname === '/blog' ? 'active' : ''}
              >
                Blog
              </Link>
            </li>
            <li className={location.pathname === '/support' ? 'active' : ''}>
              <Link 
                to="/support"
                onClick={closeMenu}
                className={location.pathname === '/support' ? 'active' : ''}
              >
                Support
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};