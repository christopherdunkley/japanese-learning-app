import { LearnClient } from '@/components/learn/LearnClient'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function LearnPage() {
  // Get 3 unreviewed cards
  const initialCard = await prisma.flashcard.findFirst({
    where: {
      reviews: {
        none: {}
      }
    }
  })

  const totalNewCards = await prisma.flashcard.count({
    where: {
      reviews: {
        none: {}
      }
    }
  })

  // Only show up to 3 cards per learning session
  const cardsToLearn = Math.min(3, totalNewCards)

  if (!initialCard) {
    return (
      <div className="min-h-screen bg-gray-900 py-12">
        <div className="container mx-auto px-4 text-center text-gray-200">
          No new cards to learn!
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold text-center mb-8 text-gray-100">Learn New Kanji</h1>
        <LearnClient 
          initialFlashcard={initialCard} 
          totalNewCards={cardsToLearn}
        />
      </div>
    </div>
  )
}