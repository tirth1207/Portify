"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
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

interface CreativeTemplateProps {
  data: Resume
  editMode?: boolean
  onSave?: (data: Resume) => void
}

export default function CreativeTemplate({ data, editMode = false, onSave }: CreativeTemplateProps) {
  const contact = data.contact || {}
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Creative Hero Section */}
        <BlurFade delay={0.1}>
          <div className="relative mb-12 sm:mb-20">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-600 rounded-2xl sm:rounded-3xl transform rotate-1"></div>
            <div className="relative bg-white dark:bg-slate-800 rounded-2xl sm:rounded-3xl p-6 sm:p-12 shadow-2xl">
              <div className="flex flex-col lg:flex-row items-center gap-6 sm:gap-12">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-600 rounded-full blur-lg opacity-30"></div>
                  <Avatar className="w-24 h-24 sm:w-40 sm:h-40 border-4 border-white shadow-xl relative">
                    <AvatarImage src="/placeholder.svg?height=160&width=160" alt={`${data.name} avatar`} />
                    <AvatarFallback className="text-2xl sm:text-3xl font-bold bg-gradient-to-br from-pink-500 to-purple-600 text-white">
                      {data.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="text-center lg:text-left flex-1">
                  <h1 className="text-4xl sm:text-6xl font-black bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-3 sm:mb-4">
                    {data.name}
                  </h1>
                  <h2 className="text-lg sm:text-2xl font-bold text-gray-700 dark:text-gray-300 mb-4 sm:mb-6">{data.title}</h2>
                  <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-4 sm:mb-6">{data.summary}</p>
                  
                  {/* Contact Information */}
                  <div className="flex flex-col sm:flex-row justify-center lg:justify-start items-center gap-3 sm:gap-6 text-sm text-gray-600 dark:text-gray-400">
                    {contact.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        <a href={`mailto:${contact.email}`} className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors">
                          {contact.email}
                        </a>
                      </div>
                    )}
                    {contact.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        <a href={`tel:${contact.phone}`} className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors">
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
                    <div className="flex justify-center lg:justify-start items-center gap-4 mt-4 sm:mt-6">
                      {contact.website && (
                        <a
                          href={contact.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
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
                          className="text-gray-400 hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
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
                          className="text-gray-400 hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
                          aria-label="GitHub profile"
                        >
                          <Github className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </BlurFade>

        {/* Creative Skills Grid */}
        {data.skills && data.skills.length > 0 && (
          <BlurFade delay={0.2}>
            <div className="mb-12 sm:mb-20">
              <h2 className="text-3xl sm:text-4xl font-black text-center mb-8 sm:mb-12 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Creative Arsenal
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {data.skills.map((skill, index) => (
                  <div
                    key={index}
                    className="group relative bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-600 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity"></div>
                    <div className="relative text-center">
                      <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                        <span className="text-white font-bold text-sm sm:text-lg">{skill.charAt(0)}</span>
                      </div>
                      <h3 className="font-bold text-gray-900 dark:text-white text-sm sm:text-base">{skill}</h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </BlurFade>
        )}

        {/* Experience Timeline */}
        {data.experience && data.experience.length > 0 && (
          <BlurFade delay={0.3}>
            <div className="mb-12 sm:mb-20">
              <h2 className="text-3xl sm:text-4xl font-black text-center mb-8 sm:mb-12 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Journey So Far
              </h2>
              <div className="relative">
                <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-pink-500 to-purple-600 rounded-full"></div>
                {data.experience.map((exp, index) => (
                  <div
                    key={index}
                    className={`flex items-center mb-8 sm:mb-12 ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}
                  >
                    <div className={`w-full sm:w-1/2 ${index % 2 === 0 ? "sm:pr-8 sm:text-right" : "sm:pl-8 sm:text-left"}`}>
                      <Card className="bg-white dark:bg-slate-800 shadow-xl border-0 transform hover:scale-105 transition-transform">
                        <CardContent className="p-4 sm:p-6">
                          <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">{exp.role}</h3>
                          <p className="text-purple-600 dark:text-purple-400 font-semibold mb-3 text-sm sm:text-base">
                            {exp.company} • {exp.duration}
                          </p>
                          <ul className="text-gray-600 dark:text-gray-300 space-y-1 text-sm sm:text-base">
                            {exp.responsibilities.slice(0, 2).map((resp, i) => (
                              <li key={i} className="text-sm sm:text-base">
                                • {resp}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </div>
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 sm:w-6 sm:h-6 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full border-4 border-white shadow-lg"></div>
                  </div>
                ))}
              </div>
            </div>
          </BlurFade>
        )}

        {/* Projects Showcase */}
        {data.projects && data.projects.length > 0 && (
          <BlurFade delay={0.4}>
            <div className="mb-12 sm:mb-20">
              <h2 className="text-3xl sm:text-4xl font-black text-center mb-8 sm:mb-12 bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
                Creative Projects
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                {data.projects.map((project, index) => (
                  <Card
                    key={index}
                    className="group bg-white dark:bg-slate-800 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-4 overflow-hidden"
                  >
                    <div className="h-32 sm:h-48 bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 relative">
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                      <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4">
                        <h3 className="text-lg sm:text-2xl font-bold text-white mb-2">{project.name}</h3>
                      </div>
                    </div>
                    <CardContent className="p-4 sm:p-6">
                      <p className="text-gray-600 dark:text-gray-300 mb-3 sm:mb-4 text-sm sm:text-base">{project.description}</p>
                      {project.techStack && (
                        <div className="flex flex-wrap gap-1 sm:gap-2">
                          {project.techStack.map((tech, i) => (
                            <Badge key={i} className="bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </BlurFade>
        )}

        {/* Education */}
        {data.education && data.education.length > 0 && (
          <BlurFade delay={0.5}>
            <div className="text-center">
              <h2 className="text-3xl sm:text-4xl font-black mb-8 sm:mb-12 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Learning Journey
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                {data.education.map((edu, index) => (
                  <Card key={index} className="bg-white dark:bg-slate-800 border-0 shadow-xl">
                    <CardContent className="p-6 sm:p-8 text-center">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                        <span className="text-white font-bold text-lg sm:text-xl">🎓</span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">{edu.degree}</h3>
                      <p className="text-purple-600 dark:text-purple-400 font-semibold mb-2 text-sm sm:text-base">{edu.institution}</p>
                      <Badge className="bg-gradient-to-r from-purple-500 to-pink-600 text-white text-xs sm:text-sm">{edu.years}</Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </BlurFade>
        )}
      </div>
    </div>
  )
}
