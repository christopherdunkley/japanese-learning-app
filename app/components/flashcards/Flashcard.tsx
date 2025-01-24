'use client'

import { useState, useEffect } from 'react'

interface FlashcardProps {
  character: string
  onyomi: string | null
  kunyomi: string | null
  meaning: string
  onResult: (result: 'EASY' | 'GOOD' | 'HARD' | 'AGAIN') => void
}

export function Flashcard({ 
  character, 
  onyomi, 
  kunyomi, 
  meaning,
  onResult 
}: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped(!isFlipped);
      }
      
      if (isFlipped) {
        switch(e.code) {
          case 'KeyC':
            onResult('AGAIN');
            break;
          case 'KeyV':
            onResult('HARD');
            break;
          case 'KeyB':
            onResult('GOOD');
            break;
          case 'KeyN':
            onResult('EASY');
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isFlipped, onResult]);

  return (
    <div className="w-full max-w-sm mx-auto">
      <div 
        className="h-64 w-full preserve-3d perspective cursor-pointer duration-500 transition-transform"
        style={{ transformStyle: 'preserve-3d' }}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* Front of card */}
        <div 
          className={`absolute w-full h-full rounded-xl bg-gray-800 border border-gray-700 shadow-xl flex items-center justify-center transform transition-transform duration-500 ${
            isFlipped ? 'rotate-y-180 invisible' : ''
          }`}
          style={{ backfaceVisibility: 'hidden' }}
        >
          <span className="text-7xl font-bold text-gray-100">{character}</span>
        </div>

        {/* Back of card */}
        <div 
          className={`absolute w-full h-full rounded-xl bg-gray-800 border border-gray-700 shadow-xl flex flex-col items-center justify-center transform transition-transform duration-500 ${
            !isFlipped ? 'rotate-y-180 invisible' : ''
          }`}
          style={{ backfaceVisibility: 'hidden' }}
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

          <div className="mt-6 grid grid-cols-4 gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onResult('AGAIN');
              }}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
            >
              Again (C)
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onResult('HARD');
              }}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded transition-colors"
            >
              Hard (V)
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onResult('GOOD');
              }}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
            >
              Good (B)
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onResult('EASY');
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
            >
              Easy (N)
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}