export const lightTheme = {
  primary: '#5be2e8',
  secondary: '#3caea3',
  background: '#ffffff',
  surface: '#f8f9fa',
  text: {
    primary: '#2c3e50',
    secondary: '#6c757d',
    inverse: '#ffffff'
  },
  border: '#e9ecef',
  shadow: 'rgba(0, 0, 0, 0.1)',
  overlay: 'rgba(255, 255, 255, 0.95)',
  glass: 'rgba(255, 255, 255, 0.8)'
};

export const darkTheme = {
  primary: '#3caea3',
  secondary: '#5be2e8',
  background: '#1a1a1a',
  surface: '#2c2c2c',
  text: {
    primary: '#ffffff',
    secondary: '#b3b3b3',
    inverse: '#2c3e50'
  },
  border: '#404040',
  shadow: 'rgba(0, 0, 0, 0.3)',
  overlay: 'rgba(26, 26, 26, 0.95)',
  glass: 'rgba(26, 26, 26, 0.8)'
};

export type Theme = typeof lightTheme; 