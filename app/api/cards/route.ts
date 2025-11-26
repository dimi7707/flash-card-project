import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateLength, capitalize } from '@/lib/utils';
import { Prisma } from '@prisma/client';

export const dynamic = 'force-dynamic'
/**
 * GET /api/cards
 * Fetch 10 random cards from database, shuffled for maximum randomness
 */
export async function GET() {
  try {
    // Get all cards
    const allCards = await prisma.card.findMany();

    if (allCards.length === 0) {
      return NextResponse.json([]);
    }

    // Shuffle all cards and take 10 random ones
    const shuffled = allCards
      .sort(() => Math.random() - 0.5)
      .slice(0, 10);

    // Shuffle again to promote even more randomness in the order
    const finalCards = shuffled.sort(() => Math.random() - 0.5);

    return NextResponse.json(finalCards);
  } catch (error) {
    console.error('Error fetching cards:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cards' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/cards
 * Create a new flashcard
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { english_word, spanish_translations, note } = body;

    // Validate english_word
    if (!english_word || typeof english_word !== 'string') {
      return NextResponse.json(
        { error: 'English word is required' },
        { status: 400 }
      );
    }

    const englishValidation = validateLength(english_word, 100, 'English word');
    if (!englishValidation.valid) {
      return NextResponse.json(
        { error: englishValidation.error },
        { status: 400 }
      );
    }

    // Validate spanish_translations (must be array)
    if (!spanish_translations || !Array.isArray(spanish_translations)) {
      return NextResponse.json(
        { error: 'Spanish translations must be an array' },
        { status: 400 }
      );
    }

    if (spanish_translations.length === 0) {
      return NextResponse.json(
        { error: 'At least one Spanish translation is required' },
        { status: 400 }
      );
    }

    if (spanish_translations.length > 10) {
      return NextResponse.json(
        { error: 'Maximum 10 translations allowed' },
        { status: 400 }
      );
    }

    // Validate each translation
    const trimmedTranslations: string[] = [];
    for (let i = 0; i < spanish_translations.length; i++) {
      const translation = spanish_translations[i];

      if (typeof translation !== 'string') {
        return NextResponse.json(
          { error: `Translation ${i + 1} must be a string` },
          { status: 400 }
        );
      }

      const validation = validateLength(
        translation,
        100,
        `Translation ${i + 1}`
      );
      if (!validation.valid) {
        return NextResponse.json(
          { error: validation.error },
          { status: 400 }
        );
      }

      const trimmed = translation.trim();
      if (trimmed.length > 0) {
        trimmedTranslations.push(trimmed);
      }
    }

    if (trimmedTranslations.length === 0) {
      return NextResponse.json(
        { error: 'At least one non-empty translation is required' },
        { status: 400 }
      );
    }

    // Validate note (optional)
    if (note !== undefined && note !== null && typeof note !== 'string') {
      return NextResponse.json({ error: 'Note must be a string' }, { status: 400 });
    }

    if (note) {
      const noteValidation = validateLength(note, 500, 'Note');
      if (!noteValidation.valid) {
        return NextResponse.json(
          { error: noteValidation.error },
          { status: 400 }
        );
      }
    }

    // Capitalize the english word for consistent storage and comparison
    const capitalizedWord = capitalize(english_word);

    // Check for duplicate (exact match since all words are stored capitalized)
    const existingCard = await prisma.card.findFirst({
      where: {
        english_word: capitalizedWord,
      },
    });

    if (existingCard) {
      return NextResponse.json(
        {
          error: 'A card with this English word already exists',
          existingCard: {
            english_word: existingCard.english_word,
            spanish_translations: existingCard.spanish_translations,
            note: existingCard.note,
          },
        },
        { status: 409 }
      );
    }

    // Create card with translations as JSON
    const card = await prisma.card.create({
      data: {
        english_word: capitalizedWord,
        spanish_translations: trimmedTranslations, // Prisma will convert to JSON
        note: note ? note.trim() : null,
      },
    });

    return NextResponse.json(card, { status: 201 });
  } catch (error) {
    console.error('Error creating card:', error);

    // Handle unique constraint violation (duplicate english_word)
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return NextResponse.json(
          { error: 'A card with this English word already exists' },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to create card' },
      { status: 500 }
    );
  }
}
