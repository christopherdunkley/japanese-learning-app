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

    // Find cards that are due but haven't been reviewed in the current session
    const nextCard = await prisma.flashcard.findFirst({
      where: {
        OR: [
          {
            // Cards with no reviews at all
            reviews: {
              none: {}
            }
          },
          {
            // Cards due for review but not reviewed in current session
            AND: [
              {
                reviews: {
                  some: {
                    nextReview: {
                      lte: new Date()
                    }
                  }
                }
              },
              {
                // Exclude cards already reviewed in this session
                reviews: {
                  none: {
                    sessionId: sessionId
                  }
                }
              }
            ]
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