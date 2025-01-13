# Japanese Learning App

A modern Japanese language learning application built with Next.js 14, focusing on kanji flashcards with spaced repetition.

## Features
- Interactive kanji flashcards with smooth 3D flip animations
- Dark theme modern UI
- Onyomi and kunyomi readings display
- Review difficulty rating system
- Spaced repetition system for efficient learning
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

### Installation
```bash
# Clone the repository
git clone https://github.com/christopherdunkley/japanese-learning-app
cd japanese-learning-app

# Install dependencies
npm install

# Set up database
npx prisma generate
npx prisma db push

# Seed initial data
npm run seed
```

### Environment Setup
1. Create `.env` file in root:
```
DATABASE_URL="file:./dev.db"
```

2. Create `.vscode/settings.json`:
```json
{
  "files.associations": {
    "*.css": "tailwindcss"
  }
}
```

### Running the Application
```bash
npm run dev
```

Visit http://localhost:3000/study to see the flashcard interface.

### Troubleshooting
1. If CSS animations aren't working:
   - Ensure all required CSS utility classes are in globals.css
   - Check browser console for any CSS-related errors
   - Try a hard refresh (Ctrl+F5) if styles aren't updating

2. If database isn't working:
   - Check .env file exists w/ correct DATABASE_URL
   - Try removing dev.db and running prisma db push again
   - ensure seed data is loaded w/ npm run seed

3. If page isn't loading:
   - Ensure you're visiting /study route, not just /
   - Check console for any TypeScript/React errors
   - Verify all components are properly exported/imported

## Project Structure
```
japanese-learning-app/
├── app/
│   ├── lib/             # Utility functions and database client
│   ├── components/      # React components including flashcards
│   ├── services/        # Business logic and data services
│   └── study/          # Study interface pages
├── prisma/              # Database schema and migrations
├── public/             # Static assets
└── README.md          # This file
```

## Contributing
```
This project is for demonstration purposes.
```