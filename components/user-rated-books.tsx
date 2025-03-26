"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BookOpen } from "lucide-react"
import BookCard from "@/components/book-card"
import { getClientRatings } from "@/lib/client-storage"
import { getBookById } from "@/lib/actions"
import type { Book } from "@/lib/types"

export default function UserRatedBooks() {
  const [books, setBooks] = useState<Array<Book & { reviewTimestamp: number }>>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchRatedBooks = async () => {
      try {
        setIsLoading(true)

        // Get all user ratings from localStorage
        const ratings = getClientRatings()

        // Sort ratings by timestamp (newest first)
        const sortedRatings = [...ratings].sort((a, b) => b.timestamp - a.timestamp)

        // Fetch book details for each rated book
        const ratedBooksPromises = sortedRatings.map(async (rating) => {
          const book = await getBookById(rating.bookId)
          if (book) {
            // Add the review timestamp to the book object
            return { ...book, reviewTimestamp: rating.timestamp }
          }
          return null
        })

        const ratedBooks = (await Promise.all(ratedBooksPromises)).filter(Boolean) as Array<
          Book & { reviewTimestamp: number }
        >
        setBooks(ratedBooks)
      } catch (error) {
        console.error("Error fetching rated books:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRatedBooks()

    // Listen for storage events to update in real-time
    const handleStorageChange = () => {
      fetchRatedBooks()
    }

    window.addEventListener("storage", handleStorageChange)
    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 animate-pulse gap-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="bg-muted rounded-lg aspect-[2/3]"></div>
        ))}
      </div>
    )
  }

  if (books.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
        <p className="mt-4 text-muted-foreground">You haven't rated any books yet.</p>
        <Link href="/books">
          <Button className="mt-4">Browse Books</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  )
}

