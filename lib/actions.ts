"use server"

import type { Book, ReadingList, UserProfile } from "./types"
import { revalidatePath } from "next/cache"
import * as dataStore from "./data-store"

// Book-related actions
export async function getBooks({ query, genre }: { query?: string; genre?: string } = {}): Promise<Book[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  let filteredBooks = [...dataStore.getBooks()]

  if (query) {
    const searchTerm = query.toLowerCase()
    filteredBooks = filteredBooks.filter(
      (book) => book.title.toLowerCase().includes(searchTerm) || book.author.toLowerCase().includes(searchTerm),
    )
  }

  if (genre) {
    filteredBooks = filteredBooks.filter((book) => book.genre.toLowerCase() === genre.toLowerCase())
  }

  return filteredBooks
}

export async function getBookById(id: string): Promise<Book | null> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  return dataStore.getBooks().find((book) => book.id === id) || null
}

export async function getSimilarBooks(bookId: string): Promise<Book[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const book = await getBookById(bookId)
  if (!book) return []

  // In a real app, this would use a recommendation algorithm
  return dataStore
    .getBooks()
    .filter((b) => b.id !== bookId && b.genre === book.genre)
    .slice(0, 5)
}

export async function getRecommendedBooks(): Promise<Book[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  // In a real app, this would use user preferences and ratings
  return dataStore.getBooks().slice(0, 5)
}

export async function rateBook(bookId: string, rating: number, review?: string): Promise<void> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  console.log(`Rating book ${bookId} with ${rating} stars`)
  if (review) {
    console.log(`Review: ${review}`)
  }

  const success = dataStore.updateBookRating(bookId, rating)
  if (!success) {
    throw new Error(`Book with ID ${bookId} not found`)
  }

  // Revalidate the book page to reflect the new rating
  revalidatePath(`/books/${bookId}`)
}

// Reading list actions
export async function getUserReadingLists(): Promise<ReadingList[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Log the current state for debugging
  console.log("Current store state:", dataStore.getStoreState())

  return dataStore.getReadingLists()
}

export async function getReadingListById(id: string): Promise<ReadingList | null> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  const list = dataStore.getReadingLists().find((list) => list.id === id)
  console.log(`Getting reading list with ID: ${id}, Found: ${!!list}`)
  return list || null
}

export async function createReadingList(name: string, description?: string): Promise<string> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Generate a unique ID for the new reading list
  // Use a simpler ID format to avoid potential issues
  const timestamp = Date.now()
  const id = `list${timestamp}`

  console.log(`Creating reading list: "${name}" with ID: ${id}`)

  // Create the new reading list
  const newList: ReadingList = {
    id,
    name,
    description,
    books: [],
  }

  // Add the new reading list to our data store
  const listId = dataStore.addReadingList(newList)

  // Log the current state for debugging
  console.log("Updated store state after creation:", dataStore.getStoreState())

  // Revalidate paths to reflect the changes
  revalidatePath("/reading-lists")

  return listId
}

export async function updateReadingList(id: string, name: string, description?: string): Promise<void> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  console.log(`Updating reading list ${id}: ${name}`)

  const success = dataStore.updateReadingList(id, { name, description })
  if (!success) {
    throw new Error(`Reading list with ID ${id} not found`)
  }

  // Revalidate paths to reflect the changes
  revalidatePath(`/reading-lists/${id}`)
  revalidatePath("/reading-lists")
}

export async function deleteReadingList(id: string): Promise<void> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  console.log(`Deleting reading list ${id}`)

  const success = dataStore.deleteReadingList(id)
  if (!success) {
    throw new Error(`Reading list with ID ${id} not found`)
  }

  // Revalidate the reading lists page to reflect the changes
  revalidatePath("/reading-lists")
}

export async function addToReadingList(bookId: string, listId: string): Promise<void> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  console.log(`Adding book ${bookId} to list ${listId}`)

  const success = dataStore.addBookToReadingList(bookId, listId)
  if (!success) {
    throw new Error(`Failed to add book ${bookId} to list ${listId}`)
  }

  revalidatePath(`/reading-lists/${listId}`)
  revalidatePath("/reading-lists")
}

export async function removeFromReadingList(bookId: string, listId: string): Promise<void> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  console.log(`Removing book ${bookId} from list ${listId}`)

  const success = dataStore.removeBookFromReadingList(bookId, listId)
  if (!success) {
    throw new Error(`Failed to remove book ${bookId} from list ${listId}`)
  }

  // Revalidate paths to reflect the changes
  revalidatePath(`/reading-lists/${listId}`)
  revalidatePath("/reading-lists")
}

// User profile actions
export async function getUserProfile(): Promise<UserProfile> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  return {
    name: "Jane Reader",
    avatar: "/placeholder.svg?height=96&width=96",
    joinedDate: "January 2023",
    bio: "Book lover and aspiring writer. I enjoy fiction, fantasy, and science fiction novels.",
    favoriteGenres: ["Fiction", "Fantasy", "Science Fiction", "Mystery"],
    stats: {
      booksRead: 42,
      listsCreated: 5,
      ratingsGiven: 37,
    },
  }
}

export async function getRecentlyRatedBooks(): Promise<Book[]> {
  // This function is no longer used directly in the profile page
  // but we'll keep it updated for other potential uses

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 600))

  // In a real app, this would fetch the user's recently rated books
  return dataStore.getBooks().slice(0, 3)
}

export async function getUserReadingStats() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 700))

  return {
    booksReadByMonth: [
      { month: "Jan", count: 3 },
      { month: "Feb", count: 5 },
      { month: "Mar", count: 2 },
      { month: "Apr", count: 4 },
      { month: "May", count: 6 },
      { month: "Jun", count: 3 },
    ],
    genreDistribution: [
      { genre: "Fiction", count: 12 },
      { genre: "Fantasy", count: 8 },
      { genre: "Sci-Fi", count: 7 },
      { genre: "Mystery", count: 5 },
      { genre: "Non-Fiction", count: 3 },
    ],
    averageRating: 4.2,
    pagesRead: 12568,
    readingStreak: 15,
  }
}

