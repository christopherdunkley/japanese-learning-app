'use client'

import { useState } from 'react'
import { Flashcard } from '../flashcards/Flashcard'
import type { Flashcard as FlashcardType } from '@prisma/client'

interface StudyClientProps {
  initialFlashcard: FlashcardType
}

export function StudyClient({ initialFlashcard }: StudyClientProps) {
  const [currentCard, setCurrentCard] = useState<FlashcardType | null>(initialFlashcard)
  const [isLoading, setIsLoading] = useState(false)
  const [isDone, setIsDone] = useState(false)

  const handleResult = async (result: 'EASY' | 'GOOD' | 'HARD' | 'AGAIN') => {
    try {
      setIsLoading(true)
      
      // Submit the review
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          flashcardId: currentCard?.id,
          result,
          readingType: 'ONYOMI',
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to submit review')
      }

      // Fetch the next card
      const nextCardResponse = await fetch('/api/flashcards/next')
      
      if (nextCardResponse.status === 404) {
        // No more cards due for review
        setCurrentCard(null)
        setIsDone(true)
        return
      }

      const nextCard = await nextCardResponse.json()
      setCurrentCard(nextCard)
      
    } catch (error) {
      console.error('Error handling review:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <div className="text-center text-gray-400">Loading next card...</div>
  }

  if (isDone) {
    return (
      <div className="text-center text-gray-200">
        <h2 className="text-xl font-bold mb-4">All Done! 🎉</h2>
        <p>You have reviewed all cards that are currently due.</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
        >
          Start New Session
        </button>
      </div>
    )
  }

  if (!currentCard) {
    return <div className="text-center text-gray-200">No cards available.</div>
  }

  return (
    <Flashcard
      character={currentCard.character}
      onyomi={currentCard.onyomi}
      kunyomi={currentCard.kunyomi}
      meaning={currentCard.meaning}
      onResult={handleResult}
    />
  )
}