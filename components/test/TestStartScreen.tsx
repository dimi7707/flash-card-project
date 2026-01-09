import React from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { PlayCircle } from 'lucide-react';

interface TestStartScreenProps {
  onStart: () => void;
  isLoading: boolean;
  error: string;
}

export default function TestStartScreen({
  onStart,
  isLoading,
  error,
}: TestStartScreenProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <Card variant="elevated" className="text-center">
        <div className="text-7xl mb-6">🏆</div>

        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 md:mb-4">
          Ready for a Challenge?
        </h2>

        <p className="text-lg text-gray-600 mb-8">
          Test your knowledge with a randomized quiz of 15 flashcards. You need
          to score at least 12/15 (80%) to pass.
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
          onClick={onStart}
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
