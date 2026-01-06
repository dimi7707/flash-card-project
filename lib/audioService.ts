import { PollyClient, SynthesizeSpeechCommand } from "@aws-sdk/client-polly";
import { S3Client, PutObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { prisma } from '@/lib/prisma';

const pollyClient = new PollyClient({ region: process.env.AWS_REGION });
const s3Client = new S3Client({ region: process.env.AWS_REGION });

// ===== TYPES =====
export type CardAudioData = {
  id: string;
  english_word: string;
  audio_url: string | null;
  audio_generated_at: Date | null;
};

export type AudioResponse = {
  audioUrl: string;
  word: string;
  cached: boolean;
  message: string;
};

// ===== DATA ACCESS FUNCTIONS =====

/**
 * Retrieves a card by its ID from the database
 */
export async function getCardById(id: string): Promise<CardAudioData | null> {
  console.log(`[Audio] Fetching card ${id}...`);
  
  const card = await prisma.card.findUnique({
    where: { id },
    select: {
      id: true,
      english_word: true,
      audio_url: true,
      audio_generated_at: true,
    },
  });

  return card;
}

/**
 * Updates the audio URL and timestamp in the database
 */
export async function updateCardAudioUrl(cardId: string, audioUrl: string): Promise<void> {
  console.log(`[Audio] Updating database with audio URL...`);
  
  await prisma.card.update({
    where: { id: cardId },
    data: {
      audio_url: audioUrl,
      audio_generated_at: new Date(),
    },
  });

  console.log(`[Audio] Database updated successfully`);
}

// ===== S3 FUNCTIONS =====

/**
 * Builds the S3 key for the audio file
 */
export function buildS3Key(cardId: string, word: string): string {
  return `audio/${cardId}/${word}.mp3`;
}

/**
 * Builds the public URL for the audio file in S3
 */
export function buildAudioUrl(s3Key: string): string {
  return `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;
}

/**
 * Verifies if the audio file exists in S3
 */
export async function verifyAudioExistsInS3(s3Key: string): Promise<boolean> {
  try {
    await s3Client.send(
      new HeadObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET!,
        Key: s3Key,
      })
    );
    return true;
  } catch {
    return false;
  }
}

/**
 * Uploads the audio file to S3
 */
export async function uploadAudioToS3(s3Key: string, audioBuffer: Uint8Array): Promise<void> {
  console.log(`[Audio] Uploading to S3: ${s3Key}`);
  
  await s3Client.send(
    new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET!,
      Key: s3Key,
      Body: audioBuffer,
      ContentType: "audio/mpeg",
      CacheControl: "max-age=31536000", // Cache for 1 year (never changes)
    })
  );

  console.log(`[Audio] File uploaded successfully`);
}

// ===== POLLY FUNCTIONS =====

/**
 * Generates audio for a word using Amazon Polly
 */
export async function generateAudioWithPolly(word: string): Promise<Uint8Array> {
  console.log(`[Audio] Generating audio for word: "${word}"`);

  const synthesizeCommand = new SynthesizeSpeechCommand({
    Text: word,
    OutputFormat: "mp3",
    VoiceId: "Joanna", // Female English voice (clear and natural)
    Engine: "standard", // neural engine is not available in the AWS region being used
  });

  const synthesizeResponse = await pollyClient.send(synthesizeCommand);
  const audioBuffer = await synthesizeResponse.AudioStream!.transformToByteArray();
  
  console.log(`[Audio] Audio generated. Size: ${audioBuffer.length} bytes`);
  
  return audioBuffer;
}

// ===== BUSINESS LOGIC FUNCTIONS =====

/**
 * Checks if audio already exists and is available (in DB and S3)
 */
export async function checkExistingAudio(card: CardAudioData): Promise<AudioResponse | null> {
  if (!card.audio_url || !card.audio_generated_at) {
    return null;
  }

  console.log(`[Audio] Audio URL found in DB: ${card.audio_url}`);
  
  const s3Key = buildS3Key(card.id, card.english_word);
  const existsInS3 = await verifyAudioExistsInS3(s3Key);

  if (existsInS3) {
    console.log(`[Audio] Audio file verified in S3. Returning cached URL.`);
    return {
      audioUrl: card.audio_url,
      word: card.english_word,
      cached: true,
      message: "Audio retrieved from cache"
    };
  }

  console.warn(`[Audio] Audio file missing in S3 for ${card.id}. Regenerating...`);
  return null;
}

/**
 * Generates and saves audio for a card
 */
export async function generateAndSaveAudio(card: CardAudioData): Promise<AudioResponse> {
  // Generate audio with Polly
  const audioBuffer = await generateAudioWithPolly(card.english_word);

  // Upload to S3
  const s3Key = buildS3Key(card.id, card.english_word);
  await uploadAudioToS3(s3Key, audioBuffer);

  // Build public URL
  const audioUrl = buildAudioUrl(s3Key);
  console.log(`[Audio] File uploaded successfully: ${audioUrl}`);

  // Update database
  await updateCardAudioUrl(card.id, audioUrl);

  return {
    audioUrl,
    word: card.english_word,
    cached: false,
    message: "Audio generated and cached"
  };
}

