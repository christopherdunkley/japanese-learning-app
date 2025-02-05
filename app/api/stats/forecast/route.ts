import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const now = new Date()
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const next7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfToday)
      date.setDate(date.getDate() + i)
      return date
    })

    // Get all cards with next review dates in the next 7 days
    const cards = await prisma.flashcard.findMany({
      where: {
        nextReviewAt: {
          gte: startOfToday,
          lt: next7Days[6]
        }
      },
      select: {
        nextReviewAt: true
      }
    })

    // Group reviews by hour within each day
    const forecast = next7Days.map(date => {
      const dayReviews = cards.filter(card => {
        if (!card.nextReviewAt) return false
        const reviewDate = new Date(card.nextReviewAt)
        return (
          reviewDate.getFullYear() === date.getFullYear() &&
          reviewDate.getMonth() === date.getMonth() &&
          reviewDate.getDate() === date.getDate()
        )
      })

      // Group by hour
      const hourlyBreakdown = Array.from({ length: 24 }, (_, hour) => {
        return {
          hour,
          count: dayReviews.filter(review => {
            if (!review.nextReviewAt) return false
            return new Date(review.nextReviewAt).getHours() === hour
          }).length
        }
      })

      return {
        date: date.toISOString().split('T')[0], // YYYY-MM-DD format
        reviews: dayReviews.length,
        day: new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date),
        hourlyBreakdown
      }
    })

    return NextResponse.json(forecast)
  } catch (error) {
    console.error('Error generating forecast:', error)
    return NextResponse.json(
      { error: 'Failed to generate forecast' },
      { status: 500 }
    )
  }
}