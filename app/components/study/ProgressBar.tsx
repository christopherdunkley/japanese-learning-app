'use client'

interface ProgressBarProps {
  current: number
  total: number
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = Math.round((current / total) * 100)
  
  return (
    <div className="w-full mt-4">
      <div className="flex justify-between text-sm text-gray-400 mb-2">
        <span>{current} of {total} cards</span>
        <span>{percentage}%</span>
      </div>
      <div className="h-2 bg-gray-700 rounded-full">
        <div 
          className="h-full bg-blue-600 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}