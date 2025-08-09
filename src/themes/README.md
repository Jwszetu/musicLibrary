# Theme System Documentation

This project includes a comprehensive theme system that supports multiple themes (Light, Dark, Ocean) with easy extensibility for future themes.

## 🎨 Features

- **Multiple Themes**: Light, Dark, and Ocean themes included
- **Persistent Theme**: User's theme choice is saved to localStorage
- **CSS Custom Properties**: Uses CSS variables for consistent theming
- **React Context**: Easy theme management across components
- **Theme Switcher**: Ready-to-use component for switching themes
- **Extensible**: Easy to add new themes and color schemes

## 📁 File Structure

```
src/
├── themes/
│   ├── themes.js          # Theme definitions and configurations
│   ├── global.css         # Global theme-aware CSS styles
│   └── README.md          # This documentation
├── context/
│   └── ThemeContext.js    # React context for theme management
└── components/
    └── ThemeSwitcher.js   # Theme switcher component
```

## 🚀 Quick Start

### 1. Wrap your app with ThemeProvider

```jsx
// src/App.js
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <div className="App">
        {/* Your app content */}
      </div>
    </ThemeProvider>
  );
}
```

### 2. Add the ThemeSwitcher component

```jsx
// Add to your navbar or header
import ThemeSwitcher from './components/ThemeSwitcher';

<ThemeSwitcher />
```

### 3. Use theme in components

```jsx
import { useTheme } from './context/ThemeContext';

function MyComponent() {
  const { getColor, currentTheme } = useTheme();
  
  return (
    <div 
      style={{
        backgroundColor: getColor('background.card'),
        color: getColor('text.primary'),
        borderColor: getColor('border.primary'),
      }}
    >
      Current theme: {currentTheme}
    </div>
  );
}
```

## 🎯 Using Themes

### Available Hooks

#### `useTheme()`
Main hook for accessing theme functionality:

```jsx
const {
  currentTheme,      // Current theme name ('light', 'dark', 'ocean')
  theme,             // Current theme object
  changeTheme,       // Function to change theme
  availableThemes,   // Array of available theme names
  getColor,          // Helper to get theme colors
  getShadow,         // Helper to get theme shadows
  isDark,            // Check if current theme is dark
  getCSSVar,         // Get CSS variable name
} = useTheme();
```

#### `useThemedStyles()`
Hook for getting pre-built style objects:

```jsx
const { styles, colors, shadows } = useThemedStyles();

// Use pre-built styles
<button style={styles.button.primary}>Primary Button</button>
<div style={styles.card}>Card Content</div>
```

### Color System

Each theme has a comprehensive color palette:

```jsx
// Primary colors (50-900 scale)
getColor('primary.500')     // Main primary color
getColor('primary.600')     // Darker primary (for hover states)

// Background colors
getColor('background.primary')    // Main background
getColor('background.secondary')  // Secondary background
getColor('background.card')       // Card backgrounds
getColor('background.modal')      // Modal backgrounds

// Text colors
getColor('text.primary')     // Main text
getColor('text.secondary')   // Secondary text
getColor('text.accent')      // Accent text (usually primary color)
getColor('text.inverse')     // Inverse text (for dark backgrounds)

// Border colors
getColor('border.primary')   // Main borders
getColor('border.secondary') // Secondary borders
getColor('border.accent')    // Accent borders

// Platform colors
getColor('youtube.primary')  // YouTube red
getColor('spotify.primary')  // Spotify green

// Status colors
getColor('success.bg')       // Success background
getColor('error.text')       // Error text
```

### CSS Custom Properties

All theme colors are available as CSS custom properties:

```css
.my-component {
  background-color: var(--color-background-card);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border-primary);
  box-shadow: var(--shadow-md);
}
```

### Utility Classes

Pre-built CSS classes for common styling:

