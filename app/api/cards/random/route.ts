import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic'

/**
 * GET /api/cards/random
 * Fetch 15 random cards for testing
 */
export async function GET() {
  try {
    // Get all cards
    const allCards = await prisma.card.findMany();

    if (allCards.length === 0) {
      return NextResponse.json(
        { error: 'No cards available. Please create some cards first.' },
        { status: 404 }
      );
    }

    // If we have fewer than 15 cards, return all of them
    if (allCards.length <= 15) {
      return NextResponse.json(allCards);
    }

    // Shuffle and take 15 random cards
    const shuffled = allCards
      .sort(() => Math.random() - 0.5)
      .slice(0, 15);

    return NextResponse.json(shuffled);
  } catch (error) {
    console.error('Error fetching random cards:', error);
    return NextResponse.json(
      { error: 'Failed to fetch random cards' },
      { status: 500 }
    );
  }
}