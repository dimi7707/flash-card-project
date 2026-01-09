import React from 'react';
import ProgressBar from '@/components/ui/ProgressBar';

interface TestProgressHeaderProps {
  currentIndex: number;
  totalCards: number;
}

export default function TestProgressHeader({
  currentIndex,
  totalCards,
}: TestProgressHeaderProps) {
  const progress = ((currentIndex + 1) / totalCards) * 100;

  return (
    <div className="mb-4 md:mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-900">
          Question {currentIndex + 1} of {totalCards}
        </h2>
        <span className="text-lg font-semibold text-primary-600">
          {Math.round(progress)}%
        </span>
      </div>
      <ProgressBar progress={progress} showLabel={false} variant="primary" />
    </div>
  );
}
