import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme as useDeviceColorScheme } from 'react-native';
import { colors } from '../constants/theme';

type ThemeData = typeof colors.light;
type ThemeType = 'light' | 'dark';

interface ThemeContextType {
  themeType: ThemeType;
  theme: ThemeData;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const deviceTheme = useDeviceColorScheme() ?? 'light';
  const [themeType, setThemeType] = useState<ThemeType>(deviceTheme);

  // Optional: update if device theme changes
  useEffect(() => {
    setThemeType(deviceTheme);
  }, [deviceTheme]);

  const toggleTheme = () => {
    setThemeType((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const theme = colors[themeType];

  return (
    <ThemeContext.Provider value={{ themeType, theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
