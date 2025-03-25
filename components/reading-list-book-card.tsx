"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import type { Book } from "@/lib/types"
import RatingStars from "@/components/rating-stars"
import { useToast } from "@/hooks/use-toast"
import { useReadingLists } from "@/components/reading-lists-provider"
import { useRouter } from "next/navigation"
import ShareButton from "./share-button"
import { ToastAction } from "@/components/ui/toast"

interface ReadingListBookCardProps {
  book: Book
  listId: string
  showRating?: boolean
}

export default function ReadingListBookCard({ book, listId, showRating = true }: ReadingListBookCardProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { getReadingListById, updateReadingList } = useReadingLists()
  const [isRemoving, setIsRemoving] = useState(false)

  const handleRemove = async () => {
    setIsRemoving(true)
    try {
      // Get the current reading list
      const readingList = getReadingListById(listId)
      if (!readingList) {
        throw new Error(`Reading list with ID ${listId} not found`)
      }

      // Find the book's index in the list (for undo functionality)
      const bookIndex = readingList.books.findIndex((b) => b.id === book.id)
      if (bookIndex === -1) {
        throw new Error(`Book with ID ${book.id} not found in reading list`)
      }

      // Create a copy of the books array before removing the book
      const originalBooks = [...readingList.books]

      // Remove the book from the list
      const updatedBooks = readingList.books.filter((b) => b.id !== book.id)
      updateReadingList(listId, { books: updatedBooks })

      // Show success toast with undo button
      toast({
        title: "Book removed",
        description: `${book.title} removed from ${readingList.name}`,
        action: (
          <ToastAction altText="Undo" onClick={() => handleUndoRemove(listId, originalBooks)}>
            Undo
          </ToastAction>
        ),
      })

      router.refresh()
    } catch (error) {
      console.error("Error removing from reading list:", error)
      toast({
        title: "Error",
        description: "Failed to remove book from reading list",
        variant: "destructive",
      })
    } finally {
      setIsRemoving(false)
    }
  }

  // Function to handle undoing the remove action
  const handleUndoRemove = (listId: string, originalBooks: Book[]) => {
    try {
      // Restore the original books array
      updateReadingList(listId, { books: originalBooks })

      toast({
        title: "Restored",
        description: `${book.title} has been restored to the reading list`,
      })

      router.refresh()
    } catch (error) {
      console.error("Error undoing remove action:", error)
      toast({
        title: "Error",
        description: "Failed to restore book to reading list",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <Link href={`/books/${book.id}`}>
          <div className="relative aspect-[2/3] w-full overflow-hidden">
            <Image
              src={book.coverImage || "/placeholder.svg?height=300&width=200"}
              alt={book.title}
              fill
              className="object-cover transition-transform hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <div className="p-4">
            <h3 className="font-semibold line-clamp-1">{book.title}</h3>
            <p className="text-sm text-muted-foreground">{book.author}</p>
            {showRating && (
              <div className="mt-2">
                <RatingStars rating={book.averageRating} />
              </div>
            )}
          </div>
        </Link>
      </CardContent>
      <CardFooter className="flex justify-between p-1 pt-0 gap-1 sm:p-2 sm:pt-0 sm:pb-3">
        {/* Mobile version - just an icon */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleRemove}
          disabled={isRemoving}
          className="h-7 w-7 sm:hidden"
          aria-label="Remove book from list"
        >
          <Trash2 className="h-4 w-4" />
        </Button>

        {/* Desktop version - button with text */}
        <Button variant="ghost" onClick={handleRemove} disabled={isRemoving} className="hidden sm:flex items-center">
          <Trash2 className="mr-2 h-4 w-4" />
          Remove
        </Button>

        <ShareButton
          url={`/books/${book.id}`}
          title={book.title}
          variant="ghost"
          size="icon"
          className="h-7 w-7 sm:h-8 sm:w-8 p-0"
        />
      </CardFooter>
    </Card>
  )
}

