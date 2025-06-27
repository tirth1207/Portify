"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import BlurFade from "@/components/magicui/blur-fade"
import { Mail, Phone, MapPin } from "lucide-react"

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

interface MinimalTemplateProps {
  data: Resume
  editMode?: boolean
  onSave?: (data: Resume) => void
}

export default function MinimalTemplate({ data, editMode = false, onSave }: MinimalTemplateProps) {
  const [editData, setEditData] = useState(data)

  const EditableText = ({
    value,
    onChange,
    className = "",
    multiline = false,
    placeholder = "",
  }: {
    value: string
    onChange: (value: string) => void
    className?: string
    multiline?: boolean
    placeholder?: string
  }) => {
    if (!editMode) return <span className={className}>{value}</span>

    return multiline ? (
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${className} min-h-[100px] border-none shadow-none resize-none`}
        placeholder={placeholder}
      />
    ) : (
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${className} border-none shadow-none`}
        placeholder={placeholder}
      />
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <div className="max-w-4xl mx-auto px-8 py-16">
        {/* Header */}
        <BlurFade delay={0.1}>
          <div className="text-center mb-16 border-b border-gray-100 dark:border-gray-800 pb-16">
            <Avatar className="w-24 h-24 mx-auto mb-8 border border-gray-200 dark:border-gray-700">
              <AvatarImage src="/placeholder.svg?height=96&width=96" />
              <AvatarFallback className="text-xl font-light bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300">
                {editData.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>

            <EditableText
              value={editData.name}
              onChange={(value) => setEditData({ ...editData, name: value })}
              className="text-4xl font-light text-gray-900 dark:text-white mb-4 block tracking-wide"
              placeholder="Your Name"
            />

            <EditableText
              value={editData.title}
              onChange={(value) => setEditData({ ...editData, title: value })}
              className="text-lg text-gray-600 dark:text-gray-400 font-light tracking-wide block"
              placeholder="Your Professional Title"
            />

            <div className="flex justify-center items-center gap-6 mt-8 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>hello@example.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>New York, NY</span>
              </div>
            </div>
          </div>
        </BlurFade>

        {/* About */}
        <BlurFade delay={0.2}>
          <div className="mb-16">
            <h2 className="text-sm uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-8 font-light">
              About
            </h2>
            <EditableText
              value={editData.summary}
              onChange={(value) => setEditData({ ...editData, summary: value })}
              className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 font-light"
              multiline
              placeholder="Tell us about yourself..."
            />
          </div>
        </BlurFade>

        {/* Experience */}
        {editData.experience && editData.experience.length > 0 && (
          <BlurFade delay={0.3}>
            <div className="mb-16">
              <h2 className="text-sm uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-8 font-light">
                Experience
              </h2>
              <div className="space-y-12">
                {editData.experience.map((exp, index) => (
                  <div key={index} className="group">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-light text-gray-900 dark:text-white">{exp.role}</h3>
                        <p className="text-gray-600 dark:text-gray-400 font-light">{exp.company}</p>
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400 font-light">{exp.duration}</span>
                    </div>
                    <ul className="space-y-2 text-gray-700 dark:text-gray-300 font-light">
                      {exp.responsibilities.slice(0, 3).map((resp, i) => (
                        <li key={i} className="flex items-start">
                          <span className="w-1 h-1 bg-gray-400 rounded-full mt-3 mr-4 flex-shrink-0"></span>
                          {resp}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </BlurFade>
        )}

        {/* Skills */}
        {editData.skills && editData.skills.length > 0 && (
          <BlurFade delay={0.4}>
            <div className="mb-16">
              <h2 className="text-sm uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-8 font-light">
                Skills
              </h2>
              <div className="flex flex-wrap gap-3">
                {editData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-none font-light"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </BlurFade>
        )}

        {/* Projects */}
        {editData.projects && editData.projects.length > 0 && (
          <BlurFade delay={0.5}>
            <div className="mb-16">
              <h2 className="text-sm uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-8 font-light">
                Projects
              </h2>
              <div className="space-y-12">
                {editData.projects.map((project, index) => (
                  <div key={index}>
                    <h3 className="text-xl font-light text-gray-900 dark:text-white mb-3">{project.name}</h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-4 font-light leading-relaxed">
                      {project.description}
                    </p>
                    {project.techStack && (
                      <div className="flex flex-wrap gap-2">
                        {project.techStack.map((tech, i) => (
                          <span
                            key={i}
                            className="text-xs text-gray-500 dark:text-gray-400 border-b border-gray-300 dark:border-gray-600 pb-1"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </BlurFade>
        )}

        {/* Education */}
        {editData.education && editData.education.length > 0 && (
          <BlurFade delay={0.6}>
            <div>
              <h2 className="text-sm uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-8 font-light">
                Education
              </h2>
              <div className="space-y-6">
                {editData.education.map((edu, index) => (
                  <div key={index} className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-light text-gray-900 dark:text-white">{edu.degree}</h3>
                      <p className="text-gray-600 dark:text-gray-400 font-light">{edu.institution}</p>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400 font-light">{edu.years}</span>
                  </div>
                ))}
              </div>
            </div>
          </BlurFade>
        )}
      </div>
    </div>
  )
}
