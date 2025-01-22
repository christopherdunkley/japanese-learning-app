import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Get all reviews for this session
    const reviews = await prisma.review.findMany({
      where: {
        sessionId: params.id
      }
    })

    // Calculate result counts
    const results = reviews.reduce((acc, review) => {
      acc[review.result] = (acc[review.result] || 0) + 1;
      return acc;
    }, {
      AGAIN: 0,
      HARD: 0,
      GOOD: 0,
      EASY: 0
    })

    // Update session with completion data
    const session = await prisma.session.update({
      where: { id: params.id },
      data: {
        endedAt: new Date(),
        results,
        totalCards: reviews.length  // Update total cards to actual count
      }
    })

    return NextResponse.json(session)
  } catch (error) {
    console.error('Error completing session:', error)
    return NextResponse.json(
      { error: 'Failed to complete session' },
      { status: 500 }
    )
  }
}