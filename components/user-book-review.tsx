"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"
import { getClientRatingForBook, getUserName } from "@/lib/client-storage"
import RatingStars from "@/components/rating-stars"
import { Pencil } from "lucide-react"
import UserNameDisplay from "@/components/user-name-display"

interface UserBookReviewProps {
  bookId: string
  onEditClick: () => void
  refreshTrigger?: number
}

export default function UserBookReview({ bookId, onEditClick, refreshTrigger = 0 }: UserBookReviewProps) {
  const [review, setReview] = useState<{
    rating: number
    review: string
    timestamp: number
  } | null>(null)

  useEffect(() => {
    const userReview = getClientRatingForBook(bookId)
    setReview(userReview)
  }, [bookId, refreshTrigger])

  // Listen for storage events to update in real-time
  useEffect(() => {
    const handleStorageChange = () => {
      const userReview = getClientRatingForBook(bookId)
      setReview(userReview)
    }

    window.addEventListener("storage", handleStorageChange)
    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [bookId])

  // Add the getInitials function
  const getInitials = () => {
    const name = getUserName()
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  if (!review) {
    return null
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Your Review</h2>
        <Button variant="outline" size="sm" onClick={onEditClick}>
          <Pencil className="mr-2 h-4 w-4" />
          Edit Review
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <Avatar>
              <AvatarFallback>{getInitials()}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <UserNameDisplay />
                  <div className="flex items-center gap-2">
                    <RatingStars rating={review.rating} size="sm" />
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(review.timestamp), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              </div>
              {review.review && <p className="mt-2 text-sm">{review.review}</p>}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

