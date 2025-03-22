"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { BookPlus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useReadingLists } from "@/components/reading-lists-provider"
import { getBookById } from "@/lib/actions"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface AddToReadingListButtonProps {
  bookId: string
}

export default function AddToReadingListButton({ bookId }: AddToReadingListButtonProps) {
  const { toast } = useToast()
  const { readingLists, updateReadingList, getReadingListById } = useReadingLists()
  const [isLoading, setIsLoading] = useState(false)

  const handleAddToList = async (listId: string) => {
    setIsLoading(true)
    try {
      // Get the book details
      const book = await getBookById(bookId)
      if (!book) {
        throw new Error(`Book with ID ${bookId} not found`)
      }

      // Get the current reading list
      const readingList = getReadingListById(listId)
      if (!readingList) {
        throw new Error(`Reading list with ID ${listId} not found`)
      }

      // Check if book is already in the list
      const bookExists = readingList.books.some((b) => b.id === bookId)
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="w-full" disabled={isLoading}>
          <BookPlus className="mr-2 h-4 w-4" />
          {isLoading ? "Adding..." : "Add to Reading List"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center">
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
  )
}

