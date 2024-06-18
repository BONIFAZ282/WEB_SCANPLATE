import React, { createContext, useContext, useState } from 'react';
import { PaletteMode } from '@mui/material';

interface ThemeContextProps {
  themeMode: PaletteMode;
  toggleThemeMode: (mode:PaletteMode) => void;
}

const ThemeContext = createContext<ThemeContextProps | null>(null);

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode; // Agrega la propiedad children
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [themeMode, setThemeMode] = useState<PaletteMode>(process.env.REACT_APP_MODE_THEME as PaletteMode || 'light');

  const toggleThemeMode = (mode:PaletteMode) => {
    setThemeMode(mode);
  };

  return (
    <ThemeContext.Provider value={{ themeMode, toggleThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
