import React from 'react';
import { Card as CardType } from '@/types';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import WordAudioPlayer from '@/components/WordAudioPlayer';
import { Check } from 'lucide-react';

interface QuestionViewProps {
  card: CardType;
  userAnswer: string;
  onAnswerChange: (value: string) => void;
  onCheck: () => void;
  onSkip: () => void;
  inputRef: React.RefObject<HTMLInputElement>;
  isLastCard: boolean;
}

export default function QuestionView({
  card,
  userAnswer,
  onAnswerChange,
  onCheck,
  onSkip,
  inputRef,
  isLastCard,
}: QuestionViewProps) {
  return (
    <>
      <div className="text-center mb-8">
        <div className="relative inline-block">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3 md:mb-4 pr-12">
            {card.english_word}
          </h2>
          <div className="absolute top-0 right-0">
            <WordAudioPlayer cardId={card.id} size="md" />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <Input
          ref={inputRef}
          label="Type the Spanish translation(s):"
          value={userAnswer}
          onChange={(e) => onAnswerChange(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              onCheck();
            }
          }}
          placeholder="Enter answer (separate multiple with commas: esparcir, rociar)"
          className="text-lg"
          helperText="💡 Tip: You can enter multiple translations separated by commas"
        />

        <div className="flex gap-3">
          <Button
            onClick={onCheck}
            disabled={!userAnswer.trim()}
            className="flex-1"
          >
            <Check className="w-5 h-5 mr-2" />
            Check Answer
          </Button>
          <Button onClick={onSkip} variant="secondary" disabled={isLastCard}>
            Skip
          </Button>
        </div>
      </div>
    </>
  );
}
