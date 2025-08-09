import { useState, useEffect, useCallback } from 'react';
import { themeManager } from '../services/ThemeManager';

export function useTheme() {
  const [themeData, setThemeData] = useState(() => themeManager.getThemeData());

  useEffect(() => {
    // Subscribe to theme changes
    const unsubscribe = themeManager.subscribe(setThemeData);
    
    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);

  // Wrap theme actions to maintain the same API
  const actions = {
    changeTheme: useCallback((themeName) => themeManager.changeTheme(themeName), []),
    getColor: useCallback((path) => themeManager.getColor(path), []),
    getShadow: useCallback((name) => themeManager.getShadow(name), []),
    isDark: useCallback(() => themeManager.isDark(), []),
    getCSSVar: useCallback((path) => themeManager.getCSSVar(path), []),
    getClasses: useCallback((baseClasses, themeOverrides) => themeManager.getClasses(baseClasses, themeOverrides), []),
  };

  return {
    ...themeData,
    ...actions,
  };
}

// Lightweight hook for components that only need theme actions (no re-renders on theme changes)
export function useThemeActions() {
  return {
    changeTheme: useCallback((themeName) => themeManager.changeTheme(themeName), []),
    getColor: useCallback((path) => themeManager.getColor(path), []),
    getShadow: useCallback((name) => themeManager.getShadow(name), []),
    isDark: useCallback(() => themeManager.isDark(), []),
    getCSSVar: useCallback((path) => themeManager.getCSSVar(path), []),
    getClasses: useCallback((baseClasses, themeOverrides) => themeManager.getClasses(baseClasses, themeOverrides), []),
  };
}

// Hook for theme-aware styling with current theme data
export function useThemedStyles() {
  const [themeData, setThemeData] = useState(() => themeManager.getThemeData());

  useEffect(() => {
    const unsubscribe = themeManager.subscribe(setThemeData);
    return unsubscribe;
  }, []);

  return {
    theme: themeData.theme,
    currentTheme: themeData.currentTheme,
    colors: themeData.theme.colors,
    shadows: themeData.theme.shadows,
    getColor: (path) => themeManager.getColor(path),
    getShadow: (name) => themeManager.getShadow(name),
    getCSSVar: (path) => themeManager.getCSSVar(path),
    styles: themeManager.getStyles(),
  };
}

// Hook for components that only need current theme name (minimal re-renders)
export function useCurrentTheme() {
  const [currentTheme, setCurrentTheme] = useState(() => themeManager.getThemeData().currentTheme);

  useEffect(() => {
    const unsubscribe = themeManager.subscribe((themeData) => {
      setCurrentTheme(themeData.currentTheme);
    });
    return unsubscribe;
  }, []);

  return currentTheme;
}
