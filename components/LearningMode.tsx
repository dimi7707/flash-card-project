'use client';

import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useLearningMode } from '@/hooks/useLearningMode';
import LoadingState from '@/components/learning/LoadingState';
import EmptyState from '@/components/learning/EmptyState';
import ProgressIndicator from '@/components/learning/ProgressIndicator';
import QuestionView from '@/components/learning/QuestionView';
import FeedbackView from '@/components/learning/FeedbackView';
import CompletionScreen from '@/components/learning/CompletionScreen';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function LearningMode() {
  const {
    cards,
    currentIndex,
    currentCard,
    userAnswer,
    showFeedback,
    validationResult,
    isLoading,
    error,
    isCompleted,
    cardRef,
    feedbackRef,
    inputRef,
    setUserAnswer,
    handleCheck,
    handleNext,
    handlePrevious,
    handleSkip,
  } = useLearningMode();

  // Loading state
  if (isLoading) {
    return <LoadingState />;
  }

  // Empty/error state
  if (error || cards.length === 0) {
    return <EmptyState error={error} />;
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Indicator */}
      {!isCompleted && (
        <ProgressIndicator currentIndex={currentIndex} totalCards={cards.length} />
      )}

      {/* Main Card */}
      {!isCompleted && (
        <Card
          ref={cardRef}
          variant="elevated"
          className="mb-6"
          style={{ perspective: '1000px' }}
        >
          {!showFeedback ? (
            <QuestionView
              card={currentCard}
              userAnswer={userAnswer}
              onAnswerChange={setUserAnswer}
              onCheck={handleCheck}
              onSkip={handleSkip}
              inputRef={inputRef}
              isLastCard={currentIndex === cards.length - 1}
            />
          ) : (
            validationResult && (
              <FeedbackView
                card={currentCard}
                validationResult={validationResult}
                onNext={handleNext}
                isLastCard={currentIndex === cards.length - 1}
                feedbackRef={feedbackRef}
              />
            )
          )}
        </Card>
      )}

      {/* Navigation Buttons - Hidden during feedback */}
      {!isCompleted && !showFeedback && (
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

      {/* Completion Screen */}
      {isCompleted && <CompletionScreen totalCards={cards.length} />}
    </div>
  );
}
