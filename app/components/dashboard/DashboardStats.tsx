'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ReviewForecast } from './ReviewForecast'

interface Stats {
  totalCards: number
  cardsLearned: number
  bestStreak: number
  currentStreak: number
}

interface DueCounts {
  learnCount: number
  reviewCount: number
  totalNewCards: number
}

export function DashboardStats() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [dueCounts, setDueCounts] = useState<DueCounts>({
    learnCount: 0,
    reviewCount: 0,
    totalNewCards: 0
  })

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsResponse, dueCountResponse] = await Promise.all([
          fetch('/api/stats/overall'),
          fetch('/api/stats/due-count')
        ])

        if (!statsResponse.ok || !dueCountResponse.ok) {
          throw new Error('Failed to fetch data')
        }

        const statsData = await statsResponse.json()
        const dueData = await dueCountResponse.json()

        setStats(statsData)
        setDueCounts(dueData)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return (
      <div className="bg-gray-800 rounded-lg p-4 lg:p-6 animate-pulse">
        <div className="h-4 bg-gray-700 rounded w-1/4 mb-4"></div>
        <div className="space-y-3">
          <div className="h-8 bg-gray-700 rounded"></div>
          <div className="h-8 bg-gray-700 rounded"></div>
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="bg-gray-800 rounded-lg p-4 lg:p-6">
        <p className="text-gray-400">Unable to load stats</p>
      </div>
    )
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="bg-gray-800 rounded-lg p-4 lg:p-6">
        <h2 className="text-xl font-semibold mb-4">Learning Progress</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          <div className="bg-gray-700 p-3 lg:p-4 rounded-lg">
            <p className="text-sm text-gray-400">Total Reviews Completed</p>
            <p className="text-xl lg:text-2xl font-bold">{stats.totalCards}</p>
          </div>
          <div className="bg-gray-700 p-3 lg:p-4 rounded-lg">
            <p className="text-sm text-gray-400">Cards Studied in Last Session</p>
            <p className="text-xl lg:text-2xl font-bold">{stats.cardsLearned}</p>
          </div>
          <div className="bg-gray-700 p-3 lg:p-4 rounded-lg">
            <p className="text-sm text-gray-400">Best Good/Easy Streak</p>
            <p className="text-xl lg:text-2xl font-bold">{stats.bestStreak}</p>
          </div>
          <div className="bg-gray-700 p-3 lg:p-4 rounded-lg">
            <p className="text-sm text-gray-400">Current Good/Easy Streak</p>
            <p className="text-xl lg:text-2xl font-bold">{stats.currentStreak}</p>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <Link
            href="/learn"
            className={`w-full rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-green-600 hover:bg-green-700 text-white gap-2 text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 ${dueCounts.learnCount === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            {...(dueCounts.learnCount === 0 ? { 'aria-disabled': true } : {})}
          >
            Learn New Cards ({dueCounts.learnCount}) →
          </Link>
          
          <Link
            href="/review"
            className={`w-full rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white gap-2 text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 ${dueCounts.reviewCount === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            {...(dueCounts.reviewCount === 0 ? { 'aria-disabled': true } : {})}
          >
            Review Cards ({dueCounts.reviewCount}) →
          </Link>
        </div>
      </div>

      <ReviewForecast />
    </div>
  )
}