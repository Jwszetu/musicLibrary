import React from 'react';
import { useTheme } from '../../hooks/useTheme';

function Search({ searchTerm, setSearchTerm, loading = false }) {
  const { getColor } = useTheme();
  return (
    <div className="w-full">
      <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
        <div className="relative flex-1">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: getColor('text.secondary') }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            className="w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 theme-transition text-sm"
            style={{
              backgroundColor: getColor('background.primary'),
              borderColor: getColor('border.primary'),
              color: getColor('text.primary'),
              '--focus-ring-color': getColor('primary.400'),
            }}
            placeholder="Search songs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={(e) => {
              e.target.style.borderColor = getColor('primary.500');
              e.target.style.boxShadow = `0 0 0 2px ${getColor('primary.400')}40`;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = getColor('border.primary');
              e.target.style.boxShadow = 'none';
            }}
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
            {loading && (
              <div 
                className="animate-spin rounded-full h-3 w-3 border-b-2"
                style={{ borderColor: getColor('primary.500') }}
              ></div>
            )}
            {searchTerm && (
              <button
                type="button"
                className="p-0.5 rounded-full transition-colors hover:bg-opacity-20"
                style={{
                  color: getColor('text.secondary'),
                  backgroundColor: 'transparent',
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = getColor('background.secondary');
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                }}
                onClick={() => setSearchTerm('')}
                title="Clear search"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

export default Search;
