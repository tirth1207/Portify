"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
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

interface ProfessionalTemplateProps {
  data: Resume
  editMode?: boolean
  onSave?: (data: Resume) => void
}

export default function ProfessionalTemplate({ data, editMode = false, onSave }: ProfessionalTemplateProps) {
  const contact = data.contact || {}
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Professional Header */}
        <BlurFade delay={0.1}>
          <Card className="mb-6 sm:mb-8 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
            <CardContent className="p-6 sm:p-8">
              <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-8">
                <Avatar className="w-24 h-24 sm:w-32 sm:h-32 border-4 border-gray-200 dark:border-slate-600">
                  <AvatarImage src="/placeholder.svg?height=128&width=128" alt={`${data.name} avatar`} />
                  <AvatarFallback className="text-xl sm:text-2xl font-bold bg-gray-600 text-white">
                    {data.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                <div className="text-center md:text-left flex-1">
                  <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">{data.name}</h1>
                  <h2 className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-3 sm:mb-4">{data.title}</h2>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base mb-4 sm:mb-6">{data.summary}</p>
                  
                  {/* Contact Information */}
                  <div className="flex flex-col sm:flex-row justify-center md:justify-start items-center gap-3 sm:gap-6 text-sm text-gray-600 dark:text-gray-400">
                    {contact.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        <a href={`mailto:${contact.email}`} className="hover:text-gray-800 dark:hover:text-gray-200 transition-colors">
                          {contact.email}
                        </a>
                      </div>
                    )}
                    {contact.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        <a href={`tel:${contact.phone}`} className="hover:text-gray-800 dark:hover:text-gray-200 transition-colors">
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
                    <div className="flex justify-center md:justify-start items-center gap-4 mt-3 sm:mt-4">
                      {contact.website && (
                        <a
                          href={contact.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
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
                          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
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
                          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                          aria-label="GitHub profile"
                        >
                          <Github className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </BlurFade>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            {/* Experience */}
            {data.experience && data.experience.length > 0 && (
              <BlurFade delay={0.2}>
                <Card className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                      Professional Experience
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 sm:space-y-6">
                    {data.experience.map((exp, index) => (
                      <div key={index}>
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-4 mb-3">
                          <div>
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">{exp.role}</h3>
                            <p className="text-gray-600 dark:text-gray-300 font-medium text-sm sm:text-base">{exp.company}</p>
                          </div>
                          <Badge variant="outline" className="ml-0 sm:ml-4 text-xs sm:text-sm">
                            {exp.duration}
                          </Badge>
                        </div>
                        <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                          {exp.responsibilities.map((resp, i) => (
                            <li key={i}>{resp}</li>
                          ))}
                        </ul>
                        {index < data.experience.length - 1 && <Separator className="mt-4 sm:mt-6" />}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </BlurFade>
            )}

            {/* Projects */}
            {data.projects && data.projects.length > 0 && (
              <BlurFade delay={0.3}>
                <Card className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Key Projects</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 sm:space-y-6">
                    {data.projects.map((project, index) => (
                      <div key={index}>
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3">{project.name}</h3>
                        <p className="text-gray-700 dark:text-gray-300 mb-3 text-sm sm:text-base">{project.description}</p>
                        {project.techStack && (
                          <div className="flex flex-wrap gap-1 sm:gap-2">
                            {project.techStack.map((tech, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        )}
                        {data.projects && index < data.projects.length - 1 && <Separator className="mt-4 sm:mt-6" />}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </BlurFade>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6 sm:space-y-8">
            {/* Skills */}
            {data.skills && data.skills.length > 0 && (
              <BlurFade delay={0.4}>
                <Card className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Core Skills</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {data.skills.map((skill, index) => (
                        <div key={index} className="flex items-center justify-between py-2">
                          <span className="text-gray-700 dark:text-gray-300 font-medium text-sm sm:text-base">{skill}</span>
                          <div className="w-20 sm:w-24 bg-gray-200 dark:bg-slate-600 rounded-full h-2">
                            <div
                              className="bg-gray-600 dark:bg-gray-400 h-2 rounded-full"
                              style={{ width: `${Math.floor(Math.random() * 30) + 70}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </BlurFade>
            )}

            {/* Education */}
            {data.education && data.education.length > 0 && (
              <BlurFade delay={0.5}>
                <Card className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Education</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 sm:space-y-4">
                    {data.education.map((edu, index) => (
                      <div key={index}>
                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">{edu.degree}</h3>
                        <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">{edu.institution}</p>
                        <Badge variant="outline" className="mt-1 text-xs">
                          {edu.years}
                        </Badge>
                        {index < data.education.length - 1 && <Separator className="mt-3 sm:mt-4" />}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </BlurFade>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
