import React, { useState, useEffect } from 'react';
import { supabaseCrud } from '../../lib/supabase'; // Import CRUD class
import { useTheme } from '../../hooks/useTheme';

/**
 * SubmitSongModal Component
 * This component contains the form for submitting new songs,
 * rendered as a full-screen modal overlay.
 * It takes an `onClose` prop to allow the parent component (HomePage) to close it.
 * It also handles the submission logic to Supabase, including managing songs,
 * artists, tags, and song links.
 */
function SubmitSongModal({ onClose }) {
  // Get theme functions
  const { getColor } = useTheme();

  // State for form inputs
  const [songTitle, setSongTitle] = useState('');
  const [songDescription, setSongDescription] = useState('');
  const [artistNames, setArtistNames] = useState(''); // Comma-separated artist names
  const [tagsInput, setTagsInput] = useState(''); // Comma-separated tags
  const [links, setLinks] = useState([{ url: '', platformId: '' }]); // Array for multiple links
  const [platforms, setPlatforms] = useState([]); // To store available platforms from DB

  // State for UI feedback
  const [loading, setLoading] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState(null); // Success or error message
  const [validationErrors, setValidationErrors] = useState({}); // Form validation errors

  // Prevent body scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Fetch available platforms when the component mounts
  useEffect(() => {
    async function fetchPlatforms() {
      const { data, error } = await supabaseCrud.getPlatforms();
      if (error) {
        console.error('Error fetching platforms:', error);
      } else {
        setPlatforms(data || []);
      }
    }
    fetchPlatforms();
  }, []);

  // Handlers for dynamic link inputs
  const handleAddLink = () => {
    setLinks([...links, { url: '', platformId: '' }]);
  };

  const handleRemoveLink = (index) => {
    const newLinks = links.filter((_, i) => i !== index);
    setLinks(newLinks);
  };

  const handleLinkChange = (index, field, value) => {
    const newLinks = links.map((link, i) =>
      i === index ? { ...link, [field]: value } : link
    );
    setLinks(newLinks);
  };

  /**
   * Handles the form submission to create a new song entry in Supabase.
   * This function performs a multi-step insertion:
   * 1. Inserts the main song details.
   * 2. Processes artist names: checks if artists exist, creates new ones if needed,
   * and then links them to the song via `song_artists`.
   * 3. Processes tags: checks if tags exist, creates new ones if needed,
   * and then links them to the song via `song_tags`.
   * 4. Inserts song links via `song_links`.
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setLoading(true);
    setSubmissionMessage(null); // Clear previous messages
    setValidationErrors({}); // Clear previous validation errors

    // Validate required fields
    const errors = {};
    if (!songTitle.trim()) {
      errors.songTitle = 'Song title is required';
    }
    if (!artistNames.trim()) {
      errors.artistNames = 'Artist name(s) is required';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setLoading(false);
      return;
    }

    try {
      // Prepare song data for the CRUD class
      const songData = {
        title: songTitle,
        description: songDescription,
        artists: artistNames.split(',').map(name => name.trim()).filter(name => name.length > 0),
        tags: tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
        links: links.filter(link => link.url && link.platformId)
      };

      // Use the CRUD class to create the song with all relationships
      const { data, error } = await supabaseCrud.createSong(songData);

      if (error) {
        throw new Error(error);
      }

      setSubmissionMessage({ type: 'success', text: 'Song submitted successfully!' });
      // Clear form fields after successful submission
      setSongTitle('');
      setSongDescription('');
      setArtistNames('');
      setTagsInput('');
      setLinks([{ url: '', platformId: '' }]);

    } catch (error) {
      console.error('Submission error:', error.message || error);
      setSubmissionMessage({ type: 'error', text: `Failed to submit song: ${error.message || error}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    // Modal Overlay: Fixed position, covers the whole screen, semi-transparent background
    <div 
      className="fixed inset-0 flex items-center justify-center p-4 z-50 backdrop-blur-sm overflow-hidden"
      style={{ backgroundColor: `${getColor('background.modal')}cc` }}
    >
      {/* Modal Content */}
      <div 
        className="rounded-2xl shadow-2xl p-8 sm:p-10 max-w-2xl w-full text-left relative overflow-y-auto max-h-[95vh] border-2 scrollbar-hide"
        style={{
          backgroundColor: getColor('background.card'),
          borderColor: getColor('border.primary'),
          boxShadow: `0 25px 50px -12px rgba(0, 0, 0, 0.25)`,
        }}
      >
        {/* Close Button - Fixed Position */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl transition-all duration-200 hover:scale-110 z-10"
          style={{
            color: getColor('text.secondary'),
            backgroundColor: getColor('background.secondary'),
            border: `1px solid ${getColor('border.primary')}`,
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = getColor('background.tertiary');
            e.target.style.color = getColor('text.primary');
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = getColor('background.secondary');
            e.target.style.color = getColor('text.secondary');
          }}
          aria-label="Close modal"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: getColor('primary.500') }}
            ></div>
            <h1 
              className="text-4xl font-bold"
              style={{ color: getColor('text.title') }}
            >
              Submit a New Song
            </h1>
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: getColor('primary.500') }}
            ></div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Song Title */}
          <div>
            <label 
              htmlFor="songTitle" 
              className="flex items-center gap-2 text-sm font-semibold mb-2"
              style={{ color: getColor('text.primary') }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
              Song Title 
              <span style={{ color: getColor('error.500') }}>*</span>
            </label>
            <input
              type="text"
              id="songTitle"
              value={songTitle}
              onChange={(e) => {
                setSongTitle(e.target.value);
                if (validationErrors.songTitle) {
                  setValidationErrors(prev => ({ ...prev, songTitle: null }));
                }
              }}
              className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-opacity-20 ${
                validationErrors.songTitle ? 'border-red-500' : ''
              }`}
              style={{
                backgroundColor: getColor('background.primary'),
                borderColor: validationErrors.songTitle ? getColor('error.500') : getColor('border.primary'),
                color: getColor('text.primary'),
                '--focus-ring-color': validationErrors.songTitle ? getColor('error.400') : getColor('primary.400'),
              }}
              onFocus={(e) => {
                e.target.style.borderColor = validationErrors.songTitle ? getColor('error.400') : getColor('primary.400');
                e.target.style.boxShadow = `0 0 0 4px ${validationErrors.songTitle ? getColor('error.100') : getColor('primary.100')}`;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = validationErrors.songTitle ? getColor('error.500') : getColor('border.primary');
                e.target.style.boxShadow = 'none';
              }}
              placeholder="e.g., Lofi Hip Hop Radio"
              required
            />
            {validationErrors.songTitle && (
              <p 
                className="mt-1 text-sm"
                style={{ color: getColor('error.500') }}
              >
                {validationErrors.songTitle}
              </p>
            )}
          </div>

          {/* Song Description */}
          <div>
            <label 
              htmlFor="songDescription" 
              className="flex items-center gap-2 text-sm font-semibold mb-2"
              style={{ color: getColor('text.primary') }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Description
            </label>
            <textarea
              id="songDescription"
              value={songDescription}
              onChange={(e) => setSongDescription(e.target.value)}
              rows="4"
              className="w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-opacity-20 resize-y"
              style={{
                backgroundColor: getColor('background.primary'),
                borderColor: getColor('border.primary'),
                color: getColor('text.primary'),
              }}
              onFocus={(e) => {
                e.target.style.borderColor = getColor('primary.400');
                e.target.style.boxShadow = `0 0 0 4px ${getColor('primary.100')}`;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = getColor('border.primary');
                e.target.style.boxShadow = 'none';
              }}
              placeholder="Optional: A brief description of the song..."
            ></textarea>
          </div>

          {/* Artist Names */}
          <div>
            <label 
              htmlFor="artistNames" 
              className="flex items-center gap-2 text-sm font-semibold mb-2"
              style={{ color: getColor('text.primary') }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Artist Name(s) 
              <span style={{ color: getColor('error.500') }}>*</span>
            </label>
            <input
              type="text"
              id="artistNames"
              value={artistNames}
              onChange={(e) => {
                setArtistNames(e.target.value);
                if (validationErrors.artistNames) {
                  setValidationErrors(prev => ({ ...prev, artistNames: null }));
                }
              }}
              className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-opacity-20 ${
                validationErrors.artistNames ? 'border-red-500' : ''
              }`}
              style={{
                backgroundColor: getColor('background.primary'),
                borderColor: validationErrors.artistNames ? getColor('error.500') : getColor('border.primary'),
                color: getColor('text.primary'),
              }}
              onFocus={(e) => {
                e.target.style.borderColor = validationErrors.artistNames ? getColor('error.400') : getColor('primary.400');
                e.target.style.boxShadow = `0 0 0 4px ${validationErrors.artistNames ? getColor('error.100') : getColor('primary.100')}`;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = validationErrors.artistNames ? getColor('error.500') : getColor('border.primary');
                e.target.style.boxShadow = 'none';
              }}
              placeholder="e.g., Lo-Fi Girl, Chillhop (comma-separated)"
              required
            />
            {validationErrors.artistNames && (
              <p 
                className="mt-1 text-sm"
                style={{ color: getColor('error.500') }}
              >
                {validationErrors.artistNames}
              </p>
            )}
          </div>

          {/* Tags */}
          <div>
            <label 
              htmlFor="tagsInput" 
              className="flex items-center gap-2 text-sm font-semibold mb-2"
              style={{ color: getColor('text.primary') }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              Tags (comma-separated)
            </label>
            <input
              type="text"
              id="tagsInput"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-opacity-20"
              style={{
                backgroundColor: getColor('background.primary'),
                borderColor: getColor('border.primary'),
                color: getColor('text.primary'),
              }}
              onFocus={(e) => {
                e.target.style.borderColor = getColor('primary.400');
                e.target.style.boxShadow = `0 0 0 4px ${getColor('primary.100')}`;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = getColor('border.primary');
                e.target.style.boxShadow = 'none';
              }}
              placeholder="e.g., Lo-Fi, Study, Chill"
            />
          </div>

          {/* Song Links */}
          <div>
            <label 
              className="flex items-center gap-2 text-sm font-semibold mb-2"
              style={{ color: getColor('text.primary') }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              Song Links
            </label>
            <div className="space-y-3">
              {links.map((link, index) => (
                <div 
                  key={index} 
                  className="p-3 rounded-xl border-2 transition-all duration-200"
                  style={{
                    backgroundColor: getColor('background.secondary'),
                    borderColor: getColor('border.primary'),
                  }}
                >
                                      <div className="flex flex-col lg:flex-row gap-3">
                    <div className="flex-1">
                      <label 
                        htmlFor={`link-url-${index}`} 
                        className="block text-xs font-semibold mb-1"
                        style={{ color: getColor('text.secondary') }}
                      >
                        URL
                      </label>
                      <input
                        type="url"
                        id={`link-url-${index}`}
                        value={link.url}
                        onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
                        className="w-full px-3 py-2.5 rounded-lg border-2 transition-all duration-200 focus:outline-none text-sm"
                        style={{
                          backgroundColor: getColor('background.primary'),
                          borderColor: getColor('border.secondary'),
                          color: getColor('text.primary'),
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = getColor('primary.400');
                          e.target.style.boxShadow = `0 0 0 3px ${getColor('primary.100')}`;
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = getColor('border.secondary');
                          e.target.style.boxShadow = 'none';
                        }}
                        placeholder="https://youtube.com/watch?v=..."
                      />
                    </div>
                    <div className="w-full lg:w-48">
                      <label 
                        htmlFor={`link-platform-${index}`} 
                        className="block text-xs font-semibold mb-1"
                        style={{ color: getColor('text.secondary') }}
                      >
                        Platform
                      </label>
                      <select
                        id={`link-platform-${index}`}
                        value={link.platformId}
                        onChange={(e) => handleLinkChange(index, 'platformId', e.target.value)}
                        className="w-full px-3 py-2.5 rounded-lg border-2 transition-all duration-200 focus:outline-none text-sm appearance-none"
                        style={{
                          backgroundColor: getColor('background.primary'),
                          borderColor: getColor('border.secondary'),
                          color: getColor('text.primary'),
                          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='${encodeURIComponent(getColor('text.secondary'))}' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                          backgroundPosition: 'right 0.5rem center',
                          backgroundRepeat: 'no-repeat',
                          backgroundSize: '1.5em 1.5em',
                          paddingRight: '2.5rem',
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = getColor('primary.400');
                          e.target.style.boxShadow = `0 0 0 3px ${getColor('primary.100')}`;
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = getColor('border.secondary');
                          e.target.style.boxShadow = 'none';
                        }}
                      >
                        <option value="">Select Platform</option>
                        {platforms.map(platform => (
                          <option key={platform.id} value={platform.id}>
                            {platform.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    {links.length > 1 && (
                      <div className="flex items-center lg:items-end">
                        <button
                          type="button"
                          onClick={() => handleRemoveLink(index)}
                          className="p-2.5 rounded-lg transition-all duration-200 hover:scale-105"
                          style={{
                            backgroundColor: getColor('error.500'),
                            color: getColor('text.inverse'),
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = getColor('error.600');
                            e.target.style.transform = 'scale(1.05)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = getColor('error.500');
                            e.target.style.transform = 'scale(1)';
                          }}
                          aria-label="Remove link"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={handleAddLink}
              className="mt-3 px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-1.5 hover:scale-105 shadow-sm text-sm"
              style={{
                backgroundColor: getColor('primary.500'),
                color: getColor('text.inverse'),
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = getColor('primary.600');
                e.target.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = getColor('primary.500');
                e.target.style.transform = 'scale(1)';
              }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m0 0H6" />
              </svg>
              Add Another Link
            </button>
          </div>

          {/* Submission Message */}
          {submissionMessage && (
            <div 
              className="p-4 rounded-xl text-center font-semibold border-2 animate-in fade-in duration-300"
              style={{
                backgroundColor: submissionMessage.type === 'success' ? getColor('success.50') : getColor('error.50'),
                color: submissionMessage.type === 'success' ? getColor('success.700') : getColor('error.700'),
                borderColor: submissionMessage.type === 'success' ? getColor('success.200') : getColor('error.200'),
              }}
            >
              <div className="flex items-center justify-center gap-2">
                {submissionMessage.type === 'success' ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                {submissionMessage.text}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2.5 font-medium rounded-lg transition duration-300 ease-in-out flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            style={{
              backgroundColor: loading ? getColor('background.disabled') : getColor('primary.500'),
              color: getColor('text.inverse'),
              boxShadow: getColor('background.primary') === '#ffffff' ? '0 4px 6px -1px rgb(0 0 0 / 0.1)' : '0 4px 6px -1px rgb(0 0 0 / 0.3)'
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = getColor('primary.600');
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = getColor('primary.500');
              }
            }}
          >
            {loading ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Submitting...
              </>
            ) : (
              <>
                Submit Song
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default SubmitSongModal;
