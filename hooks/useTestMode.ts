import { useState, useEffect, useRef } from 'react';
import { Card as CardType, TestResult } from '@/types';
import { validateMultipleTranslations } from '@/lib/utils';
import { flipCard } from '@/lib/animations';

export function useTestMode() {
  // State
  const [hasStarted, setHasStarted] = useState(false);
  const [cards, setCards] = useState<CardType[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [results, setResults] = useState<TestResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  // Refs
  const cardRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Derived state
  const currentCard = cards[currentIndex];
  const progress = cards.length > 0 ? ((currentIndex + 1) / cards.length) * 100 : 0;

  // Auto-focus input when question changes
  useEffect(() => {
    if (hasStarted && inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentIndex, hasStarted]);

  // Fetch random cards from API
  const fetchRandomCards = async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await fetch('/api/cards/random');

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to fetch cards');
      }

      const data = await response.json();

      if (data.length === 0) {
        setError('No cards available. Please create some cards first.');
        return;
      }

      setCards(data);
      setHasStarted(true);
      setCurrentIndex(0);
      setResults([]);
      setIsComplete(false);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load cards. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Submit user's answer and validate
  const handleSubmitAnswer = () => {
    if (!userAnswer.trim()) {
      return;
    }

    const validationDetails = validateMultipleTranslations(
      userAnswer,
      currentCard.spanish_translations
    );

    const result: TestResult = {
      cardId: currentCard.id,
      english_word: currentCard.english_word,
      spanish_translations: currentCard.spanish_translations,
      userAnswer: userAnswer.trim(),
      userAnswers: validationDetails.userAnswers,
      isCorrect: validationDetails.isValid, // At least 1 correct = pass
      validationDetails,
    };

    setResults((prev) => [...prev, result]);

    // Check if this was the last card
    if (currentIndex === cards.length - 1) {
      setIsComplete(true);
    } else {
      // Move to next card with animation
      if (cardRef.current) {
        flipCard(cardRef.current, () => {
          setCurrentIndex((prev) => prev + 1);
          setUserAnswer('');
        });
      }
    }
  };

  // Restart test
  const handleRetake = () => {
    fetchRandomCards();
  };

  return {
    // State
    hasStarted,
    cards,
    currentIndex,
    currentCard,
    userAnswer,
    results,
    isLoading,
    error,
    isComplete,
    progress,

    // Refs
    cardRef,
    inputRef,

    // Actions
    setUserAnswer,
    fetchRandomCards,
    handleSubmitAnswer,
    handleRetake,
  };
}
