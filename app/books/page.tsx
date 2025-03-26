import { Suspense } from "react"
import type { Metadata } from "next"
import { getBooks } from "@/lib/actions"
import BookCard from "@/components/book-card"
import { Skeleton } from "@/components/ui/skeleton"
import BookSearch from "@/components/book-search"

export const metadata: Metadata = {
  title: "Browse Books | BookBuddy",
  description: "Discover and explore books from our extensive collection",
}

export default async function BooksPage({
  searchParams,
}: {
  searchParams: { query?: string; genre?: string }
}) {
  const query = searchParams.query || ""
  const genre = searchParams.genre || ""

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Browse Books</h1>

      <BookSearch />

      <Suspense fallback={<BookGridSkeleton />}>
        <BookGrid query={query} genre={genre} />
      </Suspense>
    </div>
  )
}

async function BookGrid({ query, genre }: { query: string; genre: string }) {
  // Only pass genre to getBooks if it's not "all"
  const books = await getBooks({
    query,
    genre: genre !== "all" ? genre : undefined,
  })

  if (books.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No books found. Try a different search term or genre.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-6">
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  )
}

function BookGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-6">
      {[...Array(10)].map((_, index) => (
        <div key={index} className="space-y-3">
          <Skeleton className="aspect-[2/3] w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      ))}
    </div>
  )
}

