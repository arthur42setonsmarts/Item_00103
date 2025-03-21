import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { getUserProfile, getRecentlyRatedBooks } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Settings } from "lucide-react"
import BookCard from "@/components/book-card"
import ReadingStats from "@/components/reading-stats"
import ShareButton from "@/components/share-button"

export const metadata: Metadata = {
  title: "My Profile | BookBuddy",
  description: "View your reading stats and manage your profile",
}

export default async function ProfilePage() {
  const user = await getUserProfile()
  const recentlyRatedBooks = await getRecentlyRatedBooks()

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 h-24 w-24 overflow-hidden rounded-full">
                <Image
                  src={user.avatar || "/placeholder.svg?height=96&width=96"}
                  alt={user.name}
                  width={96}
                  height={96}
                  className="h-full w-full object-cover"
                />
              </div>
              <CardTitle>{user.name}</CardTitle>
              <CardDescription>Joined {user.joinedDate}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center gap-4">
                <Button variant="outline" size="sm">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Button>
                <ShareButton url={`/profile`} title="My Profile" variant="outline" size="sm" />
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold">{user.stats.booksRead}</p>
                  <p className="text-xs text-muted-foreground">Books Read</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{user.stats.listsCreated}</p>
                  <p className="text-xs text-muted-foreground">Lists</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{user.stats.ratingsGiven}</p>
                  <p className="text-xs text-muted-foreground">Ratings</p>
                </div>
              </div>

              <div className="pt-4">
                <h3 className="mb-2 text-sm font-medium">About</h3>
                <p className="text-sm text-muted-foreground">{user.bio || "No bio provided yet."}</p>
              </div>

              <div className="pt-4">
                <h3 className="mb-2 text-sm font-medium">Favorite Genres</h3>
                <div className="flex flex-wrap gap-2">
                  {user.favoriteGenres.map((genre) => (
                    <Link key={genre} href={`/books?genre=${genre.toLowerCase()}`}>
                      <Button variant="outline" size="sm">
                        {genre}
                      </Button>
                    </Link>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Tabs defaultValue="stats">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="stats">Reading Stats</TabsTrigger>
              <TabsTrigger value="recent">Recent Activity</TabsTrigger>
              <TabsTrigger value="recommendations">For You</TabsTrigger>
            </TabsList>

            <TabsContent value="stats" className="mt-6">
              <ReadingStats />
            </TabsContent>

            <TabsContent value="recent" className="mt-6">
              <h2 className="mb-4 text-xl font-semibold">Recently Rated Books</h2>
              {recentlyRatedBooks.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-4 text-muted-foreground">You haven't rated any books yet.</p>
                  <Link href="/books">
                    <Button className="mt-4">Browse Books</Button>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {recentlyRatedBooks.map((book) => (
                    <BookCard key={book.id} book={book} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="recommendations" className="mt-6">
              <h2 className="mb-4 text-xl font-semibold">Recommended For You</h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">{/* Recommendations will be loaded here */}</div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

