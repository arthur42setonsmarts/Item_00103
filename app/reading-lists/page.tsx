import type { Metadata } from "next"
import { ClientReadingLists } from "@/components/client-reading-lists"

export const metadata: Metadata = {
  title: "My Reading Lists | BookBuddy",
  description: "Manage your reading lists and track your reading progress",
}

export default function ReadingListsPage() {
  return (
    <div className="container py-8">
      <ClientReadingLists />
    </div>
  )
}

