'use client'

import { useState } from 'react'
import { Flashcard } from '../flashcards/Flashcard'
import { StudyStats } from '../review/StudyStats'
import { ProgressBar } from '../review/ProgressBar'
import type { Flashcard as FlashcardType } from '@prisma/client'

interface LearnClientProps {
  initialFlashcard: FlashcardType
  totalNewCards: number
}

export function LearnClient({ initialFlashcard, totalNewCards }: LearnClientProps) {
  const [currentCard, setCurrentCard] = useState<FlashcardType | null>(initialFlashcard)
  const [isLoading, setIsLoading] = useState(false)
  const [isDone, setIsDone] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [cardsReviewed, setCardsReviewed] = useState(0)

  // Create session when component mounts
  const createSession = async () => {
    try {
      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          totalCards: totalNewCards,
        }),
      })
      
      if (!response.ok) throw new Error('Failed to create session')
      
      const data = await response.json()
      setSessionId(data.id)
    } catch (error) {
      console.error('Error creating session:', error)
    }
  }

  // Initialize session if we don't have one
  if (!sessionId && !isDone) {
    createSession()
  }

  const handleResult = async (result: 'EASY' | 'GOOD' | 'HARD' | 'AGAIN') => {
    if (!currentCard || !sessionId) return
    
    try {
      setIsLoading(true)
      
      // Submit the review
      const reviewResponse = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          flashcardId: currentCard.id,
          result,
          readingType: 'ONYOMI',
          sessionId,
        }),
      })

      if (!reviewResponse.ok) {
        throw new Error('Failed to submit review')
      }

      // Update cards reviewed count
      setCardsReviewed(prev => {
        // Don't allow reviewed count to exceed total cards to learn
        return Math.min(prev + 1, totalNewCards)
      })

      // Get next card in learn mode
      const nextCardResponse = await fetch(`/api/flashcards/next?sessionId=${sessionId}&mode=learn`)
      
      if (nextCardResponse.status === 404) {
        // Complete the session
        const completeResponse = await fetch(`/api/sessions/${sessionId}/complete`, {
          method: 'POST',
        })
        
        if (!completeResponse.ok) {
          throw new Error('Failed to complete session')
        }
        
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

  const handleStartNewSession = () => {
    if (window.confirm('Are you sure you want to start a new learning session?')) {
      window.location.reload()
    }
  }

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <ProgressBar current={cardsReviewed} total={totalNewCards} />
      </div>
      
      {isLoading ? (
        <div className="text-center text-gray-400">Loading next card...</div>
      ) : isDone ? (
        <div className="text-center text-gray-200">
          <h2 className="text-xl font-bold mb-4">Learning Complete! 🎉</h2>
          <StudyStats sessionId={sessionId} showOverall={true} />
          <button 
            onClick={handleStartNewSession}
            className="mt-8 px-4 py-2 bg-green-600 hover:bg-green-700 rounded transition-colors"
          >
            Start New Learning Session
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
        <div className="text-center text-gray-200">No new cards available.</div>
      )}
    </div>
  )
}