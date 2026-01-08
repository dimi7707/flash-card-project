import React from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface CompletionScreenProps {
  totalCards: number;
}

export default function CompletionScreen({ totalCards }: CompletionScreenProps) {
  return (
    <Card variant="elevated" className="mt-8 text-center bg-gradient-to-r from-primary-50 to-purple-50">
      <div className="text-6xl mb-4">🎉</div>
      <h3 className="text-3xl font-bold text-gray-900 mb-2">Great Job!</h3>
      <p className="text-gray-600 mb-6">
        You've reviewed all {totalCards} cards. Keep practicing to improve your
        vocabulary!
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
  );
}
