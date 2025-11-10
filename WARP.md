# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

Full-stack Next.js 14+ flashcard application for learning English vocabulary with GSAP animations and PostgreSQL database. Built with TypeScript, Prisma ORM, and Tailwind CSS.

## Development Commands

### Setup
```bash
npm install                    # Install dependencies
npx prisma generate            # Generate Prisma Client
npx prisma migrate dev         # Run database migrations
```

### Development
```bash
npm run dev                    # Start dev server at http://localhost:3000
npm run build                  # Build for production
npm run start                  # Start production server
npm run lint                   # Run ESLint
```

### Database
```bash
npm run prisma:generate        # Generate Prisma Client
npm run prisma:migrate         # Run migrations (prompts for name)
npx prisma migrate dev --name <migration_name>  # Run migration with specific name
npm run prisma:studio          # Open Prisma Studio GUI
npm run prisma:seed            # Seed database with initial data
```

### Docker
```bash
docker-compose up -d           # Start app + PostgreSQL
docker-compose logs -f         # View logs
docker-compose down            # Stop services
```

## Architecture

### Database Layer
- **Prisma ORM**: Single `Card` model with unique constraint on `english_word`
- **Singleton Pattern**: `lib/prisma.ts` exports a global Prisma client to prevent connection pool exhaustion in development
- **Database URL**: Required via `DATABASE_URL` environment variable (PostgreSQL)

### API Layer (Next.js App Router)
All API routes are in `app/api/cards/`:
- `route.ts`: GET all cards, POST new card
- `[id]/route.ts`: GET/PUT/DELETE single card by ID
- `random/route.ts`: GET 15 random cards for test mode

**Validation**: All POST/PUT endpoints validate string lengths via `lib/utils.ts` `validateLength()` function. Returns appropriate HTTP status codes (400 for validation errors, 409 for duplicates, 500 for server errors).

### Frontend Architecture

#### Pages (App Router)
- `app/page.tsx`: Home page with navigation to features
- `app/add-card/page.tsx`: Form to create new flashcards
- `app/learn/page.tsx`: Practice mode (navigate through all cards, immediate feedback)
- `app/test/page.tsx`: Test mode (15 random cards, 80% pass threshold)

#### Key Components
- **SmoothScroll** (`components/SmoothScroll.tsx`): Client-side Lenis wrapper for smooth scrolling (mounted once in `app/layout.tsx`)
- **AddCardForm**: Handles card creation with validation feedback
- **LearningMode**: Practice component with Previous/Next navigation and answer checking
- **TestMode**: Quiz component with progress tracking and no skipping
- **ResultsScreen**: Displays test results with pass/fail status

#### Animation System (`lib/animations.ts`)
All animations use GSAP. Key functions:
- `flipCard()`: 3D rotation for card transitions
- `successAnimation()`: Green pulse/glow on correct answers
- `errorAnimation()`: Red shake on incorrect answers
- `animateProgressBar()`: Smooth progress bar updates
- `celebrationAnimation()`: Scale pulse for passing tests
- `staggerIn()`: Staggered fade-in for list items

### Utility Layer (`lib/utils.ts`)
- `compareStrings()`: Case-insensitive, trimmed comparison for answer checking
- `validateLength()`: Input validation with max length checking
- `shuffleArray()`: Fisher-Yates shuffle for randomizing test cards
- `calculatePercentage()`: Score calculation

## Type System (`types/index.ts`)

All types are defined in a central location:
- `Card`: Database model shape
- `CreateCardInput`, `UpdateCardInput`: API request types
- `TestResult`, `TestSession`, `TestScore`: Test mode state types

## Validation Rules

- **English word**: Required, max 100 chars, unique
- **Spanish translation**: Required, max 100 chars
- **Note**: Optional, max 500 chars
- All inputs are trimmed before validation
- Answer checking is case-insensitive and trimmed

## Important Patterns

### Prisma Client Usage
Always import from `@/lib/prisma` to use the singleton instance:
```typescript
import prisma from '@/lib/prisma';
```

### Answer Validation
Use `compareStrings()` from `lib/utils.ts` for all answer checking to ensure consistent case-insensitive comparison.

### Animation Chaining
GSAP animations return timelines/tweens. Chain them for complex sequences or use `onComplete` callbacks.

### Error Handling
API routes catch Prisma errors specifically:
- `P2002` error code = unique constraint violation (duplicate card)
- All errors should return appropriate HTTP status codes and error messages

## Environment Variables

Required:
- `DATABASE_URL`: PostgreSQL connection string (format: `postgresql://user:password@host:port/database?schema=public`)

Optional:
- `NODE_ENV`: Set to `production` for production builds
