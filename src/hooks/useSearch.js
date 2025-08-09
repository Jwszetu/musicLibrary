import { useState, useEffect } from 'react';
import { searchManager } from '../services/SearchManager';

/**
 * Custom hook for accessing search state
 * @returns {object} Current search state
 */
export function useSearch() {
  const [state, setState] = useState(searchManager.getState());

  useEffect(() => {
    const unsubscribe = searchManager.subscribe(setState);
    return unsubscribe;
  }, []);

  return state;
}

/**
 * Custom hook for search actions
 * @returns {object} Search action methods
 */
export function useSearchActions() {
  return {
    // Basic search
    setSearchTerm: (term) => searchManager.setSearchTerm(term),
    executeSearch: (isInitialLoad) => searchManager.executeSearch(isInitialLoad),
    clearAll: () => searchManager.clearAll(),
    
    // Filters
    setFilters: (filters) => searchManager.setFilters(filters),
    addTagFilter: (tag) => searchManager.addTagFilter(tag),
    removeTagFilter: (tag) => searchManager.removeTagFilter(tag),
    addArtistFilter: (artist) => searchManager.addArtistFilter(artist),
    removeArtistFilter: (artist) => searchManager.removeArtistFilter(artist),
    setPlatformFilter: (platforms) => searchManager.setPlatformFilter(platforms),
    setDateRange: (start, end) => searchManager.setDateRange(start, end),
    clearFilters: () => searchManager.clearFilters(),
    
    // Suggestions
    getSuggestions: (input) => searchManager.getSuggestions(input),
    
    // History
    clearSearchHistory: () => searchManager.clearSearchHistory(),
    
    // Pagination
    nextPage: () => searchManager.nextPage(),
    previousPage: () => searchManager.previousPage(),
    
    // Initialize
    initialize: () => searchManager.initialize(),
  };
}

/**
 * Custom hook for search results only
 * @returns {object} Search results and metadata
 */
export function useSearchResults() {
  const { results, totalCount, isLoading, error, isInitialLoad } = useSearch();
  
  return {
    results,
    totalCount,
    isLoading,
    error,
    isInitialLoad,
  };
}

/**
 * Custom hook for search filters only
 * @returns {object} Current filters and filter actions
 */
export function useSearchFilters() {
  const { filters } = useSearch();
  const actions = useSearchActions();
  
  return {
    filters,
    addTagFilter: actions.addTagFilter,
    removeTagFilter: actions.removeTagFilter,
    addArtistFilter: actions.addArtistFilter,
    removeArtistFilter: actions.removeArtistFilter,
    setPlatformFilter: actions.setPlatformFilter,
    setDateRange: actions.setDateRange,
    clearFilters: actions.clearFilters,
    hasActiveFilters: () => searchManager.hasActiveFilters(),
    getActiveFilterCount: () => searchManager.getActiveFilterCount(),
  };
}

/**
 * Custom hook for search term and basic search functionality
 * @returns {object} Search term state and basic actions
 */
export function useSearchTerm() {
  const { searchTerm, isLoading, suggestions, searchHistory } = useSearch();
  const actions = useSearchActions();
  
  return {
    searchTerm,
    isLoading,
    suggestions,
    searchHistory,
    setSearchTerm: actions.setSearchTerm,
    getSuggestions: actions.getSuggestions,
    clearSearchHistory: actions.clearSearchHistory,
  };
}

/**
 * Custom hook for pagination
 * @returns {object} Pagination state and actions
 */
export function useSearchPagination() {
  const { pagination, totalCount } = useSearch();
  const actions = useSearchActions();
  
  return {
    ...pagination,
    totalCount,
    nextPage: actions.nextPage,
    previousPage: actions.previousPage,
    canGoNext: pagination.hasMore,
    canGoPrevious: pagination.page > 1,
  };
}
