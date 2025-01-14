import { prisma } from '../lib/db'
import type { Flashcard, Review, ReadingType, ReviewResult } from '@prisma/client'

export class FlashcardService {
  // Get next card due for review
  static async getNextDueCard(): Promise<Flashcard | null> {
    return await prisma.flashcard.findFirst({
      where: {
        OR: [
          // Cards that have never been reviewed
          {
            reviews: {
              none: {}
            }
          },
          // Cards due for review
          {
            reviews: {
              some: {
                nextReview: {
                  lte: new Date()
                }
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
  }

  // Calculate next review time based on SRS algorithm
  private static calculateNextReview(result: ReviewResult, previousInterval?: number): Date {
    const now = new Date()
    const ONE_HOUR = 60 * 60 * 1000
    const ONE_DAY = 24 * ONE_HOUR

    // Base intervals for each result type
    const intervals = {
      AGAIN: ONE_HOUR,
      HARD: previousInterval ? previousInterval * 1.2 : ONE_DAY,
      GOOD: previousInterval ? previousInterval * 2 : 3 * ONE_DAY,
      EASY: previousInterval ? previousInterval * 3 : 7 * ONE_DAY,
    }

    return new Date(now.getTime() + intervals[result])
  }

  // Create a new review
  static async createReview(
    flashcardId: string,
    result: ReviewResult,
    readingType: ReadingType
  ): Promise<Review> {
    // Get the most recent review for this card
    const previousReview = await prisma.review.findFirst({
      where: { flashcardId },
      orderBy: { reviewedAt: 'desc' }
    })

    const previousInterval = previousReview 
      ? previousReview.nextReview.getTime() - previousReview.reviewedAt.getTime()
      : undefined

    const nextReview = this.calculateNextReview(result, previousInterval)

    return await prisma.review.create({
      data: {
        flashcardId,
        result,
        readingType,
        nextReview,
      }
    })
  }

  // Get all flashcards (for admin/testing)
  static async getAllFlashcards() {
    return await prisma.flashcard.findMany({
      include: {
        reviews: true
      }
    })
  }
}