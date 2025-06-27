"use client"
import MinimalTemplate from "./MinimalTemplate"

type Resume = {
  name: string
  title: string
  summary: string
  skills?: string[]
  projects?: {
    name: string
    description: string
    techStack?: string[]
  }[]
  education: {
    institution: string
    degree: string
    years: string
  }[]
  experience: {
    company: string
    role: string
    duration: string
    responsibilities: string[]
  }[]
}

interface PortfolioTemplateProps {
  data: Resume
  editMode?: boolean
  onSave?: (data: Resume) => void
}

export default function PortfolioTemplate({ data, editMode = false, onSave }: PortfolioTemplateProps) {
  // Default to MinimalTemplate for backward compatibility
  return <MinimalTemplate data={data} editMode={editMode} onSave={onSave} />
}
