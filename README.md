# Japanese Learning App

A modern Japanese language learning application built with Next.js 14, focusing on kanji flashcards with spaced repetition.

## Features
- Kanji flashcards with onyomi and kunyomi readings
- Spaced repetition system for efficient learning
- Modern, responsive UI
- TypeScript for type safety
- Prisma ORM for database management

## Tech Stack
- Next.js 14 (App Router)
- TypeScript
- Prisma
- Tailwind CSS
- SQLite (development)

## Getting Started

### Prerequisites
- Node.js 20+
- npm
- VSCode (recommended)

### VSCode Setup
1. Install recommended extensions:
   - Tailwind CSS IntelliSense
   - Prisma
   - ESLint
   - TypeScript Support

2. Add VSCode settings for Tailwind:
```json
// .vscode/settings.json
{
  "files.associations": {
    "*.css": "tailwindcss"
  }
}
```

### Installation Steps

1. Clone and install dependencies:
```bash
# Clone the repo
git clone [your-repo-url]
cd japanese-learning-app

# Install dependencies
npm install
```

2. Set up environment:
```bash
# Create .env file
DATABASE_URL="file:./dev.db"
```

3. Set up database:
```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed initial data
npm run seed
```

4. Start dev server:
```bash
npm run dev
```

Visit http://localhost:3000 to see the app.

### Database Management
- View database: `npx prisma studio`
- Reset database: `npm run seed`
- Database URL: File-based SQLite at `./dev.db`

### Troubleshooting
1. If Tailwind isn't working:
   - Verify VSCode settings
   - Restart VSCode after configuration
   
2. If database seeding fails:
   - Check .env file exists
   - Delete dev.db and retry prisma db push
   - Ensure you're in the right directory

## Project Structure
```
japanese-learning-app/
├── app/                  # Next.js 14 app directory
│   ├── lib/             # Utility functions and database client
│   └── services/        # Business logic and data services
├── prisma/              # Database schema and migrations
│   ├── schema.prisma    # Database schema
│   └── seed.ts         # Seed data script
└── README.md           # This file
```

## Contributing
This project is for demonstration purposes.