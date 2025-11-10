#!/bin/bash

# Flashcard App Setup Script
# This script helps you set up the flashcard application quickly

echo "🚀 Setting up Flashcard Application..."
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
    echo "⚠️  Please update .env with your database connection string!"
    echo ""
else
    echo "✅ .env file already exists"
    echo ""
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install
echo ""

# Generate Prisma Client
echo "🔧 Generating Prisma Client..."
npx prisma generate
echo ""

# Ask about database migration
read -p "Do you want to run database migrations now? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]
then
    echo "🗄️  Running database migrations..."
    npx prisma migrate dev --name init
    echo ""
fi

echo "✨ Setup complete!"
echo ""
echo "To start the development server, run:"
echo "  npm run dev"
echo ""
echo "Then open http://localhost:3000 in your browser."
echo ""
echo "For Docker deployment, run:"
echo "  docker-compose up -d"
echo ""
