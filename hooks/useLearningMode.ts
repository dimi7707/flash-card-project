import { useState, useEffect, useRef } from 'react';
import { Card as CardType, ValidationResult } from '@/types';
import { validateMultipleTranslations } from '@/lib/utils';
import {
  flipCard,
  successAnimation,
  partialSuccessAnimation,
  errorAnimation,
} from '@/lib/animations';

const AUTO_ADVANCE_DELAY = 2500; // 2.5 seconds
const INPUT_FOCUS_DELAY = 100; // Small delay for DOM readiness

export function useLearningMode() {
  // State
  const [cards, setCards] = useState<CardType[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Refs
  const cardRef = useRef<HTMLDivElement>(null);
  const feedbackRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const handleNextRef = useRef<() => void>();

  // Derived state
  const currentCard = cards[currentIndex];
  const isCompleted = currentIndex === cards.length - 1 && showFeedback;

  // Fetch cards on mount
  useEffect(() => {
    fetchCards();
  }, []);

  // Auto-focus input when card changes or feedback is hidden
  useEffect(() => {
    if (!showFeedback && inputRef.current && !isLoading && cards.length > 0) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, INPUT_FOCUS_DELAY);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, showFeedback, isLoading, cards.length]);

  // Auto-advance after full correct answer
  useEffect(() => {
    if (
      validationResult?.status === 'all' &&
      showFeedback &&
      currentIndex < cards.length - 1
    ) {
      const timer = setTimeout(() => {
        handleNextRef.current?.();
      }, AUTO_ADVANCE_DELAY);

      return () => clearTimeout(timer);
    }
  }, [validationResult?.status, showFeedback, currentIndex, cards.length]);

  // Keep handleNext ref updated for auto-advance
  useEffect(() => {
    handleNextRef.current = handleNext;
  });

  // Fetch cards from API
  const fetchCards = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/cards');
      if (!response.ok) {
        throw new Error('Failed to fetch cards');
      }
      const data = await response.json();
      if (data.length === 0) {
        setError('No cards available. Please create some cards first.');
      } else {
        setCards(data);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load cards'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Reset card state
  const resetCardState = () => {
    setUserAnswer('');
    setShowFeedback(false);
    setValidationResult(null);
  };

  // Check user's answer
  const handleCheck = () => {
    if (!userAnswer.trim()) {
      return;
    }

    const result = validateMultipleTranslations(
      userAnswer,
      currentCard.spanish_translations
    );

    setValidationResult(result);
    setShowFeedback(true);

    // Trigger animations
    if (cardRef.current) {
      flipCard(cardRef.current);

      if (result.status === 'all') {
        successAnimation(cardRef.current);
      } else if (result.status === 'partial') {
        partialSuccessAnimation(cardRef.current);
      } else {
        errorAnimation(cardRef.current);
      }
    }
  };

  // Navigate to next card
  function handleNext() {
    if (currentIndex < cards.length - 1) {
      if (cardRef.current) {
        flipCard(cardRef.current, () => {
          setCurrentIndex((prev) => prev + 1);
          resetCardState();
        });
      }
    }
  }

  // Navigate to previous card
  const handlePrevious = () => {
    if (currentIndex > 0) {
      if (cardRef.current) {
        flipCard(cardRef.current, () => {
          setCurrentIndex((prev) => prev - 1);
          resetCardState();
        });
      }
    }
  };

  // Skip to next card
  const handleSkip = () => {
    handleNext();
  };

  return {
    // State
    cards,
    currentIndex,
    currentCard,
    userAnswer,
    showFeedback,
    validationResult,
    isLoading,
    error,
    isCompleted,

    // Refs
    cardRef,
    feedbackRef,
    inputRef,

    // Actions
    setUserAnswer,
    handleCheck,
    handleNext,
    handlePrevious,
    handleSkip,
  };
}
