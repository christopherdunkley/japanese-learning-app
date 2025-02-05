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
        reviews: true
      },
      orderBy: {
        endedAt: 'desc'
      }
    })

    // Cards studied in last session (unique cards reviewed)
    const cardsStudied = lastSession 
      ? new Set(lastSession.reviews.map(r => r.flashcardId)).size 
      : 0

    // Get all sessions with their reviews, ordered by time
    const allSessions = await prisma.session.findMany({
      include: {
        reviews: {
          orderBy: {
            reviewedAt: 'asc'
          }
        }
      },
      orderBy: {
        startedAt: 'asc'
      }
    })

    // Calculate best streak by session
    let bestStreak = 0
    let tempStreak = 0

    allSessions.forEach(session => {
      const uniqueGoodCards = new Set()
      session.reviews.forEach(review => {
        if (review.result === 'GOOD' || review.result === 'EASY') {
          uniqueGoodCards.add(review.flashcardId)
        }
      })
      
      tempStreak = uniqueGoodCards.size
      bestStreak = Math.max(bestStreak, tempStreak)
    })

    // Calculate current streak from last session
    let currentStreak = 0
    if (lastSession) {
      const uniqueGoodCards = new Set()
      lastSession.reviews.forEach(review => {
        if (review.result === 'GOOD' || review.result === 'EASY') {
          uniqueGoodCards.add(review.flashcardId)
        }
      })
      currentStreak = uniqueGoodCards.size
    }

    return NextResponse.json({
      totalCards: totalReviews,
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