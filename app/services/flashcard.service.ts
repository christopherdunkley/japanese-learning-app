import { prisma } from '../lib/db'
import type { Flashcard, Review, ReadingType } from '@prisma/client'

export class FlashcardService {
  // Get a flashcard due for review
  static async getNextFlashcard(): Promise<Flashcard | null> {
    return await prisma.flashcard.findFirst({
      where: {
        reviews: {
          every: {
            nextReview: {
              lte: new Date(),
            },
          },
        },
      },
      include: {
        reviews: true,
      },
    })
  }

  // Create a new review for a flashcard
  static async createReview(
    flashcardId: string,
    result: Review['result'],
    readingType: ReadingType
  ): Promise<Review> {
    // Calculate next review date based on result
    const nextReview = this.calculateNextReview(result)

    return await prisma.review.create({
      data: {
        flashcardId,
        result,
        readingType,
        nextReview,
      },
    })
  }

  // Helper function to calculate spaced repetition intervals
  private static calculateNextReview(result: Review['result']): Date {
    const now = new Date()
    switch (result) {
      case 'AGAIN':
        return new Date(now.getTime() + 1000 * 60 * 10) // 10 minutes
      case 'HARD':
        return new Date(now.getTime() + 1000 * 60 * 60) // 1 hour
      case 'GOOD':
        return new Date(now.getTime() + 1000 * 60 * 60 * 24) // 1 day
      case 'EASY':
        return new Date(now.getTime() + 1000 * 60 * 60 * 24 * 3) // 3 days
      default:
        return new Date(now.getTime() + 1000 * 60 * 60 * 24) // Default to 1 day
    }
  }

  // Add methods for creating and managing flashcards
  static async createFlashcard(data: Omit<Flashcard, 'id' | 'createdAt' | 'updatedAt'>) {
    return await prisma.flashcard.create({
      data,
    })
  }

  // Get all flashcards for admin/management purposes
  static async getAllFlashcards() {
    return await prisma.flashcard.findMany({
      include: {
        reviews: true,
      },
    })
  }
}