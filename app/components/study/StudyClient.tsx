'use client'

import { Flashcard } from '../flashcards/Flashcard'
import type { Flashcard as FlashcardType } from '@prisma/client'

interface StudyClientProps {
  flashcard: FlashcardType
}

export function StudyClient({ flashcard }: StudyClientProps) {
  console.log('Flashcard data:', flashcard) // Debug log

  const handleResult = (result: 'EASY' | 'GOOD' | 'HARD' | 'AGAIN') => {
    console.log('Card result:', result)
  }

  return (
    <Flashcard
      character={flashcard.character}
      onyomi={flashcard.onyomi}
      kunyomi={flashcard.kunyomi}
      meaning={flashcard.meaning}
      onResult={handleResult}
    />
  )
}