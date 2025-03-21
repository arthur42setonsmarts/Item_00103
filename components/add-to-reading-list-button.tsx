"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { BookPlus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { addToReadingList } from "@/lib/actions"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface AddToReadingListButtonProps {
  bookId: string
}

export default function AddToReadingListButton({ bookId }: AddToReadingListButtonProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleAddToList = async (listId: string) => {
    setIsLoading(true)
    try {
      await addToReadingList(bookId, listId)
      toast({
        title: "Success",
        description: "Book added to reading list",
      })
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
        <DropdownMenuItem onSelect={() => handleAddToList("to-read")}>To Read</DropdownMenuItem>
        <DropdownMenuItem onSelect={() => handleAddToList("currently-reading")}>Currently Reading</DropdownMenuItem>
        <DropdownMenuItem onSelect={() => handleAddToList("read")}>Read</DropdownMenuItem>
        <DropdownMenuItem onSelect={() => handleAddToList("favorites")}>Favorites</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

