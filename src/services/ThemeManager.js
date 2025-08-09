import { themes, getCSSVariables, defaultTheme } from '../themes/themes';

class ThemeManager {
  constructor() {
    this.currentTheme = this.loadThemeFromStorage();
    this.subscribers = new Set();
    this.applyTheme(this.currentTheme);
  }

  // Load theme from localStorage or use default
  loadThemeFromStorage() {
    try {
      const saved = localStorage.getItem('biga-music-theme');
      return saved && themes[saved] ? saved : defaultTheme;
    } catch {
      return defaultTheme;
    }
  }

  // Subscribe to theme changes
  subscribe(callback) {
    this.subscribers.add(callback);
    // Return unsubscribe function
    return () => {
      this.subscribers.delete(callback);
    };
  }

  // Notify all subscribers of theme changes
  notify() {
    const themeData = this.getThemeData();
    this.subscribers.forEach(callback => callback(themeData));
  }

  // Get current theme data
  getThemeData() {
    return {
      currentTheme: this.currentTheme,
      theme: themes[this.currentTheme],
      availableThemes: Object.keys(themes),
    };
  }

  // Change theme
  changeTheme(themeName) {
    if (!themes[themeName]) {
      console.warn(`Theme "${themeName}" not found`);
      return;
    }

    this.currentTheme = themeName;
    this.applyTheme(themeName);
    this.saveThemeToStorage(themeName);
    this.notify();
  }

  // Apply theme to DOM
  applyTheme(themeName) {
    const theme = themes[themeName];
    if (!theme) return;

    const root = document.documentElement;
    const cssVars = getCSSVariables(theme);
    
    // Apply CSS custom properties
    Object.entries(cssVars).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });

    // Apply theme class to body
    document.body.className = document.body.className.replace(/theme-\w+/g, '');
    document.body.classList.add(`theme-${themeName}`);

    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme.colors.background.primary);
    }
  }

  // Save theme to localStorage
  saveThemeToStorage(themeName) {
    try {
      localStorage.setItem('biga-music-theme', themeName);
    } catch (error) {
      console.warn('Failed to save theme to localStorage:', error);
    }
  }

  // Helper functions
  getColor(path) {
    const theme = themes[this.currentTheme];
    const keys = path.split('.');
    let value = theme.colors;
    for (const key of keys) {
      value = value[key];
      if (value === undefined) return undefined;
    }
    return value;
  }

  getShadow(name) {
    return themes[this.currentTheme].shadows[name];
  }

  isDark() {
    return this.currentTheme === 'dark';
  }

  getCSSVar(path) {
    return `var(--color-${path.replace('.', '-')})`;
  }

  // Get theme-aware classes
  getClasses(baseClasses, themeOverrides = {}) {
    const overrides = themeOverrides[this.currentTheme] || '';
    return `${baseClasses} ${overrides}`.trim();
  }

  // Get pre-built style objects
  getStyles() {
    const theme = themes[this.currentTheme];
    
    return {
      card: {
        backgroundColor: theme.colors.background.card,
        borderColor: theme.colors.border.primary,
        boxShadow: theme.shadows.md,
      },
      button: {
        primary: {
          backgroundColor: theme.colors.primary[500],
          color: theme.colors.text.inverse,
          borderColor: theme.colors.primary[500],
        },
        secondary: {
          backgroundColor: theme.colors.background.secondary,
          color: theme.colors.text.primary,
          borderColor: theme.colors.border.primary,
        },
      },
      text: {
        primary: { color: theme.colors.text.primary },
        secondary: { color: theme.colors.text.secondary },
        accent: { color: theme.colors.text.accent },
      },
    };
  }
}

// Create singleton instance
export const themeManager = new ThemeManager();
