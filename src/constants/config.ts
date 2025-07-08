export const CONFIG = {
  APP_NAME: 'POV Token Platform',
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  // Add other configuration constants here
} as const;

export const ROUTES = {
  HOME: '/',
  TOKENS: '/tokens',
  // Add other route paths here
} as const; 