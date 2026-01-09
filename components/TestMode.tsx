'use client';

import ResultsScreen from '@/components/ResultsScreen';
import { useTestMode } from '@/hooks/useTestMode';
import TestStartScreen from '@/components/test/TestStartScreen';
import TestProgressHeader from '@/components/test/TestProgressHeader';
import TestQuestionCard from '@/components/test/TestQuestionCard';
import TestStatsCard from '@/components/test/TestStatsCard';

export default function TestMode() {
  const {
    hasStarted,
    cards,
    currentIndex,
    currentCard,
    userAnswer,
    results,
    isLoading,
    error,
    isComplete,
    cardRef,
    inputRef,
    setUserAnswer,
    fetchRandomCards,
    handleSubmitAnswer,
    handleRetake,
  } = useTestMode();

  // Show results screen if test is complete
  if (isComplete) {
    return <ResultsScreen results={results} onRetake={handleRetake} />;
  }

  // Show start screen if test hasn't started
  if (!hasStarted) {
    return (
      <TestStartScreen
        onStart={fetchRandomCards}
        isLoading={isLoading}
        error={error}
      />
    );
  }

  // Show test interface
  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Header */}
      <TestProgressHeader currentIndex={currentIndex} totalCards={cards.length} />

      {/* Question Card */}
      <TestQuestionCard
        card={currentCard}
        userAnswer={userAnswer}
        onAnswerChange={setUserAnswer}
        onSubmit={handleSubmitAnswer}
        questionNumber={currentIndex + 1}
        totalQuestions={cards.length}
        cardRef={cardRef}
        inputRef={inputRef}
      />

      {/* Stats Card */}
      <TestStatsCard
        answeredCount={results.length}
        totalCount={cards.length}
        correctCount={results.filter((r) => r.isCorrect).length}
      />
    </div>
  );
}
