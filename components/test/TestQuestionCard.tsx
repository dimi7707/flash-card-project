import React, { RefObject } from 'react';
import { Card as CardType } from '@/types';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import WordAudioPlayer from '@/components/WordAudioPlayer';

interface TestQuestionCardProps {
  card: CardType;
  userAnswer: string;
  onAnswerChange: (value: string) => void;
  onSubmit: () => void;
  questionNumber: number;
  totalQuestions: number;
  cardRef: RefObject<HTMLDivElement>;
  inputRef: RefObject<HTMLInputElement>;
}

export default function TestQuestionCard({
  card,
  userAnswer,
  onAnswerChange,
  onSubmit,
  questionNumber,
  totalQuestions,
  cardRef,
  inputRef,
}: TestQuestionCardProps) {
  const isLastQuestion = questionNumber === totalQuestions;

  return (
    <Card ref={cardRef} variant="elevated" className="mb-6">
      <div className="text-center mb-8">
        <div className="inline-block bg-primary-100 text-primary-800 px-4 py-2 rounded-full text-sm font-semibold mb-6">
          Translate to Spanish
        </div>

        <div className="relative inline-block">
          <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3 md:mb-4 pr-12">
            {card.english_word}
          </h3>
          <div className="absolute top-0 right-0">
            <WordAudioPlayer cardId={card.id} size="md" />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <Input
          ref={inputRef}
          label="Your Answer:"
          value={userAnswer}
          onChange={(e) => onAnswerChange(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              onSubmit();
            }
          }}
          placeholder="Type translation(s) - separate multiple with commas"
          className="text-lg"
          helperText="💡 You can enter multiple translations to score higher"
        />

        <Button
          onClick={onSubmit}
          disabled={!userAnswer.trim()}
          className="w-full"
          size="lg"
        >
          {isLastQuestion ? 'Submit & Finish Test' : 'Submit & Continue'}
        </Button>
      </div>
    </Card>
  );
}
