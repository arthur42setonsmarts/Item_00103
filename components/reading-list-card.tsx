import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import type { ReadingList } from "@/lib/types"
import { Book } from "lucide-react"

interface ReadingListCardProps {
  readingList: ReadingList
}

export default function ReadingListCard({ readingList }: ReadingListCardProps) {
  return (
    <Link href={`/reading-lists/${readingList.id}`}>
      <Card className="overflow-hidden h-full transition-all hover:shadow-md">
        <CardContent className="p-0">
          <div className="relative h-40 w-full bg-muted">
            {readingList.books.length > 0 ? (
              <div className="grid grid-cols-3 h-full">
                {readingList.books.slice(0, 3).map((book, index) => (
                  <div key={index} className="relative h-full">
                    <Image
                      src={book.coverImage || "/placeholder.svg?height=160&width=120"}
                      alt={book.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 33vw, 20vw"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-full items-center justify-center">
                <Book className="h-12 w-12 text-muted-foreground" />
              </div>
            )}
          </div>
          <div className="p-4">
            <h3 className="font-semibold">{readingList.name}</h3>
            <p className="text-sm text-muted-foreground">
              {readingList.books.length} {readingList.books.length === 1 ? "book" : "books"}
            </p>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <p className="text-sm line-clamp-2 text-muted-foreground">{readingList.description || "No description"}</p>
        </CardFooter>
      </Card>
    </Link>
  )
}

