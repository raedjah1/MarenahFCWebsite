import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './PageTransition.css';

interface PageTransitionProps {
  children: React.ReactNode;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState<'fade-in' | 'fade-out'>('fade-in');

  useEffect(() => {
    if (location.pathname !== displayLocation.pathname) {
      setTransitionStage('fade-out');
    }
  }, [location, displayLocation]);

  return (
    <div className="page-transition-container">
      <div
        className={`page-transition-content ${transitionStage}`}
        onAnimationEnd={() => {
          if (transitionStage === 'fade-out') {
            setDisplayLocation(location);
            setTransitionStage('fade-in');
          }
        }}
      >
        {React.cloneElement(children as React.ReactElement, { key: displayLocation.pathname })}
      </div>
    </div>
  );
}; 