import { PrismaClient, ReviewResult } from '@prisma/client'

const prisma = new PrismaClient()

export interface SessionStats {
  totalReviewed: number
  results: {
    AGAIN: number
    HARD: number
    GOOD: number
    EASY: number
  }
  averageResponse: string // AGAIN, HARD, GOOD, or EASY
}

export interface OverallStats {
  totalCards: number
  cardsLearned: number
  bestStreak: number
  currentStreak: number
}

export class StatsService {
  static async getSessionStats(sessionStartTime: Date): Promise<SessionStats> {
    const reviews = await prisma.review.findMany({
      where: {
        reviewedAt: {
          gte: sessionStartTime
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

    const totalReviewed = reviews.length
    const averageScore = Object.entries(results).reduce((acc, [result, count]) => {
      const score = result === 'AGAIN' ? 1 : 
                    result === 'HARD' ? 2 : 
                    result === 'GOOD' ? 3 : 4
      return acc + (score * count)
    }, 0) / totalReviewed

    const averageResponse = averageScore <= 1.5 ? 'AGAIN' :
                          averageScore <= 2.5 ? 'HARD' :
                          averageScore <= 3.5 ? 'GOOD' : 'EASY'

    return {
      totalReviewed,
      results,
      averageResponse
    }
  }

  static async getOverallStats(): Promise<OverallStats> {
    const totalCards = await prisma.flashcard.count()
    const cardsLearned = await prisma.flashcard.count({
      where: {
        reviews: {
          some: {}
        }
      }
    })

    // A card is considered mastered if its last review was GOOD or EASY
    const cardsMastered = await prisma.flashcard.count({
      where: {
        reviews: {
          some: {
            result: {
              in: ['GOOD', 'EASY']
            }
          }
        }
      }
    })

    return {
      totalCards,
      cardsLearned,
      bestStreak: cardsMastered,  // We'll implement proper streaks later
      currentStreak: cardsMastered
    }
  }
}