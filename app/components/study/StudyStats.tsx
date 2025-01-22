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

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Add a small delay to ensure session completion
        await new Promise(resolve => setTimeout(resolve, 500));
  
        if (sessionId) {
          const sessionRes = await fetch(`/api/sessions/${sessionId}`)
          const sessionData = await sessionRes.json()
          setSessionStats({
            totalCards: sessionData.totalCards,
            results: sessionData.results,
            reviewCount: sessionData.reviewCount
          })
        }
  
        if (showOverall) {
          const overallRes = await fetch('/api/stats/overall')
          const overallData = await overallRes.json()
          setOverallStats(overallData)
        }
      } catch (error) {
        console.error('Error fetching stats:', error)
      }
    }
  
    fetchStats()
  }, [sessionId, showOverall])

  if (!sessionStats) return null

  return (
    <div className="space-y-8">
      {/* Today's Reviews - Single centered card */}
      <div className="flex justify-center">
        <div className="bg-gray-800 p-4 rounded-lg w-64">
          <h3 className="text-gray-400 text-sm">Reviews Today</h3>
          <p className="text-2xl font-bold text-white">{sessionStats.reviewCount}</p>
        </div>
      </div>

      {/* Review Results Row */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-gray-400 text-sm">AGAIN</h3>
          <p className="text-2xl font-bold text-white">{sessionStats.results.AGAIN}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-gray-400 text-sm">HARD</h3>
          <p className="text-2xl font-bold text-white">{sessionStats.results.HARD}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-gray-400 text-sm">GOOD</h3>
          <p className="text-2xl font-bold text-white">{sessionStats.results.GOOD}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-gray-400 text-sm">EASY</h3>
          <p className="text-2xl font-bold text-white">{sessionStats.results.EASY}</p>
        </div>
      </div>

      {/* Overall Stats Row */}
      {overallStats && (
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-gray-400 text-sm">Total Cards</h3>
            <p className="text-2xl font-bold text-white">{overallStats.totalCards}</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-gray-400 text-sm">Cards Learned</h3>
            <p className="text-2xl font-bold text-white">{overallStats.cardsLearned}</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-gray-400 text-sm">Best Streak</h3>
            <p className="text-2xl font-bold text-white">{overallStats.bestStreak}</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-gray-400 text-sm">Current Streak</h3>
            <p className="text-2xl font-bold text-white">{overallStats.currentStreak}</p>
          </div>
        </div>
      )}
    </div>
  )
}