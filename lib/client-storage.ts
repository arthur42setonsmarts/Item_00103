// This file provides client-side storage utilities using localStorage
// to ensure data persistence in the deployed environment

import type { ReadingList } from "./types"

// Keys for localStorage
const READING_LISTS_KEY = "bookbuddy_reading_lists"
const RATINGS_KEY = "bookbuddy_ratings"
// Key for user name in localStorage
const USER_NAME_KEY = "bookbuddy_user_name"

// Type for the serialized reading lists
type SerializedReadingLists = {
  version: number
  lists: ReadingList[]
  lastUpdated: number
}

// Type for book ratings
export type BookRating = {
  bookId: string
  rating: number
  review: string
  timestamp: number
}

// Type for serialized ratings
type SerializedRatings = {
  version: number
  ratings: BookRating[]
  lastUpdated: number
}

// Mock initial reviews
const initialMockReviews: BookRating[] = [
  {
    bookId: "1", // The Midnight Library
    rating: 5,
    review:
      "This book changed my perspective on life. The concept of exploring different life paths is fascinating and thought-provoking.",
    timestamp: Date.now() - 1000000, // A bit in the past
  },
  {
    bookId: "2", // Project Hail Mary
    rating: 5,
    review:
      "Absolutely brilliant sci-fi! The science is fascinating, the characters are compelling, and the story kept me on the edge of my seat.",
    timestamp: Date.now() - 2000000,
  },
  {
    bookId: "3", // Klara and the Sun
    rating: 4,
    review:
      "A beautiful and melancholic exploration of what it means to be human, told through the eyes of an artificial friend.",
    timestamp: Date.now() - 3000000,
  },
  {
    bookId: "4", // The Four Winds
    rating: 4,
    review:
      "A powerful historical novel that captures the hardship and resilience of people during the Great Depression. Heartbreaking but inspiring.",
    timestamp: Date.now() - 4000000,
  },
  {
    bookId: "5", // The Invisible Life of Addie LaRue
    rating: 5,
    review:
      "A masterpiece of storytelling. The concept of being forgotten by everyone you meet is heartbreaking, and Addie's journey through centuries is captivating.",
    timestamp: Date.now() - 5000000,
  },
  {
    bookId: "6", // Dune
    rating: 5,
    review:
      "A timeless sci-fi classic that has aged incredibly well. The world-building is unparalleled, and the political intrigue is as relevant today as it was when first published.",
    timestamp: Date.now() - 6000000,
  },
  {
    bookId: "7", // The Song of Achilles
    rating: 4,
    review:
      "A beautiful retelling of the Iliad that focuses on the relationship between Achilles and Patroclus. The prose is gorgeous and the ending is devastating.",
    timestamp: Date.now() - 7000000,
  },
  {
    bookId: "8", // Educated
    rating: 5,
    review:
      "An incredible memoir about the power of education to transform lives. Tara's journey from an isolated upbringing to Cambridge University is inspiring and eye-opening.",
    timestamp: Date.now() - 8000000,
  },
  {
    bookId: "9", // Where the Crawdads Sing
    rating: 4,
    review:
      "A beautiful blend of coming-of-age story, mystery, and nature writing. The descriptions of the marsh are so vivid you can almost feel the mud between your toes.",
    timestamp: Date.now() - 9000000,
  },
  {
    bookId: "10", // The Silent Patient
    rating: 5,
    review:
      "One of the best psychological thrillers I've read. The twist at the end completely blindsided me. Couldn't put it down!",
    timestamp: Date.now() - 10000000,
  },
  // Additional reviews for some books to show distribution
  {
    bookId: "1", // The Midnight Library - second review
    rating: 3,
    review:
      "Interesting concept but I found the execution a bit lacking. Some of the alternate lives felt rushed and underdeveloped.",
    timestamp: Date.now() - 11000000,
  },
  {
    bookId: "2", // Project Hail Mary - second review
    rating: 4,
    review:
      "Great sci-fi adventure with a unique alien character. The science explanations sometimes got a bit too detailed for my taste.",
    timestamp: Date.now() - 12000000,
  },
  {
    bookId: "6", // Dune - second review
    rating: 3,
    review:
      "A classic for sure, but I found it slow-paced and the political machinations sometimes hard to follow. The world-building is impressive though.",
    timestamp: Date.now() - 13000000,
  },
  {
    bookId: "9", // Where the Crawdads Sing - second review
    rating: 5,
    review:
      "Absolutely loved this book! The dual timeline works perfectly, and Kya is such a compelling character. The ending left me in tears.",
    timestamp: Date.now() - 14000000,
  },
  {
    bookId: "10", // The Silent Patient - second review
    rating: 2,
    review:
      "I found the twist predictable and the characters one-dimensional. The pacing was good but overall it didn't live up to the hype for me.",
    timestamp: Date.now() - 15000000,
  },
]

