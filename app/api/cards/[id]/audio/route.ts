import { NextRequest, NextResponse } from 'next/server';
import {
  getCardById,
  checkExistingAudio,
  generateAndSaveAudio
} from '@/lib/audioService';

export const dynamic = 'force-dynamic'

/**
 * GET /api/cards/[id]/audio
 * 
 * Retrieves the audio for a word:
 * 1. If it already exists in S3 → returns URL (cache)
 * 2. If it doesn't exist → generates with Polly → saves to S3 → returns URL
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const { id } = params;

    // Get card
    const card = await getCardById(id);
    if (!card) {
      return NextResponse.json(
        { error: "Card not found" },
        { status: 404 }
      );
    }

    // Check if audio already exists
    const cachedResponse = await checkExistingAudio(card);
    if (cachedResponse) {
      return NextResponse.json(cachedResponse);
    }

    // Generate and save new audio
    const response = await generateAndSaveAudio(card);
    return NextResponse.json(response);

  } catch (error: any) {
    console.error("[Audio] Error:", error);
    return NextResponse.json(
      { 
        error: "Failed to generate audio",
        details: error.message
      },
      { status: 500 }
    );
  }
}
