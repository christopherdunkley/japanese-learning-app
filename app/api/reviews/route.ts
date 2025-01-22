import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const { flashcardId, result, readingType, sessionId } = await request.json()

    // Include sessionId in review creation
    const review = await prisma.review.create({
      data: {
        flashcardId,
        result,
        readingType,
        sessionId,  // Link review to session
        nextReview: new Date(Date.now() + 24 * 60 * 60 * 1000) // 1 day for now
      }
    })

    return NextResponse.json(review)
  } catch (error) {
    console.error('Error creating review:', error)
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    )
  }
}