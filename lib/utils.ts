/**
 * Utility functions for the flashcard application
 */

/**
 * Normalizes a string for comparison (lowercase, trimmed)
 */
export function normalizeString(str: string): string {
  return str.trim().toLowerCase();
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