// Initialize localStorage with default data (called from client components)
export function initializeClientStorage() {
  // Only run in browser environment
  if (typeof window === "undefined") return

  // Check if we already have reading lists data
  const existingListsData = localStorage.getItem(READING_LISTS_KEY)
  if (!existingListsData) {
    // Initialize with default reading lists
    const defaultLists: ReadingList[] = []

    const initialListsData: SerializedReadingLists = {
      version: 1,
      lists: defaultLists,
      lastUpdated: Date.now(),
    }

    localStorage.setItem(READING_LISTS_KEY, JSON.stringify(initialListsData))
  }

  // Check if we already have ratings data
  const existingRatingsData = localStorage.getItem(RATINGS_KEY)
  if (!existingRatingsData) {
    // Initialize with mock ratings
    const initialRatingsData: SerializedRatings = {
      version: 1,
      ratings: initialMockReviews,
      lastUpdated: Date.now(),
    }

    localStorage.setItem(RATINGS_KEY, JSON.stringify(initialRatingsData))
  }
}

// Get reading lists from localStorage
export function getClientReadingLists(): ReadingList[] {
  // Only run in browser environment
  if (typeof window === "undefined") return []

  try {
    const data = localStorage.getItem(READING_LISTS_KEY)
    if (!data) {
      initializeClientStorage()
      return []
    }

    const parsedData = JSON.parse(data) as SerializedReadingLists
    return parsedData.lists
  } catch (error) {
    console.error("Error getting reading lists from localStorage:", error)
    return []
  }
}

// Save reading lists to localStorage
export function saveClientReadingLists(lists: ReadingList[]) {
  // Only run in browser environment
  if (typeof window === "undefined") return

  try {
    const data: SerializedReadingLists = {
      version: 1,
      lists,
      lastUpdated: Date.now(),
    }

    localStorage.setItem(READING_LISTS_KEY, JSON.stringify(data))
  } catch (error) {
    console.error("Error saving reading lists to localStorage:", error)
  }
}

// Add a reading list to localStorage
export function addClientReadingList(list: ReadingList): boolean {
  try {
    const lists = getClientReadingLists()

    // Check if list with this ID already exists
    const existingIndex = lists.findIndex((l) => l.id === list.id)
    if (existingIndex !== -1) {
      lists[existingIndex] = list
    } else {
      lists.push(list)
    }

    saveClientReadingLists(lists)
    return true
  } catch (error) {
    console.error("Error adding reading list to localStorage:", error)
    return false
  }
}

// Update a reading list in localStorage
export function updateClientReadingList(id: string, updates: Partial<ReadingList>): boolean {
  try {
    const lists = getClientReadingLists()
    const index = lists.findIndex((list) => list.id === id)

    if (index === -1) return false

    lists[index] = { ...lists[index], ...updates }
    saveClientReadingLists(lists)
    return true
  } catch (error) {
    console.error("Error updating reading list in localStorage:", error)
    return false
  }
}

// Delete a reading list from localStorage
export function deleteClientReadingList(id: string): boolean {
  try {
    const lists = getClientReadingLists()
    const filteredLists = lists.filter((list) => list.id !== id)

    if (filteredLists.length === lists.length) return false

    saveClientReadingLists(filteredLists)
    return true
  } catch (error) {
    console.error("Error deleting reading list from localStorage:", error)
    return false
  }
}

// Get a reading list by ID from localStorage
export function getClientReadingListById(id: string): ReadingList | null {
  try {
    const lists = getClientReadingLists()
    return lists.find((list) => list.id === id) || null
  } catch (error) {
    console.error("Error getting reading list from localStorage:", error)
    return null
  }
}

