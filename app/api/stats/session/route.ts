import { NextResponse } from 'next/server'
import { PrismaClient, ReviewResult } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const startTime = searchParams.get('startTime')

    if (!startTime) {
      return NextResponse.json(
        { error: 'Start time is required' },
        { status: 400 }
      )
    }

    const reviews = await prisma.review.findMany({
      where: {
        reviewedAt: {
          gte: new Date(startTime)
        }
      }
    })

    const results = reviews.reduce((acc, review) => {
      acc[review.result]++
      return acc
    }, {
      AGAIN: 0,
      HARD: 0,
      GOOD: 0,
      EASY: 0
    } as Record<ReviewResult, number>)

    return NextResponse.json({
      totalReviewed: reviews.length,
      results,
      averageResponse: 'GOOD' // This will be calculated properly later
    })
  } catch (error) {
    console.error('Error fetching session stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch session stats' },
      { status: 500 }
    )
  }
}