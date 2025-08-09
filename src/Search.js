import React from 'react';
import { useTheme } from './hooks/useTheme';

function Search({ searchTerm, setSearchTerm, loading = false }) {
  const { getColor } = useTheme();
  return (
    <div className="max-w-2xl mx-auto p-4">
      <form className="flex gap-2 mb-6" onSubmit={(e) => e.preventDefault()}>
        <div className="relative flex-1">
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 theme-transition"
            style={{
              backgroundColor: getColor('background.card'),
              borderColor: getColor('border.primary'),
              color: getColor('text.primary'),
              '--focus-ring-color': getColor('primary.400'),
            }}
            placeholder="Search for songs by title or description..."
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
          {loading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div 
                className="animate-spin rounded-full h-4 w-4 border-b-2"
                style={{ borderColor: getColor('primary.500') }}
              ></div>
            </div>
          )}
        </div>
        <button
          type="button"
          className="px-4 py-2 rounded-lg transition"
          style={{
            backgroundColor: getColor('background.secondary'),
            color: getColor('text.primary'),
            opacity: !searchTerm ? 0.5 : 1,
          }}
          onMouseEnter={(e) => {
            if (searchTerm) {
              e.target.style.backgroundColor = getColor('background.tertiary');
            }
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = getColor('background.secondary');
          }}
          onClick={() => setSearchTerm('')}
          disabled={!searchTerm}
        >
          Clear
        </button>
      </form>
    </div>
  );
}

export default Search;
