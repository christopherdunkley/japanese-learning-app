'use client'

import { useEffect, useState } from 'react'
import type { SessionStats, OverallStats } from '@/services/stats.service'

interface StudyStatsProps {
  sessionStartTime: Date
  showOverall?: boolean
}

export function StudyStats({ sessionStartTime, showOverall = false }: StudyStatsProps) {
  const [sessionStats, setSessionStats] = useState<SessionStats | null>(null)
  const [overallStats, setOverallStats] = useState<OverallStats | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const sessionRes = await fetch(`/api/stats/session?startTime=${sessionStartTime.toISOString()}`)
        const sessionData = await sessionRes.json()
        setSessionStats(sessionData)

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
  }, [sessionStartTime, showOverall])

  if (!sessionStats) return null

  return (
    <div className="space-y-8">
      {/* Today's Reviews - Single centered card */}
      <div className="flex justify-center">
        <div className="bg-gray-800 p-4 rounded-lg w-64">
          <h3 className="text-gray-400 text-sm">Reviews Today</h3>
          <p className="text-2xl font-bold text-white">{sessionStats.totalReviewed}</p>
        </div>
      </div>

      {/* Review Results Row */}
      <div className="grid grid-cols-4 gap-4">
        {Object.entries(sessionStats.results).map(([result, count]) => (
          <div key={result} className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-gray-400 text-sm">{result}</h3>
            <p className="text-2xl font-bold text-white">{count}</p>
          </div>
        ))}
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