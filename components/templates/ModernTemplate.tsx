"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import BlurFade from "@/components/magicui/blur-fade"
import { Mail, Phone, MapPin, Globe, Linkedin, Github } from "lucide-react"

type Resume = {
  name: string
  title: string
  summary: string
  contact?: {
    email?: string
    phone?: string
    location?: string
    website?: string
    linkedin?: string
    github?: string
  }
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

interface ModernTemplateProps {
  data: Resume
  editMode?: boolean
  onSave?: (data: Resume) => void
}

export default function ModernTemplate({ data, editMode = false, onSave }: ModernTemplateProps) {
  const contact = data.contact || {}
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="w-full max-w-6xl mx-auto px-2 sm:px-6 py-6 sm:py-12">
        {/* Hero Section */}
        <BlurFade delay={0.1}>
          <div className="text-center mb-8 sm:mb-16">
            <Avatar className="w-20 h-20 sm:w-32 sm:h-32 mx-auto mb-3 sm:mb-6 border-4 border-white shadow-xl">
              <AvatarImage src="/placeholder.svg?height=128&width=128" alt={`${data.name} avatar`} />
              <AvatarFallback className="text-xl sm:text-2xl font-bold bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                {data.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>

            <h1 className="text-2xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-4">
              {data.name}
            </h1>

            <h2 className="text-base sm:text-xl text-indigo-600 dark:text-indigo-400 font-medium mb-4 sm:mb-8">
              {data.title}
            </h2>

            {/* Contact Information */}
            <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-2 sm:gap-6 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              {contact.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <a href={`mailto:${contact.email}`} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                    {contact.email}
                  </a>
                </div>
              )}
              {contact.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <a href={`tel:${contact.phone}`} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                    {contact.phone}
                  </a>
                </div>
              )}
              {contact.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{contact.location}</span>
                </div>
              )}
            </div>

            {/* Social Links */}
            {(contact.website || contact.linkedin || contact.github) && (
              <div className="flex justify-center items-center gap-3 sm:gap-4 mt-3 sm:mt-6">
                {contact.website && (
                  <a
                    href={contact.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    aria-label="Personal website"
                  >
                    <Globe className="h-4 w-4" />
                  </a>
                )}
                {contact.linkedin && (
                  <a
                    href={contact.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    aria-label="LinkedIn profile"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                )}
                {contact.github && (
                  <a
                    href={contact.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    aria-label="GitHub profile"
                  >
                    <Github className="h-4 w-4" />
                  </a>
                )}
              </div>
            )}
          </div>
        </BlurFade>

        {/* About Section */}
        <BlurFade delay={0.2}>
          <Card className="mb-6 sm:mb-12 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">About Me</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-xs sm:text-base">
                {data.summary}
              </p>
            </CardContent>
          </Card>
        </BlurFade>

        {/* Skills Section */}
        {data.skills && data.skills.length > 0 && (
          <BlurFade delay={0.3}>
            <Card className="mb-6 sm:mb-12 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">Skills & Expertise</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1 sm:gap-3">
                  {data.skills.map((skill, index) => (
                    <Badge
                      key={index}
                      className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-medium"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </BlurFade>
        )}

        {/* Experience Section */}
        {data.experience && data.experience.length > 0 && (
          <BlurFade delay={0.4}>
            <Card className="mb-6 sm:mb-12 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                  Professional Experience
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-8">
                {data.experience.map((exp, index) => (
                  <div key={index} className="border-l-4 border-indigo-500 pl-3 sm:pl-6 pb-2 sm:pb-6">
                    <h3 className="text-base sm:text-xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">
                      {exp.role}
                    </h3>
                    <p className="text-indigo-600 dark:text-indigo-400 font-medium mb-1 sm:mb-3 text-xs sm:text-base">
                      {exp.company} • {exp.duration}
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300 text-xs sm:text-base">
                      {exp.responsibilities.map((resp, i) => (
                        <li key={i}>{resp}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </CardContent>
            </Card>
          </BlurFade>
        )}

        {/* Projects Section */}
        {data.projects && data.projects.length > 0 && (
          <BlurFade delay={0.5}>
            <Card className="mb-6 sm:mb-12 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">Featured Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6">
                  {data.projects.map((project, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-br from-white to-gray-50 dark:from-slate-700 dark:to-slate-800 rounded-lg p-3 sm:p-6 shadow-lg"
                    >
                      <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-1 sm:mb-3">
                        {project.name}
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 mb-2 sm:mb-4 text-xs sm:text-base">
                        {project.description}
                      </p>
                      {project.techStack && (
                        <div className="flex flex-wrap gap-1 sm:gap-2">
                          {project.techStack.map((tech, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </BlurFade>
        )}

        {/* Education Section */}
        {data.education && data.education.length > 0 && (
          <BlurFade delay={0.6}>
            <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">Education</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 sm:space-y-4">
                {data.education.map((edu, index) => (
                  <div key={index} className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                        {edu.degree}
                      </h3>
                      <p className="text-indigo-600 dark:text-indigo-400 font-medium text-sm sm:text-base">
                        {edu.institution}
                      </p>
                    </div>
                    <Badge variant="outline" className="ml-0 sm:ml-4 text-xs sm:text-sm">
                      {edu.years}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </BlurFade>
        )}
      </div>
    </div>
  )
}
