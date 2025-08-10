// Theme definitions
export const themes = {
  light: {
    name: 'Light',
    colors: {
      // Primary colors (blue)
      primary: {
        50: '#eff6ff',
        100: '#dbeafe',
        200: '#bfdbfe',
        300: '#93c5fd',
        400: '#60a5fa',
        500: '#3b82f6', // Main primary
        600: '#2563eb',
        700: '#1d4ed8',
        800: '#1e40af',
        900: '#1e3a8a',
      },
      // Secondary colors (purple)
      secondary: {
        50: '#faf5ff',
        100: '#f3e8ff',
        200: '#e9d5ff',
        300: '#d8b4fe',
        400: '#c084fc',
        500: '#a855f7', // Main secondary
        600: '#9333ea',
        700: '#7c3aed',
        800: '#6b21a8',
        900: '#581c87',
      },
      // Background colors (low saturation, balanced layers)
      background: {
        primary: '#f1eff1',         // Very subtle warm gray base (main background)
        secondary: '#eae8ea',       // Gentle warm gray (sections)
        tertiary: '#e0dee0',        // Soft medium gray (contrast areas)
        card: '#f7f6f7',            // Barely tinted warm white (cards)
        modal: '#f7f6f7',           // Barely tinted warm white (modals)
        disabled: '#e0dee0',        // Soft medium gray
      },
      // Text colors (consistent, softer, warmer)
      text: {
        primary: '#4a5568',         // Main text (consistent everywhere)
        secondary: '#718096',       // Secondary text (consistent everywhere)
        tertiary: '#a0aec0',        // Light warm gray
        accent: '#805ad5',          // Purple accent (consistent)
        inverse: '#ffffff',         // Text on dark backgrounds
        muted: '#a0aec0',           // Muted text (same as tertiary)
        placeholder: '#a0aec0',     // Placeholder (same as tertiary/muted)
        disabled: '#a0aec0',        // Disabled (same as tertiary/muted)
        error: '#e53e3e',           // Softer red
        success: '#38a169',         // Softer green
        warning: '#dd6b20',         // Softer orange
        info: '#4299e1',            // Softer blue info
        // UI-specific text colors (synced with main colors)
        navbar: '#4a5568',          // Same as primary
        title: '#4a5568',           // Same as primary
        subtitle: '#718096',        // Same as secondary
        caption: '#a0aec0',         // Same as tertiary/muted
        meta: '#a0aec0',            // Same as tertiary/muted
        button: '#ffffff',          // Button text
        link: '#805ad5',            // Same as accent
        linkHover: '#6b46c1',       // Softer purple hover
      },
      // Border colors (very subtle, balanced)
      border: {
        primary: '#d5d3d5',         // Very subtle gray border
        secondary: '#cac8ca',       // Gentle medium gray border
        accent: '#805ad5',          // Softer purple accent border
        disabled: '#cac8ca',        // Gentle disabled border
      },
      // Status colors
      success: {
        50: '#f0fff4',
        100: '#c6f6d5',
        200: '#9ae6b4',
        500: '#38a169',
        600: '#2f855a',
        700: '#276749',
        bg: '#f0fff4',
        text: '#276749',
        border: '#9ae6b4',
      },
      error: {
        50: '#fed7d7',
        100: '#fed7d7',
        200: '#fbb6ce',
        500: '#e53e3e',
        600: '#c53030',
        700: '#9b2c2c',
        bg: '#fed7d7',
        text: '#9b2c2c',
        border: '#fbb6ce',
      },
      warning: {
        50: '#fffbeb',
        100: '#fef3c7',
        200: '#fcd34d',
        500: '#dd6b20',
        600: '#c05621',
        700: '#9c4221',
        bg: '#fffbeb',
        text: '#9c4221',
        border: '#fcd34d',
      },
      // Platform colors
      youtube: {
        primary: '#ef4444',
        hover: '#dc2626',
      },
      spotify: {
        primary: '#16a34a',
        hover: '#15803d',
      },
    },
    shadows: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    },
  },
  
  dark: {
    name: 'Dark',
    colors: {
      // Primary colors (slightly adjusted for dark mode)
      primary: {
        50: '#1e3a8a',
        100: '#1e40af',
        200: '#1d4ed8',
        300: '#2563eb',
        400: '#3b82f6',
        500: '#60a5fa', // Main primary (lighter for dark)
        600: '#93c5fd',
        700: '#bfdbfe',
        800: '#dbeafe',
        900: '#eff6ff',
      },
      // Background colors
      background: {
        primary: '#111827',
        secondary: '#1f2937',
        tertiary: '#374151',
        card: '#1f2937',
        modal: '#111827',
        disabled: '#374151',
      },
      // Text colors
      text: {
        primary: '#f9fafb',          // Main text
        secondary: '#d1d5db',        // Secondary text
        tertiary: '#9ca3af',         // Muted text
        accent: '#60a5fa',           // Accent/link text
        inverse: '#111827',          // Text on light backgrounds
        muted: '#6b7280',            // Very light text
        placeholder: '#6b7280',      // Placeholder text
        disabled: '#6b7280',         // Disabled text
        error: '#fca5a5',            // Error text
        success: '#4ade80',          // Success text
        warning: '#fbbf24',          // Warning text
        info: '#60a5fa',             // Info text
        // UI-specific text colors
        navbar: '#f9fafb',           // Navigation text
        title: '#f9fafb',            // Page/section titles
        subtitle: '#d1d5db',         // Subtitles
        caption: '#9ca3af',          // Small captions
        meta: '#9ca3af',             // Metadata text
        button: '#111827',           // Button text
        link: '#60a5fa',             // Link text
        linkHover: '#93c5fd',        // Link hover text
      },
      // Border colors
      border: {
        primary: '#374151',
        secondary: '#4b5563',
        accent: '#60a5fa',
        disabled: '#4b5563',
      },
      // Status colors
      success: {
        bg: '#064e3b',
        text: '#6ee7b7',
        border: '#065f46',
      },
      error: {
        bg: '#7f1d1d',
        text: '#fca5a5',
        border: '#991b1b',
      },
      warning: {
        bg: '#78350f',
        text: '#fcd34d',
        border: '#92400e',
      },
      // Platform colors
      youtube: {
        primary: '#ef4444',
        hover: '#f87171',
      },
      spotify: {
        primary: '#22c55e',
        hover: '#4ade80',
      },
    },
    shadows: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.3)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.3), 0 2px 4px -2px rgb(0 0 0 / 0.3)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.3), 0 4px 6px -4px rgb(0 0 0 / 0.3)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.3), 0 8px 10px -6px rgb(0 0 0 / 0.3)',
    },
  },

  ocean: {
    name: 'Ocean',
    colors: {
      // Primary colors (blue-teal theme)
      primary: {
        50: '#ecfeff',
        100: '#cffafe',
        200: '#a5f3fc',
        300: '#67e8f9',
        400: '#22d3ee',
        500: '#06b6d4', // Main primary
        600: '#0891b2',
        700: '#0e7490',
        800: '#155e75',
        900: '#164e63',
      },
      // Background colors
      background: {
        primary: '#f0fdfa',
        secondary: '#ccfbf1',
        tertiary: '#99f6e4',
        card: '#ffffff',
        modal: '#ffffff',
        disabled: '#99f6e4',
      },
      // Text colors
      text: {
        primary: '#134e4a',          // Main text
        secondary: '#0f766e',        // Secondary text
        tertiary: '#14b8a6',         // Muted text
        accent: '#06b6d4',           // Accent/link text
        inverse: '#ffffff',          // Text on dark backgrounds
        muted: '#5eead4',            // Very light text
        placeholder: '#5eead4',      // Placeholder text
        disabled: '#5eead4',         // Disabled text
        error: '#dc2626',            // Error text
        success: '#065f46',          // Success text
        warning: '#ca8a04',          // Warning text
        info: '#06b6d4',             // Info text
        // UI-specific text colors
        navbar: '#134e4a',           // Navigation text
        title: '#134e4a',            // Page/section titles
        subtitle: '#0f766e',         // Subtitles
        caption: '#14b8a6',          // Small captions
        meta: '#14b8a6',             // Metadata text
        button: '#ffffff',           // Button text
        link: '#06b6d4',             // Link text
        linkHover: '#0891b2',        // Link hover text
      },
      // Border colors
      border: {
        primary: '#5eead4',
        secondary: '#2dd4bf',
        accent: '#06b6d4',
        disabled: '#2dd4bf',
      },
      // Status colors
      success: {
        bg: '#d1fae5',
        text: '#065f46',
        border: '#a7f3d0',
      },
      error: {
        bg: '#fef2f2',
        text: '#dc2626',
        border: '#fecaca',
      },
      warning: {
        bg: '#fefce8',
        text: '#ca8a04',
        border: '#fef3c7',
      },
      // Platform colors
      youtube: {
        primary: '#ef4444',
        hover: '#dc2626',
      },
      spotify: {
        primary: '#16a34a',
        hover: '#15803d',
      },
    },
    shadows: {
      sm: '0 1px 2px 0 rgb(6 182 212 / 0.1)',
      md: '0 4px 6px -1px rgb(6 182 212 / 0.15), 0 2px 4px -2px rgb(6 182 212 / 0.1)',
      lg: '0 10px 15px -3px rgb(6 182 212 / 0.15), 0 4px 6px -4px rgb(6 182 212 / 0.1)',
      xl: '0 20px 25px -5px rgb(6 182 212 / 0.15), 0 8px 10px -6px rgb(6 182 212 / 0.1)',
    },
  },
};

// Helper function to get CSS custom properties from theme
export const getCSSVariables = (theme) => {
  const vars = {};
  
  // Convert theme colors to CSS custom properties
  Object.entries(theme.colors).forEach(([category, values]) => {
    if (typeof values === 'object' && values !== null) {
      Object.entries(values).forEach(([key, value]) => {
        vars[`--color-${category}-${key}`] = value;
      });
    }
  });

  // Convert shadows
  Object.entries(theme.shadows).forEach(([key, value]) => {
    vars[`--shadow-${key}`] = value;
  });

  return vars;
};

export const themeNames = Object.keys(themes);
export const defaultTheme = 'dark';
