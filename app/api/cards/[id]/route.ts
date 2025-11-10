import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { validateLength } from '@/lib/utils';
import { Prisma } from '@prisma/client';

/**
 * GET /api/cards/:id
 * Fetch single card by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const card = await prisma.card.findUnique({
      where: { id },
    });

    if (!card) {
      return NextResponse.json({ error: 'Card not found' }, { status: 404 });
    }

    return NextResponse.json(card);
  } catch (error) {
    console.error('Error fetching card:', error);
    return NextResponse.json(
      { error: 'Failed to fetch card' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/cards/:id
 * Update a card by ID
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { english_word, spanish_translation, note } = body;

    // Build update data object
    const updateData: {
      english_word?: string;
      spanish_translation?: string;
      note?: string | null;
    } = {};

    // Validate and add english_word if provided
    if (english_word !== undefined) {
      if (typeof english_word !== 'string') {
        return NextResponse.json(
          { error: 'English word must be a string' },
          { status: 400 }
        );
      }

      const englishValidation = validateLength(
        english_word,
        100,
        'English word'
      );
      if (!englishValidation.valid) {
        return NextResponse.json(
          { error: englishValidation.error },
          { status: 400 }
        );
      }

      updateData.english_word = english_word.trim();
    }

    // Validate and add spanish_translation if provided
    if (spanish_translation !== undefined) {
      if (typeof spanish_translation !== 'string') {
        return NextResponse.json(
          { error: 'Spanish translation must be a string' },
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

      updateData.spanish_translation = spanish_translation.trim();
    }

    // Validate and add note if provided
    if (note !== undefined) {
      if (note !== null && typeof note !== 'string') {
        return NextResponse.json(
          { error: 'Note must be a string' },
          { status: 400 }
        );
      }

      if (note) {
        const noteValidation = validateLength(note, 500, 'Note');
        if (!noteValidation.valid) {
          return NextResponse.json(
            { error: noteValidation.error },
            { status: 400 }
          );
        }
        updateData.note = note.trim();
      } else {
        updateData.note = null;
      }
    }

    // Check if there's anything to update
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      );
    }

    // Update card
    const card = await prisma.card.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(card);
  } catch (error) {
    console.error('Error updating card:', error);

    // Handle not found error
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json(
          { error: 'Card not found' },
          { status: 404 }
        );
      }
      // Handle unique constraint violation
      if (error.code === 'P2002') {
        return NextResponse.json(
          { error: 'A card with this English word already exists' },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to update card' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/cards/:id
 * Delete a card by ID
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const card = await prisma.card.delete({
      where: { id },
    });

    return NextResponse.json(card);
  } catch (error) {
    console.error('Error deleting card:', error);

    // Handle not found error
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json(
          { error: 'Card not found' },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to delete card' },
      { status: 500 }
    );
  }
}
