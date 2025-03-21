"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getUserReadingStats } from "@/lib/actions"
import { Skeleton } from "@/components/ui/skeleton"

interface ReadingStatsData {
  booksReadByMonth: { month: string; count: number }[]
  genreDistribution: { genre: string; count: number }[]
  averageRating: number
  pagesRead: number
  readingStreak: number
}

export default function ReadingStats() {
  const [stats, setStats] = useState<ReadingStatsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getUserReadingStats()
        setStats(data)
      } catch (error) {
        console.error("Failed to fetch reading stats:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {[...Array(4)].map((_, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-1/3" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-24 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Unable to load reading stats. Please try again later.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Reading Activity</CardTitle>
          <CardDescription>Books read per month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] flex items-end justify-between">
            {stats.booksReadByMonth.map((item) => (
              <div key={item.month} className="flex flex-col items-center">
                <div
                  className="w-8 bg-primary rounded-t-md"
                  style={{
                    height: `${(item.count / Math.max(...stats.booksReadByMonth.map((i) => i.count))) * 150}px`,
                  }}
                ></div>
                <span className="text-xs mt-2">{item.month}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Genre Distribution</CardTitle>
          <CardDescription>Books read by genre</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.genreDistribution.map((item) => (
              <div key={item.genre} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>{item.genre}</span>
                  <span>{item.count} books</span>
                </div>
                <div className="h-2 w-full rounded-full bg-secondary">
                  <div
                    className="h-2 rounded-full bg-primary"
                    style={{
                      width: `${(item.count / Math.max(...stats.genreDistribution.map((i) => i.count))) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Reading Summary</CardTitle>
          <CardDescription>Your reading achievements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1 rounded-lg border p-4 text-center">
              <span className="text-3xl font-bold">{stats.averageRating.toFixed(1)}</span>
              <p className="text-xs text-muted-foreground">Average Rating</p>
            </div>
            <div className="space-y-1 rounded-lg border p-4 text-center">
              <span className="text-3xl font-bold">{stats.pagesRead}</span>
              <p className="text-xs text-muted-foreground">Pages Read</p>
            </div>
            <div className="space-y-1 rounded-lg border p-4 text-center">
              <span className="text-3xl font-bold">{stats.readingStreak}</span>
              <p className="text-xs text-muted-foreground">Day Streak</p>
            </div>
            <div className="space-y-1 rounded-lg border p-4 text-center">
              <span className="text-3xl font-bold">{stats.genreDistribution.length}</span>
              <p className="text-xs text-muted-foreground">Genres Explored</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

