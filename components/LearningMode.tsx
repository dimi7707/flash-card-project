'use client';

import { useState, useEffect, useRef } from 'react';
import { Card as CardType } from '@/types';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { compareStrings } from '@/lib/utils';
import {
  flipCard,
  successAnimation,
  errorAnimation,
  fadeIn,
} from '@/lib/animations';
import { ChevronLeft, ChevronRight, Check, X } from 'lucide-react';

export default function LearningMode() {
  const [cards, setCards] = useState<CardType[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const cardRef = useRef<HTMLDivElement>(null);
  const feedbackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchCards();
  }, []);

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
    const correct = compareStrings(
      userAnswer,
      currentCard.spanish_translation
    );

    setIsCorrect(correct);
    setShowFeedback(true);

    // Animate card based on result
    if (cardRef.current) {
      if (correct) {
        successAnimation(cardRef.current);
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
          setIsCorrect(false);
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
          setIsCorrect(false);
        });
      }
    }
  };

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

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Indicator */}
      <div className="mb-8">
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

      {/* Main Card */}
      <Card
        ref={cardRef}
        variant="elevated"
        className="mb-6 perspective-1000"
      >
        <div className="text-center mb-8">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            {currentCard.english_word}
          </h2>
          {currentCard.note && (
            <p className="text-gray-600 italic text-lg">
              Note: {currentCard.note}
            </p>
          )}
        </div>

        <div className="space-y-4">
          <Input
            label="Type the Spanish translation:"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !showFeedback) {
                handleCheck();
              }
            }}
            placeholder="Enter your answer"
            disabled={showFeedback}
            className="text-lg"
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
          ) : (
            <div
              ref={feedbackRef}
              className={`p-6 rounded-lg ${
                isCorrect
                  ? 'bg-green-50 border-2 border-green-500'
                  : 'bg-red-50 border-2 border-red-500'
              }`}
            >
              <div className="flex items-center justify-center mb-4">
                {isCorrect ? (
                  <>
                    <Check className="w-8 h-8 text-green-600 mr-2" />
                    <span className="text-2xl font-bold text-green-800">
                      Correct!
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

              {!isCorrect && (
                <div className="text-center mb-4">
                  <p className="text-gray-700 mb-1">The correct answer is:</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {currentCard.spanish_translation}
                  </p>
                </div>
              )}

              <Button
                onClick={handleNext}
                variant={isCorrect ? 'success' : 'danger'}
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

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center">
        <Button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          variant="ghost"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Previous
        </Button>

        <span className="text-sm text-gray-500">
          Use arrow keys to navigate
        </span>

        <Button
          onClick={handleNext}
          disabled={currentIndex === cards.length - 1}
          variant="ghost"
        >
          Next
          <ChevronRight className="w-5 h-5 ml-1" />
        </Button>
      </div>

      {/* Completion Message */}
      {currentIndex === cards.length - 1 && showFeedback && (
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
