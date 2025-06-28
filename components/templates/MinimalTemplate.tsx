"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <div className="max-w-4xl mx-auto px-8 py-16">
        {/* Header */}
        <BlurFade delay={0.1}>
          <div className="text-center mb-16 border-b border-gray-100 dark:border-gray-800 pb-16">
            <Avatar className="w-24 h-24 mx-auto mb-8 border border-gray-200 dark:border-gray-700">
              <AvatarImage src="/placeholder.svg?height=96&width=96" />
              <AvatarFallback className="text-xl font-light bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300">
                {data.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>

            <h1 className="text-4xl font-light text-gray-900 dark:text-white mb-4 tracking-wide">{data.name}</h1>

            <h2 className="text-lg text-gray-600 dark:text-gray-400 font-light tracking-wide">{data.title}</h2>

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
            <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 font-light">{data.summary}</p>
          </div>
        </BlurFade>

        {/* Experience */}
        {data.experience && data.experience.length > 0 && (
          <BlurFade delay={0.3}>
            <div className="mb-16">
              <h2 className="text-sm uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-8 font-light">
                Experience
              </h2>
              <div className="space-y-12">
                {data.experience.map((exp, index) => (
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
        {data.skills && data.skills.length > 0 && (
          <BlurFade delay={0.4}>
            <div className="mb-16">
              <h2 className="text-sm uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-8 font-light">
                Skills
              </h2>
              <div className="flex flex-wrap gap-3">
                {data.skills.map((skill, index) => (
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
        {data.projects && data.projects.length > 0 && (
          <BlurFade delay={0.5}>
            <div className="mb-16">
              <h2 className="text-sm uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-8 font-light">
                Projects
              </h2>
              <div className="space-y-12">
                {data.projects.map((project, index) => (
                  <div key={index}>
                    <h3 className="text-xl font-light text-gray-900 dark:text-white mb-3">{project.name}</h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-4 font-light leading-relaxed">
                      {project.description}
                    </p>
                    {project.techStack && project.techStack.length > 0 && (
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
        {data.education && data.education.length > 0 && (
          <BlurFade delay={0.6}>
            <div>
              <h2 className="text-sm uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-8 font-light">
                Education
              </h2>
              <div className="space-y-6">
                {data.education.map((edu, index) => (
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
