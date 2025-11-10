import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * GET /api/cards/random
 * Fetch 15 random cards for testing
 */
export async function GET() {
  try {
    // Get total count of cards
    const totalCards = await prisma.card.count();

    if (totalCards === 0) {
      return NextResponse.json(
        { error: 'No cards available. Please create some cards first.' },
        { status: 404 }
      );
    }

    // If we have fewer than 15 cards, return all of them
    const limit = Math.min(15, totalCards);

    // Use database-level randomization for PostgreSQL
    // For other databases, you might need to adjust this query
    const randomCards = await prisma.$queryRaw`
      SELECT * FROM cards
      ORDER BY RANDOM()
      LIMIT ${limit}
    `;

    return NextResponse.json(randomCards);
  } catch (error) {
    console.error('Error fetching random cards:', error);
    return NextResponse.json(
      { error: 'Failed to fetch random cards' },
      { status: 500 }
    );
  }
}
