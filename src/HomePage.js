import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from './supabaseClient';
import SubmitSongPage from './SubmitSongPage';
import DisplaySongs from './DisplaySongs';
import ThemeSwitcher from './components/ThemeSwitcher';
import Search from './Search';
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
      <nav 
        className="p-4 sticky top-0 z-10 border-b theme-transition"
        style={{ 
          backgroundColor: getColor('background.card'),
          borderColor: getColor('border.primary'),
          boxShadow: getColor('background.primary') === '#ffffff' ? '0 4px 6px -1px rgb(0 0 0 / 0.1)' : '0 4px 6px -1px rgb(0 0 0 / 0.3)'
        }}
      >
        <div className="container mx-auto flex justify-between items-center">
          <h1 
            className="text-2xl font-bold theme-transition"
            style={{ color: getColor('text.accent') }}
          >
            Song Hub 🎶
          </h1>
         
          <div className="flex items-center gap-4">
            <ThemeSwitcher />
            <button
              onClick={() => setShowSubmitModal(true)}
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

      {/* 
        Add extra bottom padding to ensure the last row of songs is visible above the player/modal.
        You can adjust the pb-32 value if your player is taller/shorter.
      */}
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 pb-32">
        <Search
          searchTerm={searchTerm}
          setSearchTerm={handleSearchTermChange}
          loading={searchLoading}
        />
        <p 
          className="text-lg mb-12 text-center max-w-2xl mx-auto"
          style={{ color: getColor('text.subtitle') }}
        >
          Explore a collection of amazing songs, their artists, and where to find them.
        </p>
        {songs.length === 0 ? (
          <div 
            className="text-center text-xl py-10"
            style={{ color: getColor('text.secondary') }}
          >
            No songs found{searchTerm ? ` for "${searchTerm}"` : ''}. Be the first to add one!
          </div>
        ) : (
          <DisplaySongs songs={songs} />
        )}
      </div>

      {/* Submit Song Modal */}
      {showSubmitModal && (
        <SubmitSongPage onClose={handleCloseSubmitModal} />
      )}

      {/* Footer spacer to avoid content hidden under pinned player */}
      <footer className="h-32" />
    </div>
  );
}

export default HomePage;
