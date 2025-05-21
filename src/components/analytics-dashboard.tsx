"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Users, FileText, RefreshCw, BarChart } from "lucide-react"

type Stats = {
  activeUsers: string
  coverLettersGenerated: string
  cvImprovementsSuggested: string
}

export default function AnalyticsDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/stats")

      if (!response.ok) {
        throw new Error("Failed to fetch stats")
      }

      const data = await response.json()
      setStats(data)
      setError(null)
    } catch (err) {
      console.error("Error fetching stats:", err)
      setError("Could not load analytics data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()

    // Set up polling to refresh stats every minute
    const intervalId = setInterval(fetchStats, 60000)

    return () => clearInterval(intervalId)
  }, [])

  if (loading && !stats) {
    return (
      <div className="flex justify-center p-2">
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  // Fallback stats if there's an error or no data
  const displayStats = stats || {
    activeUsers: "0",
    coverLettersGenerated: "0",
    cvImprovementsSuggested: "0",
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-b">
        <div className="flex items-center">
          <BarChart className="h-3.5 w-3.5 text-gray-500 mr-1.5" />
          <h3 className="text-xs font-medium text-gray-700">Usage Statistics</h3>
        </div>
        <button
          onClick={fetchStats}
          className="text-xs text-gray-500 hover:text-gray-700 flex items-center transition-colors"
        >
          <RefreshCw className="h-3 w-3 mr-1" />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-3 divide-x">
        <StatCard
          icon={<Users className="h-3.5 w-3.5 text-blue-500" />}
          label="Active Users"
          value={displayStats.activeUsers}
          subtext="Past 7 days"
        />
        <StatCard
          icon={<FileText className="h-3.5 w-3.5 text-green-500" />}
          label="Cover Letters"
          value={displayStats.coverLettersGenerated}
          subtext="Total generated"
        />
        <StatCard
          icon={<RefreshCw className="h-3.5 w-3.5 text-amber-500" />}
          label="CV Improvements"
          value={displayStats.cvImprovementsSuggested}
          subtext="Total suggested"
        />
      </div>
    </div>
  )
}

function StatCard({
  icon,
  label,
  value,
  subtext,
}: {
  icon: React.ReactNode
  label: string
  value: string
  subtext: string
}) {
  return (
    <div className="py-2 px-3">
      <div className="flex items-center mb-1">
        {icon}
        <span className="text-xs font-medium text-gray-600 ml-1.5">{label}</span>
      </div>
      <div className="flex items-baseline">
        <span className="text-xl font-bold text-gray-800">{value}</span>
        <span className="ml-1.5 text-[10px] text-gray-500">{subtext}</span>
      </div>
    </div>
  )
}
