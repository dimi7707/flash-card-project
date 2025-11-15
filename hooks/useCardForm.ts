import { useState, FormEvent } from 'react';
import { CreateCardInput } from '@/types';

interface DuplicateError {
  english_word: string;
  spanish_translations: string[];
  note: string | null;
}

interface UseCardFormReturn {
  handleSubmit: (
    formData: CreateCardInput,
    onSuccess: () => void
  ) => Promise<void>;
  isLoading: boolean;
  successMessage: string;
  errorMessage: string;
  duplicateError: DuplicateError | null;
  clearMessages: () => void;
}

export function useCardForm(): UseCardFormReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [duplicateError, setDuplicateError] = useState<DuplicateError | null>(
    null
  );

  const clearMessages = () => {
    setSuccessMessage('');
    setErrorMessage('');
    setDuplicateError(null);
  };

  const handleSubmit = async (
    formData: CreateCardInput,
    onSuccess: () => void
  ) => {
    clearMessages();
    setIsLoading(true);

    try {
      // Filter out empty translations
      const validTranslations = formData.spanish_translations
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      const response = await fetch('/api/cards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          english_word: formData.english_word.trim(),
          spanish_translations: validTranslations,
          note: formData.note?.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Check if it's a duplicate error (409 Conflict)
        if (response.status === 409 && data.existingCard) {
          setDuplicateError({
            english_word: data.existingCard.english_word,
            spanish_translations: data.existingCard.spanish_translations,
            note: data.existingCard.note,
          });
          return;
        }

        // Other errors
        throw new Error(data.error || 'Failed to create card');
      }

      // Success
      setSuccessMessage(
        `Card "${data.english_word}" created successfully with ${validTranslations.length} translation(s)!`
      );

      // Call the success callback to reset form
      onSuccess();

      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Failed to create card'
      );
      // Clear error message after 5 seconds
      setTimeout(() => {
        setErrorMessage('');
      }, 5000);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleSubmit,
    isLoading,
    successMessage,
    errorMessage,
    duplicateError,
    clearMessages,
  };
}
