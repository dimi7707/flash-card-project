'use client';

import { useState } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Plus, X } from 'lucide-react';

interface TranslationListProps {
  translations: string[];
  onChange: (translations: string[]) => void;
  errors?: string[];
  disabled?: boolean;
}

export default function TranslationList({
  translations,
  onChange,
  errors = [],
  disabled = false,
}: TranslationListProps) {
  const handleAdd = () => {
    if (translations.length < 10) {
      // Max 10 translations
      onChange([...translations, '']);
    }
  };

  const handleRemove = (index: number) => {
    if (translations.length > 1) {
      // Minimum 1 translation
      const newTranslations = translations.filter((_, i) => i !== index);
      onChange(newTranslations);
    }
  };

  const handleChange = (index: number, value: string) => {
    const newTranslations = [...translations];
    newTranslations[index] = value;
    onChange(newTranslations);
  };

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-gray-700">
          Spanish Translations
        </label>
        <span className="text-sm text-gray-500">
          {translations.length} translation{translations.length !== 1 ? 's' : ''} added
        </span>
      </div>

      <div className="space-y-3">
        {translations.map((translation, index) => (
          <div key={index} className="flex gap-2 items-start">
            <div className="flex-1">
              <Input
                value={translation}
                onChange={(e) => handleChange(index, e.target.value)}
                placeholder={`Translation ${index + 1} (e.g., ${
                  index === 0 ? 'esparcir' : index === 1 ? 'rociar' : 'salpicar'
                })`}
                disabled={disabled}
                error={errors[index]}
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              onClick={() => handleRemove(index)}
              disabled={disabled || translations.length === 1}
              className="mt-0.5 px-3 hover:bg-red-50 hover:text-red-600"
              title="Remove translation"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        ))}
      </div>

      <Button
        type="button"
        variant="secondary"
        onClick={handleAdd}
        disabled={disabled || translations.length >= 10}
        className="w-full"
      >
        <Plus className="w-5 h-5 mr-2" />
        Add Another Translation {translations.length >= 10 && '(Max 10)'}
      </Button>

      <p className="text-sm text-gray-500 mt-2">
        💡 Tip: Add multiple valid translations to enrich vocabulary. Users can
        answer with any of these translations.
      </p>
    </div>
  );
}