```jsx
<div className="theme-bg-card theme-text-primary theme-border">
  Themed component
</div>

<button className="theme-btn-primary">Primary Button</button>
<button className="theme-btn-secondary">Secondary Button</button>

<div className="theme-youtube">YouTube colored element</div>
<div className="theme-spotify">Spotify colored element</div>
```

## 🔧 Adding New Themes

### 1. Define the theme in `themes.js`

```jsx
export const themes = {
  // ... existing themes
  
  purple: {
    name: 'Purple',
    colors: {
      primary: {
        50: '#faf5ff',
        500: '#8b5cf6',  // Main primary
        600: '#7c3aed',
        // ... other shades
      },
      background: {
        primary: '#fefbff',
        secondary: '#f8f4ff',
        card: '#ffffff',
        // ...
      },
      // ... other color categories
    },
    shadows: {
      sm: '0 1px 2px 0 rgb(139 92 246 / 0.1)',
      // ... other shadows
    },
  },
};
```

### 2. Add theme icon and label to ThemeSwitcher

```jsx
// In src/components/ThemeSwitcher.js
const themeIcons = {
  // ... existing icons
  purple: (
    <svg>/* Purple theme icon */</svg>
  ),
};

const themeLabels = {
  // ... existing labels
  purple: 'Purple',
};
```

### 3. Add theme-specific styles (optional)

```css
/* In src/themes/global.css */
.theme-purple ::-webkit-scrollbar-thumb {
  background: var(--color-primary-400);
}
```

## 💡 Best Practices

### 1. Use theme helpers instead of hardcoded colors

```jsx
// ❌ Bad
<div style={{ backgroundColor: '#3b82f6', color: '#ffffff' }}>

// ✅ Good  
<div style={{ 
  backgroundColor: getColor('primary.500'), 
  color: getColor('text.inverse') 
}}>
```

### 2. Add hover states using theme colors

```jsx
<button
  onMouseEnter={(e) => {
    e.target.style.backgroundColor = getColor('primary.600');
  }}
  onMouseLeave={(e) => {
    e.target.style.backgroundColor = getColor('primary.500');
  }}
>
```

### 3. Use the theme-transition class for smooth theme changes

```jsx
<div className="theme-transition">
  Content that smoothly transitions between themes
</div>
```

### 4. Provide fallbacks for custom properties

```css
.my-component {
  /* Fallback color */
  background-color: #ffffff;
  /* Theme color */
  background-color: var(--color-background-card);
}
```

## 🔍 Examples

### Complete themed component

```jsx
import React from 'react';
import { useTheme } from '../context/ThemeContext';

function ThemedCard({ title, children }) {
  const { getColor, getShadow } = useTheme();
  
  return (
    <div 
      className="p-6 rounded-lg theme-transition"
      style={{
        backgroundColor: getColor('background.card'),
        borderColor: getColor('border.primary'),
        boxShadow: getShadow('md'),
        border: '1px solid',
      }}
    >
      <h3 
        className="text-lg font-semibold mb-4"
        style={{ color: getColor('text.accent') }}
      >
        {title}
      </h3>
      <div style={{ color: getColor('text.primary') }}>
        {children}
      </div>
    </div>
  );
}
```

### Conditional styling based on theme

```jsx
function MyComponent() {
  const { currentTheme, isDark } = useTheme();
  
  return (
    <div className={`
      base-styles 
      ${isDark() ? 'dark-specific-styles' : 'light-specific-styles'}
      ${currentTheme === 'ocean' ? 'ocean-specific-styles' : ''}
    `}>
      Content
    </div>
  );
}
```

## 🎨 Theme Preview

- **Light Theme**: Clean, bright interface with blue accents
- **Dark Theme**: Dark backgrounds with light text and blue accents  
- **Ocean Theme**: Teal/cyan color scheme with ocean-inspired colors

The theme system automatically handles:
- Text contrast for accessibility
- Consistent spacing and shadows
- Platform-specific colors (YouTube red, Spotify green)
- Smooth transitions between themes
- Local storage persistence
