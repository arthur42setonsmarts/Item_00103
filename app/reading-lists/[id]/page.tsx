import type { Metadata } from "next"
import { ClientReadingListDetail } from "@/components/client-reading-list-detail"

interface ReadingListPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: ReadingListPageProps): Promise<Metadata> {
  return {
    title: "Reading List | BookBuddy",
    description: "View and manage your reading list",
  }
}

export default function ReadingListPage({ params }: ReadingListPageProps) {
  return (
    <div className="container py-8">
      <ClientReadingListDetail id={params.id} />
    </div>
  )
}

