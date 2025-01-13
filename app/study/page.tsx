import { StudyClient } from '@/components/study/StudyClient'
import { FlashcardService } from '@/services/flashcard.service'

export default async function StudyPage() {
  const flashcards = await FlashcardService.getAllFlashcards()
  const firstCard = flashcards[0]

  if (!firstCard) {
    return <div className="text-gray-200">No flashcards available</div>
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold text-center mb-8 text-gray-100">Study Kanji</h1>
        <StudyClient flashcard={firstCard} />
      </div>
    </div>
  )
}