# Quick Start Guide

Get the flashcard app running in 5 minutes!

## Option 1: Automated Setup (Recommended)

```bash
# Run the setup script
./setup.sh

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and you're ready to go!

## Option 2: Manual Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Database

Create a `.env` file:

```bash
cp .env.example .env
```

Edit `.env` and add your PostgreSQL connection string:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/flashcards?schema=public"
```

**Quick Database Options:**

- **Supabase** (Free): Get a connection string at [supabase.com](https://supabase.com)
- **Local PostgreSQL**: Install PostgreSQL locally
- **Docker**: Use the provided docker-compose.yml (see below)

### 3. Setup Database

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init
```

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Option 3: Docker (Everything Included)

The easiest way to run everything with zero configuration:

```bash
# Start app + database
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop everything
docker-compose down
```

The app runs on [http://localhost:3000](http://localhost:3000)

## Next Steps

1. **Create Your First Card**: Click "Add Card" and create a flashcard
2. **Practice**: Go to "Learn" to practice your vocabulary
3. **Take a Test**: Try the "Test" mode with 15 random cards

## Troubleshooting

### Database Connection Error

Make sure your `DATABASE_URL` in `.env` is correct. For Supabase:

1. Go to your project settings
2. Copy the "Connection string" from Database settings
3. Replace the password placeholder with your actual password

### Port Already in Use

If port 3000 is in use, you can change it:

```bash
PORT=3001 npm run dev
```

### Prisma Errors

If you see Prisma errors, try:

```bash
npx prisma generate
npx prisma migrate reset
```

## Features at a Glance

- ✅ Add custom English-Spanish flashcards
- ✅ Practice mode with immediate feedback
- ✅ Test mode with 15 random cards
- ✅ Beautiful GSAP animations
- ✅ Smooth scrolling with Lenis
- ✅ Fully responsive design
- ✅ TypeScript for type safety

## Development Commands

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run linting
npx prisma studio    # Open database GUI
```

## Need Help?

See the full [README.md](README.md) for detailed documentation.

---

**Happy Learning! 🎓**
