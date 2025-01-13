export type FlashcardSide = 'front' | 'back'

export interface FlashcardProps {
  character: string
  onyomi: string | null
  kunyomi: string | null
  meaning: string
  onResult?: (result: 'EASY' | 'GOOD' | 'HARD' | 'AGAIN') => void
}

export interface ReviewButtonProps {
  label: string
  result: 'EASY' | 'GOOD' | 'HARD' | 'AGAIN'
  onClick: () => void
  className?: string
}