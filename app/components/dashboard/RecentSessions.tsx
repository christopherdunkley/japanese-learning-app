'use client'

import { useState, useEffect } from 'react'
import { SessionGraph } from './SessionGraph'

interface Session {
  id: string
  startedAt: string
  endedAt: string
  results: {
    AGAIN: number
    HARD: number
    GOOD: number
    EASY: number
  }
  reviewCount: number
}

export function RecentSessions() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchSessions() {
      try {
        const response = await fetch('/api/sessions/recent')
        if (!response.ok) throw new Error('Failed to fetch sessions')
        const data = await response.json()
        setSessions(data)
      } catch (error) {
        console.error('Error fetching sessions:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSessions()
  }, [])

  if (isLoading) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 animate-pulse">
        <div className="h-4 bg-gray-700 rounded w-1/4 mb-4"></div>
        <div className="space-y-3">
          <div className="h-24 bg-gray-700 rounded"></div>
          <div className="h-24 bg-gray-700 rounded"></div>
        </div>
      </div>
    )
  }

  if (!sessions.length) {
    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Study Sessions</h2>
        <p className="text-gray-400">No study sessions yet.</p>
      </div>
    )
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Recent Study Sessions</h2>
      <div className="h-[400px] overflow-y-auto custom-scrollbar pr-2 space-y-4">
        {sessions.map((session) => (
          <div key={session.id} className="bg-gray-700 p-4 rounded-lg relative overflow-hidden">
            {/* Background Graph */}
            <SessionGraph results={session.results} />
            
            {/* Content */}
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-sm text-gray-400">
                    {new Date(session.startedAt).toLocaleDateString()}
                  </p>
                  <p className="font-medium">
                    {Object.values(session.results).reduce((a, b) => a + b, 0)} cards reviewed
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm">
                    {(() => {
                      const totalReviews = Object.values(session.results).reduce((a, b) => a + b, 0);
                      const successfulReviews = session.results.GOOD + session.results.EASY;
                      return totalReviews > 0 
                        ? Math.round((successfulReviews / totalReviews) * 100) 
                        : 0;
                    })()}% success rate
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2 text-sm">
                <div>
                  <p className="text-xs text-gray-400">AGAIN</p>
                  <p>{session.results.AGAIN}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">HARD</p>
                  <p>{session.results.HARD}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">GOOD</p>
                  <p>{session.results.GOOD}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">EASY</p>
                  <p>{session.results.EASY}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}