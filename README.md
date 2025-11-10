# English Vocabulary Flashcard Application

A comprehensive full-stack Next.js flashcard application for learning English vocabulary. Users can create custom flashcards, practice with them, and take randomized tests with beautiful animations and smooth transitions.

![Next.js](https://img.shields.io/badge/Next.js-14+-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue?style=flat-square&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-5+-2D3748?style=flat-square&logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16+-316192?style=flat-square&logo=postgresql)

## 🌟 Features

- **Add Custom Cards**: Create flashcards with English words, Spanish translations, and optional notes
- **Learn & Practice Mode**: Practice vocabulary at your own pace with immediate feedback
- **Test Mode**: Take randomized tests of 15 cards with a passing score of 12/15 (80%)
- **Beautiful Animations**: GSAP-powered card flips, success/error feedback, and smooth transitions
- **Smooth Scrolling**: Lenis integration for buttery-smooth page scrolling
- **Responsive Design**: Mobile-first design that works on all devices
- **Type-Safe**: Full TypeScript implementation with strict type checking

## 🛠️ Tech Stack

- **Frontend**: Next.js 14+ (App Router), React, TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL via Supabase
- **ORM**: Prisma
- **Animations**: GSAP, Lenis
- **Containerization**: Docker, Docker Compose
- **Package Manager**: npm

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- Node.js 18+ (Node 20 recommended for Docker)
- npm or yarn
- PostgreSQL database (or Supabase account)
- Docker & Docker Compose (optional, for containerized deployment)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd flash-cards-project
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and add your database connection string:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/flashcards?schema=public"
```

For Supabase, use the connection string from your project settings.

### 4. Setup Database

Initialize the database and run migrations:

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations to create tables
npx prisma migrate dev --name init

# (Optional) Open Prisma Studio to view your database
npx prisma studio
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🐳 Docker Deployment

### Using Docker Compose (Recommended for Local Development)

Run the entire stack (app + database) with Docker Compose:

```bash
# Build and start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

The application will be available at [http://localhost:3000](http://localhost:3000).

### Building Docker Image Only

```bash
# Build the image
docker build -t flashcard-app .

# Run the container
docker run -p 3000:3000 \
  -e DATABASE_URL="your-database-url" \
  flashcard-app
```

## 📁 Project Structure

```
flashcard-app/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   └── cards/                # Card endpoints
│   │       ├── route.ts          # GET all, POST new
│   │       ├── random/route.ts   # GET 15 random
│   │       └── [id]/route.ts     # GET, PUT, DELETE by ID
│   ├── (routes)/                 # Page routes
│   │   ├── page.tsx              # Home page
│   │   ├── add-card/page.tsx     # Add card page
│   │   ├── learn/page.tsx        # Practice page
│   │   └── test/page.tsx         # Test page
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Global styles
├── components/                   # React components
│   ├── ui/                       # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Textarea.tsx
│   │   ├── Card.tsx
│   │   └── ProgressBar.tsx
│   ├── Navigation.tsx            # Navigation bar
│   ├── SmoothScroll.tsx          # Lenis wrapper
│   ├── AddCardForm.tsx           # Add card form
│   ├── LearningMode.tsx          # Practice component
│   ├── TestMode.tsx              # Test component
│   └── ResultsScreen.tsx         # Test results
├── lib/                          # Utilities
│   ├── prisma.ts                 # Prisma client singleton
│   ├── animations.ts             # GSAP utilities
│   └── utils.ts                  # Helper functions
├── prisma/                       # Database
│   └── schema.prisma             # Database schema
├── types/                        # TypeScript types
│   └── index.ts                  # Type definitions
├── public/                       # Static assets
├── Dockerfile                    # Docker configuration
├── docker-compose.yml            # Docker Compose config
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
├── tailwind.config.ts            # Tailwind config
└── next.config.mjs               # Next.js config
```

## 🎯 API Endpoints

### Cards

- `GET /api/cards` - Fetch all cards
- `POST /api/cards` - Create a new card
  - Body: `{ english_word: string, spanish_translation: string, note?: string }`
- `GET /api/cards/random` - Fetch 15 random cards for testing
- `GET /api/cards/:id` - Fetch a single card by ID
- `PUT /api/cards/:id` - Update a card by ID
- `DELETE /api/cards/:id` - Delete a card by ID

## 🎨 Features in Detail

### 1. Add Card Feature
- Create flashcards with English word, Spanish translation, and optional notes
- Client-side and server-side validation
- Unique constraint on English words
- Success/error feedback with animations

### 2. Learn & Practice Mode
- Browse through all your flashcards
- Type the Spanish translation and get immediate feedback
- Visual feedback with GSAP animations (success glow, error shake)
- Navigation with Previous/Next buttons
- Progress tracking

### 3. Test Mode
- Randomized selection of 15 cards
- No skipping - must answer all questions
- Real-time progress tracking
- Pass/fail based on 80% threshold (12/15)
- Detailed results screen with performance breakdown
- Celebration animations for passing scores

### 4. Animations
- **Card Flips**: 3D rotation effects when transitioning between cards
- **Success Feedback**: Green pulse and glow effect
- **Error Feedback**: Red shake animation
- **Progress Bars**: Smooth width animations
- **Results Screen**: Staggered fade-in for list items
- **Smooth Scrolling**: Lenis for buttery-smooth page scrolling

## 🔒 Validation Rules

- **English Word**: Required, max 100 characters, must be unique
- **Spanish Translation**: Required, max 100 characters
- **Note**: Optional, max 500 characters
- All inputs are trimmed and sanitized

## 📱 Responsive Design

The application is fully responsive and tested at:
- Mobile: 375px
- Tablet: 768px
- Desktop: 1280px+

## 🧪 Database Schema

```prisma
model Card {
  id                    String   @id @default(cuid())
  english_word          String   @unique @db.VarChar(100)
  spanish_translation   String   @db.VarChar(100)
  note                  String?  @db.VarChar(500)
  created_at            DateTime @default(now())
  updated_at            DateTime @updatedAt

  @@map("cards")
}
```

## 🛠️ Development Scripts

```bash
# Development
npm run dev              # Start development server

# Build
npm run build            # Build for production
npm run start            # Start production server

# Database
npm run prisma:generate  # Generate Prisma Client
npm run prisma:migrate   # Run database migrations
npm run prisma:studio    # Open Prisma Studio

# Linting
npm run lint             # Run ESLint
```

## 🔧 Environment Variables

Required environment variables:

```env
# Database connection (required)
DATABASE_URL="postgresql://user:password@host:port/database?schema=public"

# Optional: If using Supabase directly
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## 🚢 Production Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Docker

```bash
# Build production image
docker build -t flashcard-app .

# Run in production
docker run -p 3000:3000 \
  -e DATABASE_URL="your-production-db-url" \
  -e NODE_ENV=production \
  flashcard-app
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Animations by [GSAP](https://greensock.com/gsap/)
- Smooth scrolling by [Lenis](https://lenis.studiofreight.com/)
- Database by [Prisma](https://www.prisma.io/) + [PostgreSQL](https://www.postgresql.org/)

## 📧 Support

For support, please open an issue in the GitHub repository.

---

**Happy Learning! 📚✨**
