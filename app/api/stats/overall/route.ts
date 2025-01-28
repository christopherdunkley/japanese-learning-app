import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    // Total number of reviews completed (counting repeated reviews)
    const totalReviews = await prisma.review.count()

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

    // Cards studied in last session (unique cards reviewed)
    const cardsStudied = lastSession 
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
      totalCards: totalReviews,  // total number of reviews (including repeated cards)
      cardsLearned: cardsStudied,
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