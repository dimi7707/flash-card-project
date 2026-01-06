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
  const hasAutoPlayedRef = useRef(false); // Rastrear si ya se reprodujo automáticamente
 
  console.log('cardId desde el word audio player', cardId);

  console.log('audioUrl', audioUrl);
  
  // Cargar audio automáticamente cuando cambia cardId
  useEffect(() => {
    // Resetear todos los estados cuando cambia la tarjeta
    setAudioUrl(null);
    setIsPlaying(false);
    setError(null);
    setIsLoading(true);
    hasAutoPlayedRef.current = false; // Resetear el flag de auto-play
    
    // Cleanup del audio anterior
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }

    // AbortController para cancelar requests si cardId cambia rápido
    const abortController = new AbortController();

    // Fetch del audio automáticamente
    const fetchAudio = async () => {
      try {
        const response = await fetch(`/api/cards/${cardId}/audio`, {
          signal: abortController.signal,
        });

        if (!response.ok) {
          throw new Error('Failed to load audio');
        }

        const data = await response.json();
        
        // Solo actualizar si el request no fue cancelado
        if (!abortController.signal.aborted) {
          setAudioUrl(data.audioUrl);
          setIsLoading(false);
        }
      } catch (err) {
        // Ignorar errores de abort
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }
        
        // Solo actualizar error si el request no fue cancelado
        if (!abortController.signal.aborted) {
          const errorMessage =
            err instanceof Error ? err.message : 'Audio unavailable';
          setError(errorMessage);
          setIsLoading(false);
        }
      }
    };

    fetchAudio();

    // Cleanup: cancelar request pendiente si cardId cambia o componente se desmonta
    return () => {
      abortController.abort();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, [cardId]);

  // Reproducir automáticamente cuando el audio se carga
  useEffect(() => {
    if (audioUrl && audioRef.current && !hasAutoPlayedRef.current) {
      // Reproducir automáticamente solo la primera vez que se carga
      const playAudio = async () => {
        try {
          await audioRef.current?.play();
          hasAutoPlayedRef.current = true; // Marcar como reproducido
        } catch (err) {
          // Algunos navegadores pueden bloquear auto-play
          // En ese caso, simplemente no reproducimos automáticamente
          console.warn('Auto-play was blocked:', err);
        }
      };
      
      // Pequeño delay para asegurar que el elemento audio esté listo
      const timeoutId = setTimeout(() => {
        playAudio();
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [audioUrl]);

  const handlePlayClick = () => {
    // Solo reproducir/pausar el audio ya cargado
    if (audioUrl && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleRetry = () => {
    // Resetear y volver a cargar
    setError(null);
    setAudioUrl(null);
    setIsLoading(true);
    hasAutoPlayedRef.current = false; // Resetear el flag para permitir auto-play después del retry
    
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
          onError={() => {
            setError('Failed to play audio');
            setIsPlaying(false);
          }}
          preload="none"
        />
      )}
    </>
  );
}
