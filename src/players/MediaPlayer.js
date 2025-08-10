import React, { useState, useRef, useMemo, useCallback } from 'react';
import YoutubePlayer from './YoutubePlayer';
import SpotifyPlayer from './SpotifyPlayer';
import { useQueue } from '../hooks/useQueue';
import { useTheme } from '../hooks/useTheme';


function MediaPlayer({ videoUrl, onClose }) {
  // Collapsible right sidebar
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const modalRef = useRef(null);
  const playerRef = useRef(null);
  const { queue, currentItem, currentIndex, remove, clear, playNow, next, previous } = useQueue();
  const { getColor } = useTheme();

  // Helpers to detect platform
  const isYouTubeUrl = (url) => !!url && (url.includes('youtube.com') || url.includes('youtu.be'));
  const isSpotifyUrl = (url) => !!url && /open\.spotify\.com/.test(url);
  
  // Memoize activeUrl to prevent unnecessary re-renders when queue changes but current item doesn't
  const activeUrl = useMemo(() => currentItem?.url || videoUrl, [currentItem?.url, videoUrl]);
  const platform = useMemo(() => isYouTubeUrl(activeUrl) ? 'youtube' : isSpotifyUrl(activeUrl) ? 'spotify' : 'unknown', [activeUrl]);

  // Extract title placeholder by platform
  const getVideoTitle = (url) => {
    if (isYouTubeUrl(url)) return 'YouTube';
    if (isSpotifyUrl(url)) return 'Spotify';
    return 'Media';
  };

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleClose = () => {
    onClose();
  };

  // Stabilize the onEnded callback to prevent unnecessary YouTube player re-renders
  const handleYoutubeEnded = useCallback(() => {
    next();
  }, [next]);

  // Handle play/pause controls
  const handlePlayPause = () => {
    if (playerRef.current && playerRef.current.contentWindow) {
      const command = isPlaying ? 'pauseVideo' : 'playVideo';
      playerRef.current.contentWindow.postMessage(
        `{"event":"command","func":"${command}","args":""}`,
        '*'
      );
      setIsPlaying(!isPlaying);
    }
  };

  // Sidebar is fixed to the right; no dragging

  if (!videoUrl && !currentItem) return null;

  return (
    <div
      ref={modalRef}
      className={`fixed top-0 right-0 z-50 h-screen border-l overflow-hidden transition-all duration-300 flex flex-col ${
        isCollapsed ? 'w-12' : 'w-[380px]'
      }`}
      style={{
        backgroundColor: getColor('background.card'),
        borderColor: getColor('border.primary'),
        boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
      }}
    >
      {/* Header */}
      <div 
        className="relative flex items-center p-3 shrink-0 border-b"
        style={{
          backgroundColor: getColor('background.secondary'),
          borderColor: getColor('border.primary'),
        }}
      >
        {/* Left status (icon + title) */}
        <div className="flex items-center gap-2 min-w-0">
          {!isCollapsed && (
            <>
              {platform === 'youtube' ? (
                <svg className="w-4 h-4 text-red-600 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              ) : platform === 'spotify' ? (
                <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.371 0 0 5.371 0 12c0 6.627 5.371 12 12 12s12-5.373 12-12c0-6.629-5.371-12-12-12zm5.438 17.438c-.221.363-.691.477-1.055.256-2.891-1.77-6.543-2.168-10.826-1.18-.414.094-.832-.16-.926-.574-.094-.414.16-.832.574-.926 4.637-1.062 8.668-.617 11.857 1.258.363.221.477.691.256 1.066zm1.504-3.012c-.277.447-.857.588-1.305.311-3.309-2.051-8.365-2.646-12.285-1.438-.51.154-1.049-.127-1.203-.637-.154-.51.127-1.049.637-1.203 4.377-1.324 9.883-.676 13.627 1.617.447.277.588.857.311 1.35zm.143-3.143c-3.979-2.365-10.563-2.582-14.262-1.406-.607.188-1.254-.145-1.441-.752-.188-.607.145-1.254.752-1.441 4.125-1.277 11.334-1.027 15.824 1.582.561.334.74 1.062.406 1.623-.334.561-1.062.74-1.623.394z"/>
                </svg>
              ) : (
                <svg className="w-4 h-4 text-secondary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
              )}
            </>
          )}
        </div>

        {/* Center controls (previous/play-pause/next) */}
        {!isCollapsed && (
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
            {/* Previous button */}
            <button
              onClick={previous}
              disabled={currentIndex <= 0}
              className={`p-1 rounded transition-colors ${
                currentIndex <= 0 
                  ? 'text-disabled cursor-not-allowed' 
                  : 'text-primary hover:bg-secondary'
              }`}
              title={currentIndex <= 0 ? 'No previous song' : 'Previous'}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
              </svg>
            </button>

            {/* Play/Pause button */}
            <button
              onClick={handlePlayPause}
              disabled={platform !== 'youtube'}
              className={`p-1 rounded transition-colors ${
                platform !== 'youtube'
                  ? 'text-disabled cursor-not-allowed'
                  : 'text-primary hover:bg-secondary'
              }`}
              title={
                platform !== 'youtube' 
                  ? 'Not available for this platform' 
                  : isPlaying ? 'Pause' : 'Play'
              }
            >
              {isPlaying ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              )}
            </button>

            {/* Next button */}
            <button
              onClick={next}
              disabled={currentIndex >= queue.length - 1}
              className={`p-1 rounded transition-colors ${
                currentIndex >= queue.length - 1
                  ? 'text-disabled cursor-not-allowed'
                  : 'text-primary hover:bg-secondary'
              }`}
              title={currentIndex >= queue.length - 1 ? 'No next song' : 'Next'}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
              </svg>
            </button>
          </div>
        )}

        {/* Right-side controls: collapse/expand + close */}
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={handleToggleCollapse}
            className="p-1 hover:bg-secondary rounded transition-colors"
            title={isCollapsed ? 'Expand' : 'Collapse'}
          >
            {isCollapsed ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 12h16M12 20l-8-8 8-8" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4m-8 0" />
              </svg>
            )}
          </button>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-red-100 hover:text-red-600 rounded transition-colors"
            title="Close"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Collapsed controls - platform icon + playback controls + song title */}
      {isCollapsed && (
        <div className="flex flex-col items-center py-2 h-full overflow-hidden">
          {/* Platform icon */}
          <div className="flex items-center justify-center shrink-0 mb-3">
            {platform === 'youtube' ? (
              <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            ) : platform === 'spotify' ? (
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.371 0 0 5.371 0 12c0 6.627 5.371 12 12 12s12-5.373 12-12c0-6.629-5.371-12-12-12zm5.438 17.438c-.221.363-.691.477-1.055.256-2.891-1.77-6.543-2.168-10.826-1.18-.414.094-.832-.16-.926-.574-.094-.414.16-.832.574-.926 4.637-1.062 8.668-.617 11.857 1.258.363.221.477.691.256 1.066zm1.504-3.012c-.277.447-.857.588-1.305.311-3.309-2.051-8.365-2.646-12.285-1.438-.51.154-1.049-.127-1.203-.637-.154-.51.127-1.049.637-1.203 4.377-1.324 9.883-.676 13.627 1.617.447.277.588.857.311 1.35zm.143-3.143c-3.979-2.365-10.563-2.582-14.262-1.406-.607.188-1.254-.145-1.441-.752-.188-.607.145-1.254.752-1.441 4.125-1.277 11.334-1.027 15.824 1.582.561.334.74 1.062.406 1.623-.334.561-1.062.74-1.623.394z"/>
              </svg>
            ) : null}
          </div>
          
          {/* Playback controls */}
          <div className="flex flex-col items-center gap-2 shrink-0">
            {/* Previous button */}
            <button
              onClick={previous}
              disabled={currentIndex <= 0}
              className={`p-1 rounded transition-colors ${
                currentIndex <= 0 
                  ? 'text-disabled cursor-not-allowed' 
                  : 'text-primary hover:bg-secondary'
              }`}
              title={currentIndex <= 0 ? 'No previous song' : 'Previous'}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
              </svg>
            </button>
            
            {/* Play/Pause button - always show but disable for non-YouTube */}
            <button
              onClick={handlePlayPause}
              disabled={platform !== 'youtube'}
              className={`p-1 rounded transition-colors ${
                platform !== 'youtube'
                  ? 'text-disabled cursor-not-allowed'
                  : 'text-primary hover:bg-secondary'
              }`}
              title={
                platform !== 'youtube' 
                  ? 'Not available for this platform' 
                  : isPlaying ? 'Pause' : 'Play'
              }
            >
              {isPlaying ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              )}
            </button>
            
            {/* Next button */}
            <button
              onClick={next}
              disabled={currentIndex >= queue.length - 1}
              className={`p-1 rounded transition-colors ${
                currentIndex >= queue.length - 1
                  ? 'text-disabled cursor-not-allowed'
                  : 'text-primary hover:bg-secondary'
              }`}
              title={currentIndex >= queue.length - 1 ? 'No next song' : 'Next'}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
              </svg>
            </button>
          </div>

          {/* Vertical song title at bottom */}
          {currentItem?.title && (
            <div className="flex-1 flex items-center justify-center overflow-hidden min-h-0 pb-4">
              <div 
                className="text-xs font-medium whitespace-nowrap transform -rotate-90 origin-center"
                style={{ 
                  transformOrigin: 'center center',
                  maxWidth: '200px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  marginBottom: '20px',
                  color: getColor('text.primary'),
                }}
                title={currentItem.title}
              >
                {currentItem.title}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className={`p-3 ${isCollapsed ? 'hidden' : ''} shrink-0`}> 
        {platform === 'youtube' && (
          <div className="max-h-48 overflow-hidden">
            <YoutubePlayer url={activeUrl} autoStart={true} playerRef={playerRef} onEnded={handleYoutubeEnded} />
          </div>
        )}
        {platform === 'spotify' && (
          <SpotifyPlayer url={activeUrl} autoStart={true} />
        )}
        {platform === 'unknown' && (
          <div className="text-sm text-red-600">Unsupported link format</div>
        )}
      </div>

      {/* Queue section */}
      {!isCollapsed && (
        <div className="border-t border-gray-200 flex-1 overflow-y-auto">
          <div className="flex items-center justify-between px-3 py-2">
            <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Queue</h3>
            <div className="flex items-center gap-2">
              <button 
                onClick={previous} 
                disabled={currentIndex <= 0}
                className={`text-xs px-2 py-1 rounded transition-colors ${
                  currentIndex <= 0
                    ? 'bg-disabled text-disabled cursor-not-allowed'
                    : 'bg-secondary hover:bg-secondary text-primary'
                }`}
                title={currentIndex <= 0 ? 'No previous song' : 'Previous song'}
              >
                Prev
              </button>
              <button 
                onClick={next} 
                disabled={currentIndex >= queue.length - 1}
                className={`text-xs px-2 py-1 rounded transition-colors ${
                  currentIndex >= queue.length - 1
                    ? 'bg-disabled text-disabled cursor-not-allowed'
                    : 'bg-secondary hover:bg-secondary text-primary'
                }`}
                title={currentIndex >= queue.length - 1 ? 'No next song' : 'Next song'}
              >
                Next
              </button>
              <button 
                onClick={clear} 
                disabled={queue.length === 0}
                className={`text-xs transition-colors ${
                  queue.length === 0
                    ? 'text-disabled cursor-not-allowed'
                    : 'text-secondary hover:text-primary'
                }`}
                title={queue.length === 0 ? 'Queue is empty' : 'Clear queue'}
              >
                Clear
              </button>
            </div>
          </div>
          <div className="pb-3">
            {queue.length === 0 && (
              <div className="px-3 py-2 text-sm text-secondary">The queue is currently empty.</div>
            )}
            {queue.map((item, idx) => {
              const isActive = idx === currentIndex;
              const isYt = isYouTubeUrl(item.url);
              const isSp = isSpotifyUrl(item.url);
              return (
                <div
                  key={item.url}
                  className={`flex items-center justify-between px-3 py-2 text-sm ${
                    isActive ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-disabled'
                  }`}
                  onClick={() => playNow(item)}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {isYt ? (
                      <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                    ) : isSp ? (
                      <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.371 0 0 5.371 0 12c0 6.627 5.371 12 12 12s12-5.373 12-12c0-6.629-5.371-12-12-12zm5.438 17.438c-.221.363-.691.477-1.055.256-2.891-1.77-6.543-2.168-10.826-1.18-.414.094-.832-.16-.926-.574-.094-.414.16-.832.574-.926 4.637-1.062 8.668-.617 11.857 1.258.363.221.477.691.256 1.066zm1.504-3.012c-.277.447-.857.588-1.305.311-3.309-2.051-8.365-2.646-12.285-1.438-.51.154-1.049-.127-1.203-.637-.154-.51.127-1.049.637-1.203 4.377-1.324 9.883-.676 13.627 1.617.447.277.588.857.311 1.35zm.143-3.143c-3.979-2.365-10.563-2.582-14.262-1.406-.607.188-1.254-.145-1.441-.752-.188-.607.145-1.254.752-1.441 4.125-1.277 11.334-1.027 15.824 1.582.561.334.74 1.062.406 1.623-.334.561-1.062.74-1.623.394z"/></svg>
                    ) : (
                      <svg className="w-4 h-4 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                    )}
                    <span className="truncate">{item.title || item.url}</span>
                  </div>
                  <button
                    className="text-gray-400 hover:text-primary ml-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      remove(item.url);
                    }}
                    title="Remove from queue"
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}


    </div>
  );
}

export default MediaPlayer;
