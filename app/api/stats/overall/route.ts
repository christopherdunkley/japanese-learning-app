import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const totalCards = await prisma.flashcard.count()
    const cardsLearned = await prisma.flashcard.count({
      where: {
        reviews: {
          some: {}
        }
      }
    })

    const cardsMastered = await prisma.flashcard.count({
      where: {
        reviews: {
          some: {
            result: {
              in: ['GOOD', 'EASY']
            }
          }
        }
      }
    })

    return NextResponse.json({
      totalCards,
      cardsLearned,
      bestStreak: cardsMastered,
      currentStreak: cardsMastered
    })
  } catch (error) {
    console.error('Error fetching overall stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch overall stats' },
      { status: 500 }
    )
  }
}