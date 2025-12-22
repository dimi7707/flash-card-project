import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const count = await prisma.card.count();

    return NextResponse.json({ count });
  } catch (error) {
    console.error('Error fetching card count:', error);
    return NextResponse.json(
      { error: 'Failed to fetch card count' },
      { status: 500 }
    );
  }
}
