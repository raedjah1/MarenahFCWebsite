import React from 'react';
import './ThemeToggle.styles.css';

interface ThemeToggleProps {
  isDarkMode: boolean;
  onToggle: () => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ isDarkMode, onToggle }) => {
  return (
    <button 
      className="theme-toggle"
      onClick={onToggle}
      aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
    >
      <div className="theme-toggle-inner">
        {isDarkMode ? (
          <i className="fas fa-sun" id="sun-icon" />
        ) : (
          <i className="fas fa-moon" id="moon-icon" />
        )}
      </div>
    </button>
  );
}; 