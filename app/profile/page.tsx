import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { getUserProfile } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import ShareButton from "@/components/share-button"
import UserNameDisplay from "@/components/user-name-display"
import UserRatedBooks from "@/components/user-rated-books"
import ProfileStats from "@/components/profile-stats"

export const metadata: Metadata = {
  title: "My Profile | BookBuddy",
  description: "View your reading stats and manage your profile",
}

export default async function ProfilePage() {
  const user = await getUserProfile()

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
              <div className="flex justify-center items-center mb-1">
                <UserNameDisplay showEditButton={true} />
              </div>
              <CardDescription>Joined {user.joinedDate}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center">
                <ShareButton url={`/profile`} title="My Profile" variant="outline" size="sm" />
              </div>

              <ProfileStats />

              <div className="pt-4">
                <h3 className="mb-2 text-sm font-medium">About</h3>
                <p className="text-sm text-muted-foreground">{user.bio || "No bio provided yet."}</p>
              </div>

              <div className="pt-4">
                <h3 className="mb-2 text-sm font-medium">Favorite Genres</h3>
                <div className="flex flex-wrap gap-2">
                  {user.favoriteGenres.map((genre) => (
                    <Link key={genre} href={`/books?genre=${genre.toLowerCase().replace(/ /g, "-")}`}>
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
          <h2 className="text-2xl font-bold mb-6">Your Rated Books</h2>
          <UserRatedBooks />
        </div>
      </div>
    </div>
  )
}

