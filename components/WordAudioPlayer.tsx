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
  const audioUrlSetTimeRef = useRef<number | null>(null); // Timestamp cuando se estableció audioUrl
  const isInitialLoadRef = useRef(true); // Rastrear si estamos en la carga inicial
 
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
    audioUrlSetTimeRef.current = null; // Resetear el timestamp
    isInitialLoadRef.current = true; // Resetear el flag de carga inicial
    
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
          audioUrlSetTimeRef.current = Date.now(); // Registrar cuando se estableció el audioUrl
          isInitialLoadRef.current = true; // Marcar como carga inicial
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
      
      // Verificar si hay un error real después de un tiempo razonable
      // Esto nos permite detectar errores reales sin ser afectados por falsos positivos de Safari
      cleanupRefs.errorCheckTimeout = setTimeout(() => {
        if (audioElement.error) {
          const errorCode = audioElement.error.code;
          // Solo establecer error para errores reales después de 5 segundos
          if (errorCode === 4 || errorCode === 2) {
            console.error('Real audio error detected after timeout:', errorCode);
            setError('Failed to play audio');
            setIsPlaying(false);
          }
        }
        // Después de 5 segundos, ya no es carga inicial
        isInitialLoadRef.current = false;
      }, 5000);
      
      // Función para intentar reproducir
      const playAudio = async () => {
        try {
          // Verificar que el audio esté listo antes de reproducir
          // readyState >= 2 significa HAVE_CURRENT_DATA o superior
          if (audioElement.readyState >= 2) {
            await audioElement.play();
            hasAutoPlayedRef.current = true;
          } else {
            // Si no está listo, esperar al evento canplay
            const playWhenReady = async () => {
              try {
                await audioElement.play();
                hasAutoPlayedRef.current = true;
              } catch (err) {
                // Auto-play bloqueado, no es un error real
                console.warn('Auto-play was blocked:', err);
                hasAutoPlayedRef.current = true; // Marcar como intentado para no volver a intentar
              }
              // Limpiar el timeout si el evento se disparó
              if (cleanupRefs.timeout) {
                clearTimeout(cleanupRefs.timeout);
                cleanupRefs.timeout = null;
              }
            };
            
            cleanupRefs.listener = playWhenReady;
            audioElement.addEventListener('canplay', playWhenReady, { once: true });
            
            // Fallback: si después de 3 segundos no está listo, no reproducir automáticamente
            cleanupRefs.timeout = setTimeout(() => {
              if (cleanupRefs.listener) {
                audioElement.removeEventListener('canplay', cleanupRefs.listener);
                cleanupRefs.listener = null;
              }
              hasAutoPlayedRef.current = true; // Marcar como intentado
            }, 3000);
          }
        } catch (err) {
          // Auto-play bloqueado, no es un error real
          console.warn('Auto-play was blocked:', err);
          hasAutoPlayedRef.current = true; // Marcar como intentado
        }
      };
      
      // Pequeño delay para asegurar que el elemento audio esté en el DOM
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
    // Solo reproducir/pausar el audio ya cargado
    if (audioUrl && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        // Cuando el usuario hace click, ya no es carga inicial
        isInitialLoadRef.current = false;
        audioRef.current.play().catch((err) => {
          // Si falla al reproducir manualmente, entonces sí es un error real
          console.error('Failed to play audio on user click:', err);
          setError('Failed to play audio');
          setIsPlaying(false);
        });
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
    audioUrlSetTimeRef.current = null; // Resetear el timestamp
    isInitialLoadRef.current = true; // Resetear el flag de carga inicial
    
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
        audioUrlSetTimeRef.current = Date.now(); // Registrar cuando se estableció el audioUrl
        isInitialLoadRef.current = true; // Marcar como carga inicial
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
            // SOLUCIÓN DEFINITIVA: Completamente ignorar onError durante la carga inicial
            // Safari dispara onError falsos inmediatamente cuando se establece el src
            // NO establecer error en absoluto si estamos en carga inicial
            if (isInitialLoadRef.current) {
              console.warn('Ignoring audio error during initial load (Safari quirk):', {
                errorCode: e.currentTarget.error?.code,
                readyState: e.currentTarget.readyState
              });
              return; // NO hacer nada, NO establecer error
            }
            
            // Solo procesar errores después de que el usuario haya interactuado
            // (isInitialLoadRef.current === false significa que el usuario ya hizo click)
            const audioElement = e.currentTarget;
            if (audioElement.error) {
              const errorCode = audioElement.error.code;
              // Solo establecer error para errores reales (código 2 o 4)
              if (errorCode === 4 || errorCode === 2) {
                console.error('Real audio error detected after user interaction:', errorCode);
                setError('Failed to play audio');
                setIsPlaying(false);
              } else {
                // Otros códigos pueden ser falsos positivos, especialmente en Safari
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