// Get all ratings from localStorage
export function getClientRatings(): BookRating[] {
  // Only run in browser environment
  if (typeof window === "undefined") return []

  try {
    const data = localStorage.getItem(RATINGS_KEY)
    if (!data) {
      initializeClientStorage()
      return []
    }

    const parsedData = JSON.parse(data) as SerializedRatings
    return parsedData.ratings
  } catch (error) {
    console.error("Error getting ratings from localStorage:", error)
    return []
  }
}

// Save a book rating to localStorage
export function saveClientRating(bookId: string, rating: number, review: string): boolean {
  try {
    // Get existing ratings
    const ratings = getClientRatings()

    // Check if this book already has a rating
    const existingRatingIndex = ratings.findIndex((r) => r.bookId === bookId)

    if (existingRatingIndex !== -1) {
      // Update existing rating
      ratings[existingRatingIndex] = {
        bookId,
        rating,
        review,
        timestamp: Date.now(),
      }
    } else {
      // Add new rating
      ratings.push({
        bookId,
        rating,
        review,
        timestamp: Date.now(),
      })
    }

    // Save back to localStorage
    const data: SerializedRatings = {
      version: 1,
      ratings,
      lastUpdated: Date.now(),
    }

    localStorage.setItem(RATINGS_KEY, JSON.stringify(data))

    // Dispatch a storage event to notify other components
    if (typeof window !== "undefined") {
      // Create and dispatch a custom event
      const event = new Event("storage")
      window.dispatchEvent(event)
    }

    return true
  } catch (error) {
    console.error("Error saving rating to localStorage:", error)
    return false
  }
}

// Get a rating for a specific book
export function getClientRatingForBook(bookId: string): BookRating | null {
  try {
    const ratings = getClientRatings()
    return ratings.find((r) => r.bookId === bookId) || null
  } catch (error) {
    console.error("Error getting rating for book:", error)
    return null
  }
}

// Add this function to get real ratings stats for a book
export function getBookRealRatings(bookId: string): { averageRating: number; ratingsCount: number } {
  try {
    // Only run in browser environment
    if (typeof window === "undefined") {
      return { averageRating: 0, ratingsCount: 0 }
    }

    const allRatings = getClientRatings()
    const bookRatings = allRatings.filter((rating) => rating.bookId === bookId)

    // Get the current user's rating specifically
    const currentUserRating = getClientRatingForBook(bookId)

    // If the current user has a rating but it's not in the list (which can happen if they just submitted it),
    // add it to the calculation
    if (
      currentUserRating &&
      !bookRatings.some(
        (rating) => rating.timestamp === currentUserRating.timestamp && rating.rating === currentUserRating.rating,
      )
    ) {
      bookRatings.push(currentUserRating)
    }

    if (bookRatings.length === 0) {
      return { averageRating: 0, ratingsCount: 0 }
    }

    const sum = bookRatings.reduce((total, rating) => total + rating.rating, 0)
    const average = sum / bookRatings.length

    return {
      averageRating: average,
      ratingsCount: bookRatings.length,
    }
  } catch (error) {
    console.error("Error getting real ratings for book:", error)
    return { averageRating: 0, ratingsCount: 0 }
  }
}

// Get the user's name from localStorage
export function getUserName(): string {
  // Only run in browser environment
  if (typeof window === "undefined") return "Jane Reader"

  try {
    const name = localStorage.getItem(USER_NAME_KEY)
    return name || "Jane Reader" // Default name if not set
  } catch (error) {
    console.error("Error getting user name from localStorage:", error)
    return "Jane Reader"
  }
}

// Save the user's name to localStorage
export function saveUserName(name: string): boolean {
  // Only run in browser environment
  if (typeof window === "undefined") return false

  try {
    localStorage.setItem(USER_NAME_KEY, name)

    // Dispatch a storage event to notify other components
    if (typeof window !== "undefined") {
      const event = new Event("storage")
      window.dispatchEvent(event)
    }

    return true
  } catch (error) {
    console.error("Error saving user name to localStorage:", error)
    return false
  }
}

