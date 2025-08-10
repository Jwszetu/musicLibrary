import React, { useState, useRef } from 'react';

/**
 * SpotifyPlayer Component
 * Props:
 *   - url: Spotify track/album/playlist URL
 *   - autoStart: (optional) boolean, whether to auto-play (default: false)
 */
function SpotifyPlayer({ url, autoStart = false }) {
  const [showPlayer, setShowPlayer] = useState(autoStart);
  const [linkUnavailable, setLinkUnavailable] = useState(false);
  const iframeRef = useRef(null);

  // Extract Spotify embed URL from the given link
  function getSpotifyEmbedUrl(link) {
    if (!link) return null;
    try {
      // Accepts track, album, playlist, episode, show
      const match = link.match(
        /https?:\/\/open\.spotify\.com\/(track|album|playlist|episode|show)\/([a-zA-Z0-9]+)/
      );
      if (!match) return null;
      const type = match[1];
      const id = match[2];
      const base = `https://open.spotify.com/embed/${type}/${id}`;
      const params = new URLSearchParams({ utm_source: 'generator', theme: '0' });
      if (autoStart) params.set('autoplay', '1');
      return `${base}?${params.toString()}`;
    } catch {
      return null;
    }
  }

  const embedUrl = getSpotifyEmbedUrl(url);

  // If the URL is not a valid Spotify link
  if (!embedUrl) {
    return (
      <div className="text-red-500 text-sm">
        Link unavailable
      </div>
    );
  }

  // If the link is unavailable (e.g., embed fails to load)
  if (linkUnavailable) {
    return (
      <div className="text-red-500 text-sm">
        Link unavailable
      </div>
    );
  }

  // Handler for iframe error (when Spotify embed fails to load)
  const handleIframeError = () => {
    setLinkUnavailable(true);
  };

  // Handler for iframe load: check if the embed is blank (optional, best effort)
  // Note: Due to cross-origin, we can't reliably check content, so we rely on onError

  return (
    <div>
      {!showPlayer ? (
        <button
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          onClick={() => setShowPlayer(true)}
        >
          Play on Spotify
        </button>
      ) : (
        <div className="mt-2">
          <div className="mb-2 text-sm text-gray-700 flex items-center gap-2">
            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.371 0 0 5.371 0 12c0 6.627 5.371 12 12 12s12-5.373 12-12c0-6.629-5.371-12-12-12zm5.438 17.438c-.221.363-.691.477-1.055.256-2.891-1.77-6.543-2.168-10.826-1.18-.414.094-.832-.16-.926-.574-.094-.414.16-.832.574-.926 4.637-1.062 8.668-.617 11.857 1.258.363.221.477.691.256 1.066zm1.504-3.012c-.277.447-.857.588-1.305.311-3.309-2.051-8.365-2.646-12.285-1.438-.51.154-1.049-.127-1.203-.637-.154-.51.127-1.049.637-1.203 4.377-1.324 9.883-.676 13.627 1.617.447.277.588.857.311 1.35zm.143-3.143c-3.979-2.365-10.563-2.582-14.262-1.406-.607.188-1.254-.145-1.441-.752-.188-.607.145-1.254.752-1.441 4.125-1.277 11.334-1.027 15.824 1.582.561.334.74 1.062.406 1.623-.334.561-1.062.74-1.623.394z"/>
            </svg>
            You may need to <span className="font-semibold text-green-700">log in to Spotify</span> to play the full track.
          </div>
          <div className="aspect-w-16 aspect-h-9">
            <iframe
              ref={iframeRef}
              src={embedUrl}
              width="100%"
              height="80"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              frameBorder="0"
              title="Spotify Player"
              className="rounded"
              onError={handleIframeError}
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
}

export default SpotifyPlayer;
