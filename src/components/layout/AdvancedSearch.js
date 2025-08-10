import React, { useState, useRef } from 'react';
import { useTheme } from '../hooks/useTheme';
import { useSearchTerm, useSearchFilters } from '../hooks/useSearch';

function AdvancedSearch() {
  const { getColor } = useTheme();
  const { 
    searchTerm, 
    isLoading, 
    suggestions, 
    searchHistory,
    setSearchTerm, 
    getSuggestions,
    clearSearchHistory 
  } = useSearchTerm();
  
  const {
    filters,
    addTagFilter,
    removeTagFilter,
    addArtistFilter,
    removeArtistFilter,
    setPlatformFilter,
    clearFilters,
    hasActiveFilters,
    getActiveFilterCount
  } = useSearchFilters();

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Handle input changes with suggestions
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value.length >= 2) {
      getSuggestions(value);
      setShowSuggestions(true);
      setShowHistory(false);
    } else {
      setShowSuggestions(false);
    }
  };

  // Handle input focus
  const handleInputFocus = () => {
    if (searchTerm.length >= 2) {
      setShowSuggestions(true);
    } else if (searchHistory.length > 0) {
      setShowHistory(true);
    }
  };

  // Handle input blur
  const handleInputBlur = (e) => {
    // Delay to allow clicking on suggestions
    setTimeout(() => {
      if (!suggestionsRef.current?.contains(e.relatedTarget)) {
        setShowSuggestions(false);
        setShowHistory(false);
      }
    }, 150);
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion) => {
    if (suggestion.type === 'tag') {
      addTagFilter(suggestion.value);
    } else if (suggestion.type === 'artist') {
      addArtistFilter(suggestion.value);
    }
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  // Handle history selection
  const handleHistorySelect = (term) => {
    setSearchTerm(term);
    setShowHistory(false);
    inputRef.current?.focus();
  };

  // Clear all search and filters
  const handleClearAll = () => {
    setSearchTerm('');
    clearFilters();
    inputRef.current?.focus();
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Main search input */}
      <div className="relative mb-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 theme-transition pr-10"
              style={{
                backgroundColor: getColor('background.card'),
                borderColor: getColor('border.primary'),
                color: getColor('text.primary'),
              }}
              placeholder="Search songs, artists, tags..."
              value={searchTerm}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
            />
            
            {/* Loading spinner */}
            {isLoading && (
              <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
                <div 
                  className="animate-spin rounded-full h-4 w-4 border-b-2"
                  style={{ borderColor: getColor('primary.500') }}
                />
              </div>
            )}
            
            {/* Clear button */}
            {(searchTerm || hasActiveFilters()) && (
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded transition-colors"
                style={{ color: getColor('text.secondary') }}
                onMouseEnter={(e) => e.target.style.color = getColor('text.primary')}
                onMouseLeave={(e) => e.target.style.color = getColor('text.secondary')}
                onClick={handleClearAll}
                title="Clear all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          
          {/* Advanced search toggle */}
          <button
            type="button"
            className={`px-4 py-3 rounded-lg transition-colors flex items-center gap-2 ${
              showAdvanced ? 'ring-2' : ''
            }`}
            style={{
              backgroundColor: showAdvanced ? getColor('primary.100') : getColor('background.secondary'),
              color: showAdvanced ? getColor('primary.700') : getColor('text.primary'),
              '--ring-color': getColor('primary.400'),
            }}
            onClick={() => setShowAdvanced(!showAdvanced)}
            title="Advanced search"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
            </svg>
            Filters
            {getActiveFilterCount() > 0 && (
              <span 
                className="px-2 py-1 text-xs rounded-full"
                style={{
                  backgroundColor: getColor('primary.500'),
                  color: getColor('text.inverse'),
                }}
              >
                {getActiveFilterCount()}
              </span>
            )}
          </button>
        </div>

        {/* Suggestions dropdown */}
        {(showSuggestions && suggestions.length > 0) && (
          <div 
            ref={suggestionsRef}
            className="absolute top-full left-0 right-0 mt-1 border rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto"
            style={{
              backgroundColor: getColor('background.card'),
              borderColor: getColor('border.primary'),
            }}
          >
            {suggestions.map((suggestion, index) => (
              <button
                key={`${suggestion.type}-${suggestion.value}-${index}`}
                className="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-opacity-50 transition-colors"
                style={{
                  backgroundColor: 'transparent',
                  color: getColor('text.primary'),
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = getColor('background.secondary')}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                onClick={() => handleSuggestionSelect(suggestion)}
              >
                <span 
                  className="px-2 py-1 text-xs rounded"
                  style={{
                    backgroundColor: suggestion.type === 'tag' ? getColor('primary.100') : getColor('success.bg'),
                    color: suggestion.type === 'tag' ? getColor('primary.700') : getColor('success.text'),
                  }}
                >
                  {suggestion.type}
                </span>
                {suggestion.value}
              </button>
            ))}
          </div>
        )}

        {/* Search history dropdown */}
        {(showHistory && searchHistory.length > 0) && (
          <div 
            ref={suggestionsRef}
            className="absolute top-full left-0 right-0 mt-1 border rounded-lg shadow-lg z-10"
            style={{
              backgroundColor: getColor('background.card'),
              borderColor: getColor('border.primary'),
            }}
          >
            <div 
              className="px-4 py-2 text-xs font-semibold border-b flex justify-between items-center"
              style={{
                color: getColor('text.secondary'),
                borderColor: getColor('border.primary'),
              }}
            >
              Recent searches
              <button
                onClick={clearSearchHistory}
                className="text-xs hover:underline"
                style={{ color: getColor('text.tertiary') }}
              >
                Clear
              </button>
            </div>
            {searchHistory.map((term, index) => (
              <button
                key={`history-${term}-${index}`}
                className="w-full px-4 py-2 text-left hover:bg-opacity-50 transition-colors"
                style={{
                  backgroundColor: 'transparent',
                  color: getColor('text.primary'),
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = getColor('background.secondary')}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                onClick={() => handleHistorySelect(term)}
              >
                <svg className="w-3 h-3 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {term}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Advanced filters */}
      {showAdvanced && (
        <div 
          className="p-4 border rounded-lg space-y-4"
          style={{
            backgroundColor: getColor('background.secondary'),
            borderColor: getColor('border.primary'),
          }}
        >
          {/* Active filters */}
          {hasActiveFilters() && (
            <div className="space-y-2">
              <h4 
                className="text-sm font-semibold"
                style={{ color: getColor('text.primary') }}
              >
                Active Filters:
              </h4>
              <div className="flex flex-wrap gap-2">
                {filters.tags.map(tag => (
                  <span 
                    key={tag}
                    className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full"
                    style={{
                      backgroundColor: getColor('primary.100'),
                      color: getColor('primary.700'),
                    }}
                  >
                    Tag: {tag}
                    <button
                      onClick={() => removeTagFilter(tag)}
                      className="hover:bg-opacity-20 rounded-full p-0.5"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
                {filters.artists.map(artist => (
                  <span 
                    key={artist}
                    className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full"
                    style={{
                      backgroundColor: getColor('success.bg'),
                      color: getColor('success.text'),
                    }}
                  >
                    Artist: {artist}
                    <button
                      onClick={() => removeArtistFilter(artist)}
                      className="hover:bg-opacity-20 rounded-full p-0.5"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Platform filters */}
          <div className="space-y-2">
            <h4 
              className="text-sm font-semibold"
              style={{ color: getColor('text.primary') }}
            >
              Platforms:
            </h4>
            <div className="flex flex-wrap gap-2">
              {['YouTube', 'Spotify', 'SoundCloud'].map(platform => (
                <button
                  key={platform}
                  className={`px-3 py-1 text-xs rounded-full transition-colors ${
                    filters.platforms.includes(platform) ? 'ring-2' : ''
                  }`}
                  style={{
                    backgroundColor: filters.platforms.includes(platform) 
                      ? getColor('primary.500') 
                      : getColor('background.card'),
                    color: filters.platforms.includes(platform) 
                      ? getColor('text.inverse') 
                      : getColor('text.primary'),
                    borderColor: getColor('border.primary'),
                    '--ring-color': getColor('primary.400'),
                  }}
                  onClick={() => {
                    if (filters.platforms.includes(platform)) {
                      setPlatformFilter(filters.platforms.filter(p => p !== platform));
                    } else {
                      setPlatformFilter([...filters.platforms, platform]);
                    }
                  }}
                >
                  {platform}
                </button>
              ))}
            </div>
          </div>

          {/* Clear filters button */}
          {hasActiveFilters() && (
            <button
              className="px-4 py-2 text-sm rounded-lg transition-colors"
              style={{
                backgroundColor: getColor('background.tertiary'),
                color: getColor('text.primary'),
                border: `1px solid ${getColor('border.primary')}`,
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = getColor('background.card')}
              onMouseLeave={(e) => e.target.style.backgroundColor = getColor('background.tertiary')}
              onClick={clearFilters}
            >
              Clear All Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default AdvancedSearch;
