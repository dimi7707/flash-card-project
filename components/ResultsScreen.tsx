'use client';

import { useEffect, useRef } from 'react';
import { TestResult, TestScore } from '@/types';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { calculatePercentage } from '@/lib/utils';
import { staggerIn, celebrationAnimation, fadeIn } from '@/lib/animations';
import { Trophy, CheckCircle, XCircle, RotateCcw, Home } from 'lucide-react';

interface ResultsScreenProps {
  results: TestResult[];
  onRetake: () => void;
}

export default function ResultsScreen({
  results,
  onRetake,
}: ResultsScreenProps) {
  const score: TestScore = {
    total: results.length,
    correct: results.filter((r) => r.isCorrect).length,
    incorrect: results.filter((r) => !r.isCorrect).length,
    percentage: calculatePercentage(
      results.filter((r) => r.isCorrect).length,
      results.length
    ),
    passed: results.filter((r) => r.isCorrect).length >= 12,
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const scoreCardRef = useRef<HTMLDivElement>(null);
  const resultsListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      fadeIn(containerRef.current);
    }

    if (scoreCardRef.current && score.passed) {
      celebrationAnimation(scoreCardRef.current);
    }

    if (resultsListRef.current) {
      const items = resultsListRef.current.querySelectorAll('.result-item');
      staggerIn(Array.from(items) as HTMLElement[], 0.1);
    }
  }, [score.passed]);

  return (
    <div ref={containerRef} className="max-w-4xl mx-auto">
      {/* Score Card */}
      <Card
        ref={scoreCardRef}
        variant="elevated"
        className={`mb-8 text-center ${
          score.passed
            ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300'
            : 'bg-gradient-to-r from-orange-50 to-yellow-50 border-2 border-orange-300'
        }`}
      >
        <div className="mb-6">
          {score.passed ? (
            <Trophy className="w-24 h-24 text-yellow-500 mx-auto mb-4" />
          ) : (
            <div className="text-7xl mb-4">📚</div>
          )}
        </div>

        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
          {score.passed
            ? 'Congratulations! 🎉'
            : 'Keep Practicing! 💪'}
        </h2>

        <p className="text-lg md:text-xl text-gray-700 mb-5 md:mb-6">
          {score.passed
            ? 'You passed the test!'
            : 'You need at least 12/15 to pass.'}
        </p>

        <div className="grid grid-cols-3 gap-3 md:gap-4 lg:gap-6 mb-5 md:mb-6 max-w-2xl mx-auto">
          <div className="bg-white rounded-lg p-4 md:p-5 lg:p-6 shadow-md">
            <div className="text-4xl font-bold text-primary-600 mb-2">
              {score.correct}/{score.total}
            </div>
            <div className="text-sm text-gray-600 uppercase tracking-wide">
              Score
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 md:p-5 lg:p-6 shadow-md">
            <div className="text-4xl font-bold text-primary-600 mb-2">
              {score.percentage}%
            </div>
            <div className="text-sm text-gray-600 uppercase tracking-wide">
              Accuracy
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 md:p-5 lg:p-6 shadow-md">
            <div className="text-4xl font-bold text-green-600 mb-2">
              {score.correct}
            </div>
            <div className="text-sm text-gray-600 uppercase tracking-wide">
              Correct
            </div>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <Button onClick={onRetake} size="lg">
            <RotateCcw className="w-5 h-5 mr-2" />
            Retake Test
          </Button>
          <Button
            onClick={() => (window.location.href = '/')}
            variant="secondary"
            size="lg"
          >
            <Home className="w-5 h-5 mr-2" />
            Home
          </Button>
        </div>
      </Card>

      {/* Detailed Results */}
      <Card variant="elevated">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Detailed Results
        </h3>

        <div ref={resultsListRef} className="space-y-4">
          {results.map((result, index) => {
            const status = result.validationDetails.status;
            return (
              <div
                key={result.cardId}
                className={`result-item p-5 rounded-lg border-2 transition-all duration-200 ${
                  status === 'all'
                    ? 'bg-green-50 border-green-200'
                    : status === 'partial'
                    ? 'bg-warning-50 border-warning-200'
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span className="bg-white px-3 py-1 rounded-full text-sm font-semibold text-gray-700 mr-3">
                        #{index + 1}
                      </span>
                      {status === 'all' ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      ) : status === 'partial' ? (
                        <CheckCircle className="w-6 h-6 text-warning-600" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-600" />
                      )}
                      {status === 'partial' && (
                        <span className="ml-2 text-sm font-semibold text-warning-700">
                          ({result.validationDetails.correctCount}/
                          {result.validationDetails.totalProvided} correct)
                        </span>
                      )}
                    </div>

                    <div className="mb-3">
                      <span className="text-gray-600 text-sm">English:</span>
                      <p className="text-xl font-bold text-gray-900">
                        {result.english_word}
                      </p>
                    </div>

                    {/* Valid Translations */}
                    <div className="mb-3">
                      <span className="text-gray-600 text-sm">
                        Valid translations:
                      </span>
                      <p className="text-md text-gray-700">
                        {result.spanish_translations.join(', ')}
                      </p>
                    </div>

                    {/* User's answers breakdown */}
                    <div className="mb-2">
                      <span className="text-gray-600 text-sm">Your answers:</span>
                      <div className="mt-1 space-y-1">
                        {result.userAnswers.map((answer, idx) => {
                          const isCorrect = result.validationDetails.correctAnswers.includes(answer);
                          return (
                            <div key={idx} className="flex items-center gap-2">
                              {isCorrect ? (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              ) : (
                                <XCircle className="w-4 h-4 text-red-600" />
                              )}
                              <span className={isCorrect ? 'text-green-700' : 'text-red-700'}>
                                {answer}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Tips Section */}
      <Card variant="outlined" className="mt-8 bg-blue-50">
        <h3 className="text-xl font-bold text-blue-900 mb-4">
          {score.passed ? 'Keep Up the Great Work!' : 'Tips to Improve:'}
        </h3>
        <ul className="list-disc list-inside space-y-2 text-blue-800">
          {score.passed ? (
            <>
              <li>Try the test again to reinforce your knowledge</li>
              <li>Add more cards to expand your vocabulary</li>
              <li>Practice daily for best results</li>
            </>
          ) : (
            <>
              <li>Review the cards you got wrong using Learn mode</li>
              <li>Pay attention to spelling and accents</li>
              <li>Practice more before taking another test</li>
              <li>Focus on commonly missed words</li>
            </>
          )}
        </ul>
      </Card>
    </div>
  );
}
