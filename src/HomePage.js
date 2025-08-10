import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from './supabaseClient';
import SubmitSongModal from './SubmitSongModal';
import DisplaySongs from './DisplaySongs';
import Navbar from './components/Navbar';
import FilterSortBar from './components/FilterSortBar';
import { useTheme } from './hooks/useTheme';

/**
 * HomePage Component
 * This component displays a list of songs fetched from the Supabase 'songs' table.
 * It includes a navigation bar and a button to open a modal for submitting new songs.
 *
 * NOTE: To ensure the last row of songs is always visible (even when a player/modal overlays the bottom of the screen),
 * we add extra bottom padding to the main content area.
 */
function HomePage() {
  // Simple state management
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [filteredSongs, setFilteredSongs] = useState([]);
  
  // Get theme functions
  const { getColor } = useTheme();

  // Simple fetch function
  const fetchSongs = useCallback(async (search = '', isInitialLoad = false) => {
    try {
      if (isInitialLoad) {
        setLoading(true);
      } else {
        setSearchLoading(true);
      }
      setError(null);

      let query = supabase
        .from('songs_view')
        .select('id, title, description, created_at, artists, links, tags')
        .order('created_at', { ascending: false });

      // Simple text search
      if (search && search.trim() !== '') {
        query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching songs:', error.message);
        setError('Failed to load songs. Please try again later.');
      } else {
        setSongs(data || []);
      }
    } catch (err) {
      console.error('An unexpected error occurred:', err);
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
      setSearchLoading(false);
    }
  }, []);

  // Load songs on mount
  useEffect(() => {
    fetchSongs('', true);
  }, [fetchSongs]);

  // Debounced search effect
  useEffect(() => {
    // Skip the first render when songs haven't loaded yet
    if (loading) return;
    
    const timeoutId = setTimeout(() => {
      fetchSongs(searchTerm, false);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, fetchSongs, loading]);

  // Handler for closing the submit modal and refreshing the list
  const handleCloseSubmitModal = () => {
    setShowSubmitModal(false);
    // Refetch songs after a new song is submitted
    fetchSongs(searchTerm, false);
  };

  // Simple search handler
  const handleSearchTermChange = (newTerm) => {
    setSearchTerm(newTerm);
  };

  // Filter/sort handler
  const handleFilteredSongsChange = useCallback((filtered) => {
    setFilteredSongs(filtered);
  }, []);

  // Determine which songs to display (filtered if available, otherwise search results)
  const displaySongs = filteredSongs.length > 0 || searchTerm ? filteredSongs : songs;

  // Render logic based on loading, error, or data availability
  if (loading) {
    return (
      <div 
        className="flex items-center justify-center min-h-screen p-4 theme-transition"
        style={{ backgroundColor: getColor('background.secondary') }}
      >
        <p 
          className="text-lg theme-transition"
          style={{ color: getColor('text.secondary') }}
        >
          Loading songs...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div 
        className="flex items-center justify-center min-h-screen p-4 theme-transition"
        style={{ backgroundColor: getColor('error.bg') }}
      >
        <p 
          className="text-lg theme-transition"
          style={{ color: getColor('error.text') }}
        >
          Error: {error}
        </p>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen theme-transition"
      style={{ backgroundColor: getColor('background.primary') }}
    >
      {/* Navigation Bar */}
      <Navbar
        searchTerm={searchTerm}
        onSearchTermChange={handleSearchTermChange}
        searchLoading={searchLoading}
        onSubmitSongClick={() => setShowSubmitModal(true)}
      />

      {/* 
        Add extra bottom padding to ensure the last row of songs is visible above the player/modal.
        You can adjust the pb-32 value if your player is taller/shorter.
      */}
      <div className="container mx-auto pb-32">
        {/* Top section with subtitle */}
        <div className="p-4 sm:p-6 lg:p-8 pb-0">
          <p 
            className="text-lg mb-6 text-center max-w-2xl mx-auto"
            style={{ color: getColor('text.subtitle') }}
          >
            Explore a collection of amazing songs, their artists, and where to find them.
          </p>
        </div>

        {/* Filter and Sort Bar */}
        {songs.length > 0 && (
          <FilterSortBar
            songs={songs}
            onFilteredSongsChange={handleFilteredSongsChange}
            totalCount={songs.length}
          />
        )}

        {/* Results section */}
        <div className="p-4 sm:p-6 lg:p-8 pt-6">
          {songs.length === 0 ? (
            <div 
              className="text-center text-xl py-10"
              style={{ color: getColor('text.secondary') }}
            >
              No songs found{searchTerm ? ` for "${searchTerm}"` : ''}. Be the first to add one!
            </div>
          ) : displaySongs.length === 0 ? (
            <div 
              className="text-center text-xl py-10"
              style={{ color: getColor('text.secondary') }}
            >
              No songs match your current filters. Try adjusting your selection.
            </div>
          ) : (
            <DisplaySongs songs={displaySongs} />
          )}
        </div>
      </div>

      {/* Submit Song Modal */}
      {showSubmitModal && (
        <SubmitSongModal onClose={handleCloseSubmitModal} />
      )}

      {/* Footer spacer to avoid content hidden under pinned player */}
      <footer className="h-32" />
    </div>
  );
}

export default HomePage;
