# Japanese Learning App

A modern Japanese learning application built with Next.js 14, featuring interactive kanji flashcards and spaced repetition.

## Features
- Separate Learn and Review modes for optimal study progression:
  - Learn Mode introduces 3 new kanji per session
  - Review Mode uses spaced repetition for previously learned cards
- Interactive kanji flashcards w/ smooth 3D flip animations
- Shows both onyomi (音読み) and kunyomi (訓読み) readings
- Advanced spaced repetition system (SRS) for efficient learning
- Progress tracking w/ visual indicators and forecast charts
- Interactive session graphs w/ canvas/SVG hybrid visualization
- 7-day review forecast showing upcoming study load
- Recent sessions overview w/ performance visualization
- Session statistics and learning analytics
- End-of-session performance summary
- Dark theme modern UI w/ custom animations
- Built with TypeScript for type safety
- Comprehensive session statistics including:
  - Cards reviewed per session
  - Review quality tracking (Again/Hard/Good/Easy)
  - Current and best Good/Easy streaks
  - Total cards encountered vs reviews completed
  - Session completion summaries

## Tech Stack
- Next.js 14 with App Router
- TypeScript
- Prisma ORM
- Tailwind CSS
- SQLite
- Hybrid Canvas/SVG for performance visualizations

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

Visit http://localhost:3000/ to see the application.

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
- Two distinct study modes:
  - Learn Mode for new cards (3 per session)
  - Review Mode for practicing known cards
- Click cards or press spacebar to flip between kanji / readings
- Rate your recall using keyboard shortcuts or buttons:
  - 1 or click "Again" - Don't remember at all (review in 1 hour)
  - 2 or click "Hard" - Remembered with difficulty (current interval × 1.2)
  - 3 or click "Good" - Remembered well (current interval × 2.0)
  - 4 or click "Easy" - Remembered easily (current interval × 3.0)
- Initial intervals for new cards:
  - Again: 1 hour
  - Hard: 1 day
  - Good: 3 days
  - Easy: 7 days
- Each subsequent review multiplies the previous interval:
  - Example: A card reviewed as "Good" after 3 days will next appear in 6 days
  - A small random factor (±5%) is applied to prevent cards from clumping together
- Progress bar shows completion of current session
- View statistics after completing all due reviews
- Start a new session anytime
- End of session statistics show:
  - Total cards reviewed
  - Review quality distribution
  - Learning streaks
  - Overall progress

### Statistics and Analytics
The app tracks various metrics with interactive visualizations:
- Dashboard Overview:
  - 7-day review forecast chart
  - Total cards encountered vs reviews completed
  - Recent study sessions with performance graphs
- Session Stats:
  - Performance visualization using canvas/SVG hybrid approach
  - Color-coded result indicators (Easy/Good/Hard/Again)
  - Success rate calculation
  - Session-by-session trend analysis
- Learning Progress:
  - Cards studied this session
  - Review quality distribution
  - Best and current Good/Easy streaks
  - Total review completion tracking

Review data persists between sessions, allowing you to track your progress over time.

## Project Structure
```
japanese-learning-app/
├── app/
│   ├── api/              # API routes
│   ├── components/       # React components
│   │   ├── dashboard/    # Dashboard & analytics
│   │   ├── flashcards/   # Flashcard components
│   │   ├── learn/        # Learn mode interface
│   │   └── review/       # Review mode interface
│   ├── learn/           # Learn page
│   └── review/          # Review page
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── seed.ts         # Seed data for flashcards
└── README.md
```

## Contributing
This project is for demonstration purposes.