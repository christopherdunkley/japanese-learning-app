import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')
    const mode = searchParams.get('mode') // 'learn' or 'review'

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      )
    }

    if (mode === 'learn') {
      // Count how many cards have been reviewed in this session
      const sessionReviewCount = await prisma.review.count({
        where: {
          sessionId: sessionId
        }
      })

      // If we've already shown 3 cards, return no more cards
      if (sessionReviewCount >= 3) {
        return NextResponse.json(
          { message: "Learning session complete" },
          { status: 404 }
        )
      }

      // Get next unreviewed card
      const nextCard = await prisma.flashcard.findFirst({
        where: {
          AND: [
            // Never reviewed before
            { reviews: { none: {} } },
            // Not reviewed in current session
            {
              reviews: {
                none: {
                  sessionId: sessionId
                }
              }
            }
          ]
        },
        include: {
          reviews: {
            orderBy: {
              reviewedAt: 'desc'
            },
            take: 1
          }
        }
      })

      if (!nextCard) {
        return NextResponse.json(
          { message: "No more new cards to learn" },
          { status: 404 }
        )
      }

      return NextResponse.json(nextCard)
    } else {
      // Review mode - existing logic
      const now = new Date()
      const nextCard = await prisma.flashcard.findFirst({
        where: {
          AND: [
            // Has been reviewed before
            { reviews: { some: {} } },
            // Not reviewed in current session
            {
              reviews: {
                none: {
                  sessionId: sessionId
                }
              }
            },
            // Is due for review
            { nextReviewAt: { lte: now } }
          ]
        },
        include: {
          reviews: {
            orderBy: {
              reviewedAt: 'desc'
            },
            take: 1
          }
        }
      })

      if (!nextCard) {
        return NextResponse.json(
          { message: "No more cards due for review" },
          { status: 404 }
        )
      }

      return NextResponse.json(nextCard)
    }
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch next card' },
      { status: 500 }
    )
  }
}