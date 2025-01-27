import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Get all reviews for this session with a single query
    const [reviews, session] = await Promise.all([
      prisma.review.findMany({
        where: {
          sessionId: params.id
        }
      }),
      prisma.session.findUnique({
        where: { id: params.id }
      })
    ])

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }

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
    const updatedSession = await prisma.session.update({
      where: { id: params.id },
      data: {
        endedAt: new Date(),
        results,
        totalCards: reviews.length
      },
      include: {
        reviews: {
          select: {
            result: true
          }
        }
      }
    })

    // Add the review count to the response
    const responseData = {
      ...updatedSession,
      reviewCount: reviews.length
    }

    return NextResponse.json(responseData)
  } catch (error) {
    console.error('Error completing session:', error)
    return NextResponse.json(
      { error: 'Failed to complete session' },
      { status: 500 }
    )
  }
}