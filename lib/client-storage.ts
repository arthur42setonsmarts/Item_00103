// This file provides client-side storage utilities using localStorage
// to ensure data persistence in the deployed environment

import type { ReadingList } from "./types"

// Keys for localStorage
const READING_LISTS_KEY = "bookbuddy_reading_lists"
const RATINGS_KEY = "bookbuddy_ratings"

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
    // Initialize with empty ratings
    const initialRatingsData: SerializedRatings = {
      version: 1,
      ratings: [],
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

