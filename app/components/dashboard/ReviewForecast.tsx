'use client'

import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, TooltipProps } from 'recharts'

interface HourlyData {
  hour: number
  count: number
}

interface ForecastData {
  date: string
  reviews: number
  day: string
  hourlyBreakdown: HourlyData[]
}

interface CustomTooltipProps extends TooltipProps<number, string> {
  active?: boolean
  payload?: Array<{ value: number }>
  label?: string
}

export function ReviewForecast() {
  const [data, setData] = useState<ForecastData[]>([])
  const [selectedDay, setSelectedDay] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchForecast() {
      try {
        const response = await fetch('/api/stats/forecast')
        if (!response.ok) throw new Error('Failed to fetch forecast')
        const forecastData = await response.json()
        setData(forecastData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load forecast')
      } finally {
        setIsLoading(false)
      }
    }

    fetchForecast()
  }, [])

  if (isLoading) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 animate-pulse">
        <div className="h-4 bg-gray-700 rounded w-1/4 mb-4"></div>
        <div className="h-48 bg-gray-700 rounded"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <p className="text-gray-400">Failed to load review forecast</p>
      </div>
    )
  }

  const maxReviews = Math.max(...data.map(d => d.reviews))

  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      const dayData = data.find(d => d.day === label)
      if (!dayData) return null

      return (
        <div className="bg-gray-900 p-3 rounded-lg shadow-lg border border-gray-700">
          <p className="font-semibold mb-2">{dayData.day} - {dayData.date}</p>
          <p className="text-blue-400">{payload[0].value} reviews</p>
          {dayData.hourlyBreakdown.some(h => h.count > 0) && (
            <div className="mt-2 text-sm">
              <p className="text-gray-400 mb-1">Review times:</p>
              {dayData.hourlyBreakdown
                .filter(h => h.count > 0)
                .map(h => (
                  <p key={h.hour}>
                    {h.hour.toString().padStart(2, '0')}:00 - {h.count} reviews
                  </p>
                ))
              }
            </div>
          )}
        </div>
      )
    }
    return null
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4 lg:p-6 w-full">
      <h3 className="text-lg font-semibold mb-4">Upcoming Reviews</h3>
      <div className="h-[250px] lg:h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={data} 
            margin={{ 
              top: 20, 
              right: 20, 
              left: 0, 
              bottom: 20 
            }}
            onMouseLeave={() => setSelectedDay(null)}
          >
            <XAxis 
              dataKey="day" 
              stroke="#9CA3AF"
              tick={{ fill: '#9CA3AF' }}
              tickSize={5}
            />
            <YAxis 
              stroke="#9CA3AF"
              tick={{ fill: '#9CA3AF' }}
              allowDecimals={false}
              domain={[0, maxReviews > 0 ? 'auto' : 5]}
              width={30}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="reviews" 
              radius={[4, 4, 0, 0]}
              animationDuration={1000}
              className="transition-all duration-300"
              onMouseEnter={(data) => setSelectedDay(data.date)}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={selectedDay === entry.date ? '#60A5FA' : '#3B82F6'}
                  className="transition-colors duration-300"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}