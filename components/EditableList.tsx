"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { X, Plus, Edit2 } from "lucide-react"

interface EditableListProps<T = any> {
  items: T[]
  onChange: (items: T[]) => void
  editMode: boolean
  renderItem: (item: T, index: number) => React.ReactNode
  renderEditForm: (item: T, onChange: (item: T) => void, onSave: () => void, onCancel: () => void) => React.ReactNode
  addNewItem: () => T
  className?: string
}

export default function EditableList<T = any>({
  items = [], // Add default empty array
  onChange,
  editMode,
  renderItem,
  renderEditForm,
  addNewItem,
  className = "",
}: EditableListProps<T>) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editingItem, setEditingItem] = useState<T | null>(null)

  // Ensure items is always an array
  const safeItems = items || []

  const startEditing = (index: number) => {
    setEditingIndex(index)
    setEditingItem({ ...safeItems[index] })
  }

  const saveEdit = () => {
    if (editingIndex !== null && editingItem !== null) {
      const newItems = [...safeItems]
      newItems[editingIndex] = editingItem
      onChange(newItems)
      setEditingIndex(null)
      setEditingItem(null)
    }
  }

  const cancelEdit = () => {
    setEditingIndex(null)
    setEditingItem(null)
  }

  const removeItem = (index: number) => {
    onChange(safeItems.filter((_, i) => i !== index))
  }

  const addItem = () => {
    onChange([...safeItems, addNewItem()])
  }

  return (
    <div className={className}>
      {safeItems.map((item, index) => (
        // Rest of the component remains the same, but use safeItems
        <div key={index} className="relative group mb-6 last:mb-0">
          {editingIndex === index ? (
            renderEditForm(editingItem!, setEditingItem, saveEdit, cancelEdit)
          ) : (
            <>
              {renderItem(item, index)}
              {editMode && (
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 bg-blue-500 hover:bg-blue-600 text-white rounded-full"
                    onClick={() => startEditing(index)}
                  >
                    <Edit2 className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 bg-red-500 hover:bg-red-600 text-white rounded-full"
                    onClick={() => removeItem(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      ))}

      {editMode && (
        <Button variant="outline" className="w-full border-dashed bg-transparent" onClick={addItem}>
          <Plus className="h-4 w-4 mr-2" />
          Add New
        </Button>
      )}
    </div>
  )
}
