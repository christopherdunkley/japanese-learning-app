'use client'

import { useState, useEffect } from 'react'

interface StudyStatsProps {
  sessionId: string | null;
  showOverall?: boolean;
}

interface SessionStats {
  totalCards: number;
  results: {
    AGAIN: number;
    HARD: number;
    GOOD: number;
    EASY: number;
  };
  reviewCount: number;
}

interface OverallStats {
  totalCards: number;
  cardsLearned: number;
  bestStreak: number;
  currentStreak: number;
}

export function StudyStats({ sessionId, showOverall = false }: StudyStatsProps) {
  const [sessionStats, setSessionStats] = useState<SessionStats | null>(null)
  const [overallStats, setOverallStats] = useState<OverallStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (sessionId) {
          const [sessionData, overallData] = await Promise.all([
            fetch(`/api/sessions/${sessionId}`).then(res => res.json()),
            showOverall ? fetch('/api/stats/overall').then(res => res.json()) : null
          ])

          setSessionStats({
            totalCards: sessionData.totalCards,
            results: sessionData.results,
            reviewCount: sessionData.reviewCount
          })

          if (overallData) {
            setOverallStats(overallData)
          }
        }
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setIsLoading(false)
      }
    }
  
    if (sessionId) {
      fetchStats()
    }
  }, [sessionId, showOverall])

  if (isLoading || !sessionStats) return (
    <div className="flex justify-center items-center h-48">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  )

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Review Results Row */}
      <div className="grid grid-cols-4 gap-4">
        {Object.entries(sessionStats.results).map(([key, value]) => (
          <div 
            key={key} 
            className="bg-gray-800 p-4 rounded-lg"
          >
            <h3 className="text-gray-400 text-sm">{key}</h3>
            <p className="text-2xl font-bold text-white">{value}</p>
          </div>
        ))}
      </div>

      {/* Overall Stats Row */}
      {overallStats && (
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-gray-400 text-sm">Total Reviews Completed</h3>
            <p className="text-2xl font-bold text-white">{overallStats.totalCards}</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-gray-400 text-sm">Cards Reviewed This Session</h3>
            <p className="text-2xl font-bold text-white">{overallStats.cardsLearned}</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-gray-400 text-sm">Best Good/Easy Streak</h3>
            <p className="text-2xl font-bold text-white">{overallStats.bestStreak}</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-gray-400 text-sm">Current Good/Easy Streak</h3>
            <p className="text-2xl font-bold text-white">{overallStats.currentStreak}</p>
          </div>
        </div>
      )}
    </div>
  )
}