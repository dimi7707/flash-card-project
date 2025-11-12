/**
 * Utility functions for the flashcard application
 */

/**
 * Normalizes a string for comparison (lowercase, trimmed, accents removed)
 */
export function normalizeString(str: string): string {
  return str
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, ''); // Remove accents
}

/**
 * Compares two strings case-insensitively and trimmed
 */
export function compareStrings(str1: string, str2: string): boolean {
  return normalizeString(str1) === normalizeString(str2);
}

/**
 * Validates string length
 */
export function validateLength(
  str: string,
  maxLength: number,
  fieldName: string
): { valid: boolean; error?: string } {
  const trimmed = str.trim();
  if (trimmed.length === 0) {
    return { valid: false, error: `${fieldName} is required` };
  }
  if (trimmed.length > maxLength) {
    return {
      valid: false,
      error: `${fieldName} must be ${maxLength} characters or less`,
    };
  }
  return { valid: true };
}

/**
 * Calculates percentage score
 */
export function calculatePercentage(correct: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((correct / total) * 100);
}

/**
 * Shuffles an array using Fisher-Yates algorithm
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Validates multiple translations from user input
 * User can provide multiple translations separated by commas
 * Returns validation result with detailed information
 *
 * Scoring logic:
 * - If user provides 1 answer and it's correct = 100% (1/1)
 * - If user provides multiple answers = x/y where x=correct, y=total provided
 * - Example: user writes "hola, adios, buenos dias" and only "hola" is correct = 1/3
 */
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

export function validateMultipleTranslations(
  userInput: string,
  validTranslations: string[]
): ValidationResult {
  // Split user input by commas and clean each answer
  const userAnswers = userInput
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0) // Remove empty strings
    .map((s) => normalizeString(s));

  // Normalize valid translations for comparison
  const validNormalized = validTranslations.map((t) => normalizeString(t));

  // Find which user answers are correct
  const correctAnswers = userAnswers.filter((ua) =>
    validNormalized.includes(ua)
  );

  // Find valid translations the user didn't provide
  const missedAnswers = validTranslations.filter(
    (vt) => !userAnswers.includes(normalizeString(vt))
  );

  // Determine overall status
  let status: 'all' | 'partial' | 'none';
  if (correctAnswers.length === 0) {
    status = 'none';
  } else if (correctAnswers.length === userAnswers.length) {
    // All user answers are correct (100%)
    status = 'all';
  } else {
    // Some user answers are correct, some are wrong
    status = 'partial';
  }

  return {
    isValid: correctAnswers.length > 0, // At least 1 correct = valid
    correctCount: correctAnswers.length,
    totalProvided: userAnswers.length, // UPDATED: Number of answers user provided
    totalAvailable: validTranslations.length,
    userAnswers,
    correctAnswers,
    missedAnswers,
    status,
  };
}
