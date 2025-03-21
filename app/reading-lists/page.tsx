import type { Metadata } from "next"
import { getUserReadingLists } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import ReadingListCard from "@/components/reading-list-card"
import CreateReadingListDialog from "@/components/create-reading-list-dialog"

export const metadata: Metadata = {
  title: "My Reading Lists | BookBuddy",
  description: "Manage your reading lists and track your reading progress",
}

export default async function ReadingListsPage() {
  // Add a cache-busting timestamp to ensure we get fresh data
  const readingLists = await getUserReadingLists()

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">My Reading Lists</h1>
        <CreateReadingListDialog />
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
    </div>
  )
}

