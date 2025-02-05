'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface DueCounts {
  learnCount: number
  reviewCount: number
}

export function Navbar() {
  const [dueCounts, setDueCounts] = useState<DueCounts>({ learnCount: 0, reviewCount: 0 })
  const pathname = usePathname()

  useEffect(() => {
    async function fetchDueCount() {
      try {
        const res = await fetch('/api/stats/due-count')
        const data = await res.json()
        setDueCounts(data)
      } catch (error) {
        console.error('Error fetching due counts:', error)
      }
    }
    fetchDueCount()
  }, [])

  return (
    <nav className="bg-gray-800 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-white font-bold">
              Kanji Learning
            </Link>
          </div>
          <div className="flex space-x-4">
            <Link
              href="/learn"
              className={`
                px-3 py-2 rounded-md text-sm font-medium 
                ${pathname === '/learn'
                  ? 'bg-green-600 text-white'
                  : 'text-gray-300 hover:bg-green-700 hover:text-white'
                }
              `}
            >
              Learn ({dueCounts.learnCount})
            </Link>
            <Link
              href="/review"
              className={`
                px-3 py-2 rounded-md text-sm font-medium 
                ${pathname === '/review'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-blue-700 hover:text-white'
                }
              `}
            >
              Review ({dueCounts.reviewCount})
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}