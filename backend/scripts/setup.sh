#!/bin/bash

# NEAT Schedule Backend Setup Script

set -e

echo "🚀 Setting up NEAT Schedule Backend..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL is not installed. Please install PostgreSQL 13+ first."
    echo "   You can use Docker to run PostgreSQL:"
    echo "   docker run --name postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres:15"
    exit 1
fi

echo "✅ PostgreSQL is available"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Copy environment file
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp env.example .env
    echo "⚠️  Please edit .env file with your database credentials and other settings"
else
    echo "✅ .env file already exists"
fi

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npm run db:generate

# Check if database is accessible
echo "🔍 Checking database connection..."
if npm run db:push --dry-run &> /dev/null; then
    echo "✅ Database connection successful"
    
    # Run migrations
    echo "🗄️  Running database migrations..."
    npm run db:push
    
    # Seed database
    echo "🌱 Seeding database..."
    npm run db:seed
    
    echo "✅ Database setup completed"
else
    echo "⚠️  Database connection failed. Please check your DATABASE_URL in .env file"
    echo "   You can start the database later and run:"
    echo "   npm run db:push"
    echo "   npm run db:seed"
fi

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p logs
mkdir -p uploads

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "Next steps:"
echo "1. Edit .env file with your configuration"
echo "2. Start the development server: npm run dev"
echo "3. Visit http://localhost:3001/health to check if the server is running"
echo ""
echo "Default admin credentials (after seeding):"
echo "Email: admin@neatschedule.com"
echo "Password: admin123"
echo ""
echo "Happy coding! 🚀"
