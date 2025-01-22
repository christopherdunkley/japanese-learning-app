import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await prisma.session.findUnique({
      where: { id: params.id },
      include: {
        reviews: true  // Include the reviews
      }
    })

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }

    // Calculate stats from the actual reviews
    const reviewCounts = session.reviews.reduce((acc, review) => {
      acc[review.result] = (acc[review.result] || 0) + 1;
      return acc;
    }, {
      AGAIN: 0,
      HARD: 0,
      GOOD: 0,
      EASY: 0
    })

    return NextResponse.json({
      id: session.id,
      startedAt: session.startedAt,
      endedAt: session.endedAt,
      totalCards: session.totalCards,
      results: reviewCounts,
      reviewCount: session.reviews.length
    })
  } catch (error) {
    console.error('Error fetching session:', error)
    return NextResponse.json(
      { error: 'Failed to fetch session' },
      { status: 500 }
    )
  }
}