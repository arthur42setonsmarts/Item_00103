"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useReadingLists } from "@/components/reading-lists-provider"
import type { ReadingList } from "@/lib/types"
import ReadingListBookCard from "@/components/reading-list-book-card"
import DeleteReadingListButton from "@/components/delete-reading-list-button"
import EditReadingListButton from "@/components/edit-reading-list-button"
import ShareButton from "@/components/share-button"
import { Skeleton } from "@/components/ui/skeleton"

interface ClientReadingListDetailProps {
  id: string
}

export function ClientReadingListDetail({ id }: ClientReadingListDetailProps) {
  const router = useRouter()
  const { getReadingListById, isLoaded } = useReadingLists()
  const [readingList, setReadingList] = useState<ReadingList | null>(null)

  useEffect(() => {
    if (isLoaded) {
      const list = getReadingListById(id)
      setReadingList(list)

      if (!list) {
        // Redirect to reading lists page if list not found
        router.push("/reading-lists")
      }
    }
  }, [id, isLoaded, getReadingListById, router])

  // Show loading state while data is being loaded
  if (!isLoaded || !readingList) {
    return (
      <>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Skeleton className="h-10 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-10" />
            <Skeleton className="h-10 w-10" />
            <Skeleton className="h-10 w-10" />
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {[...Array(5)].map((_, index) => (
            <Skeleton key={index} className="h-64 w-full" />
          ))}
        </div>
      </>
    )
  }

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">{readingList.name}</h1>
          {readingList.description && <p className="mt-2 text-muted-foreground">{readingList.description}</p>}
          <p className="mt-1 text-sm text-muted-foreground">
            {readingList.books.length} {readingList.books.length === 1 ? "book" : "books"}
          </p>
        </div>

        <div className="flex gap-2">
          <EditReadingListButton readingList={readingList} />

          <ShareButton
            url={`/reading-lists/${readingList.id}`}
            title={readingList.name}
            variant="outline"
            size="icon"
          />

          <DeleteReadingListButton id={readingList.id} />
        </div>
      </div>

      <div className="mt-8">
        {readingList.books.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">This reading list is empty. Add some books to get started!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {readingList.books.map((book) => (
              <ReadingListBookCard key={book.id} book={book} listId={readingList.id} />
            ))}
          </div>
        )}
      </div>
    </>
  )
}

