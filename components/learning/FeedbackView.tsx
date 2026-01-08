import React from 'react';
import { Card as CardType, ValidationResult } from '@/types';
import Button from '@/components/ui/Button';
import WordAudioPlayer from '@/components/WordAudioPlayer';
import { Check, X, CheckCircle, XCircle } from 'lucide-react';

interface FeedbackViewProps {
  card: CardType;
  validationResult: ValidationResult;
  onNext: () => void;
  isLastCard: boolean;
  feedbackRef: React.RefObject<HTMLDivElement>;
}

export default function FeedbackView({
  card,
  validationResult,
  onNext,
  isLastCard,
  feedbackRef,
}: FeedbackViewProps) {
  const getStatusColor = () => {
    switch (validationResult.status) {
      case 'all':
        return 'bg-green-50 border-2 border-green-500';
      case 'partial':
        return 'bg-warning-50 border-2 border-warning-500';
      default:
        return 'bg-red-50 border-2 border-red-500';
    }
  };

  const getButtonVariant = () => {
    switch (validationResult.status) {
      case 'all':
        return 'primary';
      case 'partial':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  return (
    <div
      ref={feedbackRef}
      className={`max-h-[70vh] overflow-y-auto p-4 rounded-lg ${getStatusColor()}`}
    >
      {/* Header with status and word */}
      <div className="text-center mb-4">
        <div className="flex items-center justify-center mb-2">
          {validationResult.status === 'all' ? (
            <>
              <Check className="w-7 h-7 text-green-600 mr-2" />
              <span className="text-xl md:text-2xl font-bold text-green-800">
                Perfect! All Correct!
              </span>
            </>
          ) : validationResult.status === 'partial' ? (
            <>
              <Check className="w-7 h-7 text-warning-600 mr-2" />
              <span className="text-xl md:text-2xl font-bold text-warning-800">
                Good! Partially Correct ({validationResult.correctCount}/
                {validationResult.totalProvided})
              </span>
            </>
          ) : (
            <>
              <X className="w-7 h-7 text-red-600 mr-2" />
              <span className="text-xl md:text-2xl font-bold text-red-800">
                Incorrect
              </span>
            </>
          )}
        </div>
        <div className="flex items-center justify-center gap-2">
          <h3 className="text-2xl font-bold text-gray-900">
            {card.english_word}
          </h3>
          <WordAudioPlayer cardId={card.id} size="sm" />
        </div>
      </div>

      {/* Two-column layout for answers (50/50 split on desktop) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
        {/* User's answers */}
        {validationResult.userAnswers.length > 0 && (
          <div className="p-3 bg-white rounded-lg">
            <p className="font-semibold text-gray-700 mb-2 text-sm">
              Your answers:
            </p>
            <div className="space-y-1">
              {validationResult.userAnswers.map((answer, idx) => {
                const isCorrect =
                  validationResult.correctAnswers.includes(answer);
                return (
                  <div key={idx} className="flex items-center gap-2">
                    {isCorrect ? (
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                    )}
                    <span
                      className={`text-sm ${
                        isCorrect ? 'text-green-700' : 'text-red-700'
                      }`}
                    >
                      {answer}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Missed translations */}
        {validationResult.missedAnswers.length > 0 && (
          <div className="p-3 bg-white rounded-lg">
            <p className="font-semibold text-gray-700 mb-2 text-sm">
              Other valid translations:
            </p>
            <div className="space-y-1">
              {validationResult.missedAnswers.map((answer, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-base">•</span>
                  <span className="text-sm text-gray-900">{answer}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Note section (full width) */}
      {card.note && (
        <div className="mb-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs font-semibold text-blue-900 mb-1">📝 Note:</p>
          <p className="text-sm text-blue-800 italic">{card.note}</p>
        </div>
      )}

      {/* Next button */}
      <Button
        onClick={onNext}
        variant={getButtonVariant()}
        disabled={isLastCard}
        className="w-full"
      >
        {isLastCard ? 'Completed!' : 'Next Card'}
      </Button>
    </div>
  );
}
