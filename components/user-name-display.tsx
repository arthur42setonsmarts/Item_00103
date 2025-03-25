"use client"

import { useState, useEffect } from "react"
import { getUserName } from "@/lib/client-storage"
import EditUserNameDialog from "@/components/edit-user-name-dialog"

interface UserNameDisplayProps {
  showEditButton?: boolean
  className?: string
}

export default function UserNameDisplay({ showEditButton = false, className = "" }: UserNameDisplayProps) {
  const [name, setName] = useState("")

  useEffect(() => {
    setName(getUserName())

    // Listen for storage events to update in real-time
    const handleStorageChange = () => {
      setName(getUserName())
    }

    window.addEventListener("storage", handleStorageChange)
    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  const handleNameChange = () => {
    setName(getUserName())
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="font-medium">{name}</span>
      {showEditButton && <EditUserNameDialog onNameChange={handleNameChange} />}
    </div>
  )
}

