"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import type { ReadingList } from "@/lib/types"
import {
  initializeClientStorage,
  getClientReadingLists,
  addClientReadingList,
  updateClientReadingList,
  deleteClientReadingList,
  getClientReadingListById,
} from "@/lib/client-storage"

// Define the context type
type ReadingListsContextType = {
  readingLists: ReadingList[]
  addReadingList: (list: ReadingList) => void
  updateReadingList: (id: string, updates: Partial<ReadingList>) => void
  deleteReadingList: (id: string) => void
  getReadingListById: (id: string) => ReadingList | null
  isLoaded: boolean
}

// Create the context with default values
const ReadingListsContext = createContext<ReadingListsContextType>({
  readingLists: [],
  addReadingList: () => {},
  updateReadingList: () => {},
  deleteReadingList: () => {},
  getReadingListById: () => null,
  isLoaded: false,
})

// Hook to use the reading lists context
export const useReadingLists = () => useContext(ReadingListsContext)

// Provider component
export function ReadingListsProvider({ children }: { children: React.ReactNode }) {
  const [readingLists, setReadingLists] = useState<ReadingList[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Initialize on mount
  useEffect(() => {
    initializeClientStorage()
    setReadingLists(getClientReadingLists())
    setIsLoaded(true)
  }, [])

  // Add a reading list
  const addReadingList = (list: ReadingList) => {
    addClientReadingList(list)
    setReadingLists(getClientReadingLists())
  }

  // Update a reading list
  const updateReadingList = (id: string, updates: Partial<ReadingList>) => {
    updateClientReadingList(id, updates)
    setReadingLists(getClientReadingLists())
  }

  // Delete a reading list
  const deleteReadingList = (id: string) => {
    deleteClientReadingList(id)
    setReadingLists(getClientReadingLists())
  }

  // Get a reading list by ID
  const getReadingListById = (id: string): ReadingList | null => {
    return getClientReadingListById(id)
  }

  return (
    <ReadingListsContext.Provider
      value={{
        readingLists,
        addReadingList,
        updateReadingList,
        deleteReadingList,
        getReadingListById,
        isLoaded,
      }}
    >
      {children}
    </ReadingListsContext.Provider>
  )
}

