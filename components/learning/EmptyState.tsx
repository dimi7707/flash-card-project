import React from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface EmptyStateProps {
  error?: string;
}

export default function EmptyState({ error }: EmptyStateProps) {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Card variant="elevated" className="max-w-md text-center">
        <div className="text-6xl mb-4">📚</div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          No Cards Available
        </h3>
        <p className="text-gray-600 mb-6">
          {error || 'Create some flashcards to start learning!'}
        </p>
        <Button
          onClick={() => (window.location.href = '/add-card')}
          variant="primary"
        >
          Create Your First Card
        </Button>
      </Card>
    </div>
  );
}
