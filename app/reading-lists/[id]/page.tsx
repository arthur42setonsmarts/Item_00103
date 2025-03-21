import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getReadingListById } from "@/lib/actions"
import ReadingListBookCard from "@/components/reading-list-book-card"
import DeleteReadingListButton from "@/components/delete-reading-list-button"
import EditReadingListButton from "@/components/edit-reading-list-button"
import ShareButton from "@/components/share-button"

interface ReadingListPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: ReadingListPageProps): Promise<Metadata> {
  const readingList = await getReadingListById(params.id)

  if (!readingList) {
    return {
      title: "Reading List Not Found | BookBuddy",
    }
  }

  return {
    title: `${readingList.name} | BookBuddy`,
    description: readingList.description,
  }
}

export default async function ReadingListPage({ params }: ReadingListPageProps) {
  const readingList = await getReadingListById(params.id)

  if (!readingList) {
    notFound()
  }

  return (
    <div className="container py-8">
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
    </div>
  )
}

