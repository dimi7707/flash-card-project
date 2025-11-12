import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const sampleCards = [
  {
    english_word: 'Hello',
    spanish_translations: ['Hola'],
    note: 'Common greeting',
  },
  {
    english_word: 'Goodbye',
    spanish_translations: ['Adiós', 'Chao'],
    note: 'Farewell greeting - multiple ways to say it',
  },
  {
    english_word: 'Thank you',
    spanish_translations: ['Gracias'],
    note: 'Expression of gratitude',
  },
  {
    english_word: 'Please',
    spanish_translations: ['Por favor'],
    note: 'Polite request',
  },
  {
    english_word: 'Yes',
    spanish_translations: ['Sí'],
    note: 'Affirmative response',
  },
  {
    english_word: 'No',
    spanish_translations: ['No'],
    note: 'Negative response',
  },
  {
    english_word: 'Water',
    spanish_translations: ['Agua'],
    note: 'Essential beverage',
  },
  {
    english_word: 'Food',
    spanish_translations: ['Comida', 'Alimento'],
    note: 'General term for nourishment',
  },
  {
    english_word: 'Friend',
    spanish_translations: ['Amigo', 'Amiga'],
    note: 'Amigo for male, Amiga for female',
  },
  {
    english_word: 'Family',
    spanish_translations: ['Familia'],
    note: 'Relatives and close ones',
  },
  {
    english_word: 'House',
    spanish_translations: ['Casa', 'Hogar'],
    note: 'Casa is physical structure, Hogar is home',
  },
  {
    english_word: 'Book',
    spanish_translations: ['Libro'],
    note: 'Reading material',
  },
  {
    english_word: 'School',
    spanish_translations: ['Escuela', 'Colegio'],
    note: 'Educational institution - Escuela is general, Colegio is primary/secondary',
  },
  {
    english_word: 'Time',
    spanish_translations: ['Tiempo', 'Hora'],
    note: 'Tiempo is general time or weather, Hora is hour/time of day',
  },
  {
    english_word: 'Love',
    spanish_translations: ['Amor', 'Cariño'],
    note: 'Amor is strong love, Cariño is affection/care',
  },
  {
    english_word: 'Happy',
    spanish_translations: ['Feliz', 'Contento', 'Alegre'],
    note: 'Different degrees of happiness',
  },
  {
    english_word: 'Beautiful',
    spanish_translations: ['Hermoso', 'Hermosa', 'Bello', 'Bella'],
    note: 'Hermoso/Bello for masculine, Hermosa/Bella for feminine',
  },
  {
    english_word: 'Good',
    spanish_translations: ['Bueno', 'Buena'],
    note: 'Bueno for masculine, Buena for feminine',
  },
  {
    english_word: 'Bad',
    spanish_translations: ['Malo', 'Mala'],
    note: 'Malo for masculine, Mala for feminine',
  },
  {
    english_word: 'Big',
    spanish_translations: ['Grande', 'Gran'],
    note: 'Grande is regular, Gran is shortened form used before nouns',
  },
  {
    english_word: 'Sprinkle',
    spanish_translations: ['Esparcir', 'Rociar', 'Salpicar'],
    note: 'Multiple ways to express the action of sprinkling',
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

  console.log(`✅ Created ${sampleCards.length} sample flashcards with multiple translations`);
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
