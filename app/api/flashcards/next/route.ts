import { NextResponse } from 'next/server'
import { FlashcardService } from '@/services/flashcard.service'

export async function GET() {
  try {
    const nextCard = await FlashcardService.getNextDueCard()
    
    if (!nextCard) {
      // If no cards are due, return 404
      return NextResponse.json(
        { message: "No cards due for review" },
        { status: 404 }
      )
    }

    return NextResponse.json(nextCard)
  } catch (error) {
    console.error('Error fetching next card:', error)
    return NextResponse.json(
      { error: 'Failed to fetch next card' },
      { status: 500 }
    )
  }
}