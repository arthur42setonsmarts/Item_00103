"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface RatingStarsProps {
  rating?: number
  maxRating?: number
  size?: "sm" | "md" | "lg"
  interactive?: boolean
  onRatingChange?: (rating: number) => void
}

export default function RatingStars({
  rating = 0,
  maxRating = 5,
  size = "md",
  interactive = false,
  onRatingChange,
}: RatingStarsProps) {
  const [hoverRating, setHoverRating] = useState(0)

  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  }

  const handleClick = (index: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(index)
    }
  }

  return (
    <div className="flex items-center">
      {[...Array(maxRating)].map((_, index) => {
        const starValue = index + 1
        const isFilled = interactive ? starValue <= (hoverRating || rating) : starValue <= rating

        return (
          <Star
            key={index}
            className={cn(
              sizeClasses[size],
              "transition-colors mr-1",
              isFilled ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground",
              interactive && "cursor-pointer",
            )}
            onClick={() => handleClick(starValue)}
            onMouseEnter={() => interactive && setHoverRating(starValue)}
            onMouseLeave={() => interactive && setHoverRating(0)}
          />
        )
      })}
      {rating > 0 && !interactive && <span className="ml-2 text-sm text-muted-foreground">{rating.toFixed(1)}</span>}
    </div>
  )
}

