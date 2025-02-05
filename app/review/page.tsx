import { ReviewClient } from '@/components/review/ReviewClient'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function ReviewPage() {
  const now = new Date()

  // Get count of cards due for review (excluding new cards)
  const dueCount = await prisma.flashcard.count({
    where: {
      AND: [
        // Has been reviewed before
        { reviews: { some: {} } },
        // Is due for review
        { nextReviewAt: { lte: now } }
      ]
    }
  })

  // Get first due card
  const initialCard = await prisma.flashcard.findFirst({
    where: {
      AND: [
        // Has been reviewed before
        { reviews: { some: {} } },
        // Is due for review
        { nextReviewAt: { lte: now } }
      ]
    }
  })

  if (!initialCard) {
    return (
      <div className="min-h-screen bg-gray-900 py-12">
        <div className="container mx-auto px-4 text-center text-gray-200">
          No cards due for review!
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold text-center mb-8 text-gray-100">Review Kanji</h1>
        <ReviewClient 
          initialFlashcard={initialCard} 
          totalDueCards={dueCount}
        />
      </div>
    </div>
  )
}