import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useViewTransition } from './ViewTransition';
import logoImage from '../assets/images/Logo.png';
import './Navigation.css';

export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const location = useLocation();
  const { transitionNavigate, supportsViewTransitions } = useViewTransition();
  
  const closeMenu = () => setIsMenuOpen(false);

  const handleNavClick = (to: string, event: React.MouseEvent) => {
    event.preventDefault();
    closeMenu();
    
    if (supportsViewTransitions) {
      transitionNavigate(to);
    } else {
      // Fallback: navigate normally
      window.location.href = to;
    }
  };

  const languages = [
    { code: 'en', flag: '🇬🇧', name: 'English' },
    { code: 'fr', flag: '🇫🇷', name: 'Français' },
    { code: 'wo', flag: '🇬🇲', name: 'Wolof' }
  ];

  return (
    <header className="header">
      {/* Overlay */}
      <div className="header-overlay"></div>
      
      {/* Logo */}
      <div className="header-logo">
        <Link 
          to="/" 
          className="logo-link" 
          onClick={(e) => handleNavClick('/', e)}
        >
          <img 
            src={logoImage} 
            alt="Right To Dream Logo" 
            className="logo-img"
          />
        </Link>
      </div>

      {/* Navigation Menu */}
      <nav className="header-nav">
        <ul className="nav-list">
          <li className="nav-item">
            <Link 
              to="/team" 
              className={`nav-link ${location.pathname === '/team' ? 'active' : ''}`}
              onClick={(e) => handleNavClick('/team', e)}
            >
              TEAM
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              to="/matches" 
              className={`nav-link ${location.pathname === '/matches' ? 'active' : ''}`}
              onClick={(e) => handleNavClick('/matches', e)}
            >
              MATCHES
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              to="/facility" 
              className={`nav-link ${location.pathname === '/facility' ? 'active' : ''}`}
              onClick={(e) => handleNavClick('/facility', e)}
            >
              FACILITY
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              to="/store" 
              className={`nav-link ${location.pathname === '/store' ? 'active' : ''}`}
              onClick={(e) => handleNavClick('/store', e)}
            >
              STORE
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              to="/blog" 
              className={`nav-link ${location.pathname === '/blog' ? 'active' : ''}`}
              onClick={(e) => handleNavClick('/blog', e)}
            >
              NEWS
            </Link>
          </li>
        </ul>
      </nav>

      {/* Language Selector */}
      <div className="language-selector">
        <button 
          className="language-button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span className="selected-flag">
            {languages.find(lang => lang.code === selectedLanguage)?.flag}
          </span>
          <svg className="dropdown-arrow" width="12" height="6" viewBox="0 0 12 6">
            <path d="M1 1L6 5L11 1" stroke="#FFFFFF" strokeWidth="1.5" fill="none"/>
          </svg>
        </button>
        
        {isMenuOpen && (
          <div className="language-dropdown">
            {languages.map((lang) => (
              <button
                key={lang.code}
                className={`language-option ${selectedLanguage === lang.code ? 'active' : ''}`}
                onClick={() => {
                  setSelectedLanguage(lang.code);
                }}
              >
                <span className="flag">{lang.flag}</span>
                <span className="language-name">{lang.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Mobile menu toggle */}
      <button 
        className="mobile-toggle"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle navigation menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
    </header>
  );
};