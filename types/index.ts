/**
 * Type definitions for the flashcard application
 */

export interface Card {
  id: string;
  english_word: string;
  spanish_translation: string;
  note: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface CreateCardInput {
  english_word: string;
  spanish_translation: string;
  note?: string;
}

export interface UpdateCardInput {
  english_word?: string;
  spanish_translation?: string;
  note?: string | null;
}

export interface TestResult {
  cardId: string;
  english_word: string;
  spanish_translation: string;
  userAnswer: string;
  isCorrect: boolean;
}

export interface TestSession {
  cards: Card[];
  currentIndex: number;
  results: TestResult[];
  isComplete: boolean;
}

export interface TestScore {
  total: number;
  correct: number;
  incorrect: number;
  percentage: number;
  passed: boolean; // >= 12/15 (80%)
}
