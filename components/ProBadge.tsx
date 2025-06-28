"use client"

import { Crown } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface ProBadgeProps {
  className?: string
  size?: "sm" | "md" | "lg"
}

export default function ProBadge({ className = "", size = "sm" }: ProBadgeProps) {
  const sizeClasses = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-3 py-1.5",
    lg: "text-base px-4 py-2",
  }

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  }

  return (
    <Badge
      className={`bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 ${sizeClasses[size]} ${className}`}
    >
      <Crown className={`${iconSizes[size]} mr-1`} />
      PRO
    </Badge>
  )
}
