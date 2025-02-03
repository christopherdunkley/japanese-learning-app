import { NextResponse } from 'next/server'
import { PrismaClient, ReviewResult } from '@prisma/client'

const prisma = new PrismaClient()

const ONE_HOUR = 60 * 60 * 1000
const ONE_DAY = 24 * ONE_HOUR

function calculateNextInterval(result: ReviewResult, currentInterval: number | null): number {
  if (!currentInterval) {
    switch (result) {
      case 'AGAIN': return ONE_HOUR;
      case 'HARD': return ONE_DAY;
      case 'GOOD': return 3 * ONE_DAY;
      case 'EASY': return 7 * ONE_DAY;
      default: return ONE_DAY;
    }
  }

  switch (result) {
    case 'AGAIN': return ONE_HOUR;
    case 'HARD': return Math.round(currentInterval * 1.2);
    case 'GOOD': return Math.round(currentInterval * 2.0);
    case 'EASY': return Math.round(currentInterval * 3.0);
    default: return Math.round(currentInterval * 2.0);
  }
}

export async function POST(request: Request) {
  try {
    const { flashcardId, result, readingType, sessionId } = await request.json()

    const flashcard = await prisma.flashcard.findUnique({
      where: { id: flashcardId }
    })

    if (!flashcard) {
      return NextResponse.json({ error: 'Flashcard not found' }, { status: 404 })
    }

    const now = new Date()
    const nextInterval = calculateNextInterval(result as ReviewResult, flashcard.currentInterval)
    const nextReviewDate = new Date(now.getTime() + nextInterval)

    await prisma.$transaction([
      prisma.flashcard.update({
        where: { id: flashcardId },
        data: {
          lastReviewedAt: now,
          nextReviewAt: nextReviewDate,
          currentInterval: nextInterval,
          reviewCount: { increment: 1 }
        }
      }),
      prisma.review.create({
        data: {
          flashcardId,
          result,
          readingType,
          sessionId,
          nextReview: nextReviewDate
        }
      })
    ])

    return NextResponse.json({ success: true, nextReview: nextReviewDate })
  } catch (error) {
    console.error('Error creating review:', error)
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 })
  }
}