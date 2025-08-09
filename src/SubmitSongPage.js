import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient'; // Import supabase client

/**
 * SubmitSongPage Component (Modal Version)
 * This component contains the form for submitting new songs,
 * rendered as a full-screen modal overlay.
 * It takes an `onClose` prop to allow the parent component (HomePage) to close it.
 * It also handles the submission logic to Supabase, including managing songs,
 * artists, tags, and song links.
 */
function SubmitSongPage({ onClose }) {
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

  // Fetch available platforms when the component mounts
  useEffect(() => {
    async function fetchPlatforms() {
      const { data, error } = await supabase.from('platforms').select('id, name, icon_url');
      if (error) {
        console.error('Error fetching platforms:', error.message);
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

    try {
      // 1. Insert the Song
      const { data: songData, error: songError } = await supabase
        .from('songs')
        .insert({
          title: songTitle,
          description: songDescription,
          // submitted_by: 'YOUR_DEFAULT_USER_UUID', // TODO: Replace with a mechanism to get a user ID or remove if not needed
          // For now, we omit submitted_by since we're not using auth.
          // If you *do* need it, you must insert a dummy profile linked to auth.users.
        })
        .select('id')
        .single();

      if (songError) throw songError;
      const newSongId = songData.id;

      // 2. Process Artists
      const artistNamesArray = artistNames.split(',').map(name => name.trim()).filter(name => name.length > 0);
      const artistIdsToLink = [];

      for (const name of artistNamesArray) {
        let artistId;
        // Try to find existing artist
        const { data: existingArtist, error: findError } = await supabase
          .from('artists')
          .select('id')
          .eq('name', name)
          .single();

        if (existingArtist) {
          artistId = existingArtist.id;
        } else if (findError && findError.code === 'PGRST116') { // No rows found
          // Create new artist if not found
          const { data: newArtist, error: insertArtistError } = await supabase
            .from('artists')
            .insert({ name: name })
            .select('id')
            .single();
          if (insertArtistError) throw insertArtistError;
          artistId = newArtist.id;
        } else if (findError) {
          throw findError; // Other error
        }
        artistIdsToLink.push(artistId);
      }

      // Link artists to the song
      if (artistIdsToLink.length > 0) {
        const songArtistsData = artistIdsToLink.map(artist_id => ({
          song_id: newSongId,
          artist_id: artist_id,
        }));
        const { error: songArtistsError } = await supabase.from('song_artists').insert(songArtistsData);
        if (songArtistsError) throw songArtistsError;
      }

      // 3. Process Tags
      const tagsArray = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
      const tagIdsToLink = [];

      for (const tagName of tagsArray) {
        let tagId;
        // Try to find existing tag
        const { data: existingTag, error: findError } = await supabase
          .from('tags')
          .select('id')
          .eq('name', tagName)
          .single();

        if (existingTag) {
          tagId = existingTag.id;
        } else if (findError && findError.code === 'PGRST116') { // No rows found
          // Create new tag if not found
          const { data: newTag, error: insertTagError } = await supabase
            .from('tags')
            .insert({ name: tagName })
            .select('id')
            .single();
          if (insertTagError) throw insertTagError;
          tagId = newTag.id;
        } else if (findError) {
          throw findError; // Other error
        }
        tagIdsToLink.push(tagId);
      }

      // Link tags to the song
      if (tagIdsToLink.length > 0) {
        const songTagsData = tagIdsToLink.map(tag_id => ({
          song_id: newSongId,
          tag_id: tag_id,
        }));
        const { error: songTagsError } = await supabase.from('song_tags').insert(songTagsData);
        if (songTagsError) throw songTagsError;
      }

      // 4. Insert Song Links
      const validLinks = links.filter(link => link.url && link.platformId);
      if (validLinks.length > 0) {
        const songLinksData = validLinks.map(link => ({
          song_id: newSongId,
          platform_id: link.platformId,
          url: link.url,
        }));
        const { error: songLinksError } = await supabase.from('song_links').insert(songLinksData);
        if (songLinksError) throw songLinksError;
      }

      setSubmissionMessage({ type: 'success', text: 'Song submitted successfully!' });
      // Optionally clear form fields after successful submission
      setSongTitle('');
      setSongDescription('');
      setArtistNames('');
      setTagsInput('');
      setLinks([{ url: '', platformId: '' }]);

    } catch (error) {
      console.error('Submission error:', error.message);
      setSubmissionMessage({ type: 'error', text: `Failed to submit song: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    // Modal Overlay: Fixed position, covers the whole screen, semi-transparent background
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      {/* Modal Content */}
      <div className="bg-white rounded-xl shadow-2xl p-8 sm:p-12 max-w-lg w-full text-left relative overflow-y-auto max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors duration-200"
          aria-label="Close modal"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>

        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Submit a New Song</h1>
        <p className="text-gray-600 mb-8 text-center">
          Fill out the details below to add a new song to the library.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Song Title */}
          <div>
            <label htmlFor="songTitle" className="block text-sm font-medium text-gray-700 mb-1">Song Title <span className="text-red-500">*</span></label>
            <input
              type="text"
              id="songTitle"
              value={songTitle}
              onChange={(e) => setSongTitle(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Lofi Hip Hop Radio"
              required
            />
          </div>

          {/* Song Description */}
          <div>
            <label htmlFor="songDescription" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              id="songDescription"
              value={songDescription}
              onChange={(e) => setSongDescription(e.target.value)}
              rows="3"
              className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
              placeholder="Optional: A brief description of the song..."
            ></textarea>
          </div>

          {/* Artist Names */}
          <div>
            <label htmlFor="artistNames" className="block text-sm font-medium text-gray-700 mb-1">Artist Name(s) <span className="text-red-500">*</span></label>
            <input
              type="text"
              id="artistNames"
              value={artistNames}
              onChange={(e) => setArtistNames(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Lo-Fi Girl, Chillhop (comma-separated)"
              required
            />
          </div>

          {/* Tags */}
          <div>
            <label htmlFor="tagsInput" className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
            <input
              type="text"
              id="tagsInput"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Lo-Fi, Study, Chill"
            />
          </div>

          {/* Song Links */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Song Links</label>
            {links.map((link, index) => (
              <div key={index} className="flex flex-col sm:flex-row gap-2 mb-3 items-end">
                <div className="flex-1 w-full">
                  <label htmlFor={`link-url-${index}`} className="block text-xs font-medium text-gray-500 mb-1">URL</label>
                  <input
                    type="url"
                    id={`link-url-${index}`}
                    value={link.url}
                    onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="https://youtube.com/watch?v=..."
                  />
                </div>
                <div className="w-full sm:w-auto">
                  <label htmlFor={`link-platform-${index}`} className="block text-xs font-medium text-gray-500 mb-1">Platform</label>
                  <select
                    id={`link-platform-${index}`}
                    value={link.platformId}
                    onChange={(e) => handleLinkChange(index, 'platformId', e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
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
                  <button
                    type="button"
                    onClick={() => handleRemoveLink(index)}
                    className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200 flex-shrink-0"
                    aria-label="Remove link"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddLink}
              className="mt-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg shadow-md transition duration-300 ease-in-out text-sm flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m0 0H6"></path></svg>
              Add Another Link
            </button>
          </div>

          {/* Submission Message */}
          {submissionMessage && (
            <div className={`p-3 rounded-lg text-center font-medium ${
              submissionMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {submissionMessage.text}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Submitting...' : 'Submit Song'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default SubmitSongPage;
