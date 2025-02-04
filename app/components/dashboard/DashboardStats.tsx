'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Stats {
  totalCards: number
  cardsLearned: number
  bestStreak: number
  currentStreak: number
}

export function DashboardStats() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [dueCount, setDueCount] = useState(0)

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/stats/overall')
        if (!response.ok) throw new Error('Failed to fetch stats')
        const data = await response.json()
        setStats(data)
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setIsLoading(false)
      }
    }

    async function fetchDueCount() {
      const res = await fetch('/api/stats/due-count')
      const data = await res.json()
      setDueCount(data.count)
    }

    fetchStats()
    fetchDueCount()
  }, [])

  if (isLoading) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 animate-pulse">
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
      <div className="bg-gray-800 rounded-lg p-6">
        <p className="text-gray-400">Unable to load stats</p>
      </div>
    )
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 space-y-4">
      <h2 className="text-xl font-semibold">Learning Progress</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-700 p-4 rounded-lg">
          <p className="text-sm text-gray-400">Total Reviews Completed</p>
          <p className="text-2xl font-bold">{stats.totalCards}</p>
        </div>
        <div className="bg-gray-700 p-4 rounded-lg">
          <p className="text-sm text-gray-400">Cards Reviewed in Last Session</p>
          <p className="text-2xl font-bold">{stats.cardsLearned}</p>
        </div>
        <div className="bg-gray-700 p-4 rounded-lg">
          <p className="text-sm text-gray-400">Best Good/Easy Streak</p>
          <p className="text-2xl font-bold">{stats.bestStreak}</p>
        </div>
        <div className="bg-gray-700 p-4 rounded-lg">
          <p className="text-sm text-gray-400">Current Good/Easy Streak</p>
          <p className="text-2xl font-bold">{stats.currentStreak}</p>
        </div>
      </div>

      <Link
        href="/study"
        className="mt-4 w-full rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
      >
        Start Studying ({dueCount}) →
      </Link>
    </div>
  )
}