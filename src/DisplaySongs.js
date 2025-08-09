import React, { useState } from 'react';
import TagChip from './TagChip';
import VideoModal from './VideoModal';
import { useQueueActions } from './hooks/useQueue';
import { useTheme } from './hooks/useTheme';

function DisplaySongs({ songs, onPlayNow, onAddToQueue }) {
  const [modalVideoUrl, setModalVideoUrl] = useState(null);
  const { playNow, add } = useQueueActions();
  const { getColor } = useTheme();

  // Check if a URL is a YouTube link
  const isYouTubeUrl = (url) => {
    return url && (url.includes('youtube.com') || url.includes('youtu.be'));
  };

  // Check if a URL is a Spotify link
  const isSpotifyUrl = (url) => {
    return url && /open\.spotify\.com/.test(url);
  };

  // Handle opening the video modal
  const handleVideoClick = (e, url, meta = {}) => {
    e.preventDefault();
    e.stopPropagation();
    if (!(isYouTubeUrl(url) || isSpotifyUrl(url))) return;
    // Play immediately and ensure modal visible
    playNow({ url, ...meta });
    setModalVideoUrl(url);
  };

  // Close the modal
  const closeModal = () => {
    setModalVideoUrl(null);
  };

  // Default handlers if not provided
  const handlePlayNow = (song) => {
    if (typeof onPlayNow === 'function') {
      onPlayNow(song);
      return;
    }
    if (!Array.isArray(song.links)) return;
    const playable = song.links.find((l) => isYouTubeUrl(l.url) || isSpotifyUrl(l.url));
    if (!playable) return;
    const meta = {
      title: song.title,
      artist: Array.isArray(song.artists) ? song.artists.map((a) => a.name).join(', ') : undefined,
      platform: isYouTubeUrl(playable.url) ? 'youtube' : 'spotify',
    };
    playNow({ url: playable.url, ...meta });
    setModalVideoUrl(playable.url);
  };

  const handleAddToQueue = (song) => {
    if (typeof onAddToQueue === 'function') {
      onAddToQueue(song);
      return;
    }
    if (!Array.isArray(song.links)) return;
    const playable = song.links.find((l) => isYouTubeUrl(l.url) || isSpotifyUrl(l.url));
    if (!playable) return;
    const meta = {
      title: song.title,
      artist: Array.isArray(song.artists) ? song.artists.map((a) => a.name).join(', ') : undefined,
      platform: isYouTubeUrl(playable.url) ? 'youtube' : 'spotify',
    };
    add({ url: playable.url, ...meta });
  };

  if (!Array.isArray(songs) || songs.length === 0) {
    return (
      <div 
        className="text-center text-xl py-10"
        style={{ color: getColor('text.secondary') }}
      >
        No songs to display.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {songs.map((song) => (
        <div
          key={song.id}
          className="theme-bg-card rounded-xl shadow-lg hover:shadow-xl theme-transition overflow-hidden border theme-border"
          style={{
            backgroundColor: getColor('background.card'),
            borderColor: getColor('border.primary'),
          }}
        >
          <div className="p-6 flex flex-col h-full">
            {/* Title */}
            <h2 
              className="text-2xl font-bold mb-3 truncate theme-transition"
              style={{ color: getColor('text.accent') }}
            >
              {song.title}
            </h2>
            {/* Description */}
            {song.description && (
              <p 
                className="text-sm mb-4 line-clamp-2 theme-transition"
                style={{ color: getColor('text.secondary') }}
              >
                {song.description}
              </p>
            )}

            {/* Artists */}
            {Array.isArray(song.artists) && song.artists.length > 0 && (
              <div className="mb-4">
                <span 
                  className="font-semibold block mb-1"
                  style={{ color: getColor('text.primary') }}
                >
                  Artists:
                </span>
                <span 
                  className="text-sm"
                  style={{ color: getColor('text.secondary') }}
                >
                  {song.artists.map(a => a.name).join(', ')}
                </span>
              </div>
            )}

            {/* Tags */}
            {Array.isArray(song.tags) && song.tags.length > 0 && (
              <div className="mb-4">
                <span 
                  className="font-semibold block mb-2"
                  style={{ color: getColor('text.primary') }}
                >
                  Tags:
                </span>
                <TagChip tags={song.tags} />
              </div>
            )}

            {/* Links */}
            {Array.isArray(song.links) && song.links.length > 0 && (
              <div className="mb-4">
                <span 
                  className="font-semibold block mb-2"
                  style={{ color: getColor('text.primary') }}
                >
                  Listen on:
                </span>
                <div className="flex flex-wrap gap-2">
                {song.links.map((link) => {
                  const isYoutube = isYouTubeUrl(link.url);
                  const isSpotify = isSpotifyUrl(link.url);
                  return (
                    <a
                      key={link.id || link.url}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center text-white text-xs font-medium px-3 py-1 rounded-full transition-colors duration-200 ${
                        isYoutube
                          ? 'bg-red-500 hover:bg-red-600 cursor-pointer'
                          : isSpotify
                          ? 'bg-green-600 hover:bg-green-700 cursor-pointer'
                          : 'bg-indigo-500 hover:bg-indigo-600'
                      }`}
                      onClick={(isYoutube || isSpotify) ? (e) => handleVideoClick(e, link.url, { title: song.title, artist: Array.isArray(song.artists) ? song.artists.map(a=>a.name).join(', ') : undefined, platform: isYoutube ? 'youtube' : 'spotify' }) : undefined}
                    >
                      {link.platform_icon_url ? (
                        <img src={link.platform_icon_url} alt={link.platform_name || 'Platform'} className="w-4 h-4 mr-1" />
                      ) : isYoutube ? (
                        <svg className="mr-1 w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                        </svg>
                      ) : isSpotify ? (
                        <svg className="mr-1 w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0C5.371 0 0 5.371 0 12c0 6.627 5.371 12 12 12s12-5.373 12-12c0-6.629-5.371-12-12-12zm5.438 17.438c-.221.363-.691.477-1.055.256-2.891-1.77-6.543-2.168-10.826-1.18-.414.094-.832-.16-.926-.574-.094-.414.16-.832.574-.926 4.637-1.062 8.668-.617 11.857 1.258.363.221.477.691.256 1.066zm1.504-3.012c-.277.447-.857.588-1.305.311-3.309-2.051-8.365-2.646-12.285-1.438-.51.154-1.049-.127-1.203-.637-.154-.51.127-1.049.637-1.203 4.377-1.324 9.883-.676 13.627 1.617.447.277.588.857.311 1.35zm.143-3.143c-3.979-2.365-10.563-2.582-14.262-1.406-.607.188-1.254-.145-1.441-.752-.188-.607.145-1.254.752-1.441 4.125-1.277 11.334-1.027 15.824 1.582.561.334.74 1.062.406 1.623-.334.561-1.062.74-1.623.394z"/>
                        </svg>
                      ) : (
                        <svg className="mr-1 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                      )}
                      {link.platform_name || 'Link'}
                    </a>
                  );
                  })}
                </div>
              </div>
            )}

            {/* Submission date - pushed to bottom with margin-top auto */}
            <div className="mt-auto">
              <p 
                className="text-xs mb-4"
                style={{ color: getColor('text.meta') }}
              >
                Submitted on: {new Date(song.created_at).toLocaleDateString()}
              </p>

              {/* Card-spanning action buttons at bottom */}
              <div className="flex gap-3">
                <button
                  className="flex-1 text-sm font-semibold py-2.5 px-4 rounded-lg theme-transition"
                  style={{
                    backgroundColor: getColor('primary.500'),
                    color: getColor('text.inverse'),
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = getColor('primary.600');
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = getColor('primary.500');
                  }}
                  onClick={() => handlePlayNow(song)}
                  title="Play Now"
                >
                  ▶️ Play Now
                </button>
                <button
                  className="flex-1 text-sm font-semibold py-2.5 px-4 rounded-lg theme-transition"
                  style={{
                    backgroundColor: getColor('background.secondary'),
                    color: getColor('text.primary'),
                    border: `1px solid ${getColor('border.primary')}`,
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = getColor('background.tertiary');
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = getColor('background.secondary');
                  }}
                  onClick={() => handleAddToQueue(song)}
                  title="Add to Queue"
                >
                  ➕ Add to Queue
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Video Modal */}
      <VideoModal 
        videoUrl={modalVideoUrl} 
        onClose={closeModal} 
      />
    </div>
  );
}

export default DisplaySongs;
