"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import BlurFade from "@/components/magicui/blur-fade"
import { Award, TrendingUp, Users, Target, Building, Calendar, Mail, Phone, MapPin, Globe, Linkedin } from "lucide-react"

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

interface ExecutiveTemplateProps {
  data: Resume
  editMode?: boolean
  onSave?: (data: Resume) => void
}

export default function ExecutiveTemplate({ data, editMode = false, onSave }: ExecutiveTemplateProps) {
  const contact = data.contact || {}
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-900 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-16">
        {/* Executive Header */}
        <BlurFade delay={0.1}>
          <Card className="mb-8 sm:mb-12 bg-white dark:bg-slate-800 shadow-2xl border-0 rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white p-6 sm:p-12">
              <div className="flex flex-col lg:flex-row items-center gap-6 sm:gap-12">
                <Avatar className="w-24 h-24 sm:w-40 sm:h-40 border-4 border-white shadow-2xl">
                  <AvatarImage src="/placeholder.svg?height=160&width=160" alt={`${data.name} avatar`} />
                  <AvatarFallback className="text-2xl sm:text-4xl font-bold bg-gradient-to-br from-slate-600 to-slate-800 text-white">
                    {data.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                <div className="text-center lg:text-left flex-1">
                  <h1 className="text-4xl sm:text-5xl font-bold mb-3 sm:mb-4 tracking-tight">{data.name}</h1>
                  <h2 className="text-lg sm:text-2xl font-light mb-4 sm:mb-6 text-gray-300">{data.title}</h2>
                  <div className="flex flex-wrap justify-center lg:justify-start gap-4 sm:gap-6 text-xs sm:text-sm">
                    <div className="flex items-center gap-2">
                      <Building className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span>Fortune 500 Experience</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span>Team Leadership</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span>Growth Strategy</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </BlurFade>

        {/* Executive Summary */}
        <BlurFade delay={0.2}>
          <Card className="mb-8 sm:mb-12 bg-white dark:bg-slate-800 shadow-xl border-0 rounded-2xl">
            <CardContent className="p-6 sm:p-10">
              <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-slate-800 dark:bg-slate-700 rounded-full flex items-center justify-center">
                  <Target className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white">Executive Summary</h2>
              </div>
              <p className="text-base sm:text-lg leading-relaxed text-gray-700 dark:text-gray-300 font-light">{data.summary}</p>
            </CardContent>
          </Card>
        </BlurFade>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            {/* Leadership Experience */}
            {data.experience && data.experience.length > 0 && (
              <BlurFade delay={0.3}>
                <Card className="bg-white dark:bg-slate-800 shadow-xl border-0 rounded-2xl">
                  <CardContent className="p-6 sm:p-10">
                    <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                      <div className="w-8 h-8 sm:w-12 sm:h-12 bg-slate-800 dark:bg-slate-700 rounded-full flex items-center justify-center">
                        <Award className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white">Leadership Experience</h2>
                    </div>

                    <div className="space-y-8 sm:space-y-10">
                      {data.experience.map((exp, index) => (
                        <div key={index} className="relative">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4 mb-4 sm:mb-6">
                            <div>
                              <h3 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white mb-1 sm:mb-2">{exp.role}</h3>
                              <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 font-medium">{exp.company}</p>
                            </div>
                            <Badge className="bg-slate-800 text-white text-xs sm:text-sm px-3 sm:px-4 py-1 sm:py-2">{exp.duration}</Badge>
                          </div>

                          <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 sm:p-6">
                            <h4 className="font-semibold text-slate-800 dark:text-white mb-3 sm:mb-4 text-sm sm:text-base">Key Achievements:</h4>
                            <ul className="space-y-2 sm:space-y-3">
                              {exp.responsibilities.map((resp, i) => (
                                <li key={i} className="flex items-start gap-2 sm:gap-3">
                                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-slate-800 dark:bg-slate-400 rounded-full mt-2 flex-shrink-0"></div>
                                  <span className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base">{resp}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {index < data.experience.length - 1 && (
                            <Separator className="mt-8 sm:mt-10 bg-slate-200 dark:bg-slate-600" />
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </BlurFade>
            )}

            {/* Strategic Projects */}
            {data.projects && data.projects.length > 0 && (
              <BlurFade delay={0.4}>
                <Card className="bg-white dark:bg-slate-800 shadow-xl border-0 rounded-2xl">
                  <CardContent className="p-6 sm:p-10">
                    <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                      <div className="w-8 h-8 sm:w-12 sm:h-12 bg-slate-800 dark:bg-slate-700 rounded-full flex items-center justify-center">
                        <TrendingUp className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white">Strategic Initiatives</h2>
                    </div>

                    <div className="grid gap-6 sm:gap-8">
                      {data.projects.map((project, index) => (
                        <div key={index} className="border-l-4 border-slate-800 dark:border-slate-400 pl-4 sm:pl-8">
                          <h3 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white mb-2 sm:mb-3">{project.name}</h3>
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3 sm:mb-4 text-sm sm:text-base">{project.description}</p>
                          {project.techStack && (
                            <div className="flex flex-wrap gap-1 sm:gap-2">
                              {project.techStack.map((tech, i) => (
                                <Badge
                                  key={i}
                                  variant="outline"
                                  className="border-slate-300 text-slate-700 dark:text-slate-300 text-xs"
                                >
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
          </div>

          {/* Sidebar */}
          <div className="space-y-6 sm:space-y-8">
            {/* Core Competencies */}
            {data.skills && data.skills.length > 0 && (
              <BlurFade delay={0.5}>
                <Card className="bg-white dark:bg-slate-800 shadow-xl border-0 rounded-2xl">
                  <CardContent className="p-4 sm:p-8">
                    <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                      <div className="w-6 h-6 sm:w-10 sm:h-10 bg-slate-800 dark:bg-slate-700 rounded-full flex items-center justify-center">
                        <Users className="h-3 w-3 sm:h-5 sm:w-5 text-white" />
                      </div>
                      <h2 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white">Core Competencies</h2>
                    </div>
                    <div className="space-y-3 sm:space-y-4">
                      {data.skills.map((skill, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between py-2 sm:py-3 border-b border-slate-100 dark:border-slate-700 last:border-0"
                        >
                          <span className="text-gray-700 dark:text-gray-300 font-medium text-sm sm:text-base">{skill}</span>
                          <div className="w-16 sm:w-20 bg-slate-200 dark:bg-slate-600 rounded-full h-2">
                            <div
                              className="bg-slate-600 dark:bg-slate-400 h-2 rounded-full"
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
              <BlurFade delay={0.6}>
                <Card className="bg-white dark:bg-slate-800 shadow-xl border-0 rounded-2xl">
                  <CardContent className="p-4 sm:p-8">
                    <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                      <div className="w-6 h-6 sm:w-10 sm:h-10 bg-slate-800 dark:bg-slate-700 rounded-full flex items-center justify-center">
                        <Calendar className="h-3 w-3 sm:h-5 sm:w-5 text-white" />
                      </div>
                      <h2 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white">Education</h2>
                    </div>
                    <div className="space-y-3 sm:space-y-4">
                      {data.education.map((edu, index) => (
                        <div key={index}>
                          <h3 className="font-semibold text-slate-800 dark:text-white text-sm sm:text-base">{edu.degree}</h3>
                          <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm">{edu.institution}</p>
                          <Badge variant="outline" className="mt-1 text-xs border-slate-300 text-slate-700 dark:text-slate-300">
                            {edu.years}
                          </Badge>
                          {index < data.education.length - 1 && <Separator className="mt-3 sm:mt-4 bg-slate-200 dark:bg-slate-600" />}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </BlurFade>
            )}

            {/* Contact Information */}
            {(contact.email || contact.phone || contact.location || contact.website || contact.linkedin) && (
              <BlurFade delay={0.7}>
                <Card className="bg-white dark:bg-slate-800 shadow-xl border-0 rounded-2xl">
                  <CardContent className="p-4 sm:p-8">
                    <h2 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white mb-4 sm:mb-6">Contact</h2>
                    <div className="space-y-2 sm:space-y-3">
                      {contact.email && (
                        <div className="flex items-center gap-2 text-sm sm:text-base">
                          <Mail className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                          <a href={`mailto:${contact.email}`} className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
                            {contact.email}
                          </a>
                        </div>
                      )}
                      {contact.phone && (
                        <div className="flex items-center gap-2 text-sm sm:text-base">
                          <Phone className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                          <a href={`tel:${contact.phone}`} className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
                            {contact.phone}
                          </a>
                        </div>
                      )}
                      {contact.location && (
                        <div className="flex items-center gap-2 text-sm sm:text-base">
                          <MapPin className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                          <span className="text-slate-700 dark:text-slate-300">{contact.location}</span>
                        </div>
                      )}
                      {contact.website && (
                        <div className="flex items-center gap-2 text-sm sm:text-base">
                          <Globe className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                          <a href={contact.website} target="_blank" rel="noopener noreferrer" className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
                            Website
                          </a>
                        </div>
                      )}
                      {contact.linkedin && (
                        <div className="flex items-center gap-2 text-sm sm:text-base">
                          <Linkedin className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                          <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
                            LinkedIn
                          </a>
                        </div>
                      )}
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
