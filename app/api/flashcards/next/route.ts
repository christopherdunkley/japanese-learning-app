import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const flashcard = await prisma.flashcard.findFirst({
      where: {
        OR: [
          {
            // Cards with no reviews
            reviews: {
              none: {}
            }
          },
          {
            // Cards that are due for review
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
      orderBy: {
        reviews: {
          _count: 'asc'
        }
      }
    })

    if (!flashcard) {
      return NextResponse.json(
        { message: 'No cards due for review' },
        { status: 404 }
      )
    }

    return NextResponse.json(flashcard)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Failed to fetch next flashcard' }, { status: 500 })
  }
}