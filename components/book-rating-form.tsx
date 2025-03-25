"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import RatingStars from "@/components/rating-stars"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { saveClientRating, getClientRatingForBook } from "@/lib/client-storage"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

// Define the form validation schema
const ratingFormSchema = z.object({
  rating: z.number().min(1, "Please select a rating"),
  review: z.string().max(1000, "Review must be less than 1000 characters"),
})

type RatingFormValues = z.infer<typeof ratingFormSchema>

// Update the props interface to include an onRatingSubmit callback
interface BookRatingFormProps {
  bookId: string
  onRatingSubmit?: () => void
}

export default function BookRatingForm({ bookId, onRatingSubmit }: BookRatingFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [existingRating, setExistingRating] = useState<{ rating: number; review: string } | null>(null)

  // Initialize form with react-hook-form and zod validation
  const form = useForm<RatingFormValues>({
    resolver: zodResolver(ratingFormSchema),
    defaultValues: {
      rating: 0,
      review: "",
    },
  })

  // Load existing rating if available
  useEffect(() => {
    if (typeof window !== "undefined") {
      const rating = getClientRatingForBook(bookId)
      if (rating) {
        setExistingRating({ rating: rating.rating, review: rating.review })
        form.setValue("rating", rating.rating)
        form.setValue("review", rating.review)
      }
    }
  }, [bookId, form])

  // Custom handler for rating changes
  const handleRatingChange = (value: number) => {
    form.setValue("rating", value)
    // Trigger validation after setting the value
    form.trigger("rating")
  }

  const onSubmit = async (values: RatingFormValues) => {
    setIsSubmitting(true)

    try {
      // Save rating to localStorage
      const success = saveClientRating(bookId, values.rating, values.review)

      if (success) {
        toast({
          title: existingRating ? "Rating updated" : "Rating submitted",
          description: "Thank you for your feedback!",
        })

        // Update the existing rating state
        setExistingRating({ rating: values.rating, review: values.review })

        // Call the onRatingSubmit callback if provided
        if (onRatingSubmit) {
          onRatingSubmit()
        }

        // Refresh the page to show updated ratings
        router.refresh()
      } else {
        throw new Error("Failed to save rating")
      }
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

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Rating</FormLabel>
                <FormControl>
                  <div className="pt-2">
                    <RatingStars
                      rating={field.value}
                      interactive={true}
                      size="lg"
                      onRatingChange={handleRatingChange}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="review"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Review (Optional)</FormLabel>
                <FormControl>
                  <Textarea placeholder="Share your thoughts about this book..." rows={4} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : existingRating ? "Update Rating" : "Submit Rating"}
          </Button>
        </form>
      </Form>
    </div>
  )
}

