import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { validateLength } from '@/lib/utils';
import { Prisma } from '@prisma/client';

/**
 * GET /api/cards
 * Fetch all cards from database
 */
export async function GET() {
  try {
    const cards = await prisma.card.findMany({
      orderBy: {
        created_at: 'desc',
      },
    });

    return NextResponse.json(cards);
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
    const { english_word, spanish_translation, note } = body;

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

    // Validate spanish_translation
    if (!spanish_translation || typeof spanish_translation !== 'string') {
      return NextResponse.json(
        { error: 'Spanish translation is required' },
        { status: 400 }
      );
    }

    const spanishValidation = validateLength(
      spanish_translation,
      100,
      'Spanish translation'
    );
    if (!spanishValidation.valid) {
      return NextResponse.json(
        { error: spanishValidation.error },
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

    // Create card
    const card = await prisma.card.create({
      data: {
        english_word: english_word.trim(),
        spanish_translation: spanish_translation.trim(),
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
