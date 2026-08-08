import React, { createContext, useContext, useState, useMemo } from 'react';
import { AppTheme, dark, light } from './colors';

type ThemeMode = 'light' | 'dark'

type ThemeContextValue = {
    mode: ThemeMode;
    theme: AppTheme;
    isDark: boolean;
    setMode: (m: ThemeMode) => void;
    toggleMode: () => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [mode, setMode] = useState<ThemeMode>('light');

    const isDark = mode === "dark";

    const theme = isDark ? dark : light;

    const setTheme = (newMode: ThemeMode) => setMode(newMode);

    const toggleMode = () => setMode(mode => (mode === 'light' ? 'dark' : 'light'));

    return <ThemeContext.Provider value={{ theme, mode, isDark, setMode: setTheme, toggleMode }}>{children}</ThemeContext.Provider>;
}

export const useThemeContext = () => {
    const themeContext = useContext(ThemeContext);
    if (!themeContext) throw new Error('useThemeContext must be used within ThemeProvider');
    return themeContext;
}

export default ThemeProvider;