"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import RatingStars from "@/components/rating-stars"
import { getClientRatings, getUserName, getClientRatingForBook } from "@/lib/client-storage"
import type { Book } from "@/lib/types"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"
import UserNameDisplay from "@/components/user-name-display"

interface BookReviewsProps {
  book: Book
  refreshTrigger?: number
}

type Review = {
  bookId: string
  rating: number
  review: string
  timestamp: number
  userName?: string // Optional user name for mock reviews
  isCurrentUser?: boolean // Flag to identify the current user's review
}

export default function BookReviews({ book, refreshTrigger = 0 }: BookReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [ratingDistribution, setRatingDistribution] = useState<number[]>([0, 0, 0, 0, 0])
  const [averageRating, setAverageRating] = useState(0)
  const [currentUserName, setCurrentUserName] = useState("")

  // Load reviews and calculate statistics
  useEffect(() => {
    // Get current user name
    setCurrentUserName(getUserName())

    // Get all ratings from client storage
    const allRatings = getClientRatings()

    // Get the current user's rating specifically
    const currentUserRating = getClientRatingForBook(book.id)

    // Filter ratings for this book
    let bookReviews = allRatings.filter((rating) => rating.bookId === book.id)

    // If the current user has a rating but it's not in the list (which can happen if they just submitted it),
    // add it to the list
    if (
      currentUserRating &&
      !bookReviews.some(
        (review) => review.timestamp === currentUserRating.timestamp && review.rating === currentUserRating.rating,
      )
    ) {
      bookReviews = [...bookReviews, currentUserRating]
    }

    // Sort by timestamp (newest first)
    bookReviews.sort((a, b) => b.timestamp - a.timestamp)

    // Add mock user names to reviews that aren't from the current user
    const reviewsWithNames = bookReviews.map((review) => {
      // Check if this is the current user's review
      const isCurrentUserReview =
        currentUserRating &&
        review.rating === currentUserRating.rating &&
        review.review === currentUserRating.review &&
        review.timestamp === currentUserRating.timestamp

      if (isCurrentUserReview) {
        return {
          ...review,
          isCurrentUser: true,
        }
      }

      // Add mock names to other reviews
      const mockNames = ["Alex Johnson", "Sam Taylor", "Jordan Smith", "Casey Williams", "Morgan Lee"]
      return {
        ...review,
        userName: mockNames[Math.floor(Math.random() * mockNames.length)],
      }
    })

    setReviews(reviewsWithNames)

    // Calculate rating distribution - from all reviews including the user's
    const distribution = [0, 0, 0, 0, 0]

    // Add ratings from all reviews
    bookReviews.forEach((review) => {
      if (review.rating >= 1 && review.rating <= 5) {
        distribution[review.rating - 1]++
      }
    })

    setRatingDistribution(distribution)

    // Calculate average rating
    if (bookReviews.length > 0) {
      const sum = bookReviews.reduce((total, review) => total + review.rating, 0)
      setAverageRating(sum / bookReviews.length)
    } else {
      setAverageRating(0)
    }
  }, [book.id, refreshTrigger])

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  // Calculate total ratings from actual reviews
  const totalRatings = reviews.length

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Community Reviews</h2>

      {totalRatings > 0 ? (
        <div>
          {/* Rating distribution */}
          <div className="space-y-4 max-w-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-3xl font-bold">{averageRating.toFixed(1)}</span>
                <span className="ml-2 text-muted-foreground">out of 5</span>
              </div>
              <div>
                <RatingStars rating={averageRating} size="lg" />
                <p className="text-sm text-muted-foreground text-right">
                  {totalRatings} {totalRatings === 1 ? "review" : "reviews"}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((stars) => (
                <div key={stars} className="flex items-center gap-2">
                  <div className="w-8 text-sm text-right">{stars} ★</div>
                  <Progress
                    value={totalRatings > 0 ? (ratingDistribution[stars - 1] / totalRatings) * 100 : 0}
                    className="h-2"
                  />
                  <div className="w-10 text-sm text-muted-foreground">{ratingDistribution[stars - 1]}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 border rounded-lg">
          <p className="text-muted-foreground">No reviews yet.</p>
        </div>
      )}

      {totalRatings > 0 && (
        <>
          <Separator />

          {/* Reviews list */}
          <div>
            <h3 className="font-medium mb-4">Reviews</h3>

            <div className="space-y-4">
              {reviews.map((review, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <Avatar>
                        <AvatarFallback>
                          {review.isCurrentUser ? getInitials(currentUserName) : getInitials(review.userName || "")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            {review.isCurrentUser ? (
                              <UserNameDisplay />
                            ) : (
                              <div className="font-medium">{review.userName}</div>
                            )}
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
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

