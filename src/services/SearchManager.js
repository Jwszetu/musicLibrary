import { supabase } from '../lib/supabaseClient';

// Configuration constants
const DEFAULT_SEARCH_CONFIG = {
  // Set to empty string to show all songs on initial load
  // Change this to a specific term if you want a default search
  initialSearchTerm: '',
  showAllSongsOnStart: true,
  debounceDelay: 300,
  resultsPerPage: 50,
};

/**
 * SearchManager - Observable pattern for search state and operations
 * Manages search terms, filters, results, and advanced search functionality
 */
class SearchManager {
  constructor() {
    this.observers = new Set();
    this.state = {
      // Basic search
      searchTerm: DEFAULT_SEARCH_CONFIG.initialSearchTerm,
      isLoading: false,
      isInitialLoad: true,
      
      // Advanced search filters
      filters: {
        tags: [],
        artists: [],
        platforms: [], // youtube, spotify, etc.
        dateRange: null, // { start: Date, end: Date }
      },
      
      // Results and metadata
      results: [],
      totalCount: 0,
      error: null,
      
      // Search history and suggestions
      searchHistory: this.loadSearchHistory(),
      suggestions: [],
      
      // Pagination
      pagination: {
        page: 1,
        limit: DEFAULT_SEARCH_CONFIG.resultsPerPage,
        hasMore: true,
      }
    };
    
    // Debounce timeout for search
    this.searchTimeout = null;
    this.debounceDelay = DEFAULT_SEARCH_CONFIG.debounceDelay;

    // Debounce timeout for suggestions
    this.suggestionsTimeout = null;
    this.suggestionsDebounceDelay = 250;

    // Track last term saved to history to avoid repeated writes
    this.lastHistoryTerm = '';
  }

  // Observable pattern methods
  subscribe(observer) {
    this.observers.add(observer);
    return () => this.observers.delete(observer);
  }

  notify() {
    this.observers.forEach(observer => observer(this.state));
  }

  getState() {
    return { ...this.state };
  }

  // Search term management
  setSearchTerm(term) {
    this.state.searchTerm = term;
    this.notify();

    // Only execute debounced search; do not write to history on every keystroke
    this.debouncedSearch();
  }

  // Advanced filter management
  setFilters(filters) {
    this.state.filters = { ...this.state.filters, ...filters };
    this.notify();
    this.debouncedSearch();
  }

  addTagFilter(tag) {
    if (!this.state.filters.tags.includes(tag)) {
      this.state.filters.tags.push(tag);
      this.notify();
      this.debouncedSearch();
    }
  }

  removeTagFilter(tag) {
    this.state.filters.tags = this.state.filters.tags.filter(t => t !== tag);
    this.notify();
    this.debouncedSearch();
  }

  addArtistFilter(artist) {
    if (!this.state.filters.artists.includes(artist)) {
      this.state.filters.artists.push(artist);
      this.notify();
      this.debouncedSearch();
    }
  }

  removeArtistFilter(artist) {
    this.state.filters.artists = this.state.filters.artists.filter(a => a !== artist);
    this.notify();
    this.debouncedSearch();
  }

  setPlatformFilter(platforms) {
    this.state.filters.platforms = Array.isArray(platforms) ? platforms : [platforms];
    this.notify();
    this.debouncedSearch();
  }

  setDateRange(start, end) {
    this.state.filters.dateRange = start && end ? { start, end } : null;
    this.notify();
    this.debouncedSearch();
  }

  clearFilters() {
    this.state.filters = {
      tags: [],
      artists: [],
      platforms: [],
      dateRange: null,
    };
    this.notify();
    this.debouncedSearch();
  }

  clearAll() {
    this.state.searchTerm = '';
    this.clearFilters();
  }

  // Debounced search execution
  debouncedSearch() {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    
    this.searchTimeout = setTimeout(() => {
      this.executeSearch();
    }, this.debounceDelay);
  }

  // Main search execution
  async executeSearch(isInitialLoad = false) {
    try {
      if (isInitialLoad) {
        this.state.isInitialLoad = true;
        this.state.isLoading = true;
      } else {
        this.state.isInitialLoad = false;
        this.state.isLoading = true;
      }
      
      this.state.error = null;
      this.notify();

      const query = this.buildQuery();
      const { data, error, count } = await query;

      if (error) {
        console.error('Search error:', error.message);
        this.state.error = 'Failed to search songs. Please try again.';
        this.state.results = [];
      } else {
        this.state.results = data || [];
        this.state.totalCount = count || 0;
        this.state.error = null;

        // Save to search history only when a search completes and term changed
        const term = this.state.searchTerm.trim();
        if (term && term !== this.lastHistoryTerm) {
          this.addToSearchHistory(term);
          this.lastHistoryTerm = term;
        }
      }
    } catch (err) {
      console.error('Unexpected search error:', err);
      this.state.error = 'An unexpected error occurred during search.';
      this.state.results = [];
    } finally {
      this.state.isLoading = false;
      this.state.isInitialLoad = false;
      this.notify();
    }
  }

