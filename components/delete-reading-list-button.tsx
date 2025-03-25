"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useReadingLists } from "@/components/reading-lists-provider"
import { Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface DeleteReadingListButtonProps {
  id: string
}

export default function DeleteReadingListButton({ id }: DeleteReadingListButtonProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { deleteReadingList, getReadingListById } = useReadingLists()
  const [isDeleting, setIsDeleting] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  // Get the reading list name
  const readingList = getReadingListById(id)
  const readingListName = readingList?.name || "this reading list"

  const handleDelete = async () => {
    setIsDeleting(true)

    try {
      // Delete the reading list from client storage
      deleteReadingList(id)

      // Close the dialog
      setIsOpen(false)

      // Show success toast
      toast({
        title: "Success",
        description: "Reading list deleted successfully",
      })

      // Navigate to the reading lists page
      router.push("/reading-lists")
    } catch (error) {
      console.error("Error deleting reading list:", error)
      toast({
        title: "Error",
        description: "Failed to delete reading list",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Delete</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Deleting Reading List</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to permanently delete <strong>{readingListName}</strong>?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              // Prevent the default action which would close the dialog
              e.preventDefault()
              handleDelete()
            }}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

