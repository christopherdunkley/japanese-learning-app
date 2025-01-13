'use client'

import { useState } from 'react'
import { FlashcardProps } from '@/types/flashcard'

export function Flashcard({ 
  character, 
  onyomi, 
  kunyomi, 
  meaning,
  onResult 
}: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  
  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="w-full h-64 perspective-1000">
        <div 
          className={`relative w-full h-full transition-transform duration-700 ease-in-out`}
          style={{ 
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            transformOrigin: 'center'
          }}
          onClick={() => setIsFlipped(!isFlipped)}
        >
          {/* Front of card */}
          <div 
            className="absolute w-full h-full rounded-xl bg-gray-800 border border-gray-700 shadow-xl flex items-center justify-center cursor-pointer"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <span className="text-7xl font-bold text-gray-100">{character}</span>
          </div>

          {/* Back of card */}
          <div 
            className="absolute w-full h-full rounded-xl bg-gray-800 border border-gray-700 shadow-xl flex flex-col items-center justify-center cursor-pointer"
            style={{ 
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)'
            }}
          >
            {onyomi && (
              <div className="text-center mb-4">
                <span className="text-sm text-gray-400">音読み</span>
                <p className="text-xl font-medium text-gray-100">{onyomi}</p>
              </div>
            )}
            {kunyomi && (
              <div className="text-center mb-4">
                <span className="text-sm text-gray-400">訓読み</span>
                <p className="text-xl font-medium text-gray-100">{kunyomi}</p>
              </div>
            )}
            <div className="text-center">
              <span className="text-sm text-gray-400">Meaning</span>
              <p className="text-xl font-medium text-gray-100">{meaning}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Review buttons */}
      {isFlipped && onResult && (
        <div className="mt-6 grid grid-cols-4 gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onResult('AGAIN');
            }}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
          >
            Again
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onResult('HARD');
            }}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded transition-colors"
          >
            Hard
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onResult('GOOD');
            }}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
          >
            Good
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onResult('EASY');
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
          >
            Easy
          </button>
        </div>
      )}
    </div>
  )
}