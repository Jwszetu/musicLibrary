import React, { useEffect, useState, useMemo } from 'react';

let youtubeApiPromise = null;

function ensureYoutubeApi() {
  if (window.YT && window.YT.Player) return Promise.resolve();
  if (!youtubeApiPromise) {
    youtubeApiPromise = new Promise((resolve) => {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);
      window.onYouTubeIframeAPIReady = () => resolve();
    });
  }
  return youtubeApiPromise;
}

function YoutubePlayer({ url, autoStart = false, playerRef = null, onEnded }) {
  const [showPlayer, setShowPlayer] = useState(autoStart);
  // NOTE: kept for potential future direct API usage

  // Extract the YouTube video ID from the URL
  function getYoutubeId(link) {
    if (!link) return null;
    const regExp =
      /^.*(?:youtu\.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|watch\?.+&v=)([^#&?]*).*/;
    const match = link.match(regExp);
    return match && match[1].length === 11 ? match[1] : null;
  }

  const videoId = useMemo(() => getYoutubeId(url), [url]);
  
  useEffect(() => {
    if (!showPlayer || !videoId) return;
    let player;
    let cancelled = false;
    ensureYoutubeApi().then(() => {
      if (cancelled) return;
      player = new window.YT.Player(`yt-${videoId}`, {
        videoId,
        width: '100%',
        height: '100%',
        playerVars: { 
          autoplay: 1, 
          origin: window.location.origin,
          rel: 0,
          modestbranding: 1
        },
        events: {
          onReady: (e) => {
            if (playerRef && typeof playerRef === 'object') {
              // keep ref compatible
              try { playerRef.current = e.target.getIframe(); } catch {}
            }
          },
          onStateChange: (e) => {
            // 0 = ended
            if (e.data === window.YT.PlayerState.ENDED && typeof onEnded === 'function') {
              onEnded();
            }
          },
        },
      });
    });
    return () => {
      cancelled = true;
      try { player && player.destroy && player.destroy(); } catch {}
    };
  }, [showPlayer, videoId, onEnded, playerRef]);

  if (!videoId) {
    return (
      <div className="text-red-500 text-sm">
        Invalid YouTube URL
      </div>
    );
  }

  return (
    <div>
      {!showPlayer ? (
        <button
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          onClick={() => setShowPlayer(true)}
        >
          Play YouTube Video
        </button>
      ) : (
        <div className="mt-2 w-full">
          <div className="relative w-full overflow-hidden rounded-md bg-black" style={{ paddingTop: '56.25%', maxWidth: '100%' }}>
            <div id={`yt-${videoId}`} className="absolute inset-0 w-full h-full"></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default YoutubePlayer;
