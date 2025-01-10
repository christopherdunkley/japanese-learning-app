import { PrismaClient, CardType } from '@prisma/client'

const prisma = new PrismaClient()
async function main() {
  try {
    // Clear existing data
    console.log('Clearing existing data...')
    await prisma.review.deleteMany({})
    await prisma.flashcard.deleteMany({})

    // Create some basic kanji flashcards
    console.log('Creating kanji flashcards...')
    const kanji = [
      {
        character: '食',
        onyomi: 'ショク、ジキ',
        kunyomi: 'た.べる、く.う',
        meaning: 'eat, food',
        type: CardType.KANJI,
      },
      {
        character: '水',
        onyomi: 'スイ',
        kunyomi: 'みず',
        meaning: 'water',
        type: CardType.KANJI,
      },
      {
        character: '火',
        onyomi: 'カ',
        kunyomi: 'ひ',
        meaning: 'fire',
        type: CardType.KANJI,
      },
    ]

    for (const card of kanji) {
      await prisma.flashcard.create({
        data: card
      })
    }

    console.log('Seed completed successfully')
  } catch (error) {
    console.error('Error seeding database:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })