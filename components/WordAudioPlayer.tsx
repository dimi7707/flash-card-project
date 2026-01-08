'use client';

import { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface WordAudioPlayerProps {
  cardId: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'w-6 h-6 p-1',
  md: 'w-8 h-8 p-1.5',
  lg: 'w-10 h-10 p-2',
};

const iconSizes = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

export default function WordAudioPlayer({
  cardId,
  size = 'md',
  className = '',
}: WordAudioPlayerProps) {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const hasAutoPlayedRef = useRef(false); // Track if audio has already auto-played
  const audioUrlSetTimeRef = useRef<number | null>(null); // Timestamp when audioUrl was set
  const isInitialLoadRef = useRef(true); // Track if we're in initial load
 
  console.log('cardId desde el word audio player', cardId);

  console.log('audioUrl', audioUrl);

  // Load audio automatically when cardId changes
  useEffect(() => {
    // Reset all states when card changes
    setAudioUrl(null);
    setIsPlaying(false);
    setError(null);
    setIsLoading(true);
    hasAutoPlayedRef.current = false; // Reset auto-play flag
    audioUrlSetTimeRef.current = null; // Reset timestamp
    isInitialLoadRef.current = true; // Reset initial load flag

    // Cleanup previous audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }

    // AbortController to cancel requests if cardId changes quickly
    const abortController = new AbortController();

    // Fetch audio automatically
    const fetchAudio = async () => {
      try {
        const response = await fetch(`/api/cards/${cardId}/audio`, {
          signal: abortController.signal,
        });

        if (!response.ok) {
          throw new Error('Failed to load audio');
        }

        const data = await response.json();

        // Only update if request wasn't cancelled
        if (!abortController.signal.aborted) {
          setAudioUrl(data.audioUrl);
          setIsLoading(false);
          audioUrlSetTimeRef.current = Date.now(); // Record when audioUrl was set
          isInitialLoadRef.current = true; // Mark as initial load
        }
      } catch (err) {
        // Ignore abort errors
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }

        // Only update error if request wasn't cancelled
        if (!abortController.signal.aborted) {
          const errorMessage =
            err instanceof Error ? err.message : 'Audio unavailable';
          setError(errorMessage);
          setIsLoading(false);
        }
      }
    };

    fetchAudio();

    // Cleanup: cancel pending request if cardId changes or component unmounts
    return () => {
      abortController.abort();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, [cardId]);

  // Auto-play when audio loads
  useEffect(() => {
    if (audioUrl && audioRef.current && !hasAutoPlayedRef.current) {
      const audioElement = audioRef.current;
      const cleanupRefs: {
        timeout: NodeJS.Timeout | null;
        listener: (() => void) | null;
        errorCheckTimeout: NodeJS.Timeout | null;
      } = {
        timeout: null,
        listener: null,
        errorCheckTimeout: null,
      };

      // Check for real errors after a reasonable time
      // This allows us to detect real errors without being affected by Safari false positives
      cleanupRefs.errorCheckTimeout = setTimeout(() => {
        if (audioElement.error) {
          const errorCode = audioElement.error.code;
          // Only set error for real errors after 5 seconds
          if (errorCode === 4 || errorCode === 2) {
            console.error('Real audio error detected after timeout:', errorCode);
            setError('Failed to play audio');
            setIsPlaying(false);
          }
        }
        // After 5 seconds, no longer initial load
        isInitialLoadRef.current = false;
      }, 5000);

      // Function to attempt playback
      const playAudio = async () => {
        try {
          // Check that audio is ready before playing
          // readyState >= 2 means HAVE_CURRENT_DATA or higher
          if (audioElement.readyState >= 2) {
            await audioElement.play();
            hasAutoPlayedRef.current = true;
          } else {
            // If not ready, wait for canplay event
            const playWhenReady = async () => {
              try {
                await audioElement.play();
                hasAutoPlayedRef.current = true;
              } catch (err) {
                // Auto-play blocked, not a real error
                console.warn('Auto-play was blocked:', err);
                hasAutoPlayedRef.current = true; // Mark as attempted to avoid retrying
              }
              // Clear timeout if event fired
              if (cleanupRefs.timeout) {
                clearTimeout(cleanupRefs.timeout);
                cleanupRefs.timeout = null;
              }
            };

            cleanupRefs.listener = playWhenReady;
            audioElement.addEventListener('canplay', playWhenReady, { once: true });

            // Fallback: if after 3 seconds not ready, don't auto-play
            cleanupRefs.timeout = setTimeout(() => {
              if (cleanupRefs.listener) {
                audioElement.removeEventListener('canplay', cleanupRefs.listener);
                cleanupRefs.listener = null;
              }
              hasAutoPlayedRef.current = true; // Mark as attempted
            }, 3000);
          }
        } catch (err) {
          // Auto-play blocked, not a real error
          console.warn('Auto-play was blocked:', err);
          hasAutoPlayedRef.current = true; // Mark as attempted
        }
      };

      // Small delay to ensure audio element is in the DOM
      const initialTimeout = setTimeout(() => {
        playAudio();
      }, 100);

      // Cleanup function
      return () => {
        clearTimeout(initialTimeout);
        if (cleanupRefs.timeout) {
          clearTimeout(cleanupRefs.timeout);
        }
        if (cleanupRefs.errorCheckTimeout) {
          clearTimeout(cleanupRefs.errorCheckTimeout);
        }
        if (cleanupRefs.listener && audioElement) {
          audioElement.removeEventListener('canplay', cleanupRefs.listener);
        }
      };
    }
  }, [audioUrl]);

  const handlePlayClick = () => {
    // Only play/pause the already loaded audio
    if (audioUrl && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        // When user clicks, it's no longer initial load
        isInitialLoadRef.current = false;
        audioRef.current.play().catch((err) => {
          // If manual playback fails, then it's a real error
          console.error('Failed to play audio on user click:', err);
          setError('Failed to play audio');
          setIsPlaying(false);
        });
        setIsPlaying(true);
      }
    }
  };

  const handleRetry = () => {
    // Reset and reload
    setError(null);
    setAudioUrl(null);
    setIsLoading(true);
    hasAutoPlayedRef.current = false; // Reset flag to allow auto-play after retry
    audioUrlSetTimeRef.current = null; // Reset timestamp
    isInitialLoadRef.current = true; // Reset initial load flag
    
    fetch(`/api/cards/${cardId}/audio`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to load audio');
        }
        return response.json();
      })
      .then((data) => {
        setAudioUrl(data.audioUrl);
        setIsLoading(false);
        audioUrlSetTimeRef.current = Date.now(); // Record when audioUrl was set
        isInitialLoadRef.current = true; // Mark as initial load
      })
      .catch((err) => {
        const errorMessage =
          err instanceof Error ? err.message : 'Audio unavailable';
        setError(errorMessage);
        setIsLoading(false);
      });
  };

  // Error state
  if (error) {
    return (
      <button
        onClick={handleRetry}
        className={`${sizeClasses[size]} rounded-full hover:bg-red-50 transition-colors ${className}`}
        title={error}
        aria-label={`Retry audio (Error: ${error})`}
      >
        <VolumeX className={`${iconSizes[size]} text-red-500`} />
      </button>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div
        className={`${sizeClasses[size]} rounded-full flex items-center justify-center ${className}`}
        aria-label="Loading audio"
      >
        <svg
          className={`animate-spin ${iconSizes[size]} text-primary-600`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
    );
  }

  // Default state (play button)
  return (
    <>
      <button
        onClick={handlePlayClick}
        disabled={isLoading || !audioUrl}
        className={`${sizeClasses[size]} rounded-full hover:bg-primary-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        aria-label="Play pronunciation"
        title={isLoading ? 'Loading audio...' : audioUrl ? 'Play pronunciation' : 'Audio not ready'}
      >
        <Volume2 className={`${iconSizes[size]} text-primary-600`} />
      </button>

      {/* Hidden audio element */}
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onEnded={() => setIsPlaying(false)}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onError={(e) => {
            // DEFINITIVE SOLUTION: Completely ignore onError during initial load
            // Safari fires false onError immediately when src is set
            // DO NOT set error at all if we're in initial load
            if (isInitialLoadRef.current) {
              console.warn('Ignoring audio error during initial load (Safari quirk):', {
                errorCode: e.currentTarget.error?.code,
                readyState: e.currentTarget.readyState
              });
              return; // DO nothing, DO NOT set error
            }

            // Only process errors after user has interacted
            // (isInitialLoadRef.current === false means user has already clicked)
            const audioElement = e.currentTarget;
            if (audioElement.error) {
              const errorCode = audioElement.error.code;
              // Only set error for real errors (code 2 or 4)
              if (errorCode === 4 || errorCode === 2) {
                console.error('Real audio error detected after user interaction:', errorCode);
                setError('Failed to play audio');
                setIsPlaying(false);
              } else {
                // Other codes may be false positives, especially in Safari
                console.warn('Audio error code', errorCode, 'ignored (may be false positive)');
              }
            }
          }}
          preload="auto"
        />
      )}
    </>
  );
}
