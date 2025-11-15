# Claude Development Guide - English Vocabulary Flashcard Application

## Project Overview

A comprehensive full-stack Next.js 14+ flashcard application for learning English vocabulary. Users can create custom flashcards with multiple Spanish translations, practice with them in learning mode, and take randomized tests with 15 cards (passing score: 12/15 = 80%).

Key features include:
- Custom flashcard creation with multiple translations per English word
- Two practice modes: Learning (self-paced) and Test (randomized 15-card tests)
- Beautiful GSAP animations for card flips, success/error feedback
- Smooth scrolling with Lenis
- Full TypeScript type safety
- PostgreSQL database with Prisma ORM

## Tech Stack

- **Frontend Framework**: Next.js 14+ with App Router (React 18)
- **Language**: TypeScript 5+ with strict type checking
- **Styling**: Tailwind CSS 3.4+
- **Database**: PostgreSQL 16+ via Supabase
- **ORM**: Prisma 5.14+
- **Animations**: GSAP 3.12+ and Lenis 1.3+
- **Icons**: Lucide React
- **Package Manager**: npm
- **Containerization**: Docker & Docker Compose
- **Deployment**: Docker, Vercel-ready (standalone output)

## Project Structure

```
flashcard-app/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   └── cards/
│   │       ├── route.ts          # GET all cards, POST new card
│   │       ├── random/route.ts   # GET 15 random cards for testing
│   │       └── [id]/route.ts     # GET, PUT, DELETE specific card
│   ├── (routes)/                 # Page routes
│   │   ├── page.tsx              # Home/landing page
│   │   ├── add-card/page.tsx     # Add card form page
│   │   ├── learn/page.tsx        # Learning/practice page
│   │   └── test/page.tsx         # Test mode page
│   ├── layout.tsx                # Root layout with Navigation & SmoothScroll
│   ├── globals.css               # Global styles
│   └── api/                      # Server-side API routes
│
├── components/                   # React client components
│   ├── ui/                       # Reusable UI components
│   │   ├── Button.tsx            # Button with variants (primary/secondary)
│   │   ├── Input.tsx             # Text input with validation feedback
│   │   ├── Textarea.tsx          # Textarea with character counter
│   │   ├── Card.tsx              # Card layout component
│   │   └── ProgressBar.tsx       # Animated progress bar
│   ├── Navigation.tsx            # Sticky nav with responsive design
│   ├── SmoothScroll.tsx          # Lenis wrapper component
│   ├── AddCardForm.tsx           # Card creation form with multiple translations
│   ├── TranslationList.tsx       # Dynamic translation input list
│   ├── LearningMode.tsx          # Practice component (self-paced)
│   ├── TestMode.tsx              # Test component (randomized 15 cards)
│   └── ResultsScreen.tsx         # Test results with score breakdown
│
├── lib/                          # Utility functions
│   ├── prisma.ts                 # Prisma client singleton (handles build-time isolation)
│   ├── animations.ts             # GSAP animation utilities (flip, success, error, etc.)
│   └── utils.ts                  # Helper functions (normalization, validation, array shuffle)
│
├── hooks/                        # Custom React hooks
│   └── useCardForm.ts            # Hook for handling card form submissions
│
├── types/                        # TypeScript type definitions
│   └── index.ts                  # Card, TestResult, ValidationResult, TestSession types
│
├── prisma/                       # Database configuration
│   └── schema.prisma             # Prisma schema with Card model
│
├── public/                       # Static assets
├── Dockerfile                    # Multi-stage production Docker build
├── docker-compose.yml            # Docker Compose for local dev (app + postgres)
├── next.config.ts                # Next.js config (standalone output, no static generation)
├── tsconfig.json                 # TypeScript compiler options
├── tailwind.config.ts            # Tailwind CSS with custom colors/animations
├── postcss.config.mjs            # PostCSS for Tailwind
├── package.json                  # Dependencies and scripts
├── package-lock.json             # Locked dependencies
├── .env                          # Environment variables (DATABASE_URL)
├── .env.example                  # Example env template
├── .gitignore                    # Git ignore rules
├── .dockerignore                 # Docker build ignore rules
└── README.md                     # User-facing project documentation
```

## Database Schema

