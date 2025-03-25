"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import type { Book } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import ShareButton from "./share-button"
import { useReadingLists } from "./reading-lists-provider"
import RealBookRating from "./real-book-rating"

interface BookCardProps {
  book: Book
  showRating?: boolean
  showActions?: boolean
}

export default function BookCard({ book, showRating = true, showActions = true }: BookCardProps) {
  const { toast } = useToast()
  const { readingLists, updateReadingList, getReadingListById } = useReadingLists()
  const [isLoading, setIsLoading] = useState(false)

  const handleAddToList = async (listId: string) => {
    setIsLoading(true)
    try {
      // Get the current reading list
      const readingList = getReadingListById(listId)
      if (!readingList) {
        throw new Error(`Reading list with ID ${listId} not found`)
      }

      // Check if book is already in the list
      const bookExists = readingList.books.some((b) => b.id === book.id)
      if (!bookExists) {
        // Add the book to the reading list
        const updatedBooks = [...readingList.books, book]
        updateReadingList(listId, { books: updatedBooks })

        toast({
          title: "Success",
          description: `${book.title} added to ${readingList.name}`,
        })
      } else {
        toast({
          title: "Info",
          description: `${book.title} is already in ${readingList.name}`,
        })
      }
    } catch (error) {
      console.error("Error adding to reading list:", error)
      toast({
        title: "Error",
        description: "Failed to add book to reading list",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
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
                <RealBookRating
                  bookId={book.id}
                  defaultRating={0}
                  defaultCount={0}
                  showCount={false}
                  size="sm"
                  showEmptyStars={true}
                />
              </div>
            )}
          </div>
        </Link>
      </CardContent>
      {showActions && (
        <CardFooter className="flex justify-between p-1 pt-0 sm:p-2 sm:pt-0 sm:pb-3">
          {/* Mobile version - small icon only */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="h-7 w-7 sm:hidden">
                <Plus className="h-4 w-4" />
                <span className="sr-only">Add to List</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {readingLists.length === 0 ? (
                <DropdownMenuItem disabled>No reading lists available</DropdownMenuItem>
              ) : (
                readingLists.map((list) => (
                  <DropdownMenuItem key={list.id} onSelect={() => handleAddToList(list.id)}>
                    {list.name}
                  </DropdownMenuItem>
                ))
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Desktop version - medium-sized button with text */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="hidden sm:flex items-center px-3">
                <Plus className="mr-2 h-4 w-4" />
                Add to List
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {readingLists.length === 0 ? (
                <DropdownMenuItem disabled>No reading lists available</DropdownMenuItem>
              ) : (
                readingLists.map((list) => (
                  <DropdownMenuItem key={list.id} onSelect={() => handleAddToList(list.id)}>
                    {list.name}
                  </DropdownMenuItem>
                ))
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <ShareButton
            url={`/books/${book.id}`}
            title={book.title}
            variant="ghost"
            size="icon"
            className="h-7 w-7 sm:h-8 sm:w-8 p-0"
          />
        </CardFooter>
      )}
    </Card>
  )
}

