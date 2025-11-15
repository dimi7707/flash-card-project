'use client';

import { useState, FormEvent, useRef, useEffect } from 'react';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import TranslationList from '@/components/TranslationList';
import { CreateCardInput } from '@/types';
import { fadeIn, successAnimation } from '@/lib/animations';
import { useCardForm } from '@/hooks/useCardForm';

export default function AddCardForm() {
  const {
    handleSubmit: submitCard,
    isLoading,
    successMessage,
    errorMessage,
    duplicateError,
    clearMessages,
  } = useCardForm();

  const [formData, setFormData] = useState<CreateCardInput>({
    english_word: '',
    spanish_translations: [''],
    note: '',
  });
  const [translationErrors, setTranslationErrors] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ english_word?: string; note?: string }>({});

  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (formRef.current) {
      fadeIn(formRef.current);
    }
  }, []);

  useEffect(() => {
    if (successMessage && successRef.current) {
      fadeIn(successRef.current);
      successAnimation(successRef.current);
    }
  }, [successMessage]);

  useEffect(() => {
    if (errorMessage && errorRef.current) {
      fadeIn(errorRef.current);
    }
  }, [errorMessage]);

  const validateForm = (): boolean => {
    const newErrors: { english_word?: string; note?: string } = {};
    const newTranslationErrors: string[] = [];

    // Validate English word
    if (!formData.english_word.trim()) {
      newErrors.english_word = 'English word is required';
    } else if (formData.english_word.trim().length > 100) {
      newErrors.english_word = 'English word must be 100 characters or less';
    }

    // Validate translations
    const nonEmptyTranslations = formData.spanish_translations.filter(
      (t) => t.trim().length > 0
    );

    if (nonEmptyTranslations.length === 0) {
      newTranslationErrors[0] = 'At least one translation is required';
    } else {
      formData.spanish_translations.forEach((translation, index) => {
        if (translation.trim().length > 0 && translation.trim().length > 100) {
          newTranslationErrors[index] = 'Must be 100 characters or less';
        }
      });
    }

    // Validate note
    if (formData.note && formData.note.trim().length > 500) {
      newErrors.note = 'Note must be 500 characters or less';
    }

    setErrors(newErrors);
    setTranslationErrors(newTranslationErrors);
    return (
      Object.keys(newErrors).length === 0 && newTranslationErrors.length === 0
    );
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    await submitCard(formData, () => {
      // Reset form on success
      setFormData({
        english_word: '',
        spanish_translations: [''],
        note: '',
      });
      setErrors({});
      setTranslationErrors([]);
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (name === 'english_word' || name === 'note') {
      if (errors[name]) {
        setErrors((prev) => ({
          ...prev,
          [name]: undefined,
        }));
      }
      // Clear duplicate error when user modifies english_word
      if (name === 'english_word' && duplicateError) {
        clearMessages();
      }
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Success Message */}
      {successMessage && (
        <div
          ref={successRef}
          className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg"
          role="alert"
        >
          <p className="font-semibold">Success!</p>
          <p>{successMessage}</p>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div
          ref={errorRef}
          className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg"
          role="alert"
        >
          <p className="font-semibold">Error</p>
          <p>{errorMessage}</p>
        </div>
      )}

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Input
            label="English Word"
            name="english_word"
            type="text"
            value={formData.english_word}
            onChange={handleChange}
            error={errors.english_word}
            placeholder="Enter English word"
            disabled={isLoading}
            required
          />
          {duplicateError && (
            <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-md">
              <p className="text-sm font-semibold text-amber-800">
                This word already exists in your collection
              </p>
              <p className="text-sm text-amber-700 mt-1">
                <strong>Word:</strong> {duplicateError.english_word}
              </p>
              <p className="text-sm text-amber-700">
                <strong>Translations:</strong>{' '}
                {Array.isArray(duplicateError.spanish_translations)
                  ? duplicateError.spanish_translations.join(', ')
                  : duplicateError.spanish_translations}
              </p>
              {duplicateError.note && (
                <p className="text-sm text-amber-700">
                  <strong>Note:</strong> {duplicateError.note}
                </p>
              )}
            </div>
          )}
        </div>

        <TranslationList
          translations={formData.spanish_translations}
          onChange={(translations) => {
            setFormData((prev) => ({
              ...prev,
              spanish_translations: translations,
            }));
            setTranslationErrors([]);
          }}
          errors={translationErrors}
          disabled={isLoading}
        />

        <Textarea
          label="Note (Optional)"
          name="note"
          value={formData.note}
          onChange={handleChange}
          error={errors.note}
          placeholder="Add any additional notes or context"
          disabled={isLoading}
          helperText="Maximum 500 characters"
        />

        <div className="flex gap-4">
          <Button type="submit" isLoading={isLoading} className="flex-1">
            Create Card
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              setFormData({
                english_word: '',
                spanish_translations: [''],
                note: '',
              });
              setErrors({});
              setTranslationErrors([]);
              clearMessages();
            }}
            disabled={isLoading}
          >
            Clear
          </Button>
        </div>
      </form>
    </div>
  );
}