### Card Model
```prisma
model Card {
  id                    String   @id @default(cuid())              # Unique ID using CUID
  english_word          String   @unique @db.VarChar(100)         # English word (unique, capitalized)
  spanish_translations  Json     // JSONB array of translation strings
  note                  String?  @db.VarChar(500)                 # Optional notes about the card
  created_at            DateTime @default(now())                  # Creation timestamp
  updated_at            DateTime @updatedAt                       # Last update timestamp

  @@map("cards")  # Table name in database
}
```

**Key Features:**
- CUID for distributed-friendly unique IDs
- JSONB storage for flexible multiple translations
- Unique constraint on English words (case-sensitive)
- Automatic timestamps for audit trail
- Max constraints: 100 chars for word, 500 for note, 10 translations per card

## Type Definitions

### Core Types (types/index.ts)

```typescript
// Card interface
interface Card {
  id: string;
  english_word: string;
  spanish_translations: string[];
  note: string | null;
  created_at: Date;
  updated_at: Date;
}

// Input validation types
interface CreateCardInput {
  english_word: string;
  spanish_translations: string[];
  note?: string;
}

// Validation result for multiple translations
interface ValidationResult {
  isValid: boolean;                // At least 1 correct translation
  correctCount: number;            // Count of correct translations provided
  totalProvided: number;           // Total translations user provided
  totalAvailable: number;          // Total valid translations in database
  userAnswers: string[];           // User's normalized answers
  correctAnswers: string[];        // Which user answers were correct
  missedAnswers: string[];         // Valid translations user didn't provide
  status: 'all' | 'partial' | 'none'; // 'all' = 100%, 'partial' = some correct, 'none' = 0%
}

// Test session tracking
interface TestSession {
  cards: Card[];
  currentIndex: number;
  results: TestResult[];
  isComplete: boolean;
}

// Test scoring
interface TestScore {
  total: number;                   // Total questions (15)
  correct: number;                 // Questions with at least 1 correct answer
  incorrect: number;               // Questions with no correct answers
  percentage: number;              // Percentage score
  passed: boolean;                 // true if >= 80% (12/15)
}
```

## API Endpoints

### Cards API

**GET /api/cards** - Fetch all cards
- Returns: Array of Card objects
- Order: newest first (created_at DESC)
- Dynamic: true (force-dynamic)

**POST /api/cards** - Create new card
- Body: `{ english_word: string, spanish_translations: string[], note?: string }`
- Returns: Created Card object
- Status: 201 Created | 400 Bad Request | 409 Conflict (duplicate)
- Validation:
  - English word: required, max 100 chars, unique
  - Translations: array required, 1-10 items, each max 100 chars
  - Note: optional, max 500 chars

**GET /api/cards/random** - Get 15 random cards for test
- Returns: Array of 15 (or fewer if not enough cards exist) random Card objects
- Shuffling: Simple randomization (Math.random())
- Dynamic: true (force-dynamic)

**GET /api/cards/:id** - Get single card
- Returns: Card object or 404
- Dynamic: true

**PUT /api/cards/:id** - Update card
- Body: Partial Card update
- Returns: Updated Card object

**DELETE /api/cards/:id** - Delete card
- Returns: Confirmation or 404
- Status: 200 OK | 404 Not Found

## Key Architectural Patterns

### 1. Client/Server Separation
- **Client Components** (`'use client'`): Navigation, forms, learning/test modes (interactive)
- **Server Components**: Layout, pages (minimal client JS)
- **API Routes**: All database operations via Next.js API routes

### 2. Prisma Client Singleton Pattern
- `lib/prisma.ts` implements singleton to prevent multiple Prisma instances
- Handles build-time isolation (prevents DB connection during builds on Vercel)
- Configurable logging based on environment (production vs development)

### 3. Type-Safe Forms
- Form state managed with React hooks
- Client-side validation with clear error messages
- Server-side validation on API routes (defense in depth)
- Validation helpers in `lib/utils.ts`

### 4. Animation System
- GSAP utilities in `lib/animations.ts`
- Reusable animation functions (flip, success, error, progress, etc.)
- Tailwind CSS animations for basic effects (fade-in, slide-up, shake)
- Timeline-based complex animations for multiple elements

### 5. String Normalization
- All English words capitalized before storage (for consistent comparison)
- Spanish translations normalized for comparison:
  - Trimmed, lowercased
  - Accent marks removed (NFD Unicode normalization)
- Case-insensitive user input validation

