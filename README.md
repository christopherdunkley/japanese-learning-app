# Japanese Learning App

A modern Japanese language learning application built with Next.js 14, featuring flashcards with spaced repetition.

## Features
- Interactive kanji flashcards with smooth 3D flip animations
- Shows both onyomi (音読み) and kunyomi (訓読み) readings
- Spaced repetition system for efficient learning
- Dark theme modern UI
- Built with TypeScript for type safety

## Tech Stack
- Next.js 14 with App Router
- TypeScript
- Prisma ORM
- Tailwind CSS
- SQLite

## Getting Started

### Prerequisites
- Node.js 20+ installed
- npm

### Installation & Setup
```bash
# Clone the repository
git clone https://github.com/christopherdunkley/japanese-learning-app.git
cd japanese-learning-app

# Install dependencies
npm install

# Set up the database
npx prisma generate
npx prisma db push

# Start the development server
npm run dev
```

Visit http://localhost:3000/study to see the application.

### Database Management
You can manage the database using Prisma Studio:
```bash
npx prisma studio
```

This opens a GUI at http://localhost:5555 where you can:
- View all flashcards
- Delete reviews to reset spaced repetition progress
- Add new flashcards
- Modify existing data

### Managing Reviews
To reset your learning progress:
1. Open Prisma Studio (`npx prisma studio`)
2. Click on the "Review" table
3. Select all reviews
4. Click "Delete records" to start fresh

## Project Structure
```
japanese-learning-app/
├── app/
│   ├── api/              # API routes
│   ├── components/       # React components
│   │   ├── flashcards/   # Flashcard components
│   │   └── study/       # Study interface
│   └── study/           # Study page
├── prisma/              # Database schema
└── README.md
```

## Contributing
This project is for demonstration purposes.