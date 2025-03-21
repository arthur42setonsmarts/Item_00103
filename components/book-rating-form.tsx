"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import RatingStars from "@/components/rating-stars"
import { useToast } from "@/hooks/use-toast"
import { rateBook } from "@/lib/actions"
import { useRouter } from "next/navigation"

interface BookRatingFormProps {
  bookId: string
}

export default function BookRatingForm({ bookId }: BookRatingFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [rating, setRating] = useState(0)
  const [review, setReview] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (rating === 0) {
      toast({
        title: "Rating required",
        description: "Please select a rating before submitting",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      await rateBook(bookId, rating, review)
      toast({
        title: "Rating submitted",
        description: "Thank you for your feedback!",
      })

      // Reset form
      setRating(0)
      setReview("")

      // Refresh the page to show updated ratings
      router.refresh()
    } catch (error) {
      console.error("Error submitting rating:", error)
      toast({
        title: "Error",
        description: "Failed to submit rating. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Rate This Book</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Your Rating</label>
          <RatingStars rating={rating} interactive={true} size="lg" onRatingChange={setRating} />
        </div>

        <div>
          <label htmlFor="review" className="block text-sm font-medium mb-2">
            Your Review (Optional)
          </label>
          <Textarea
            id="review"
            placeholder="Share your thoughts about this book..."
            value={review}
            onChange={(e) => setReview(e.target.value)}
            rows={4}
          />
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Rating"}
        </Button>
      </form>
    </div>
  )
}

