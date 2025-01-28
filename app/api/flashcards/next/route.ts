import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: Request) {
  try {
    // Get the current session ID from the query params
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      )
    }

    // First get all flashcards with their latest review
    const cardsWithLatestReview = await prisma.flashcard.findMany({
      include: {
        reviews: {
          orderBy: {
            reviewedAt: 'desc'
          },
          take: 1
        }
      }
    })

    // Filter to find the first due card that hasn't been reviewed in this session
    const now = new Date()
    const nextCard = cardsWithLatestReview.find(card => {
      // Card hasn't been reviewed in current session
      const reviewedInSession = card.reviews.some(r => r.sessionId === sessionId)
      if (reviewedInSession) return false

      // Card has no reviews (is new)
      if (card.reviews.length === 0) return true

      // Card's latest review is due
      const latestReview = card.reviews[0]
      return latestReview.nextReview <= now
    })

    if (!nextCard) {
      return NextResponse.json(
        { message: "No more cards due for review" },
        { status: 404 }
      )
    }

    return NextResponse.json(nextCard)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch next card' },
      { status: 500 }
    )
  }
}