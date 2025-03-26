"use client"

import { useState, useEffect } from "react"
import { getClientRatings } from "@/lib/client-storage"
import { useReadingLists } from "@/components/reading-lists-provider"

export default function ProfileStats() {
  const [stats, setStats] = useState({ listsCreated: 0, ratingsGiven: 0 })
  const { readingLists } = useReadingLists()

  useEffect(() => {
    // Get ratings from client storage
    const ratings = getClientRatings()

    setStats({
      listsCreated: readingLists.length,
      ratingsGiven: ratings.length,
    })
  }, [readingLists])

  // Listen for storage events to update in real-time
  useEffect(() => {
    const handleStorageChange = () => {
      const ratings = getClientRatings()
      setStats((prev) => ({
        ...prev,
        ratingsGiven: ratings.length,
      }))
    }

    window.addEventListener("storage", handleStorageChange)
    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  return (
    <div className="grid grid-cols-2 gap-4 text-center">
      <div>
        <p className="text-2xl font-bold">{stats.listsCreated}</p>
        <p className="text-xs text-muted-foreground">Lists</p>
      </div>
      <div>
        <p className="text-2xl font-bold">{stats.ratingsGiven}</p>
        <p className="text-xs text-muted-foreground">Ratings</p>
      </div>
    </div>
  )
}

