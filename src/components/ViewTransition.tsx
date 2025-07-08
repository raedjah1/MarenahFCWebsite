import React, { useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface ViewTransitionProps {
  children: React.ReactNode;
}

// Check if browser supports View Transitions API
const supportsViewTransitions = () => {
  return typeof document !== 'undefined' && 'startViewTransition' in document;
};

// Custom hook for view transitions
export const useViewTransition = () => {
  const navigate = useNavigate();

  const transitionNavigate = useCallback((to: string, options?: { replace?: boolean }) => {
    if (!supportsViewTransitions()) {
      // Fallback to regular navigation
      navigate(to, options);
      return;
    }

    // Use View Transitions API
    const transition = (document as any).startViewTransition(() => {
      navigate(to, options);
    });

    // Handle transition errors
    transition.finished.catch((error: Error) => {
      console.warn('View transition failed:', error);
    });

    return transition;
  }, [navigate]);

  return { transitionNavigate, supportsViewTransitions: supportsViewTransitions() };
};

export const ViewTransition: React.FC<ViewTransitionProps> = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    // Add view transition names to key elements
    const addViewTransitionNames = () => {
      // Main content container
      const mainContent = document.querySelector('.main-content');
      if (mainContent) {
        (mainContent as any).style.viewTransitionName = 'main-content';
      }

      // Hero sections
      const heroSection = document.querySelector('.hero-section, .landing-hero');
      if (heroSection) {
        (heroSection as any).style.viewTransitionName = 'hero-section';
      }

      // Navigation
      const navigation = document.querySelector('.navigation');
      if (navigation) {
        (navigation as any).style.viewTransitionName = 'navigation';
      }

      // Footer
      const footer = document.querySelector('.footer-container');
      if (footer) {
        (footer as any).style.viewTransitionName = 'footer';
      }
    };

    // Add transition names after a brief delay to ensure DOM is ready
    const timer = setTimeout(addViewTransitionNames, 100);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return <>{children}</>;
}; 