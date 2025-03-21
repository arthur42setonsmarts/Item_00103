export interface Book {
  id: string
  title: string
  author: string
  description: string
  coverImage?: string
  publishedDate: string
  genre: string
  pageCount: number
  isbn: string
  averageRating: number
  ratingsCount: number
}

export interface ReadingList {
  id: string
  name: string
  description?: string
  books: Book[]
}

export interface UserProfile {
  name: string
  avatar?: string
  joinedDate: string
  bio?: string
  favoriteGenres: string[]
  stats: {
    booksRead: number
    listsCreated: number
    ratingsGiven: number
  }
}

