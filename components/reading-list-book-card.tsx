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
import { removeFromReadingList } from "@/lib/actions"
import { useRouter } from "next/navigation"
import ShareButton from "./share-button"

interface ReadingListBookCardProps {
  book: Book
  listId: string
  showRating?: boolean
}

export default function ReadingListBookCard({ book, listId, showRating = true }: ReadingListBookCardProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isRemoving, setIsRemoving] = useState(false)

  const handleRemove = async () => {
    setIsRemoving(true)
    try {
      await removeFromReadingList(book.id, listId)
      toast({
        title: "Success",
        description: `"${book.title}" removed from reading list`,
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
      <CardFooter className="flex justify-between p-4 pt-0">
        <Button
          variant="outline"
          size="sm"
          onClick={handleRemove}
          disabled={isRemoving}
          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          {isRemoving ? "Removing..." : "Remove"}
        </Button>
        <ShareButton url={`/books/${book.id}`} title={book.title} variant="ghost" size="icon" />
      </CardFooter>
    </Card>
  )
}

