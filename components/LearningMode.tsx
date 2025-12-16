'use client';

import { useState, useEffect, useRef } from 'react';
import { Card as CardType, ValidationResult } from '@/types';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { validateMultipleTranslations } from '@/lib/utils';
import {
  flipCard,
  successAnimation,
  partialSuccessAnimation,
  errorAnimation,
  fadeIn,
} from '@/lib/animations';
import { ChevronLeft, ChevronRight, Check, X, CheckCircle, XCircle } from 'lucide-react';

export default function LearningMode() {
  const [cards, setCards] = useState<CardType[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const cardRef = useRef<HTMLDivElement>(null);
  const feedbackRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const handleNextRef = useRef<() => void>();

  useEffect(() => {
    fetchCards();
  }, []);

  // Auto-focus en el input cuando se carga una nueva card o se resetea el estado
  useEffect(() => {
    if (!showFeedback && inputRef.current && !isLoading && cards.length > 0) {
      // Pequeño delay para asegurar que el DOM esté listo después de las animaciones
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, showFeedback, isLoading, cards.length]);

  // Auto-avance después de respuesta completamente correcta
  useEffect(() => {
    if (
      validationResult?.status === 'all' &&
      showFeedback &&
      currentIndex < cards.length - 1
    ) {
      const timer = setTimeout(() => {
        handleNextRef.current?.();
      }, 2000); // 2 segundos

      return () => clearTimeout(timer);
    }
  }, [validationResult?.status, showFeedback, currentIndex, cards.length]);

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

  const handleCheck = () => {
    if (!userAnswer.trim()) {
      return;
    }

    const currentCard = cards[currentIndex];
    const result = validateMultipleTranslations(
      userAnswer,
      currentCard.spanish_translations
    );

    setValidationResult(result);
    setShowFeedback(true);

    // Animate card based on result
    if (cardRef.current) {
      if (result.status === 'all') {
        successAnimation(cardRef.current);
      } else if (result.status === 'partial') {
        partialSuccessAnimation(cardRef.current);
      } else {
        errorAnimation(cardRef.current);
      }
    }
  };

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      // Flip card animation before moving to next
      if (cardRef.current) {
        flipCard(cardRef.current, () => {
          setCurrentIndex((prev) => prev + 1);
          setUserAnswer('');
          setShowFeedback(false);
          setValidationResult(null);
        });
      }
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      // Flip card animation before moving to previous
      if (cardRef.current) {
        flipCard(cardRef.current, () => {
          setCurrentIndex((prev) => prev - 1);
          setUserAnswer('');
          setShowFeedback(false);
          setValidationResult(null);
        });
      }
    }
  };

  // Mantener referencia actualizada para el auto-avance
  useEffect(() => {
    handleNextRef.current = handleNext;
  });

  const handleSkip = () => {
    handleNext();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading cards...</p>
        </div>
      </div>
    );
  }

  if (error || cards.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card variant="elevated" className="max-w-md text-center">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            No Cards Available
          </h3>
          <p className="text-gray-600 mb-6">
            {error || 'Create some flashcards to start learning!'}
          </p>
          <Button
            onClick={() => (window.location.href = '/add-card')}
            variant="primary"
          >
            Create Your First Card
          </Button>
        </Card>
      </div>
    );
  }

  const currentCard = cards[currentIndex];
  const isCompleted = currentIndex === cards.length - 1 && showFeedback;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Indicator */}
      {!isCompleted && (
        <div className="mb-4 md:mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Card {currentIndex + 1} of {cards.length}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(((currentIndex + 1) / cards.length) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${((currentIndex + 1) / cards.length) * 100}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Main Card */}
      {!isCompleted && (
        <Card
          ref={cardRef}
          variant="elevated"
          className="mb-6 perspective-1000"
        >
          <div className="text-center mb-8">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3 md:mb-4">
              {currentCard.english_word}
            </h2>
          </div>

          <div className="space-y-4">
            <Input
              ref={inputRef}
              label="Type the Spanish translation(s):"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !showFeedback) {
                  handleCheck();
                }
              }}
              placeholder="Enter answer (separate multiple with commas: esparcir, rociar)"
              disabled={showFeedback}
              className="text-lg"
              helperText="💡 Tip: You can enter multiple translations separated by commas"
            />

            {!showFeedback ? (
              <div className="flex gap-3">
                <Button
                  onClick={handleCheck}
                  disabled={!userAnswer.trim()}
                  className="flex-1"
                >
                  <Check className="w-5 h-5 mr-2" />
                  Check Answer
                </Button>
                <Button
                  onClick={handleSkip}
                  variant="secondary"
                  disabled={currentIndex === cards.length - 1}
                >
                  Skip
                </Button>
              </div>
            ) : validationResult && (
              <div
                ref={feedbackRef}
                className={`p-6 rounded-lg ${
                  validationResult.status === 'all'
                    ? 'bg-green-50 border-2 border-green-500'
                    : validationResult.status === 'partial'
                    ? 'bg-warning-50 border-2 border-warning-500'
                    : 'bg-red-50 border-2 border-red-500'
                }`}
              >
                {/* Header with status */}
                <div className="flex items-center justify-center mb-4">
                  {validationResult.status === 'all' ? (
                    <>
                      <Check className="w-8 h-8 text-green-600 mr-2" />
                      <span className="text-2xl font-bold text-green-800">
                        Perfect! All Correct!
                      </span>
                    </>
                  ) : validationResult.status === 'partial' ? (
                    <>
                      <Check className="w-8 h-8 text-warning-600 mr-2" />
                      <span className="text-2xl font-bold text-warning-800">
                        Good! Partially Correct ({validationResult.correctCount}/
                        {validationResult.totalProvided})
                      </span>
                    </>
                  ) : (
                    <>
                      <X className="w-8 h-8 text-red-600 mr-2" />
                      <span className="text-2xl font-bold text-red-800">
                        Incorrect
                      </span>
                    </>
                  )}
                </div>

                {/* User's answers breakdown */}
                {validationResult.userAnswers.length > 0 && (
                  <div className="mb-4 p-4 bg-white rounded-lg">
                    <p className="font-semibold text-gray-700 mb-2">Your answers:</p>
                    <div className="space-y-1">
                      {validationResult.userAnswers.map((answer, idx) => {
                        const isCorrect = validationResult.correctAnswers.includes(answer);
                        return (
                          <div key={idx} className="flex items-center gap-2">
                            {isCorrect ? (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            ) : (
                              <XCircle className="w-5 h-5 text-red-600" />
                            )}
                            <span className={isCorrect ? 'text-green-700' : 'text-red-700'}>
                              {answer}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Show missed translations */}
                {validationResult.missedAnswers.length > 0 && (
                  <div className="mb-4 p-4 bg-white rounded-lg">
                    <p className="font-semibold text-gray-700 mb-2">
                      Other valid translations you can learn:
                    </p>
                    <div className="space-y-1">
                      {validationResult.missedAnswers.map((answer, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span className="text-lg">•</span>
                          <span className="text-gray-900">{answer}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Note section */}
                {currentCard.note && (
                  <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm font-semibold text-blue-900 mb-1">
                      📝 Note:
                    </p>
                    <p className="text-blue-800 italic">
                      {currentCard.note}
                    </p>
                  </div>
                )}

                {/* Next button */}
                <Button
                  onClick={handleNext}
                  variant={
                    validationResult.status === 'all'
                      ? 'success'
                      : validationResult.status === 'partial'
                      ? 'secondary'
                      : 'danger'
                  }
                  disabled={currentIndex === cards.length - 1}
                  className="w-full"
                >
                  {currentIndex === cards.length - 1
                    ? 'Completed!'
                    : 'Next Card'}
                </Button>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Navigation Buttons */}
      {!isCompleted && (
        <div className="flex justify-between items-center">
          <Button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            variant="ghost"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Previous
          </Button>

          <Button
            onClick={handleNext}
            disabled={currentIndex === cards.length - 1}
            variant="ghost"
          >
            Next
            <ChevronRight className="w-5 h-5 ml-1" />
          </Button>
        </div>
      )}

      {/* Completion Message */}
      {isCompleted && (
        <Card variant="elevated" className="mt-8 text-center bg-gradient-to-r from-primary-50 to-purple-50">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-3xl font-bold text-gray-900 mb-2">
            Great Job!
          </h3>
          <p className="text-gray-600 mb-6">
            You've reviewed all {cards.length} cards. Keep practicing to
            improve your vocabulary!
          </p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => window.location.reload()}>
              Practice Again
            </Button>
            <Button
              onClick={() => (window.location.href = '/test')}
              variant="secondary"
            >
              Take a Test
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
