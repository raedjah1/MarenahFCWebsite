import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useViewTransition } from './ViewTransition';
import logoImage from '../assets/images/Logo.png';
import './Navigation.css';

export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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

  const closeMenu = () => setIsMenuOpen(false);

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
  };

  return (
    <>
      <Link to="/" className="header-logo" onClick={(e) => handleNavClick('/', e)}>
        <img src={logoImage} alt="Marenah FC Logo" />
      </Link>

      <nav className="header-nav">
        <ul>
          <li className="nav-item">
            <Link 
              to="/who-we-are" 
              className={`nav-link ${location.pathname === '/who-we-are' ? 'active' : ''}`}
              onClick={(e) => handleNavClick('/who-we-are', e)}
            >
              {t('navigation.who_we_are')}
            </Link>
          </li>

          <li className="nav-item">
            <Link 
              to="/team" 
              className={`nav-link ${location.pathname === '/team' ? 'active' : ''}`}
              onClick={(e) => handleNavClick('/team', e)}
            >
              {t('navigation.team')}
            </Link>
          </li>

          <li className="nav-item">
            <Link 
              to="/matches" 
              className={`nav-link ${location.pathname === '/matches' ? 'active' : ''}`}
              onClick={(e) => handleNavClick('/matches', e)}
            >
              {t('navigation.matches')}
            </Link>
          </li>

          <li className="nav-item">
            <Link 
              to="/facility" 
              className={`nav-link ${location.pathname === '/facility' ? 'active' : ''}`}
              onClick={(e) => handleNavClick('/facility', e)}
            >
              {t('navigation.facility')}
            </Link>
          </li>

          <li className="nav-item">
            <Link 
              to="/store" 
              className={`nav-link ${location.pathname === '/store' ? 'active' : ''}`}
              onClick={(e) => handleNavClick('/store', e)}
            >
              {t('navigation.store')}
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
        className="mobile-toggle"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle navigation menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
    </>
  );
};