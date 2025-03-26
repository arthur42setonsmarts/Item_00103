"use client"

import { useEffect, useState } from "react"
import RatingStars from "@/components/rating-stars"
import { getBookRealRatings, getClientRatingForBook } from "@/lib/client-storage"

interface RealBookRatingProps {
  bookId: string
  defaultRating?: number
  defaultCount?: number
  refreshTrigger?: number
  showCount?: boolean
  size?: "sm" | "md" | "lg"
  showEmptyStars?: boolean
}

export default function RealBookRating({
  bookId,
  defaultRating = 0,
  defaultCount = 0,
  refreshTrigger = 0,
  showCount = true,
  size = "md",
  showEmptyStars = true,
}: RealBookRatingProps) {
  const [rating, setRating] = useState(defaultRating)
  const [count, setCount] = useState(defaultCount)
  const [hasRatings, setHasRatings] = useState(false)

  useEffect(() => {
    // Only run in browser
    if (typeof window === "undefined") return

    // Get all ratings from client storage
    const { averageRating, ratingsCount } = getBookRealRatings(bookId)

    // Check if the current user has rated this book
    const userRating = getClientRatingForBook(bookId)

    // If there are user ratings, use them
    if (ratingsCount > 0 || userRating) {
      setRating(averageRating)
      setCount(ratingsCount)
      setHasRatings(true)
    } else {
      // If showEmptyStars is true, set rating to 0 to show empty stars
      // Otherwise use the default rating (which might be 0 anyway)
      setRating(showEmptyStars ? 0 : defaultRating)
      setCount(0)
      setHasRatings(false)
    }
  }, [bookId, defaultRating, defaultCount, refreshTrigger, showEmptyStars])

  // Listen for storage events to update ratings in real-time
  useEffect(() => {
    const handleStorageChange = () => {
      const { averageRating, ratingsCount } = getBookRealRatings(bookId)
      const userRating = getClientRatingForBook(bookId)

      if (ratingsCount > 0 || userRating) {
        setRating(averageRating)
        setCount(ratingsCount)
        setHasRatings(true)
      } else {
        setRating(showEmptyStars ? 0 : defaultRating)
        setCount(0)
        setHasRatings(false)
      }
    }

    window.addEventListener("storage", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [bookId, defaultRating, showEmptyStars])

  // If there are no ratings and we don't want to show empty stars, don't render anything
  if (!hasRatings && !showEmptyStars && defaultRating === 0) {
    return null
  }

  return (
    <div className="flex items-center">
      <RatingStars rating={rating} size={size} />
      {showCount && hasRatings && (
        <span className="ml-2 text-sm text-muted-foreground">
          ({count} {count === 1 ? "rating" : "ratings"})
        </span>
      )}
    </div>
  )
}

