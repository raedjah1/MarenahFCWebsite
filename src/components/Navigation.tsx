import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useViewTransition } from './ViewTransition';
import logoImage from '../assets/images/Logo.png';
import './Navigation.css';

export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { i18n, t } = useTranslation();
  const [isVisible, setIsVisible] = useState(true);

  const location = useLocation();
  const { transitionNavigate, supportsViewTransitions } = useViewTransition();

  // Improved scroll behavior with debouncing and better threshold detection
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let lastScrollPosition = window.scrollY;
    const scrollThreshold = 5;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollingUp = currentScrollY < lastScrollPosition;
      const scrollingDown = currentScrollY > lastScrollPosition;
      const isAtTop = currentScrollY < 10;
      const isAtBottom = window.innerHeight + currentScrollY >= document.documentElement.scrollHeight - 10;
      const hasScrolledPastThreshold = Math.abs(currentScrollY - lastScrollPosition) > scrollThreshold;

      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(() => {
        if (isAtTop || isAtBottom) {
        setIsVisible(true);
        } else if (hasScrolledPastThreshold) {
          if (scrollingDown) {
        setIsVisible(false);
          } else if (scrollingUp) {
        setIsVisible(true);
      }
        }
        lastScrollPosition = currentScrollY;
      }, 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  useEffect(() => {
    const headerElement = document.querySelector('.header');
    if (headerElement) {
      headerElement.classList.toggle('visible', isVisible);
      headerElement.classList.toggle('hidden', !isVisible);
    }
  }, [isVisible]);

  // Close mobile menu when clicking outside or on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
        setIsMenuOpen(false);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.mobile-nav') && !target.closest('.mobile-toggle')) {
        setIsMobileMenuOpen(false);
      }
      if (!target.closest('.language-selector')) {
        setIsMenuOpen(false);
      }
    };

    if (isMobileMenuOpen || isMenuOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('click', handleClickOutside);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('click', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen, isMenuOpen]);

  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  const handleNavClick = (to: string, event: React.MouseEvent) => {
    event.preventDefault();
    closeMenu();
    
    if (supportsViewTransitions) {
      transitionNavigate(to);
    } else {
      window.location.href = to;
    }
  };

  const languages = [
    { code: 'en', flag: '🇬🇧', name: 'English' },
    { code: 'fr', flag: '🇫🇷', name: 'Français' },
    { code: 'wo', flag: '🇬🇲', name: 'Wolof' },
    { code: 'mnk', flag: '🇬🇲', name: 'Mandinka' }
  ];

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
    setIsMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setIsMenuOpen(false);
  };

  const navigationItems = [
    { path: '/who-we-are', key: 'navigation.who_we_are' },
    { path: '/team', key: 'navigation.team' },
    { path: '/matches', key: 'navigation.matches' },
    { path: '/facility', key: 'navigation.facility' },
    { path: '/store', key: 'navigation.store' }
  ];

  return (
    <>
      <Link to="/" className="header-logo" onClick={(e) => handleNavClick('/', e)}>
        <img src={logoImage} alt="Marenah FC Logo" className="logo-img" />
          </Link>

      {/* Desktop Navigation */}
      <nav className="header-nav">
        <ul className="nav-list">
          {navigationItems.map((item, index) => (
            <li key={item.path} className="nav-item">
              <Link 
                to={item.path} 
                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                onClick={(e) => handleNavClick(item.path, e)}
              >
                {t(item.key)}
              </Link>
            </li>
          ))}
          </ul>
        </nav>

      {/* Desktop Language Selector */}
      <div className="language-selector">
        <button 
          className="language-button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span className="selected-flag">
            {languages.find(lang => lang.code === i18n.language)?.flag}
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
                className={`language-option ${i18n.language === lang.code ? 'active' : ''}`}
                onClick={() => handleLanguageChange(lang.code)}
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
        className={`mobile-toggle ${isMobileMenuOpen ? 'active' : ''}`}
        onClick={toggleMobileMenu}
        aria-label="Toggle navigation menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Mobile Navigation Menu */}
      <div className={`mobile-nav ${isMobileMenuOpen ? 'open' : ''}`}>
        <ul className="mobile-nav-list">
          {navigationItems.map((item, index) => (
            <li key={item.path} className="mobile-nav-item">
              <Link 
                to={item.path} 
                className={`mobile-nav-link ${location.pathname === item.path ? 'active' : ''}`}
                onClick={(e) => handleNavClick(item.path, e)}
              >
                {t(item.key)}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile Language Selector */}
        <div className="mobile-language-selector">
          <h4 style={{ color: '#E6A64C', textAlign: 'center', marginBottom: '1rem' }}>
            Choose Language
          </h4>
          <div className="mobile-language-grid">
            {languages.map((lang) => (
              <button
                key={lang.code}
                className={`mobile-language-option ${i18n.language === lang.code ? 'active' : ''}`}
                onClick={() => handleLanguageChange(lang.code)}
              >
                <span className="flag">{lang.flag}</span>
                <span className="language-name">{lang.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};