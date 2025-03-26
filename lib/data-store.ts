// This file creates a more persistent data store for our mock data
// that will work better in a deployed environment

import type { Book, ReadingList } from "./types"

// Initial mock books data
const initialBooks: Book[] = [
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
  // Adding more books
  {
    id: "6",
    title: "Dune",
    author: "Frank Herbert",
    description:
      "Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, heir to a noble family tasked with ruling an inhospitable world where the only thing of value is the &quot;spice&quot; melange, a drug capable of extending life and enhancing consciousness.",
    coverImage: "/placeholder.svg?height=300&width=200",
    publishedDate: "1965-08-01",
    genre: "Science Fiction",
    pageCount: 412,
    isbn: "9780441172719",
    averageRating: 4.6,
    ratingsCount: 2345,
  },
  {
    id: "7",
    title: "The Song of Achilles",
    author: "Madeline Miller",
    description:
      "A tale of gods, kings, immortal fame, and the human heart, The Song of Achilles is a dazzling literary feat that brilliantly reimagines Homer's enduring masterwork, The Iliad.",
    coverImage: "/placeholder.svg?height=300&width=200",
    publishedDate: "2012-03-06",
    genre: "Historical Fiction",
    pageCount: 378,
    isbn: "9780062060624",
    averageRating: 4.7,
    ratingsCount: 1876,
  },
  {
    id: "8",
    title: "Educated",
    author: "Tara Westover",
    description:
      "An unforgettable memoir about a young girl who, kept out of school, leaves her survivalist family and goes on to earn a PhD from Cambridge University.",
    coverImage: "/placeholder.svg?height=300&width=200",
    publishedDate: "2018-02-20",
    genre: "Non-Fiction",
    pageCount: 334,
    isbn: "9780399590504",
    averageRating: 4.5,
    ratingsCount: 2103,
  },
  {
    id: "9",
    title: "Where the Crawdads Sing",
    author: "Delia Owens",
    description:
      "For years, rumors of the 'Marsh Girl' have haunted Barkley Cove, a quiet town on the North Carolina coast. So in late 1969, when handsome Chase Andrews is found dead, the locals immediately suspect Kya Clark, the so-called Marsh Girl.",
    coverImage: "/placeholder.svg?height=300&width=200",
    publishedDate: "2018-08-14",
    genre: "Fiction",
    pageCount: 368,
    isbn: "9780735219090",
    averageRating: 4.8,
    ratingsCount: 2567,
  },
  {
    id: "10",
    title: "The Silent Patient",
    author: "Alex Michaelides",
    description:
      "Alicia Berenson's life is seemingly perfect. A famous painter married to an in-demand fashion photographer, she lives in a grand house with big windows overlooking a park in one of London's most desirable areas. One evening her husband Gabriel returns home late from a fashion shoot, and Alicia shoots him five times in the face, and then never speaks another word.",
    coverImage: "/placeholder.svg?height=300&width=200",
    publishedDate: "2019-02-05",
    genre: "Thriller",
    pageCount: 325,
    isbn: "9781250301697",
    averageRating: 4.3,
    ratingsCount: 1932,
  },
]

// Initial reading lists
const initialReadingLists: ReadingList[] = [
  {
    id: "to-read",
    name: "To Read",
    description: "Books I want to read in the future",
    books: [initialBooks[2], initialBooks[3], initialBooks[8]],
  },
  {
    id: "currently-reading",
    name: "Currently Reading",
    description: "Books I'm reading right now",
    books: [initialBooks[0], initialBooks[6]],
  },
  {
    id: "read",
    name: "Read",
    description: "Books I've finished reading",
    books: [initialBooks[9]],
  },
  {
    id: "favorites",
    name: "Favorites",
    description: "My all-time favorite books",
    books: [initialBooks[1], initialBooks[4], initialBooks[5]],
  },
]

// Create a global store that persists across requests
// In a real app, this would be a database
const globalStore = {
  books: [...initialBooks],
  readingLists: [...initialReadingLists],
}

// Export functions to interact with the store
export function getBooks() {
  return globalStore.books
}

export function getReadingLists() {
  return globalStore.readingLists
}

export function addReadingList(readingList: ReadingList) {
  globalStore.readingLists.push(readingList)
  return readingList.id
}

export function updateReadingList(id: string, updates: Partial<ReadingList>) {
  const index = globalStore.readingLists.findIndex((list) => list.id === id)
  if (index !== -1) {
    globalStore.readingLists[index] = {
      ...globalStore.readingLists[index],
      ...updates,
    }
    return true
  }
  return false
}

export function deleteReadingList(id: string) {
  const initialLength = globalStore.readingLists.length
  globalStore.readingLists = globalStore.readingLists.filter((list) => list.id !== id)
  return initialLength !== globalStore.readingLists.length
}

export function addBookToReadingList(bookId: string, listId: string) {
  const book = globalStore.books.find((b) => b.id === bookId)
  const listIndex = globalStore.readingLists.findIndex((list) => list.id === listId)

  if (!book || listIndex === -1) {
    return false
  }

  // Check if book is already in the list
  const bookExists = globalStore.readingLists[listIndex].books.some((b) => b.id === bookId)
  if (!bookExists) {
    globalStore.readingLists[listIndex].books.push(book)
    return true
  }

  return false
}

export function removeBookFromReadingList(bookId: string, listId: string) {
  const listIndex = globalStore.readingLists.findIndex((list) => list.id === listId)

  if (listIndex === -1) {
    return false
  }

  const initialLength = globalStore.readingLists[listIndex].books.length
  globalStore.readingLists[listIndex].books = globalStore.readingLists[listIndex].books.filter(
    (book) => book.id !== bookId,
  )

  return initialLength !== globalStore.readingLists[listIndex].books.length
}

export function updateBookRating(bookId: string, rating: number) {
  const bookIndex = globalStore.books.findIndex((book) => book.id === bookId)

  if (bookIndex === -1) {
    return false
  }

  const book = globalStore.books[bookIndex]
  const newTotalRating = book.averageRating * book.ratingsCount + rating
  const newRatingsCount = book.ratingsCount + 1
  const newAverageRating = newTotalRating / newRatingsCount

  globalStore.books[bookIndex] = {
    ...book,
    averageRating: newAverageRating,
    ratingsCount: newRatingsCount,
  }

  return true
}

// For debugging
export function getStoreState() {
  return {
    booksCount: globalStore.books.length,
    readingListsCount: globalStore.readingLists.length,
    readingLists: globalStore.readingLists.map((list) => ({
      id: list.id,
      name: list.name,
      booksCount: list.books.length,
    })),
  }
}

