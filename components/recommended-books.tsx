"use client"

import { useEffect, useState } from "react"
import type { Book } from "@/lib/types"
import BookCard from "@/components/book-card"
import { getRecommendedBooks } from "@/lib/actions"
import { Skeleton } from "@/components/ui/skeleton"

export default function RecommendedBooks() {
  const [books, setBooks] = useState<Book[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const recommendedBooks = await getRecommendedBooks()
        setBooks(recommendedBooks)
      } catch (error) {
        console.error("Failed to fetch recommended books:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBooks()
  }, [])

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="space-y-3">
            <Skeleton className="aspect-[2/3] w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        ))}
      </div>
    )
  }

  if (books.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Rate some books to get personalized recommendations!</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  )
}

