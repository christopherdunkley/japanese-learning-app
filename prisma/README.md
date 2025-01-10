# Database Layer

This directory contains database schema and management files.

## Key Files
- `schema.prisma`: database schema definition
- `seed.ts`: initial data seeding script

## Schema Overview
The database includes:
- Flashcards (kanji, readings, meanings)
- Review history
- Spaced repetition metadata

## Working w/ the Database

### Common Commands
```bash
# Update schema
npx prisma db push

# Reset database
npm run seed

# View data
npx prisma studio
```

### Seed Data
The seed script provides initial kanji cards with:
- Character
- Onyomi (Chinese reading)
- Kunyomi (Japanese reading)
- English meaning