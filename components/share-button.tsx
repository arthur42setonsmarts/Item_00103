"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, Copy } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ShareButtonProps {
  url: string
  title: string
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
}

export default function ShareButton({
  url,
  title,
  variant = "outline",
  size = "default",
  className = "",
}: ShareButtonProps) {
  const { toast } = useToast()
  const [isSharing, setIsSharing] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    setIsSharing(true)

    try {
      // Ensure we have a complete URL with hostname
      let fullUrl = url

      // If the URL is relative (starts with /), add the origin
      if (url.startsWith("/")) {
        fullUrl = `${window.location.origin}${url}`
      }
      // If the URL doesn't have a protocol, assume it's relative to the current origin
      else if (!url.startsWith("http")) {
        fullUrl = `${window.location.origin}/${url}`
      }

      // Copy the full URL to clipboard
      await navigator.clipboard.writeText(fullUrl)
      setCopied(true)
      toast({
        title: "Link copied",
        description: `${title} link copied to clipboard`,
      })

      // Reset the copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000)
    } catch (clipboardError) {
      console.error("Clipboard error:", clipboardError)
      toast({
        title: "Sharing failed",
        description: "Could not copy link to clipboard",
        variant: "destructive",
      })
    } finally {
      setIsSharing(false)
    }
  }

  // For icon-only button
  if (size === "icon") {
    return (
      <Button variant={variant} size="icon" className={className} onClick={handleShare} disabled={isSharing}>
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        <span className="sr-only">Copy Link</span>
      </Button>
    )
  }

  // For regular button with text
  return (
    <Button variant={variant} size={size} className={className} onClick={handleShare} disabled={isSharing}>
      {copied ? (
        <>
          <Check className="mr-2 h-4 w-4" />
          Copied!
        </>
      ) : (
        <>
          <Copy className="mr-2 h-4 w-4" />
          Copy Link
        </>
      )}
    </Button>
  )
}

