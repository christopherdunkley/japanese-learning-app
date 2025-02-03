import { StudyClient } from '@/components/study/StudyClient'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function StudyPage() {
  const now = new Date()

  const dueCount = await prisma.flashcard.count({
    where: {
      OR: [
        { nextReviewAt: null },
        { nextReviewAt: { lte: now } }
      ]
    }
  })

  const initialCard = await prisma.flashcard.findFirst({
    where: {
      OR: [
        { nextReviewAt: null },
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
        <h1 className="text-2xl font-bold text-center mb-8 text-gray-100">Study Kanji</h1>
        <StudyClient 
          initialFlashcard={initialCard} 
          totalDueCards={dueCount}
        />
      </div>
    </div>
  )
}