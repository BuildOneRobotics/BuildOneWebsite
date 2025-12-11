import React, { useState, useEffect } from 'react';
import './Settings.css';
import { loadSettings, saveSettings } from '../utils/themeManager';

function Settings() {
  const [theme, setTheme] = useState('light');
  const [fontSize, setFontSize] = useState('medium');
  const [colorTheme, setColorTheme] = useState('blue');
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    // Load saved settings
    const settings = loadSettings();
    setTheme(settings.theme);
    setFontSize(settings.fontSize);
    setColorTheme(settings.colorTheme);
    setHighContrast(settings.highContrast);
    setReducedMotion(settings.reducedMotion);
  }, []);

  useEffect(() => {
    const settings = { theme, fontSize, colorTheme, highContrast, reducedMotion };
    saveSettings(settings);
  }, [theme, fontSize, colorTheme, highContrast, reducedMotion]);

  return (
    <div className="settings">
      <div className="settings-header">
        <h1>Settings</h1>
        <p>Customize your experience</p>
      </div>

      <div className="settings-sections">
        <section className="settings-section">
          <h2>Appearance</h2>
          
          <div className="setting-group">
            <label>Theme</label>
            <div className="radio-group">
              <label className="radio-option">
                <input 
                  type="radio" 
                  value="light" 
                  checked={theme === 'light'}
                  onChange={(e) => setTheme(e.target.value)}
                />
                Light
              </label>
              <label className="radio-option">
                <input 
                  type="radio" 
                  value="dark" 
                  checked={theme === 'dark'}
                  onChange={(e) => setTheme(e.target.value)}
                />
                Dark
              </label>
            </div>
          </div>

          <div className="setting-group">
            <label>Color Theme</label>
            <select value={colorTheme} onChange={(e) => setColorTheme(e.target.value)}>
              <option value="blue">Blue</option>
              <option value="green">Green</option>
              <option value="purple">Purple</option>
              <option value="orange">Orange</option>
            </select>
          </div>

          <div className="setting-group">
            <label>Font Size</label>
            <select value={fontSize} onChange={(e) => setFontSize(e.target.value)}>
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>
        </section>

        <section className="settings-section">
          <h2>Accessibility</h2>
          
          <div className="setting-group">
            <label className="checkbox-option">
              <input 
                type="checkbox" 
                checked={highContrast}
                onChange={(e) => setHighContrast(e.target.checked)}
              />
              High Contrast
            </label>
          </div>

          <div className="setting-group">
            <label className="checkbox-option">
              <input 
                type="checkbox" 
                checked={reducedMotion}
                onChange={(e) => setReducedMotion(e.target.checked)}
              />
              Reduce Motion
            </label>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Settings;