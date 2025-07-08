import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export const CookieNotification = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosed, setIsClosed] = useState(false);

  useEffect(() => {
    const hasAccepted = localStorage.getItem('cookiesAccepted');
    if (!hasAccepted) {
      setTimeout(() => setIsOpen(true), 2000);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setIsClosed(true);
    localStorage.setItem('cookiesAccepted', 'true');
  };

  if (isClosed) return null;

  return (
    <div id="cookies">
      <div className={`cookies-bar ${isOpen ? 'open' : ''}`}>
        <div className="cookies-wrapper">
          <p>
            This website uses cookies to track visitors. Please see our{' '}
            <Link to="/privacy">Privacy Policy</Link> for more information.
          </p>
        </div>
        <button className="button" id="cookies-close" onClick={handleClose}>
          X
        </button>
      </div>
    </div>
  );
}; 