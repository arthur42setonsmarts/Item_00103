import type { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"
import { getBookById, getSimilarBooks } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { BookOpen } from "lucide-react"
import RatingStars from "@/components/rating-stars"
import BookRatingForm from "@/components/book-rating-form"
import BookCard from "@/components/book-card"
import AddToReadingListButton from "@/components/add-to-reading-list-button"
import ShareButton from "@/components/share-button"

interface BookPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: BookPageProps): Promise<Metadata> {
  const book = await getBookById(params.id)

  if (!book) {
    return {
      title: "Book Not Found | BookBuddy",
    }
  }

  return {
    title: `${book.title} | BookBuddy`,
    description: book.description,
  }
}

export default async function BookPage({ params }: BookPageProps) {
  const book = await getBookById(params.id)

  if (!book) {
    notFound()
  }

  const similarBooks = await getSimilarBooks(params.id)

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
          <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg">
            <Image
              src={book.coverImage || "/placeholder.svg?height=600&width=400"}
              alt={book.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>

          <div className="mt-6 flex flex-col gap-4">
            <AddToReadingListButton bookId={book.id} />

            <Button variant="outline" className="w-full">
              <BookOpen className="mr-2 h-4 w-4" />
              Preview
            </Button>

            <ShareButton url={`/books/${book.id}`} title={book.title} className="w-full" />
          </div>
        </div>

        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold">{book.title}</h1>
          <p className="text-lg text-muted-foreground">by {book.author}</p>

          <div className="mt-4 flex items-center gap-4">
            <RatingStars rating={book.averageRating} size="lg" />
            <span className="text-sm text-muted-foreground">({book.ratingsCount} ratings)</span>
          </div>

          <Separator className="my-6" />

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">About the Book</h2>
            <p className="leading-relaxed">{book.description}</p>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-muted-foreground">Published</h3>
                <p>{book.publishedDate}</p>
              </div>
              <div>
                <h3 className="font-medium text-muted-foreground">Genre</h3>
                <p>{book.genre}</p>
              </div>
              <div>
                <h3 className="font-medium text-muted-foreground">Pages</h3>
                <p>{book.pageCount}</p>
              </div>
              <div>
                <h3 className="font-medium text-muted-foreground">ISBN</h3>
                <p>{book.isbn}</p>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          <BookRatingForm bookId={book.id} />
        </div>
      </div>

      {similarBooks.length > 0 && (
        <div className="mt-12">
          <h2 className="mb-6 text-2xl font-bold">Similar Books</h2>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {similarBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

