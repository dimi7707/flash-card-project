/**
 * Type definitions for the flashcard application
 */

export interface Card {
  id: string;
  english_word: string;
  spanish_translations: string[]; // UPDATED: Now supports multiple translations
  note: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface CreateCardInput {
  english_word: string;
  spanish_translations: string[]; // UPDATED: Array of translations
  note?: string;
}

export interface UpdateCardInput {
  english_word?: string;
  spanish_translations?: string[]; // UPDATED: Array of translations
  note?: string | null;
}

export interface ValidationResult {
  isValid: boolean; // True if at least 1 translation is correct
  correctCount: number; // Number of correct translations provided by user
  totalProvided: number; // Total number of answers the user provided
  totalAvailable: number; // Total valid translations in database
  userAnswers: string[]; // User's answers (cleaned)
  correctAnswers: string[]; // Which user answers were correct
  missedAnswers: string[]; // Valid translations the user didn't provide
  status: 'all' | 'partial' | 'none'; // Overall status
}

export interface TestResult {
  cardId: string;
  english_word: string;
  spanish_translations: string[]; // UPDATED: All valid translations
  userAnswer: string; // Raw user input
  userAnswers: string[]; // Parsed user answers
  isCorrect: boolean; // True if at least 1 correct
  validationDetails: ValidationResult; // Detailed validation info
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