### 6. Dynamic Routes
- All API routes set to `dynamic = 'force-dynamic'` to prevent static generation
- Required for database dependency and real-time data

## Configuration Files

### Next.js Configuration (next.config.ts)
```typescript
- reactStrictMode: true           // Strict React development checks
- output: 'standalone'             // Self-contained build for Docker
- typescript: ignoreBuildErrors: false  // Enforce type safety
- staticPageGenerationTimeout: 0   // No timeout for dynamic routes
- isrMemoryCacheSize: 0           // Disable ISR memory to avoid build issues
```

### TypeScript Configuration (tsconfig.json)
- **Mode**: Strict type checking enabled
- **Paths**: `@/*` alias resolves to project root
- **Target**: ES2020 with esnext modules
- **Bundler mode**: For Next.js compatibility

### Tailwind Configuration (tailwind.config.ts)
- **Colors**: Custom primary (indigo) and warning (amber) palettes
- **Animations**: fade-in, slide-up, shake keyframes
- **Content**: Scans app/, components/, pages/ for class usage

### Prisma Configuration (prisma/schema.prisma)
- **Provider**: PostgreSQL
- **Client**: Generated JavaScript client
- **URL**: Read from DATABASE_URL env variable

## Development Workflows

### Common Development Tasks

**Start Development Server**
```bash
npm run dev
```
- Runs Next.js dev server (port 3000)
- Hot reload enabled
- Requires DATABASE_URL in .env

**Database Setup**
```bash
npx prisma generate        # Generate Prisma Client
npx prisma migrate dev     # Run migrations
npx prisma studio         # Open Prisma Studio UI
```
Or use npm scripts:
```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:studio
```

**Docker Development**
```bash
docker-compose up -d       # Start app + database
docker-compose logs -f     # View logs
docker-compose down        # Stop services
```

**Build for Production**
```bash
npm run build             # Build app (runs prisma generate first)
npm run start             # Start production server
```

**Linting**
```bash
npm lint                  # Run ESLint
```

### Development Conventions

1. **Component Organization**
   - Keep components focused on single responsibility
   - UI components in `components/ui/` directory
   - Feature components in `components/` root
   - Use `'use client'` directive at top of interactive components

2. **API Route Pattern**
   - Wrap all endpoints with try/catch error handling
   - Validate all inputs (server-side, not just client)
   - Use appropriate HTTP status codes (400, 409, 404, 500)
   - Return consistent JSON response format

3. **Type Safety**
   - Define types in `types/index.ts`
   - Use interfaces for objects, never use `any`
   - Import shared types across client and server code
   - Validate API responses match expected types

4. **Animation Usage**
   - Use GSAP for complex, interactive animations
   - Use Tailwind keyframes for simple, CSS-based animations
   - Cache element refs to avoid re-selecting DOM
   - Clean up timelines to prevent memory leaks

5. **Form Handling**
   - Validate client-side for UX (immediate feedback)
   - Always validate server-side for security
   - Clear validation errors when user starts typing
   - Show loading states during submission

6. **Error Handling**
   - Return user-friendly error messages
   - Log errors server-side for debugging
   - Handle specific error codes (like Prisma P2002 for unique constraint)
   - Auto-clear error messages after 5 seconds

## Environment Variables

**Required**
```env
DATABASE_URL="postgresql://user:password@host:5432/db?schema=public"
```

