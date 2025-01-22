import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    // First try to find any unreviewed cards
    const nextCard = await prisma.flashcard.findFirst({
      where: {
        OR: [
          {
            // Cards with no reviews
            reviews: {
              none: {}
            }
          },
          {
            // Cards due for review
            reviews: {
              some: {
                nextReview: {
                  lte: new Date()
                }
              }
            }
          }
        ]
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