export const COLORS = {
  primary: {
    light: '#5be2e8', // bright teal
    dark: '#3caea3',  // deeper teal
  },
  secondary: {
    light: '#E0E0E0',
    dark: '#000000',
  },
  background: {
    light: '#EFEFEF',
    dark: '#101010',
  },
  surface: {
    light: '#FFFFFF',
    dark: '#1E1E1E',
  },
  accent: {
    light: '#5be2e8',
    dark: '#3caea3',
  },
  error: {
    light: '#EF5350',
    dark: '#EF5350',
  },
} as const;

export const createTheme = (isDarkMode: boolean) => ({
  colors: {
    primary: isDarkMode ? COLORS.primary.dark : COLORS.primary.light,
    secondary: isDarkMode ? COLORS.secondary.dark : COLORS.secondary.light,
    background: isDarkMode ? COLORS.background.dark : COLORS.background.light,
    surface: isDarkMode ? COLORS.surface.dark : COLORS.surface.light,
    accent: isDarkMode ? COLORS.accent.dark : COLORS.accent.light,
    error: isDarkMode ? COLORS.error.dark : COLORS.error.light,
  },
}); 