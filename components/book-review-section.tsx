"use client"

import { useState, useEffect } from "react"
import { Separator } from "@/components/ui/separator"
import BookRatingForm from "@/components/book-rating-form"
import BookReviews from "@/components/book-reviews"
import UserBookReview from "@/components/user-book-review"
import type { Book } from "@/lib/types"
import { getClientRatingForBook } from "@/lib/client-storage"

interface BookReviewSectionProps {
  book: Book
}

export default function BookReviewSection({ book }: BookReviewSectionProps) {
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [hasUserReview, setHasUserReview] = useState(false)
  const [isEditingReview, setIsEditingReview] = useState(false)

  // Check if the user has already reviewed this book
  useEffect(() => {
    const userReview = getClientRatingForBook(book.id)
    setHasUserReview(!!userReview)
    // If user doesn't have a review, show the form by default
    setIsEditingReview(!userReview)
  }, [book.id, refreshTrigger])

  // Listen for storage events to update in real-time
  useEffect(() => {
    const handleStorageChange = () => {
      const userReview = getClientRatingForBook(book.id)
      setHasUserReview(!!userReview)
    }

    window.addEventListener("storage", handleStorageChange)
    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [book.id])

  const handleRatingSubmit = () => {
    // Increment the refresh trigger to cause the reviews to update
    setRefreshTrigger((prev) => prev + 1)
    // After submitting, show the review instead of the form
    setIsEditingReview(false)
  }

  const handleEditClick = () => {
    setIsEditingReview(true)
  }

  return (
    <>
      <BookReviews book={book} refreshTrigger={refreshTrigger} />

      <Separator className="my-6" />

      <div id="rate-book">
        {hasUserReview && !isEditingReview ? (
          <UserBookReview bookId={book.id} onEditClick={handleEditClick} refreshTrigger={refreshTrigger} />
        ) : (
          <BookRatingForm bookId={book.id} onRatingSubmit={handleRatingSubmit} />
        )}
      </div>
    </>
  )
}

