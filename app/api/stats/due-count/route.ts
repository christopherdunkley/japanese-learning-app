import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const now = new Date()

    // Get count of new cards (never reviewed)
    const newCardsCount = await prisma.flashcard.count({
      where: {
        // Never reviewed
        reviews: {
          none: {}
        }
      }
    })

    // Get count of cards due for review
    const reviewCount = await prisma.flashcard.count({
      where: {
        AND: [
          // Has been reviewed before
          { reviews: { some: {} } },
          // Is due for review
          { nextReviewAt: { lte: now } }
        ]
      }
    })

    // Debug logging
    console.log('New cards available:', newCardsCount)
    console.log('Review cards due:', reviewCount)

    return new NextResponse(JSON.stringify({
      learnCount: Math.min(3, newCardsCount),  // Cap at 3 for learning
      reviewCount: reviewCount
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Error:', error)
    return new NextResponse(JSON.stringify({ error: 'Failed to fetch counts' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}