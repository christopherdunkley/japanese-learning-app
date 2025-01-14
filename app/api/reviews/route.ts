import { NextResponse } from 'next/server'
import { FlashcardService } from '@/services/flashcard.service'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { flashcardId, result, readingType } = body

    const review = await FlashcardService.createReview(
      flashcardId,
      result,
      readingType
    )

    return NextResponse.json(review)
  } catch (error) {
    console.error('Error creating review:', error)
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    )
  }
}