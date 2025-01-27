import { prisma } from '../lib/db'
import type { Flashcard, Review, ReadingType, ReviewResult } from '@prisma/client'

export class FlashcardService {
  // Get next card due for review
  static async getNextDueCard(sessionId: string): Promise<Flashcard | null> {
    return await prisma.flashcard.findFirst({
      where: {
        OR: [
          // Cards that have never been reviewed
          {
            reviews: {
              none: {}
            }
          },
          // Cards due for review but not in current session
          {
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
  }

  // Calculate next review time based on SRS algorithm
  private static calculateNextReview(result: ReviewResult, previousInterval?: number): Date {
    const now = new Date()
    const ONE_HOUR = 60 * 60 * 1000
    const ONE_DAY = 24 * ONE_HOUR

    let baseInterval: number
    let multiplier: number

    switch (result) {
      case 'AGAIN':
        return new Date(now.getTime() + ONE_HOUR)
      case 'HARD':
        baseInterval = previousInterval || ONE_DAY
        multiplier = 1.2
        break
      case 'GOOD':
        baseInterval = previousInterval || (3 * ONE_DAY)
        multiplier = 2.0
        break
      case 'EASY':
        baseInterval = previousInterval || (7 * ONE_DAY)
        multiplier = 3.0
        break
    }

    // Apply random factor (0.95 to 1.05) to prevent cards from clumping
    const randomFactor = 0.95 + (Math.random() * 0.1)
    const newInterval = baseInterval * multiplier * randomFactor

    return new Date(now.getTime() + newInterval)
  }

  // Create a new review
  static async createReview(
    flashcardId: string,
    result: ReviewResult,
    readingType: ReadingType,
    sessionId: string
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
        sessionId,
        nextReview,
      }
    })
  }

  // Get count of due cards (for progress tracking)
  static async getDueCardCount(): Promise<number> {
    const count = await prisma.flashcard.count({
      where: {
        OR: [
          {
            reviews: {
              none: {}
            }
          },
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
      }
    })
    return count
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