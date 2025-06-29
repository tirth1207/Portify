"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import BlurFade from "@/components/magicui/blur-fade"
import { Github, ExternalLink, Mail, Phone, MapPin, Calendar, Award } from "lucide-react"

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
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="w-full max-w-7xl mx-auto px-2 sm:px-6 py-6 sm:py-12">
        {/* Hero Section */}
        <BlurFade delay={0.1}>
          <div className="text-center mb-8 sm:mb-16">
            <div className="relative inline-block mb-6 sm:mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full blur-xl opacity-30"></div>
              <Avatar className="w-20 h-20 sm:w-32 sm:h-32 border-4 border-white shadow-2xl relative">
                <AvatarImage src="/placeholder.svg?height=128&width=128" />
                <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                  {data.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </div>
            <h1 className="text-2xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-4">{data.name}</h1>
            <h2 className="text-base sm:text-xl text-blue-600 dark:text-blue-400 font-medium mb-4 sm:mb-6">{data.title}</h2>
            <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-2 sm:gap-6 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
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

        {/* About Section */}
        <BlurFade delay={0.2}>
          <Card className="mb-16 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                  <Award className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">About Me</h2>
              </div>
              <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">{data.summary}</p>
            </CardContent>
          </Card>
        </BlurFade>

        {/* Projects Section - Main Focus */}
        {data.projects && data.projects.length > 0 && (
          <BlurFade delay={0.3}>
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">Featured Projects</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {data.projects.map((project, index) => (
                  <Card
                    key={index}
                    className="group bg-white dark:bg-slate-800 border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
                  >
                    <div className="h-48 bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600 relative">
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-xl font-bold text-white mb-2">{project.name}</h3>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">{project.description}</p>
                      {project.techStack && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.techStack.map((tech, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      )}
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Github className="h-4 w-4 mr-2" />
                          Code
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Demo
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </BlurFade>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Experience */}
            {data.experience && data.experience.length > 0 && (
              <BlurFade delay={0.4}>
                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl">
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Experience</h2>
                    <div className="space-y-8">
                      {data.experience.map((exp, index) => (
                        <div key={index} className="border-l-4 border-blue-500 pl-6">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{exp.role}</h3>
                              <p className="text-blue-600 dark:text-blue-400 font-medium">{exp.company}</p>
                            </div>
                            <Badge variant="outline" className="ml-4">
                              {exp.duration}
                            </Badge>
                          </div>
                          <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                            {exp.responsibilities.map((resp, i) => (
                              <li key={i} className="flex items-start">
                                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                {resp}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </BlurFade>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Skills */}
            {data.skills && data.skills.length > 0 && (
              <BlurFade delay={0.5}>
                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Skills</h2>
                    <div className="flex flex-wrap gap-2">
                      {data.skills.map((skill, index) => (
                        <Badge
                          key={index}
                          className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-3 py-1"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </BlurFade>
            )}

            {/* Education */}
            {data.education && data.education.length > 0 && (
              <BlurFade delay={0.6}>
                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Education</h2>
                    <div className="space-y-4">
                      {data.education.map((edu, index) => (
                        <div key={index}>
                          <h3 className="font-semibold text-gray-900 dark:text-white">{edu.degree}</h3>
                          <p className="text-blue-600 dark:text-blue-400 text-sm">{edu.institution}</p>
                          <Badge variant="outline" className="mt-1 text-xs">
                            {edu.years}
                          </Badge>
                        </div>
                      ))}
                    </div>
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
