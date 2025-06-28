"use client"

import type React from "react"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, Plus } from "lucide-react"

interface EditableSkillsProps {
  skills?: string[]
  onChange: (skills: string[]) => void
  editMode: boolean
  className?: string
  badgeClassName?: string
}

export default function EditableSkills({
  skills = [],
  onChange,
  editMode,
  className = "",
  badgeClassName = "",
}: EditableSkillsProps) {
  const [newSkill, setNewSkill] = useState("")
  const [isAdding, setIsAdding] = useState(false)

  const safeSkills = skills || []

  const addSkill = () => {
    if (newSkill.trim() && !safeSkills.includes(newSkill.trim())) {
      onChange([...safeSkills, newSkill.trim()])
      setNewSkill("")
      setIsAdding(false)
    }
  }

  const removeSkill = (skillToRemove: string) => {
    onChange(safeSkills.filter((skill) => skill !== skillToRemove))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addSkill()
    } else if (e.key === "Escape") {
      setNewSkill("")
      setIsAdding(false)
    }
  }

  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      {safeSkills.map((skill, index) => (
        <Badge key={index} className={`${badgeClassName} ${editMode ? "group relative pr-8" : ""}`}>
          {skill}
          {editMode && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute -top-1 -right-1 h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 hover:bg-red-600 text-white rounded-full"
              onClick={() => removeSkill(skill)}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </Badge>
      ))}

      {editMode && (
        <>
          {isAdding ? (
            <div className="flex items-center gap-2">
              <Input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Add skill..."
                className="w-32 h-8 text-sm"
                autoFocus
                onBlur={() => {
                  if (newSkill.trim()) addSkill()
                  else setIsAdding(false)
                }}
              />
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-3 text-sm border-dashed bg-transparent"
              onClick={() => setIsAdding(true)}
            >
              <Plus className="h-3 w-3 mr-1" />
              Add Skill
            </Button>
          )}
        </>
      )}
    </div>
  )
}
