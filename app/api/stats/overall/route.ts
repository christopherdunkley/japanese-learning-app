import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    // Total number of flashcards in database
    const totalCards = await prisma.flashcard.count()

    // Get the most recently completed session
    const lastSession = await prisma.session.findFirst({
      where: {
        endedAt: {
          not: null
        }
      },
      include: {
        reviews: {
          orderBy: {
            reviewedAt: 'desc'
          }
        }
      },
      orderBy: {
        endedAt: 'desc'
      }
    })

    // Cards learned is the unique cards reviewed in this session
    const cardsLearned = lastSession 
      ? new Set(lastSession.reviews.map(r => r.flashcardId)).size 
      : 0

    // Calculate streak from session's reviews
    let currentStreak = 0
    let bestStreak = 0
    let tempStreak = 0

    if (lastSession?.reviews) {
      lastSession.reviews.reverse().forEach(review => {  // Process in chronological order
        if (review.result === 'GOOD' || review.result === 'EASY') {
          tempStreak++
          currentStreak = tempStreak
          bestStreak = Math.max(bestStreak, tempStreak)
        } else {
          tempStreak = 0
        }
      })
    }

    return NextResponse.json({
      totalCards,
      cardsLearned,
      bestStreak,
      currentStreak
    })
  } catch (error) {
    console.error('Error fetching overall stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch overall stats' },
      { status: 500 }
    )
  }
}