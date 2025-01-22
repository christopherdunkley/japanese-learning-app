# Japanese Learning App

A modern Japanese learning application built with Next.js 14, featuring interactive kanji flashcards and spaced repetition.

## Features
- Interactive kanji flashcards w/ smooth 3D flip animations
- Shows both onyomi (音読み) and kunyomi (訓読み) readings
- Spaced repetition system (SRS) for efficient learning
- Progress tracking w/ visual indicators
- Session statistics and learning analytics
- End-of-session performance summary
- Dark theme modern UI
- Built with TypeScript for type safety
- Comprehensive session statistics including:
  - Cards reviewed per session
  - Review quality tracking (Again/Hard/Good/Easy)
  - Current and best streaks
  - Session completion summaries

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

# Populate database with kanji cards
npm run seed

# Start the development server
npm run dev
```

Visit http://localhost:3000/study to see the application.

### Managing Flashcards

#### Viewing and Managing Data
You can manage the database using Prisma Studio:
```bash
npx prisma studio
```
This opens a GUI at http://localhost:5555 where you can:
- View all flashcards
- Delete reviews to reset learning progress
- Add new flashcards manually
- Modify existing data

#### Adding More Flashcards
1. Navigate to `prisma/seed.ts`
2. Add new kanji to the `kanji` array, following this format:
```typescript
{
  character: '日',
  onyomi: 'ニチ、ジツ',
  kunyomi: 'ひ、-び、-か',
  meaning: 'day, sun',
  type: CardType.KANJI,
}
```
3. Run `npm run seed` to reset the database with the new cards

CAUTION: Running `npm run seed` will clear all existing review data and recreate the flashcard deck.

### Study Interface
- Click cards to flip between kanji / readings
- Rate your recall: Again, Hard, Good or Easy
- Progress bar shows completion of current session
- View statistics after completing all due reviews
- Start a new session anytime
- End of session statistics show:
  - Total cards reviewed
  - Review quality distribution
  - Learning streaks
  - Overall progress

### Statistics Tracking
The app tracks various metrics to help monitor your learning:
- **Cards Learned**: Number of unique cards reviewed in current session
- **Review Quality**: Distribution of Again/Hard/Good/Easy ratings
- **Best Streak**: Highest consecutive Good/Easy ratings
- **Current Streak**: Recent consecutive Good/Easy ratings

Review data persists between sessions, allowing you to track your progress over time.

## Project Structure
```
japanese-learning-app/
├── app/
│   ├── api/              # API routes
│   ├── components/       # React components
│   │   ├── flashcards/   # Flashcard components
│   │   └── study/       # Study interface
│   └── study/           # Study page
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── seed.ts         # Seed data for flashcards
└── README.md
```

## Contributing
This project is for demonstration purposes.