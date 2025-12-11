// Theme management utility
export const loadSettings = () => {
  const savedSettings = JSON.parse(localStorage.getItem('buildone-settings') || '{}');
  return {
    theme: savedSettings.theme || 'light',
    fontSize: savedSettings.fontSize || 'medium',
    colorTheme: savedSettings.colorTheme || 'blue',
    highContrast: savedSettings.highContrast || false,
    reducedMotion: savedSettings.reducedMotion || false
  };
};

export const applySettings = (settings) => {
  document.documentElement.setAttribute('data-theme', settings.theme);
  document.documentElement.setAttribute('data-font-size', settings.fontSize);
  document.documentElement.setAttribute('data-color-theme', settings.colorTheme);
  document.documentElement.setAttribute('data-high-contrast', settings.highContrast);
  document.documentElement.setAttribute('data-reduced-motion', settings.reducedMotion);
};

export const saveSettings = (settings) => {
  localStorage.setItem('buildone-settings', JSON.stringify(settings));
  applySettings(settings);
};

// Initialize theme on app load
export const initializeTheme = () => {
  const settings = loadSettings();
  applySettings(settings);
  return settings;
};