  // Build Supabase query based on current search state
  buildQuery() {
    let query = supabase
      .from('songs_view')
      .select('id, title, description, created_at, artists, links, tags', { count: 'exact' })
      .order('created_at', { ascending: false });

    // Text search
    if (this.state.searchTerm.trim()) {
      const searchTerm = this.state.searchTerm.trim();
      query = query.or(
        `title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`
      );
    }

    // Tag filters - For now, let's disable advanced filtering to get basic search working
    // TODO: Implement proper JSON array filtering once we understand the exact schema
    if (this.state.filters.tags.length > 0) {
      console.log('Tag filtering not yet implemented:', this.state.filters.tags);
    }

    // Artist filters - For now, let's disable advanced filtering
    if (this.state.filters.artists.length > 0) {
      console.log('Artist filtering not yet implemented:', this.state.filters.artists);
    }

    // Platform filters - For now, let's disable advanced filtering
    if (this.state.filters.platforms.length > 0) {
      console.log('Platform filtering not yet implemented:', this.state.filters.platforms);
    }

    // Date range filter
    if (this.state.filters.dateRange) {
      const { start, end } = this.state.filters.dateRange;
      query = query
        .gte('created_at', start.toISOString())
        .lte('created_at', end.toISOString());
    }

    // Pagination
    const { page, limit } = this.state.pagination;
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);

    return query;
  }

  // Search history management
  loadSearchHistory() {
    try {
      const history = localStorage.getItem('search_history');
      return history ? JSON.parse(history) : [];
    } catch {
      return [];
    }
  }

  addToSearchHistory(term) {
    const trimmed = term.trim();
    if (!trimmed) return;

    // Remove if already exists
    this.state.searchHistory = this.state.searchHistory.filter(item => item !== trimmed);
    
    // Add to beginning
    this.state.searchHistory.unshift(trimmed);
    
    // Keep only last 10 searches
    this.state.searchHistory = this.state.searchHistory.slice(0, 10);
    
    // Save to localStorage
    try {
      localStorage.setItem('search_history', JSON.stringify(this.state.searchHistory));
    } catch (e) {
      console.warn('Failed to save search history:', e);
    }
    
    this.notify();
  }

  clearSearchHistory() {
    this.state.searchHistory = [];
    try {
      localStorage.removeItem('search_history');
    } catch (e) {
      console.warn('Failed to clear search history:', e);
    }
    this.notify();
  }

  // Get search suggestions based on current input
  async getSuggestions(input) {
    // Debounce suggestions to avoid UI jank while typing
    if (this.suggestionsTimeout) {
      clearTimeout(this.suggestionsTimeout);
      this.suggestionsTimeout = null;
    }

    // Clear suggestions if input too short
    if (!input || input.length < 2) {
      this.state.suggestions = [];
      this.notify();
      return;
    }

    const queryKey = input.toLowerCase();
    this._lastSuggestionQuery = queryKey;

    this.suggestionsTimeout = setTimeout(async () => {
      try {
        // Fetch a limited sample to derive suggestions quickly
        const [{ data: tagData }, { data: artistData }] = await Promise.all([
          supabase
            .from('songs_view')
            .select('tags')
            .not('tags', 'is', null)
            .limit(50),
          supabase
            .from('songs_view')
            .select('artists')
            .not('artists', 'is', null)
            .limit(50),
        ]);

        // If the input changed since this request started, drop the result
        if (this._lastSuggestionQuery !== queryKey) return;

        const allTags = new Set();
        const allArtists = new Set();

        tagData?.forEach(song => {
          song.tags?.forEach(tag => {
            if (tag.name && tag.name.toLowerCase().includes(queryKey)) {
              allTags.add(tag.name);
            }
          });
        });

        artistData?.forEach(song => {
          song.artists?.forEach(artist => {
            if (artist.name && artist.name.toLowerCase().includes(queryKey)) {
              allArtists.add(artist.name);
            }
          });
        });

        this.state.suggestions = [
          ...Array.from(allTags).slice(0, 5).map(tag => ({ type: 'tag', value: tag })),
          ...Array.from(allArtists).slice(0, 5).map(artist => ({ type: 'artist', value: artist })),
        ];

        this.notify();
      } catch (error) {
        console.error('Failed to get suggestions:', error);
      }
    }, this.suggestionsDebounceDelay);
  }

  // Pagination methods
  nextPage() {
    if (this.state.pagination.hasMore) {
      this.state.pagination.page += 1;
      this.notify();
      this.executeSearch();
    }
  }

  previousPage() {
    if (this.state.pagination.page > 1) {
      this.state.pagination.page -= 1;
      this.notify();
      this.executeSearch();
    }
  }

  resetPagination() {
    this.state.pagination.page = 1;
    this.state.pagination.hasMore = true;
  }

  // Initial load
  async initialize() {
    // Set initial search term if configured
    if (DEFAULT_SEARCH_CONFIG.initialSearchTerm !== this.state.searchTerm) {
      this.state.searchTerm = DEFAULT_SEARCH_CONFIG.initialSearchTerm;
    }
    
    // Execute initial search to load all songs or default search
    await this.executeSearch(true);
  }

  // Helper methods for components
  hasActiveFilters() {
    const { tags, artists, platforms, dateRange } = this.state.filters;
    return tags.length > 0 || artists.length > 0 || platforms.length > 0 || dateRange !== null;
  }

  getActiveFilterCount() {
    const { tags, artists, platforms, dateRange } = this.state.filters;
    return tags.length + artists.length + platforms.length + (dateRange ? 1 : 0);
  }

  isSearchActive() {
    return this.state.searchTerm.trim() !== '' || this.hasActiveFilters();
  }
}

// Create and export singleton instance
export const searchManager = new SearchManager();
export default SearchManager;
