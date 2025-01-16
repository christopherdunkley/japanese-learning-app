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
        character: '日',
        onyomi: 'ニチ、ジツ',
        kunyomi: 'ひ、-び、-か',
        meaning: 'day, sun',
        type: CardType.KANJI,
      },
      {
        character: '月',
        onyomi: 'ゲツ、ガツ',
        kunyomi: 'つき',
        meaning: 'month, moon',
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
      {
        character: '木',
        onyomi: 'モク、ボク',
        kunyomi: 'き、こ-',
        meaning: 'tree, wood',
        type: CardType.KANJI,
      },
      {
        character: '金',
        onyomi: 'キン、コン',
        kunyomi: 'かね、かな-',
        meaning: 'gold, money',
        type: CardType.KANJI,
      },
      {
        character: '土',
        onyomi: 'ド、ト',
        kunyomi: 'つち',
        meaning: 'earth, soil',
        type: CardType.KANJI,
      },
      {
        character: '一',
        onyomi: 'イチ',
        kunyomi: 'ひと-',
        meaning: 'one',
        type: CardType.KANJI,
      },
      {
        character: '二',
        onyomi: 'ニ',
        kunyomi: 'ふた-',
        meaning: 'two',
        type: CardType.KANJI,
      },
      {
        character: '三',
        onyomi: 'サン',
        kunyomi: 'み-',
        meaning: 'three',
        type: CardType.KANJI,
      },
      {
        character: '人',
        onyomi: 'ジン、ニン',
        kunyomi: 'ひと',
        meaning: 'person',
        type: CardType.KANJI,
      },
      {
        character: '年',
        onyomi: 'ネン',
        kunyomi: 'とし',
        meaning: 'year',
        type: CardType.KANJI,
      },
      {
        character: '大',
        onyomi: 'ダイ、タイ',
        kunyomi: 'おお-',
        meaning: 'big, large',
        type: CardType.KANJI,
      },
      {
        character: '小',
        onyomi: 'ショウ',
        kunyomi: 'ちい-、こ-',
        meaning: 'small',
        type: CardType.KANJI,
      },
      {
        character: '中',
        onyomi: 'チュウ',
        kunyomi: 'なか',
        meaning: 'middle, inside',
        type: CardType.KANJI,
      }
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