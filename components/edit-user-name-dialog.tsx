"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { getUserName, saveUserName } from "@/lib/client-storage"
import { Pencil } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

// Define form validation schema
const nameFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name must be less than 50 characters"),
})

type NameFormValues = z.infer<typeof nameFormSchema>

interface EditUserNameDialogProps {
  onNameChange?: () => void
}

export default function EditUserNameDialog({ onNameChange }: EditUserNameDialogProps) {
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [currentName, setCurrentName] = useState("")

  // Initialize form with react-hook-form and zod validation
  const form = useForm<NameFormValues>({
    resolver: zodResolver(nameFormSchema),
    defaultValues: {
      name: "",
    },
  })

  // Load current name when dialog opens
  useEffect(() => {
    if (open) {
      const name = getUserName()
      setCurrentName(name)
      form.setValue("name", name)
    }
  }, [open, form])

  const isSubmitting = form.formState.isSubmitting

  const onSubmit = async (values: NameFormValues) => {
    try {
      // Save name to localStorage
      const success = saveUserName(values.name)

      if (success) {
        toast({
          title: "Name updated",
          description: "Your name has been updated successfully.",
        })

        // Close the dialog
        setOpen(false)

        // Call the onNameChange callback if provided
        if (onNameChange) {
          onNameChange()
        }
      } else {
        throw new Error("Failed to save name")
      }
    } catch (error) {
      console.error("Error updating name:", error)
      toast({
        title: "Error",
        description: "Failed to update your name. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
          <Pencil className="h-4 w-4" />
          <span className="sr-only">Edit Name</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Your Name</DialogTitle>
          <DialogDescription>Change how your name appears in reviews and comments.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your name" {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

