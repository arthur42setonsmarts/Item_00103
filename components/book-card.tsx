"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookPlus } from "lucide-react"
import type { Book } from "@/lib/types"
import RatingStars from "@/components/rating-stars"
import { useToast } from "@/hooks/use-toast"
import { addToReadingList } from "@/lib/actions"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import ShareButton from "./share-button"

interface BookCardProps {
  book: Book
  showRating?: boolean
  showActions?: boolean
}

export default function BookCard({ book, showRating = true, showActions = true }: BookCardProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleAddToList = async (listId: string) => {
    setIsLoading(true)
    try {
      await addToReadingList(book.id, listId)
      toast({
        title: "Success",
        description: `"${book.title}" added to reading list`,
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
      {showActions && (
        <CardFooter className="flex justify-between p-4 pt-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" disabled={isLoading}>
                <BookPlus className="mr-2 h-4 w-4" />
                {isLoading ? "Adding..." : "Add to List"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onSelect={() => handleAddToList("to-read")}>To Read</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => handleAddToList("currently-reading")}>
                Currently Reading
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => handleAddToList("read")}>Read</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => handleAddToList("favorites")}>Favorites</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <ShareButton url={`/books/${book.id}`} title={book.title} variant="ghost" size="icon" />
        </CardFooter>
      )}
    </Card>
  )
}

