import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      )
    }

    const nextCard = await prisma.flashcard.findFirst({
      where: {
        AND: [
          // Not reviewed in current session
          {
            reviews: {
              none: {
                sessionId: sessionId
              }
            }
          },
          {
            OR: [
              // Never reviewed
              { nextReviewAt: null },
              // Due for review
              {
                nextReviewAt: {
                  lte: new Date()
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