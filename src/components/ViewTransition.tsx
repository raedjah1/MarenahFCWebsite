import React from 'react';
import { useNavigate } from 'react-router-dom';

interface ViewTransitionProps {
  children: React.ReactNode;
}

// Check if browser supports View Transitions API
const supportsViewTransitions = () => {
  return false; // Disable view transitions to prevent glitching
};

// Custom hook for view transitions
export const useViewTransition = () => {
  const navigate = useNavigate();

  const transitionNavigate = (to: string, options?: { replace?: boolean }) => {
    // Always use regular navigation to prevent glitching
    navigate(to, options);
  };

  return { transitionNavigate, supportsViewTransitions: supportsViewTransitions() };
};

export const ViewTransition: React.FC<ViewTransitionProps> = ({ children }) => {
  // Simply return children without any transition logic
  return <>{children}</>;
}; 