**Optional** (if using Supabase authentication in future)
```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

**Docker Compose Default**
```env
DATABASE_URL="postgresql://flashcard_user:flashcard_password@db:5432/flashcards?schema=public"
```

## Testing & Validation

### Input Validation Rules

**English Word**
- Required field
- Max 100 characters
- Must be unique (case-sensitive after capitalization)
- Trimmed before storage

**Spanish Translations**
- Array of 1-10 translations
- Each translation: required, max 100 characters
- Trimmed before storage
- Empty strings filtered out

**Note**
- Optional field
- Max 500 characters if provided
- Trimmed before storage

**Test Scoring**
- Must answer 15 cards (no skipping)
- Pass score: 12/15 (80%)
- User can provide multiple comma-separated answers
- At least 1 correct translation = question is correct
- Partial credit shown but not counted toward pass

### Validation Utilities (lib/utils.ts)

Key functions:
- `normalizeString()`: Trim, lowercase, remove accents
- `compareStrings()`: Case-insensitive comparison
- `validateLength()`: Check required and max length
- `validateMultipleTranslations()`: Score user answers against valid translations
- `shuffleArray()`: Fisher-Yates shuffle algorithm
- `calculatePercentage()`: Safe division for scores

## Build & Deployment

### Docker Build Process (Multi-stage)

1. **Base Stage**: Node 20 Alpine
2. **Dependencies Stage**: Install npm packages
3. **Builder Stage**: Generate Prisma client, run Next.js build
4. **Production Stage**: Minimal image with only necessary files
   - Prisma schema and generated client copied
   - Node user created (non-root)
   - Standalone output only
   - Port 3000 exposed

### Production Deployment Options

**Vercel (Recommended)**
1. Push to GitHub
2. Import in Vercel dashboard
3. Add DATABASE_URL environment variable
4. Deploy (automatic)

**Docker Deployment**
```bash
docker build -t flashcard-app .
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://..." \
  -e NODE_ENV=production \
  flashcard-app
```

**Docker Compose (Local)**
```bash
docker-compose up -d
```
- Auto-creates PostgreSQL database
- Health checks ensure database is ready
- App depends on database being healthy

## Important Implementation Notes

### Multiple Translations Feature
- Each card stores multiple Spanish translations as JSON array
- Users can provide comma-separated answers during learning/test
- Validation checks if ANY answer matches ANY valid translation
- Provides feedback on correct/missed/extra answers
- Visual feedback: green (all correct), amber (partial), red (none correct)

### Build-Time Database Isolation
- Prisma client configured to avoid DB connection during builds
- Important for serverless/Vercel deployments
- Environment check: `process.env.VERCEL_ENV`
- Production builds use standalone output mode

### String Normalization Strategy
- Consistent capitalization: first char uppercase, rest lowercase
- Case-insensitive, accent-insensitive comparison
- "HELLO" and "hello" and "hóllo" all treated as equivalent
- Improves user experience for Spanish accents

### Animation Framework
- GSAP for timeline and advanced animations
- Tailwind CSS for simple state transitions
- Smooth Scroll (Lenis) for page scrolling
- Staggered animations for list items (results screen)

## Code Quality Standards

- **Type Safety**: No `any` types, strict mode enabled
- **Error Handling**: Try/catch on all async operations
- **Validation**: Client + server validation always
- **Naming**: Clear, descriptive names (no abbreviations except common ones)
- **Components**: Max 300-400 lines per component
- **Functions**: Single responsibility principle
- **Comments**: Complex logic documented, obvious code self-documenting

## Common Tasks & Solutions

### Adding a New Feature
1. Define types in `types/index.ts`
2. Create/update API route in `app/api/`
3. Create component in `components/` with `'use client'`
4. Add page in `app/(routes)/` if needed
5. Update `Navigation.tsx` if needed
6. Test validation (client + server)

### Handling Form Submission
1. Validate client-side (validateForm function)
2. Call API endpoint via fetch
3. Handle response status codes (409 for duplicate, 400 for validation, 500 for errors)
4. Show success/error message
5. Auto-clear message after 5 seconds
6. Reset form state on success

### Debugging Database Issues
1. Check DATABASE_URL in .env
2. Run `npx prisma studio` to inspect data
3. Check Prisma logs in console (when not production)
4. Review migration files in `prisma/migrations/`
5. Use `npx prisma db pull` to sync schema with database

### Adding Animation to Component
1. Import animation function from `lib/animations.ts`
2. Get element ref using `useRef()`
3. Call animation function in useEffect when element appears
4. Clean up timeline if needed
5. Test on multiple devices (animations can be performance-heavy)

## Useful Resources

- [Next.js 14 Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Tailwind CSS](https://tailwindcss.com/)
- [GSAP Documentation](https://greensock.com/gsap/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Hooks](https://react.dev/reference/react/hooks)

## Recent Changes & Notes

- **Build Script**: Updated to run `prisma generate` before `next build`
- **TypeScript Config**: Enforces strict type checking across project
- **Database Isolation**: Prisma client configured to prevent connections during build time
- **Standalone Output**: Next.js configured for containerization with standalone output
- **Dynamic Routes**: All API routes marked as `force-dynamic` to prevent static generation

---

**Last Updated**: November 15, 2025
**Version**: 0.1.0
