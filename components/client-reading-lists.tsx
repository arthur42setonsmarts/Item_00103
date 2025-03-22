"use client"

import { useReadingLists } from "@/components/reading-lists-provider"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import ReadingListCard from "@/components/reading-list-card"
import CreateReadingListDialog from "@/components/create-reading-list-dialog"
import { Skeleton } from "@/components/ui/skeleton"

export function ClientReadingLists() {
  const { readingLists, isLoaded } = useReadingLists()

  // Show loading state while data is being loaded from localStorage
  if (!isLoaded) {
    return (
      <>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <h1 className="text-3xl font-bold">My Reading Lists</h1>
          <Skeleton className="h-10 w-40" />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, index) => (
            <Skeleton key={index} className="h-48 w-full" />
          ))}
        </div>
      </>
    )
  }

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-3xl font-bold">My Reading Lists</h1>
        <div className="flex justify-end">
          <CreateReadingListDialog />
        </div>
      </div>

      {readingLists.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">You don't have any reading lists yet.</p>
          <CreateReadingListDialog>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Reading List
            </Button>
          </CreateReadingListDialog>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {readingLists.map((list) => (
            <ReadingListCard key={list.id} readingList={list} />
          ))}
        </div>
      )}
    </>
  )
}

