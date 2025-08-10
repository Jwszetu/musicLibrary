import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * Supabase CRUD Operations Class
 * Centralized database operations for the Song Hub application
 * Provides clean, reusable methods for all database interactions
 */
class SupabaseCrud {
  constructor() {
    this.client = supabase;
  }

  // ========================================
  // SONGS OPERATIONS
  // ========================================

  /**
   * Get all songs with related data (artists, tags, links)
   * Uses the songs_view for optimized data fetching
   */
  async getSongs() {
    try {
      const { data, error } = await this.client
        .from('songs_view')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching songs:', error);
      return { data: null, error: error.message };
    }
  }

  /**
   * Get a single song by ID with all related data
   * @param {string} songId - The ID of the song to fetch
   */
  async getSongById(songId) {
    try {
      const { data, error } = await this.client
        .from('songs_view')
        .select('*')
        .eq('id', songId)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching song:', error);
      return { data: null, error: error.message };
    }
  }

  /**
   * Search songs by title or description
   * @param {string} searchTerm - The term to search for
   */
  async searchSongs(searchTerm) {
    try {
      if (!searchTerm || searchTerm.trim() === '') {
        return this.getSongs();
      }

      const { data, error } = await this.client
        .from('songs_view')
        .select('*')
        .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error searching songs:', error);
      return { data: null, error: error.message };
    }
  }

  /**
   * Create a new song with artists, tags, and links
   * @param {Object} songData - The song data
   * @param {string} songData.title - Song title
   * @param {string} songData.description - Song description
   * @param {string[]} songData.artists - Array of artist names
   * @param {string[]} songData.tags - Array of tag names
   * @param {Object[]} songData.links - Array of link objects {url, platformId}
   */
  async createSong(songData) {
    try {
      const { title, description, artists = [], tags = [], links = [] } = songData;

      // 1. Create the song
      const { data: song, error: songError } = await this.client
        .from('songs')
        .insert({ title, description })
        .select('id')
        .single();

      if (songError) throw songError;
      const songId = song.id;

      // 2. Handle artists
      if (artists.length > 0) {
        const artistIds = await this._handleArtists(artists);
        await this._linkSongArtists(songId, artistIds);
      }

      // 3. Handle tags
      if (tags.length > 0) {
        const tagIds = await this._handleTags(tags);
        await this._linkSongTags(songId, tagIds);
      }

      // 4. Handle links
      if (links.length > 0) {
        await this._createSongLinks(songId, links);
      }

      return { data: song, error: null };
    } catch (error) {
      console.error('Error creating song:', error);
      return { data: null, error: error.message };
    }
  }

