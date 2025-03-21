"use server"

import type { Book, ReadingList, UserProfile } from "./types"
import { revalidatePath } from "next/cache"

// Mock data for demonstration purposes
const mockBooks: Book[] = [
  {
    id: "1",
    title: "The Midnight Library",
    author: "Matt Haig",
    description:
      "Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived. To see how things would be if you had made other choices... Would you have done anything different, if you had the chance to undo your regrets?",
    coverImage: "/placeholder.svg?height=300&width=200",
    publishedDate: "2020-08-13",
    genre: "Fiction",
    pageCount: 304,
    isbn: "9780525559474",
    averageRating: 4.2,
    ratingsCount: 1243,
  },
  {
    id: "2",
    title: "Project Hail Mary",
    author: "Andy Weir",
    description:
      "Ryland Grace is the sole survivor on a desperate, last-chance mission—and if he fails, humanity and the earth itself will perish. Except that right now, he doesn't know that. He can't even remember his own name, let alone the nature of his assignment or how to complete it.",
    coverImage: "/placeholder.svg?height=300&width=200",
    publishedDate: "2021-05-04",
    genre: "Science Fiction",
    pageCount: 496,
    isbn: "9780593135204",
    averageRating: 4.5,
    ratingsCount: 987,
  },
  {
    id: "3",
    title: "Klara and the Sun",
    author: "Kazuo Ishiguro",
    description:
      "From the bestselling and Booker Prize winning author of Never Let Me Go and The Remains of the Day, a stunning new novel—his first since winning the Nobel Prize in Literature—about the wondrous, mysterious nature of the human heart.",
    coverImage: "/placeholder.svg?height=300&width=200",
    publishedDate: "2021-03-02",
    genre: "Literary Fiction",
    pageCount: 320,
    isbn: "9780571364879",
    averageRating: 3.9,
    ratingsCount: 756,
  },
  {
    id: "4",
    title: "The Four Winds",
    author: "Kristin Hannah",
    description:
      "From the number-one bestselling author of The Nightingale and The Great Alone comes a powerful American epic about love and heroism and hope, set during the Great Depression, a time when the country was in crisis and at war with itself, when millions were out of work and even the land seemed to have turned against them.",
    coverImage: "/placeholder.svg?height=300&width=200",
    publishedDate: "2021-02-02",
    genre: "Historical Fiction",
    pageCount: 464,
    isbn: "9781250178602",
    averageRating: 4.3,
    ratingsCount: 1102,
  },
  {
    id: "5",
    title: "The Invisible Life of Addie LaRue",
    author: "V.E. Schwab",
    description:
      "A Life No One Will Remember. A Story You Will Never Forget. France, 1714: in a moment of desperation, a young woman makes a Faustian bargain to live forever—and is cursed to be forgotten by everyone she meets.",
    coverImage: "/placeholder.svg?height=300&width=200",
    publishedDate: "2020-10-06",
    genre: "Fantasy",
    pageCount: 448,
    isbn: "9780765387561",
    averageRating: 4.4,
    ratingsCount: 1532,
  },
]

// In-memory storage for reading lists (in a real app, this would be a database)
let mockReadingLists: ReadingList[] = [
  {
    id: "to-read",
    name: "To Read",
    description: "Books I want to read in the future",
    books: [mockBooks[2], mockBooks[3]],
  },
  {
    id: "currently-reading",
    name: "Currently Reading",
    description: "Books I'm reading right now",
    books: [mockBooks[0]],
  },
  {
    id: "read",
    name: "Read",
    description: "Books I've finished reading",
    books: [],
  },
  {
    id: "favorites",
    name: "Favorites",
    description: "My all-time favorite books",
    books: [mockBooks[1], mockBooks[4]],
  },
]

// Book-related actions
export async function getBooks({ query, genre }: { query?: string; genre?: string } = {}): Promise<Book[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  let filteredBooks = [...mockBooks]

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

  return mockBooks.find((book) => book.id === id) || null
}

export async function getSimilarBooks(bookId: string): Promise<Book[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const book = await getBookById(bookId)
  if (!book) return []

  // In a real app, this would use a recommendation algorithm
  return mockBooks.filter((b) => b.id !== bookId && b.genre === book.genre).slice(0, 5)
}

