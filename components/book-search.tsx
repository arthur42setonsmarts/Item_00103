"use client"

import { useState, useTransition, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const genres = [
  { value: "all", label: "All Genres" },
  { value: "fiction", label: "Fiction" },
  { value: "non-fiction", label: "Non-Fiction" },
  { value: "mystery", label: "Mystery" },
  { value: "science-fiction", label: "Science Fiction" },
  { value: "fantasy", label: "Fantasy" },
  { value: "romance", label: "Romance" },
  { value: "thriller", label: "Thriller" },
  { value: "biography", label: "Biography" },
]

export default function BookSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const initialQuery = searchParams.get("query") || ""
  const initialGenre = searchParams.get("genre") || "all"

  const [query, setQuery] = useState(initialQuery)
  const [genre, setGenre] = useState(initialGenre)

  // Effect to handle URL parameter changes
  useEffect(() => {
    // Get the current genre from URL
    const urlGenre = searchParams.get("genre")

    // If there's a genre in the URL, normalize it and update the state
    if (urlGenre) {
      // Handle hyphenated genres like "science-fiction"
      const normalizedGenre = urlGenre.toLowerCase()

      // Check if this genre exists in our options
      const matchedGenre = genres.find(
        (g) =>
          g.value === normalizedGenre ||
          g.value === normalizedGenre.replace(/-/g, " ") ||
          normalizedGenre === g.label.toLowerCase().replace(/ /g, "-"),
      )

      if (matchedGenre) {
        setGenre(matchedGenre.value)
      } else {
        setGenre(urlGenre) // Use as-is if no match found
      }
    } else {
      setGenre("all")
    }

    // Update query from URL
    const urlQuery = searchParams.get("query")
    if (urlQuery !== null) {
      setQuery(urlQuery)
    }
  }, [searchParams])

  const handleSearch = () => {
    startTransition(() => {
      const params = new URLSearchParams()
      if (query) params.set("query", query)
      if (genre && genre !== "all") params.set("genre", genre)

      router.push(`/books?${params.toString()}`)
    })
  }

  const handleClear = () => {
    setQuery("")
    setGenre("all")
    router.push("/books")
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      <div className="relative flex-1">
        <Input
          placeholder="Search books by title or author..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pr-10"
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        {query && (
          <Button variant="ghost" size="icon" className="absolute right-0 top-0 h-full" onClick={() => setQuery("")}>
            <X className="h-4 w-4" />
            <span className="sr-only">Clear search</span>
          </Button>
        )}
      </div>

      <Select value={genre} onValueChange={setGenre}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="All Genres" />
        </SelectTrigger>
        <SelectContent>
          {genres.map((genre) => (
            <SelectItem key={genre.value} value={genre.value}>
              {genre.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button onClick={handleSearch} disabled={isPending}>
        <Search className="mr-2 h-4 w-4" />
        Search
      </Button>

      {(query || genre !== "all") && (
        <Button variant="outline" onClick={handleClear}>
          Clear
        </Button>
      )}
    </div>
  )
}

