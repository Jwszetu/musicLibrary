import React, { useState } from 'react';
import { useTheme } from '../../hooks/useTheme';

function ThemeSwitcher({ className = '' }) {
  const { currentTheme, changeTheme, availableThemes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const themeIcons = {
    light: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    dark: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>
    ),
    ocean: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.5a1.5 1.5 0 011.5 1.5M9 10h1.5a1.5 1.5 0 011.5 1.5M9 10v3a3 3 0 003 3h0a3 3 0 003-3v-3" />
      </svg>
    ),
  };

  const themeLabels = {
    light: 'Light',
    dark: 'Dark', 
    ocean: 'Ocean',
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 hover:bg-opacity-80"
        style={{
          backgroundColor: 'var(--color-background-secondary)',
          color: 'var(--color-text-primary)',
          border: '1px solid var(--color-border-primary)',
        }}
        title="Change theme"
      >
        {themeIcons[currentTheme]}
        <span className="hidden sm:inline">{themeLabels[currentTheme]}</span>
        <svg 
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div 
            className="absolute right-0 mt-2 py-2 w-48 rounded-lg shadow-lg z-50 border"
            style={{
              backgroundColor: 'var(--color-background-card)',
              borderColor: 'var(--color-border-primary)',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            {availableThemes.map((themeName) => {
              const isActive = currentTheme === themeName;
              return (
                <button
                  key={themeName}
                  onClick={() => {
                    changeTheme(themeName);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2 text-sm text-left transition-colors duration-200 ${
                    isActive 
                      ? 'font-medium' 
                      : 'hover:bg-opacity-50'
                  }`}
                  style={{
                    backgroundColor: isActive ? 'var(--color-primary-50)' : 'transparent',
                    color: isActive ? 'var(--color-primary-700)' : 'var(--color-text-primary)',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.target.style.backgroundColor = 'var(--color-background-secondary)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.target.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  {themeIcons[themeName]}
                  <span>{themeLabels[themeName]}</span>
                  {isActive && (
                    <svg className="w-4 h-4 ml-auto" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export default ThemeSwitcher;
