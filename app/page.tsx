import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { BookOpen, ListChecks, Star, Users } from "lucide-react"
import RecommendedBooks from "@/components/recommended-books"

export default function Home() {
  return (
    <div className="container px-4 py-8 md:py-12">
      <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-16">
        <div className="flex max-w-[980px] flex-col items-start gap-2">
          <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl lg:text-5xl">
            Discover your next favorite book <br className="hidden sm:inline" />
            with personalized recommendations
          </h1>
          <p className="max-w-[700px] text-lg text-muted-foreground">
            BookBuddy helps you find books you'll love based on your preferences and past ratings. Create reading lists,
            track your progress, and share recommendations with friends.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/books">
            <Button size="lg">Browse Books</Button>
          </Link>
          <Link href="/reading-lists">
            <Button variant="outline" size="lg">
              My Reading Lists
            </Button>
          </Link>
        </div>
      </section>

      <section className="py-8 md:py-12">
        <h2 className="mb-6 text-2xl font-bold tracking-tight">How It Works</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold">Rate Books</h3>
              <p className="text-muted-foreground">Rate books you've read to help us understand your preferences.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Star className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold">Get Recommendations</h3>
              <p className="text-muted-foreground">Receive personalized book recommendations based on your taste.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <ListChecks className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold">Create Reading Lists</h3>
              <p className="text-muted-foreground">
                Organize books into custom reading lists for different moods or goals.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold">Share with Friends</h3>
              <p className="text-muted-foreground">Share your favorite books and reading lists with friends.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="py-8 md:py-12">
        <h2 className="mb-6 text-2xl font-bold tracking-tight">Recommended For You</h2>
        <RecommendedBooks />
      </section>
    </div>
  )
}

