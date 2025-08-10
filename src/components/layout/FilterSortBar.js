import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../hooks/useTheme';

function FilterSortBar({ songs, onFilteredSongsChange, totalCount = 0 }) {
  const { getColor } = useTheme();
  const [showFilters, setShowFilters] = useState(false);
  const [showSorts, setShowSorts] = useState(false);
  const filtersRef = useRef(null);
  const sortsRef = useRef(null);

  // Filter states
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedArtists, setSelectedArtists] = useState([]);

  // Sort state
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' or 'desc'

  // Extract unique values from songs for filter options
  const availablePlatforms = React.useMemo(() => {
    const platforms = new Set();
    songs.forEach(song => {
      if (Array.isArray(song.links)) {
        song.links.forEach(link => {
          if (link.platform_name) {
            platforms.add(link.platform_name);
          }
        });
      }
    });
    return Array.from(platforms).sort();
  }, [songs]);

  const availableTags = React.useMemo(() => {
    const tags = new Set();
    songs.forEach(song => {
      if (Array.isArray(song.tags)) {
        song.tags.forEach(tag => {
          if (tag.name) {
            tags.add(tag.name);
          }
        });
      }
    });
    return Array.from(tags).sort();
  }, [songs]);

  const availableArtists = React.useMemo(() => {
    const artists = new Set();
    songs.forEach(song => {
      if (Array.isArray(song.artists)) {
        song.artists.forEach(artist => {
          if (artist.name) {
            artists.add(artist.name);
          }
        });
      }
    });
    return Array.from(artists).sort();
  }, [songs]);

  // Apply filters and sorting
  const filteredAndSortedSongs = React.useMemo(() => {
    let filtered = [...songs];

    // Apply platform filter
    if (selectedPlatforms.length > 0) {
      filtered = filtered.filter(song =>
        Array.isArray(song.links) &&
        song.links.some(link => selectedPlatforms.includes(link.platform_name))
      );
    }

    // Apply tag filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter(song =>
        Array.isArray(song.tags) &&
        song.tags.some(tag => selectedTags.includes(tag.name))
      );
    }

    // Apply artist filter
    if (selectedArtists.length > 0) {
      filtered = filtered.filter(song =>
        Array.isArray(song.artists) &&
        song.artists.some(artist => selectedArtists.includes(artist.name))
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case 'title':
          aValue = a.title?.toLowerCase() || '';
          bValue = b.title?.toLowerCase() || '';
          break;
        case 'created_at':
          aValue = new Date(a.created_at);
          bValue = new Date(b.created_at);
          break;
        case 'artist':
          aValue = a.artists?.[0]?.name?.toLowerCase() || '';
          bValue = b.artists?.[0]?.name?.toLowerCase() || '';
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [songs, selectedPlatforms, selectedTags, selectedArtists, sortBy, sortOrder]);

  // Notify parent of filtered songs
  useEffect(() => {
    onFilteredSongsChange(filteredAndSortedSongs);
  }, [filteredAndSortedSongs, onFilteredSongsChange]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filtersRef.current && !filtersRef.current.contains(event.target)) {
        setShowFilters(false);
      }
      if (sortsRef.current && !sortsRef.current.contains(event.target)) {
        setShowSorts(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Check for dropdown overflow and adjust positioning
  useEffect(() => {
    if (showFilters && filtersRef.current) {
      const dropdown = filtersRef.current.querySelector('[data-dropdown]');
      if (dropdown) {
        const rect = dropdown.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        
        if (rect.right > viewportWidth - 16) {
          dropdown.style.left = 'auto';
          dropdown.style.right = '0';
        }
      }
    }
  }, [showFilters]);

  // Helper functions
  const togglePlatform = (platform) => {
    setSelectedPlatforms(prev =>
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const toggleTag = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const toggleArtist = (artist) => {
    setSelectedArtists(prev =>
      prev.includes(artist)
        ? prev.filter(a => a !== artist)
        : [...prev, artist]
    );
  };

  const clearAllFilters = () => {
    setSelectedPlatforms([]);
    setSelectedTags([]);
    setSelectedArtists([]);
  };

  const hasActiveFilters = selectedPlatforms.length > 0 || selectedTags.length > 0 || selectedArtists.length > 0;
  const activeFilterCount = selectedPlatforms.length + selectedTags.length + selectedArtists.length;

  const getSortIcon = () => {
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  const getSortLabel = () => {
    const labels = {
      'created_at': 'Date',
      'title': 'Title',
      'artist': 'Artist'
    };
    return labels[sortBy] || 'Date';
  };

  return (
    <div 
      className="sticky z-40 backdrop-blur-sm border-b shadow-sm"
      style={{
        top: '88px', // Height of navigation bar (p-4 + content + border)
        backgroundColor: `${getColor('background.secondary')}f0`,
        borderColor: getColor('border.primary'),
        maxWidth: '100vw',
        overflow: 'hidden',
      }}
    >
      <div className="flex flex-wrap items-center justify-between gap-4 p-6">
      {/* Left side - Filters */}
      <div className="flex items-center gap-3">
        {/* Filter Button */}
        <div className="relative" ref={filtersRef}>
          <button
            className={`group flex items-center gap-3 px-4 py-2.5 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
              hasActiveFilters ? 'ring-2 ring-opacity-50' : ''
            }`}
            style={{
              backgroundColor: hasActiveFilters ? getColor('primary.50') : getColor('background.card'),
              borderColor: hasActiveFilters ? getColor('primary.300') : getColor('border.primary'),
              color: hasActiveFilters ? getColor('primary.700') : getColor('text.primary'),
              '--ring-color': getColor('primary.400'),
              boxShadow: hasActiveFilters ? `0 4px 12px ${getColor('primary.200')}40` : '0 2px 4px rgba(0,0,0,0.1)',
            }}
            onClick={() => setShowFilters(!showFilters)}
          >
            <svg className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
            </svg>
            <span className="font-semibold">Filters</span>
            {hasActiveFilters && (
              <div 
                className="px-2 py-1 text-xs font-bold rounded-full animate-pulse"
                style={{
                  backgroundColor: getColor('primary.500'),
                  color: getColor('text.inverse'),
                }}
              >
                {activeFilterCount}
              </div>
            )}
          </button>

          {/* Filter Dropdown */}
          {showFilters && (
            <div 
              data-dropdown
              className="absolute top-full left-0 mt-3 w-96 border-2 rounded-2xl shadow-2xl z-20 max-h-96 overflow-hidden animate-in slide-in-from-top-2 duration-200"
              style={{
                backgroundColor: getColor('background.card'),
                borderColor: getColor('border.primary'),
                boxShadow: `0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)`,
                maxWidth: 'calc(100vw - 2rem)',
                left: '0',
                right: 'auto',
                transform: 'translateX(0)',
              }}
            >
              <div className="max-h-96 overflow-y-auto">
                <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: getColor('primary.500') }}
                    ></div>
                    <h3 
                      className="text-lg font-bold"
                      style={{ color: getColor('text.primary') }}
                    >
                      Filter Songs
                    </h3>
                  </div>
                  {hasActiveFilters && (
                    <button
                      className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all hover:scale-105"
                      style={{ 
                        color: getColor('text.secondary'),
                        backgroundColor: getColor('background.secondary'),
                        border: `1px solid ${getColor('border.primary')}`,
                      }}
                      onClick={clearAllFilters}
                    >
                      Clear All
                    </button>
                  )}
                </div>

                {/* Platform Filter */}
                {availablePlatforms.length > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: getColor('primary.500') }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0v8a1 1 0 01-1 1H8a1 1 0 01-1-1V4m0 0H5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2h-2" />
                      </svg>
                      <h4 
                        className="font-semibold"
                        style={{ color: getColor('text.primary') }}
                      >
                        Platforms 
                        <span 
                          className="ml-1 text-xs px-2 py-0.5 rounded-full"
                          style={{ 
                            backgroundColor: getColor('background.tertiary'),
                            color: getColor('text.secondary'),
                          }}
                        >
                          {availablePlatforms.length}
                        </span>
                      </h4>
                    </div>
                    <div className="grid grid-cols-2 gap-2 max-h-24 overflow-y-auto">
                      {availablePlatforms.map(platform => (
                        <label key={platform} className="flex items-center p-2 rounded-lg hover:bg-opacity-50 cursor-pointer transition-all"
                          style={{ backgroundColor: selectedPlatforms.includes(platform) ? getColor('primary.50') : 'transparent' }}
                        >
                          <input
                            type="checkbox"
                            className="sr-only"
                            checked={selectedPlatforms.includes(platform)}
                            onChange={() => togglePlatform(platform)}
                          />
                          <div 
                            className={`w-4 h-4 rounded border-2 mr-3 flex items-center justify-center transition-all ${
                              selectedPlatforms.includes(platform) ? 'border-opacity-100' : 'border-opacity-30'
                            }`}
                            style={{ 
                              borderColor: getColor('primary.500'),
                              backgroundColor: selectedPlatforms.includes(platform) ? getColor('primary.500') : 'transparent',
                            }}
                          >
                            {selectedPlatforms.includes(platform) && (
                              <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                          <span 
                            className="text-sm font-medium"
                            style={{ color: selectedPlatforms.includes(platform) ? getColor('primary.700') : getColor('text.secondary') }}
                          >
                            {platform}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tag Filter */}
                {availableTags.length > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: getColor('success.500') }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      <h4 
                        className="font-semibold"
                        style={{ color: getColor('text.primary') }}
                      >
                        Tags 
                        <span 
                          className="ml-1 text-xs px-2 py-0.5 rounded-full"
                          style={{ 
                            backgroundColor: getColor('background.tertiary'),
                            color: getColor('text.secondary'),
                          }}
                        >
                          {availableTags.length}
                        </span>
                      </h4>
                    </div>
                    <div className="grid grid-cols-2 gap-2 max-h-24 overflow-y-auto">
                      {availableTags.map(tag => (
                        <label key={tag} className="flex items-center p-2 rounded-lg hover:bg-opacity-50 cursor-pointer transition-all"
                          style={{ backgroundColor: selectedTags.includes(tag) ? getColor('success.50') : 'transparent' }}
                        >
                          <input
                            type="checkbox"
                            className="sr-only"
                            checked={selectedTags.includes(tag)}
                            onChange={() => toggleTag(tag)}
                          />
                          <div 
                            className={`w-4 h-4 rounded border-2 mr-3 flex items-center justify-center transition-all ${
                              selectedTags.includes(tag) ? 'border-opacity-100' : 'border-opacity-30'
                            }`}
                            style={{ 
                              borderColor: getColor('success.500'),
                              backgroundColor: selectedTags.includes(tag) ? getColor('success.500') : 'transparent',
                            }}
                          >
                            {selectedTags.includes(tag) && (
                              <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                          <span 
                            className="text-sm font-medium"
                            style={{ color: selectedTags.includes(tag) ? getColor('success.700') : getColor('text.secondary') }}
                          >
                            {tag}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Artist Filter */}
                {availableArtists.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: getColor('warning.500') }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <h4 
                        className="font-semibold"
                        style={{ color: getColor('text.primary') }}
                      >
                        Artists 
                        <span 
                          className="ml-1 text-xs px-2 py-0.5 rounded-full"
                          style={{ 
                            backgroundColor: getColor('background.tertiary'),
                            color: getColor('text.secondary'),
                          }}
                        >
                          {availableArtists.length}
                        </span>
                      </h4>
                    </div>
                    <div className="grid grid-cols-2 gap-2 max-h-24 overflow-y-auto">
                      {availableArtists.map(artist => (
                        <label key={artist} className="flex items-center p-2 rounded-lg hover:bg-opacity-50 cursor-pointer transition-all"
                          style={{ backgroundColor: selectedArtists.includes(artist) ? getColor('warning.50') : 'transparent' }}
                        >
                          <input
                            type="checkbox"
                            className="sr-only"
                            checked={selectedArtists.includes(artist)}
                            onChange={() => toggleArtist(artist)}
                          />
                          <div 
                            className={`w-4 h-4 rounded border-2 mr-3 flex items-center justify-center transition-all ${
                              selectedArtists.includes(artist) ? 'border-opacity-100' : 'border-opacity-30'
                            }`}
                            style={{ 
                              borderColor: getColor('warning.500'),
                              backgroundColor: selectedArtists.includes(artist) ? getColor('warning.500') : 'transparent',
                            }}
                          >
                            {selectedArtists.includes(artist) && (
                              <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                          <span 
                            className="text-sm font-medium"
                            style={{ color: selectedArtists.includes(artist) ? getColor('warning.700') : getColor('text.secondary') }}
                          >
                            {artist}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Active Filter Chips */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2">
            {selectedPlatforms.map(platform => (
              <div
                key={`platform-${platform}`}
                className="group inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg border shadow-sm transition-all hover:shadow-md"
                style={{
                  backgroundColor: getColor('primary.50'),
                  color: getColor('primary.700'),
                  borderColor: getColor('primary.200'),
                }}
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0v8a1 1 0 01-1 1H8a1 1 0 01-1-1V4m0 0H5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2h-2" />
                </svg>
                {platform}
                <button
                  onClick={() => togglePlatform(platform)}
                  className="ml-1 hover:bg-opacity-30 rounded-full p-1 transition-all group-hover:scale-110"
                  style={{ backgroundColor: getColor('primary.200') }}
                >
                  <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
            {selectedTags.map(tag => (
              <div
                key={`tag-${tag}`}
                className="group inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg border shadow-sm transition-all hover:shadow-md"
                style={{
                  backgroundColor: getColor('success.50'),
                  color: getColor('success.700'),
                  borderColor: getColor('success.200'),
                }}
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                {tag}
                <button
                  onClick={() => toggleTag(tag)}
                  className="ml-1 hover:bg-opacity-30 rounded-full p-1 transition-all group-hover:scale-110"
                  style={{ backgroundColor: getColor('success.200') }}
                >
                  <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
            {selectedArtists.map(artist => (
              <div
                key={`artist-${artist}`}
                className="group inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg border shadow-sm transition-all hover:shadow-md"
                style={{
                  backgroundColor: getColor('warning.50'),
                  color: getColor('warning.700'),
                  borderColor: getColor('warning.200'),
                }}
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {artist}
                <button
                  onClick={() => toggleArtist(artist)}
                  className="ml-1 hover:bg-opacity-30 rounded-full p-1 transition-all group-hover:scale-110"
                  style={{ backgroundColor: getColor('warning.200') }}
                >
                  <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right side - Sort and Results */}
      <div className="flex items-center gap-4">
        {/* Results Count */}
        <div className="flex items-center gap-2">
          <div 
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ backgroundColor: getColor('success.500') }}
          ></div>
          <span 
            className="text-sm font-medium"
            style={{ color: getColor('text.primary') }}
          >
            <span 
              className="text-lg font-bold"
              style={{ color: getColor('primary.600') }}
            >
              {filteredAndSortedSongs.length}
            </span>
            <span style={{ color: getColor('text.secondary') }}> of {totalCount} songs</span>
          </span>
        </div>

        {/* Sort Button */}
        <div className="relative" ref={sortsRef}>
          <button
            className="group flex items-center gap-3 px-4 py-2.5 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            style={{
              backgroundColor: getColor('background.card'),
              borderColor: getColor('border.primary'),
              color: getColor('text.primary'),
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
            onClick={() => setShowSorts(!showSorts)}
          >
            <svg className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
            </svg>
            <span className="font-semibold">
              Sort: {getSortLabel()}
            </span>
            <span 
              className="text-lg font-bold"
              style={{ color: getColor('primary.600') }}
            >
              {getSortIcon()}
            </span>
          </button>

          {/* Sort Dropdown */}
          {showSorts && (
            <div 
              className="absolute top-full right-0 mt-3 w-56 border-2 rounded-2xl shadow-2xl z-20 animate-in slide-in-from-top-2 duration-200"
              style={{
                backgroundColor: getColor('background.card'),
                borderColor: getColor('border.primary'),
                boxShadow: `0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)`,
                maxWidth: 'calc(100vw - 2rem)',
                right: '0',
                left: 'auto',
              }}
            >
              <div className="p-2">
                <div className="flex items-center gap-2 mb-4 p-3">
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: getColor('primary.500') }}
                  ></div>
                  <h3 
                    className="text-lg font-bold"
                    style={{ color: getColor('text.primary') }}
                  >
                    Sort Options
                  </h3>
                </div>
                {[
                  { value: 'created_at', label: 'Date Added', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
                  { value: 'title', label: 'Song Title', icon: 'M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0v8a1 1 0 01-1 1H8a1 1 0 01-1-1V4m0 0H5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2h-2' },
                  { value: 'artist', label: 'Artist Name', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
                ].map(option => (
                  <button
                    key={option.value}
                    className={`group w-full text-left px-4 py-3 mb-2 text-sm rounded-xl transition-all duration-200 border ${
                      sortBy === option.value ? 'font-semibold shadow-md' : 'hover:shadow-sm'
                    }`}
                    style={{
                      backgroundColor: sortBy === option.value ? getColor('primary.50') : getColor('background.secondary'),
                      color: sortBy === option.value ? getColor('primary.700') : getColor('text.primary'),
                      borderColor: sortBy === option.value ? getColor('primary.200') : getColor('border.primary'),
                    }}
                    onClick={() => {
                      if (sortBy === option.value) {
                        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                      } else {
                        setSortBy(option.value);
                        setSortOrder('desc');
                      }
                      setShowSorts(false);
                    }}
                    onMouseEnter={(e) => {
                      if (sortBy !== option.value) {
                        e.target.style.backgroundColor = getColor('background.tertiary');
                        e.target.style.transform = 'scale(1.02)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (sortBy !== option.value) {
                        e.target.style.backgroundColor = getColor('background.secondary');
                        e.target.style.transform = 'scale(1)';
                      }
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={option.icon} />
                        </svg>
                        <span>{option.label}</span>
                      </div>
                      {sortBy === option.value && (
                        <div className="flex items-center gap-2">
                          <span 
                            className="text-xs px-2 py-1 rounded-full font-bold"
                            style={{ 
                              backgroundColor: getColor('primary.500'),
                              color: getColor('text.inverse'),
                            }}
                          >
                            Active
                          </span>
                          <span 
                            className="text-lg font-bold"
                            style={{ color: getColor('primary.600') }}
                          >
                            {getSortIcon()}
                          </span>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
  );
}

export default FilterSortBar;
