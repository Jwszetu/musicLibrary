import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import ThemeSwitcher from './ThemeSwitcher';
import Search from '../layout/Search';

function Navbar({ 
  searchTerm, 
  onSearchTermChange, 
  searchLoading, 
  onSubmitSongClick 
}) {
  const { getColor } = useTheme();

  return (
    <nav 
      className="p-4 sticky top-0 z-50 border-b theme-transition"
      style={{ 
        backgroundColor: getColor('background.card'),
        borderColor: getColor('border.primary'),
        boxShadow: getColor('background.primary') === '#ffffff' ? '0 4px 6px -1px rgb(0 0 0 / 0.1)' : '0 4px 6px -1px rgb(0 0 0 / 0.3)'
      }}
    >
      <div className="container mx-auto flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div className="flex justify-between items-center">
          <h1 
            className="text-xl lg:text-2xl font-bold theme-transition flex-shrink-0"
            style={{ color: getColor('text.accent') }}
          >
            Song Hub 🎶
          </h1>
          
          {/* Mobile controls */}
          <div className="flex items-center gap-2 lg:hidden">
            <ThemeSwitcher />
            <button
              onClick={onSubmitSongClick}
              className="px-3 py-1.5 text-sm font-medium rounded-lg transition duration-300 ease-in-out"
              style={{
                backgroundColor: getColor('primary.500'),
                color: getColor('text.inverse'),
                boxShadow: getColor('background.primary') === '#ffffff' ? '0 4px 6px -1px rgb(0 0 0 / 0.1)' : '0 4px 6px -1px rgb(0 0 0 / 0.3)'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = getColor('primary.600');
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = getColor('primary.500');
              }}
            >
              Add Song
            </button>
          </div>
        </div>

        {/* Search Bar in Navigation */}
        <div className="flex-1 lg:max-w-md lg:mx-4">
          <Search
            searchTerm={searchTerm}
            setSearchTerm={onSearchTermChange}
            loading={searchLoading}
          />
        </div>
       
        {/* Desktop controls */}
        <div className="hidden lg:flex items-center gap-4 flex-shrink-0">
          <ThemeSwitcher />
          <button
            onClick={onSubmitSongClick}
            className="px-4 py-2 font-medium rounded-lg transition duration-300 ease-in-out"
            style={{
              backgroundColor: getColor('primary.500'),
              color: getColor('text.inverse'),
              boxShadow: getColor('background.primary') === '#ffffff' ? '0 4px 6px -1px rgb(0 0 0 / 0.1)' : '0 4px 6px -1px rgb(0 0 0 / 0.3)'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = getColor('primary.600');
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = getColor('primary.500');
            }}
          >
            Submit New Song
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
