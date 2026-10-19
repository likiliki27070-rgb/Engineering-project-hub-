import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemePreset, ThemeConfig } from '../types';

interface ThemeContextType {
  themeConfig: ThemeConfig;
  setThemePreset: (preset: ThemePreset) => void;
  updateThemeConfig: (config: Partial<ThemeConfig>) => void;
  isThemeDrawerOpen: boolean;
  setIsThemeDrawerOpen: (open: boolean) => void;
}

const defaultThemeConfig: ThemeConfig = {
  preset: 'dark',
  primaryColor: '#38bdf8',
  accentColor: '#818cf8',
  backgroundStyle: 'mesh',
  cardAppearance: 'glass',
  borderRadius: '14px',
  glassIntensity: 75,
  animationIntensity: 'full'
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeConfig, setThemeConfig] = useState<ThemeConfig>(() => {
    try {
      const saved = localStorage.getItem('limo_theme_config');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse saved theme config', e);
    }
    return defaultThemeConfig;
  });

  const [isThemeDrawerOpen, setIsThemeDrawerOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('limo_theme_config', JSON.stringify(themeConfig));
    } catch (e) {
      console.warn('Could not save theme config to localStorage', e);
    }

    // Apply attributes to document element
    const root = document.documentElement;
    root.setAttribute('data-theme', themeConfig.preset);
    root.setAttribute('data-card-style', themeConfig.cardAppearance);
    root.setAttribute('data-bg-style', themeConfig.backgroundStyle);
    root.setAttribute('data-animations', themeConfig.animationIntensity);

    // Apply dynamic CSS variables if custom colors/radii/glass are set
    if (themeConfig.primaryColor) {
      root.style.setProperty('--primary', themeConfig.primaryColor);
    }
    if (themeConfig.accentColor) {
      root.style.setProperty('--accent', themeConfig.accentColor);
    }
    if (themeConfig.borderRadius) {
      root.style.setProperty('--card-radius', themeConfig.borderRadius);
    }
    if (themeConfig.glassIntensity !== undefined) {
      const blurPx = Math.round((themeConfig.glassIntensity / 100) * 24);
      root.style.setProperty('--glass-blur', `${blurPx}px`);
    }
  }, [themeConfig]);

  const setThemePreset = (preset: ThemePreset) => {
    setThemeConfig(prev => ({
      ...prev,
      preset
    }));
  };

  const updateThemeConfig = (updates: Partial<ThemeConfig>) => {
    setThemeConfig(prev => ({
      ...prev,
      ...updates
    }));
  };

  return (
    <ThemeContext.Provider
      value={{
        themeConfig,
        setThemePreset,
        updateThemeConfig,
        isThemeDrawerOpen,
        setIsThemeDrawerOpen
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};