  /**
   * Update a song
   * @param {string} songId - The ID of the song to update
   * @param {Object} updateData - The data to update
   */
  async updateSong(songId, updateData) {
    try {
      const { data, error } = await this.client
        .from('songs')
        .update(updateData)
        .eq('id', songId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error updating song:', error);
      return { data: null, error: error.message };
    }
  }

  /**
   * Delete a song and all related data
   * @param {string} songId - The ID of the song to delete
   */
  async deleteSong(songId) {
    try {
      // Due to CASCADE constraints, deleting the song will remove related records
      const { data, error } = await this.client
        .from('songs')
        .delete()
        .eq('id', songId);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error deleting song:', error);
      return { data: null, error: error.message };
    }
  }

  // ========================================
  // ARTISTS OPERATIONS
  // ========================================

  /**
   * Get all artists
   */
  async getArtists() {
    try {
      const { data, error } = await this.client
        .from('artists')
        .select('*')
        .order('name');

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching artists:', error);
      return { data: null, error: error.message };
    }
  }

  /**
   * Create a new artist
   * @param {string} name - Artist name
   */
  async createArtist(name) {
    try {
      const { data, error } = await this.client
        .from('artists')
        .insert({ name })
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error creating artist:', error);
      return { data: null, error: error.message };
    }
  }

  // ========================================
  // TAGS OPERATIONS
  // ========================================

  /**
   * Get all tags
   */
  async getTags() {
    try {
      const { data, error } = await this.client
        .from('tags')
        .select('*')
        .order('name');

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching tags:', error);
      return { data: null, error: error.message };
    }
  }

  /**
   * Create a new tag
   * @param {string} name - Tag name
   */
  async createTag(name) {
    try {
      const { data, error } = await this.client
        .from('tags')
        .insert({ name })
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error creating tag:', error);
      return { data: null, error: error.message };
    }
  }

  // ========================================
  // PLATFORMS OPERATIONS
  // ========================================

  /**
   * Get all platforms
   */
  async getPlatforms() {
    try {
      const { data, error } = await this.client
        .from('platforms')
        .select('*')
        .order('name');

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching platforms:', error);
      return { data: null, error: error.message };
    }
  }

  // ========================================
  // PRIVATE HELPER METHODS
  // ========================================

  /**
   * Handle artist creation and return their IDs
   * @private
   */
  async _handleArtists(artistNames) {
    const artistIds = [];

    for (const name of artistNames) {
      const trimmedName = name.trim();
      if (!trimmedName) continue;

      // Try to find existing artist
      const { data: existingArtist } = await this.client
        .from('artists')
        .select('id')
        .eq('name', trimmedName)
        .single();

      if (existingArtist) {
        artistIds.push(existingArtist.id);
      } else {
        // Create new artist
        const { data: newArtist, error } = await this.client
          .from('artists')
          .insert({ name: trimmedName })
          .select('id')
          .single();

        if (error) throw error;
        artistIds.push(newArtist.id);
      }
    }

    return artistIds;
  }

  /**
   * Handle tag creation and return their IDs
   * @private
   */
  async _handleTags(tagNames) {
    const tagIds = [];

    for (const name of tagNames) {
      const trimmedName = name.trim();
      if (!trimmedName) continue;

      // Try to find existing tag
      const { data: existingTag } = await this.client
        .from('tags')
        .select('id')
        .eq('name', trimmedName)
        .single();

      if (existingTag) {
        tagIds.push(existingTag.id);
      } else {
        // Create new tag
        const { data: newTag, error } = await this.client
          .from('tags')
          .insert({ name: trimmedName })
          .select('id')
          .single();

        if (error) throw error;
        tagIds.push(newTag.id);
      }
    }

    return tagIds;
  }

  /**
   * Link song to artists
   * @private
   */
  async _linkSongArtists(songId, artistIds) {
    if (artistIds.length === 0) return;

    const songArtists = artistIds.map(artistId => ({
      song_id: songId,
      artist_id: artistId
    }));

    const { error } = await this.client
      .from('song_artists')
      .insert(songArtists);

    if (error) throw error;
  }

  /**
   * Link song to tags
   * @private
   */
  async _linkSongTags(songId, tagIds) {
    if (tagIds.length === 0) return;

    const songTags = tagIds.map(tagId => ({
      song_id: songId,
      tag_id: tagId
    }));

    const { error } = await this.client
      .from('song_tags')
      .insert(songTags);

    if (error) throw error;
  }

  /**
   * Create song links
   * @private
   */
  async _createSongLinks(songId, links) {
    const validLinks = links.filter(link => link.url && link.platformId);
    if (validLinks.length === 0) return;

    const songLinks = validLinks.map(link => ({
      song_id: songId,
      platform_id: link.platformId,
      url: link.url
    }));

    const { error } = await this.client
      .from('song_links')
      .insert(songLinks);

    if (error) throw error;
  }

  // ========================================
  // REAL-TIME SUBSCRIPTIONS
  // ========================================

  /**
   * Subscribe to song changes
   * @param {Function} callback - Callback function to handle changes
   */
  subscribeToSongs(callback) {
    return this.client
      .channel('songs-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'songs' }, 
        callback
      )
      .subscribe();
  }

  /**
   * Unsubscribe from all channels
   */
  unsubscribeAll() {
    return this.client.removeAllChannels();
  }
}

// Export singleton instance
export const supabaseCrud = new SupabaseCrud();
export default supabaseCrud;