export async function getRecommendedBooks(): Promise<Book[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  // In a real app, this would use user preferences and ratings
  return mockBooks.slice(0, 5)
}

export async function rateBook(bookId: string, rating: number, review?: string): Promise<void> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  console.log(`Rating book ${bookId} with ${rating} stars`)
  if (review) {
    console.log(`Review: ${review}`)
  }

  // Find the book in our mock data
  const bookIndex = mockBooks.findIndex((book) => book.id === bookId)
  if (bookIndex === -1) {
    throw new Error(`Book with ID ${bookId} not found`)
  }

  // Update the book's rating (in a real app, this would be more complex)
  const book = mockBooks[bookIndex]
  const newTotalRating = book.averageRating * book.ratingsCount + rating
  const newRatingsCount = book.ratingsCount + 1
  const newAverageRating = newTotalRating / newRatingsCount

  // Update the book with new rating data
  mockBooks[bookIndex] = {
    ...book,
    averageRating: newAverageRating,
    ratingsCount: newRatingsCount,
  }

  // Revalidate the book page to reflect the new rating
  revalidatePath(`/books/${bookId}`)
}

// Reading list actions
export async function getUserReadingLists(): Promise<ReadingList[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  return mockReadingLists
}

export async function getReadingListById(id: string): Promise<ReadingList | null> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  return mockReadingLists.find((list) => list.id === id) || null
}

export async function createReadingList(name: string, description?: string): Promise<string> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const id = `list-${Date.now()}`
  console.log(`Creating reading list: ${name}`)

  const newList: ReadingList = {
    id,
    name,
    description,
    books: [],
  }

  mockReadingLists.push(newList)
  revalidatePath("/reading-lists")

  return id
}

export async function updateReadingList(id: string, name: string, description?: string): Promise<void> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  console.log(`Updating reading list ${id}: ${name}`)

  const listIndex = mockReadingLists.findIndex((list) => list.id === id)
  if (listIndex !== -1) {
    mockReadingLists[listIndex] = {
      ...mockReadingLists[listIndex],
      name,
      description,
    }
    revalidatePath(`/reading-lists/${id}`)
    revalidatePath("/reading-lists")
  }
}

export async function deleteReadingList(id: string): Promise<void> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  console.log(`Deleting reading list ${id}`)

  // Check if the reading list exists before attempting to delete
  const listIndex = mockReadingLists.findIndex((list) => list.id === id)
  if (listIndex === -1) {
    throw new Error(`Reading list with ID ${id} not found`)
  }

  // Filter out the reading list with the given ID
  mockReadingLists = mockReadingLists.filter((list) => list.id !== id)

  // Revalidate the reading lists page to reflect the changes
  revalidatePath("/reading-lists")
}

export async function addToReadingList(bookId: string, listId: string): Promise<void> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  console.log(`Adding book ${bookId} to list ${listId}`)

  const book = await getBookById(bookId)
  if (!book) {
    throw new Error(`Book with ID ${bookId} not found`)
  }

  const listIndex = mockReadingLists.findIndex((list) => list.id === listId)
  if (listIndex === -1) {
    throw new Error(`Reading list with ID ${listId} not found`)
  }

  // Check if book is already in the list
  const bookExists = mockReadingLists[listIndex].books.some((b) => b.id === bookId)
  if (!bookExists) {
    mockReadingLists[listIndex].books.push(book)
    revalidatePath(`/reading-lists/${listId}`)
    revalidatePath("/reading-lists")
  }
}

export async function removeFromReadingList(bookId: string, listId: string): Promise<void> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  console.log(`Removing book ${bookId} from list ${listId}`)

  const listIndex = mockReadingLists.findIndex((list) => list.id === listId)
  if (listIndex === -1) {
    throw new Error(`Reading list with ID ${listId} not found`)
  }

  // Check if book is in the list
  const bookIndex = mockReadingLists[listIndex].books.findIndex((book) => book.id === bookId)
  if (bookIndex === -1) {
    throw new Error(`Book with ID ${bookId} not found in reading list ${listId}`)
  }

  // Remove the book from the list
  mockReadingLists[listIndex].books = mockReadingLists[listIndex].books.filter((book) => book.id !== bookId)

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
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 600))

  // In a real app, this would fetch the user's recently rated books
  return mockBooks.slice(0, 3)
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

