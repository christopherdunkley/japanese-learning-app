'use client'

import { useState } from 'react'
import { Flashcard } from '../flashcards/Flashcard'
import { StudyStats } from './StudyStats'
import { ProgressBar } from './ProgressBar'
import type { Flashcard as FlashcardType } from '@prisma/client'

interface StudyClientProps {
  initialFlashcard: FlashcardType
  totalDueCards: number  // Add this prop
}

export function StudyClient({ initialFlashcard, totalDueCards }: StudyClientProps) {
  const [currentCard, setCurrentCard] = useState<FlashcardType | null>(initialFlashcard)
  const [isLoading, setIsLoading] = useState(false)
  const [isDone, setIsDone] = useState(false)
  const [sessionStartTime] = useState(new Date())
  const [cardsReviewed, setCardsReviewed] = useState(0)

  const handleResult = async (result: 'EASY' | 'GOOD' | 'HARD' | 'AGAIN') => {
    try {
      setIsLoading(true)
      setCardsReviewed(prev => prev + 1)
      
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

      const nextCardResponse = await fetch('/api/flashcards/next')
      
      if (nextCardResponse.status === 404) {
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

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <ProgressBar current={cardsReviewed} total={totalDueCards} />
      </div>
      {isLoading ? (
        <div className="text-center text-gray-400">Loading next card...</div>
      ) : isDone ? (
        <div className="text-center text-gray-200">
          <h2 className="text-xl font-bold mb-4">Session Complete! 🎉</h2>
          <StudyStats sessionStartTime={sessionStartTime} showOverall={true} />
          <button 
            onClick={(e) => {
              e.preventDefault();
              if (window.confirm('Are you sure you want to start a new session? Your current session stats will be lost.')) {
                window.location.reload();
              }
            }}
            className="mt-8 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
          >
            Start New Session
          </button>
        </div>
      ) : currentCard ? (
        <Flashcard
          character={currentCard.character}
          onyomi={currentCard.onyomi}
          kunyomi={currentCard.kunyomi}
          meaning={currentCard.meaning}
          onResult={handleResult}
        />
      ) : (
        <div className="text-center text-gray-200">No cards available.</div>
      )}
    </div>
  )
}