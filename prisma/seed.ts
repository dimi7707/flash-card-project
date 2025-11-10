import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const sampleCards = [
  {
    english_word: 'Hello',
    spanish_translation: 'Hola',
    note: 'Common greeting',
  },
  {
    english_word: 'Goodbye',
    spanish_translation: 'Adiós',
    note: 'Farewell greeting',
  },
  {
    english_word: 'Thank you',
    spanish_translation: 'Gracias',
    note: 'Expression of gratitude',
  },
  {
    english_word: 'Please',
    spanish_translation: 'Por favor',
    note: 'Polite request',
  },
  {
    english_word: 'Yes',
    spanish_translation: 'Sí',
    note: 'Affirmative response',
  },
  {
    english_word: 'No',
    spanish_translation: 'No',
    note: 'Negative response',
  },
  {
    english_word: 'Water',
    spanish_translation: 'Agua',
    note: 'Essential beverage',
  },
  {
    english_word: 'Food',
    spanish_translation: 'Comida',
    note: 'General term for nourishment',
  },
  {
    english_word: 'Friend',
    spanish_translation: 'Amigo',
    note: 'Male friend; Amiga for female',
  },
  {
    english_word: 'Family',
    spanish_translation: 'Familia',
    note: 'Relatives and close ones',
  },
  {
    english_word: 'House',
    spanish_translation: 'Casa',
    note: 'Place of residence',
  },
  {
    english_word: 'Book',
    spanish_translation: 'Libro',
    note: 'Reading material',
  },
  {
    english_word: 'School',
    spanish_translation: 'Escuela',
    note: 'Educational institution',
  },
  {
    english_word: 'Time',
    spanish_translation: 'Tiempo',
    note: 'Also means weather',
  },
  {
    english_word: 'Love',
    spanish_translation: 'Amor',
    note: 'Strong affection',
  },
  {
    english_word: 'Happy',
    spanish_translation: 'Feliz',
    note: 'Feeling of joy',
  },
  {
    english_word: 'Beautiful',
    spanish_translation: 'Hermoso',
    note: 'Hermosa for feminine',
  },
  {
    english_word: 'Good',
    spanish_translation: 'Bueno',
    note: 'Buena for feminine',
  },
  {
    english_word: 'Bad',
    spanish_translation: 'Malo',
    note: 'Mala for feminine',
  },
  {
    english_word: 'Big',
    spanish_translation: 'Grande',
    note: 'Size descriptor',
  },
];

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing cards
  await prisma.card.deleteMany();
  console.log('🗑️  Cleared existing cards');

  // Insert sample cards
  for (const card of sampleCards) {
    await prisma.card.create({
      data: card,
    });
  }

  console.log(`✅ Created ${sampleCards.length} sample flashcards`);
  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
