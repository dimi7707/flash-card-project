import React from 'react';
import Card from '@/components/ui/Card';

interface TestStatsCardProps {
  answeredCount: number;
  totalCount: number;
  correctCount: number;
}

export default function TestStatsCard({
  answeredCount,
  totalCount,
  correctCount,
}: TestStatsCardProps) {
  return (
    <Card variant="outlined" className="bg-gray-50">
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>
          Answered: {answeredCount} / {totalCount}
        </span>
        <span>Correct so far: {correctCount}</span>
      </div>
    </Card>
  );
}
