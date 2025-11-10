'use client';

import { useState, useEffect, useRef } from 'react';
import { Card as CardType, TestResult } from '@/types';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import ProgressBar from '@/components/ui/ProgressBar';
import ResultsScreen from '@/components/ResultsScreen';
import { compareStrings } from '@/lib/utils';
import { flipCard, fadeIn } from '@/lib/animations';
import { PlayCircle } from 'lucide-react';

export default function TestMode() {
  const [hasStarted, setHasStarted] = useState(false);
  const [cards, setCards] = useState<CardType[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [results, setResults] = useState<TestResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (hasStarted && inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentIndex, hasStarted]);

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

  const handleSubmitAnswer = () => {
    if (!userAnswer.trim()) {
      return;
    }

    const currentCard = cards[currentIndex];
    const correct = compareStrings(
      userAnswer,
      currentCard.spanish_translation
    );

    const result: TestResult = {
      cardId: currentCard.id,
      english_word: currentCard.english_word,
      spanish_translation: currentCard.spanish_translation,
      userAnswer: userAnswer.trim(),
      isCorrect: correct,
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

  const handleRetake = () => {
    fetchRandomCards();
  };

  // Show results screen if test is complete
  if (isComplete) {
    return <ResultsScreen results={results} onRetake={handleRetake} />;
  }

  // Show start screen if test hasn't started
  if (!hasStarted) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card variant="elevated" className="text-center">
          <div className="text-7xl mb-6">🏆</div>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready for a Challenge?
          </h2>

          <p className="text-lg text-gray-600 mb-8">
            Test your knowledge with a randomized quiz of 15 flashcards. You
            need to score at least 12/15 (80%) to pass.
          </p>

          <div className="bg-blue-50 rounded-lg p-6 mb-8 text-left">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">
              Test Rules:
            </h3>
            <ul className="list-disc list-inside space-y-2 text-blue-800">
              <li>You'll be shown 15 random cards</li>
              <li>Type the Spanish translation for each English word</li>
              <li>No skipping - you must answer all questions</li>
              <li>Answers are checked automatically</li>
              <li>Get 12 or more correct to pass (80%)</li>
            </ul>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg">
              {error}
            </div>
          )}

          <Button
            onClick={fetchRandomCards}
            isLoading={isLoading}
            size="lg"
            className="w-full md:w-auto"
          >
            <PlayCircle className="w-6 h-6 mr-2" />
            {isLoading ? 'Loading...' : 'Start Test'}
          </Button>
        </Card>
      </div>
    );
  }

  // Show test interface
  const currentCard = cards[currentIndex];
  const progress = ((currentIndex + 1) / cards.length) * 100;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            Question {currentIndex + 1} of {cards.length}
          </h2>
          <span className="text-lg font-semibold text-primary-600">
            {Math.round(progress)}%
          </span>
        </div>
        <ProgressBar
          progress={progress}
          showLabel={false}
          variant="primary"
        />
      </div>

      {/* Question Card */}
      <Card ref={cardRef} variant="elevated" className="mb-6">
        <div className="text-center mb-8">
          <div className="inline-block bg-primary-100 text-primary-800 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            Translate to Spanish
          </div>

          <h3 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            {currentCard.english_word}
          </h3>
        </div>

        <div className="space-y-4">
          <Input
            ref={inputRef}
            label="Your Answer:"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSubmitAnswer();
              }
            }}
            placeholder="Type the Spanish translation"
            className="text-lg"
          />

          <Button
            onClick={handleSubmitAnswer}
            disabled={!userAnswer.trim()}
            className="w-full"
            size="lg"
          >
            {currentIndex === cards.length - 1
              ? 'Submit & Finish Test'
              : 'Submit & Continue'}
          </Button>
        </div>
      </Card>

      {/* Info Card */}
      <Card variant="outlined" className="bg-gray-50">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>
            Answered: {results.length} / {cards.length}
          </span>
          <span>
            Correct so far:{' '}
            {results.filter((r) => r.isCorrect).length}
          </span>
        </div>
      </Card>
    </div>
  );
}
