import React from 'react';

interface ProgressIndicatorProps {
  currentIndex: number;
  totalCards: number;
}

export default function ProgressIndicator({
  currentIndex,
  totalCards,
}: ProgressIndicatorProps) {
  const percentage = Math.round(((currentIndex + 1) / totalCards) * 100);

  return (
    <div className="mb-4 md:mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">
          Card {currentIndex + 1} of {totalCards}
        </span>
        <span className="text-sm text-gray-500">{percentage}% Complete</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-primary-600 h-2 rounded-full transition-all duration-300"
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
}
