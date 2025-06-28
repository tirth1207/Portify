"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import BlurFade from "@/components/magicui/blur-fade"
import { Palette, Brush, Sparkles, Heart, Star, Mail, Phone, MapPin, Globe, Linkedin, Github } from "lucide-react"

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

interface ArtisticTemplateProps {
  data: Resume
  editMode?: boolean
  onSave?: (data: Resume) => void
}

export default function ArtisticTemplate({ data, editMode = false, onSave }: ArtisticTemplateProps) {
  const contact = data.contact || {}
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 dark:from-rose-950 dark:via-orange-950 dark:to-amber-950 relative overflow-hidden">
      {/* Artistic Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-pink-300 to-rose-400 rounded-full opacity-20 blur-xl"></div>
        <div className="absolute top-40 right-20 w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-orange-300 to-amber-400 rounded-full opacity-20 blur-xl"></div>
        <div className="absolute bottom-40 left-1/4 w-32 h-32 sm:w-40 sm:h-40 bg-gradient-to-br from-purple-300 to-pink-400 rounded-full opacity-15 blur-xl"></div>
        <div className="absolute bottom-20 right-1/3 w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-br from-amber-300 to-orange-400 rounded-full opacity-20 blur-xl"></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-8 py-8 sm:py-16">
        {/* Artistic Header */}
        <BlurFade delay={0.1}>
          <div className="text-center mb-12 sm:mb-20 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-rose-200/30 to-transparent h-px top-1/2 transform -translate-y-1/2"></div>

            <div className="relative bg-gradient-to-br from-rose-50 to-orange-50 dark:from-rose-950 dark:to-orange-950 rounded-full w-24 h-24 sm:w-40 sm:h-40 mx-auto mb-6 sm:mb-8 flex items-center justify-center border-4 border-white dark:border-gray-800 shadow-2xl">
              <Avatar className="w-20 h-20 sm:w-32 sm:h-32">
                <AvatarImage src="/placeholder.svg?height=128&width=128" alt={`${data.name} avatar`} />
                <AvatarFallback className="text-2xl sm:text-3xl font-bold bg-gradient-to-br from-rose-400 to-orange-500 text-white">
                  {data.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black mb-3 sm:mb-4 bg-gradient-to-r from-rose-600 via-orange-500 to-amber-500 bg-clip-text text-transparent">
              {data.name}
            </h1>
            <h2 className="text-lg sm:text-2xl font-light text-gray-700 dark:text-gray-300 mb-6 sm:mb-8 italic">{data.title}</h2>

            <div className="flex justify-center items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
              <div className="w-12 h-px sm:w-16 sm:h-px bg-gradient-to-r from-transparent to-rose-400"></div>
              <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-rose-400 fill-current" />
              <div className="w-12 h-px sm:w-16 sm:h-px bg-gradient-to-l from-transparent to-rose-400"></div>
            </div>

            {/* Contact Information */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-6 text-sm text-gray-600 dark:text-gray-400 mb-4 sm:mb-6">
              {contact.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <a href={`mailto:${contact.email}`} className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors">
                    {contact.email}
                  </a>
                </div>
              )}
              {contact.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <a href={`tel:${contact.phone}`} className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors">
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
              <div className="flex justify-center items-center gap-4">
                {contact.website && (
                  <a
                    href={contact.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
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
                    className="text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
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
                    className="text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                    aria-label="GitHub profile"
                  >
                    <Github className="h-4 w-4" />
                  </a>
                )}
              </div>
            )}
          </div>
        </BlurFade>

        {/* Artistic About Section */}
        <BlurFade delay={0.2}>
          <Card className="mb-12 sm:mb-16 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-0 shadow-2xl rounded-3xl overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-rose-400 via-orange-400 to-amber-400"></div>
            <CardContent className="p-6 sm:p-12">
              <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-rose-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Brush className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">My Story</h2>
              </div>
              <p className="text-base sm:text-lg leading-relaxed text-gray-700 dark:text-gray-300 font-light italic">
                "{data.summary}"
              </p>
            </CardContent>
          </Card>
        </BlurFade>

        {/* Creative Skills Palette */}
        {data.skills && data.skills.length > 0 && (
          <BlurFade delay={0.3}>
            <div className="mb-12 sm:mb-16">
              <div className="text-center mb-8 sm:mb-12">
                <div className="flex items-center justify-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <Palette className="h-6 w-6 sm:h-8 sm:w-8 text-rose-500" />
                  <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-rose-600 to-orange-500 bg-clip-text text-transparent">
                    Creative Palette
                  </h2>
                  <Palette className="h-6 w-6 sm:h-8 sm:w-8 text-orange-500" />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {data.skills.map((skill, index) => (
                  <div
                    key={index}
                    className="group relative bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-l-4 border-gradient-to-b from-rose-400 to-orange-500"
                    style={{
                      borderLeftColor: `hsl(${(index * 137.5) % 360}, 70%, 60%)`,
                    }}
                  >
                    <div className="text-center">
                      <div
                        className="w-8 h-8 sm:w-12 sm:h-12 rounded-full mx-auto mb-3 sm:mb-4 flex items-center justify-center text-white font-bold"
                        style={{
                          background: `linear-gradient(135deg, hsl(${(index * 137.5) % 360}, 70%, 60%), hsl(${(index * 137.5 + 30) % 360}, 70%, 50%))`,
                        }}
                      >
                        {skill.charAt(0)}
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white text-xs sm:text-sm">{skill}</h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </BlurFade>
        )}

        {/* Experience as Art Gallery */}
        {data.experience && data.experience.length > 0 && (
          <BlurFade delay={0.4}>
            <div className="mb-12 sm:mb-16">
              <div className="text-center mb-8 sm:mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent mb-3 sm:mb-4">
                  Experience Gallery
                </h2>
                <p className="text-gray-600 dark:text-gray-400 italic text-sm sm:text-base">
                  A curated collection of my professional journey
                </p>
              </div>

              <div className="space-y-6 sm:space-y-8">
                {data.experience.map((exp, index) => (
                  <Card
                    key={index}
                    className="bg-white dark:bg-gray-800 border-0 shadow-xl rounded-3xl overflow-hidden transform hover:scale-105 transition-all duration-300"
                  >
                    <div
                      className="h-2 sm:h-3"
                      style={{
                        background: `linear-gradient(90deg, hsl(${(index * 60) % 360}, 70%, 60%), hsl(${(index * 60 + 60) % 360}, 70%, 50%))`,
                      }}
                    ></div>
                    <CardContent className="p-6 sm:p-8">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
                        <div>
                          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">{exp.role}</h3>
                          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 font-medium">{exp.company}</p>
                        </div>
                        <Badge
                          className="text-white border-0 text-xs sm:text-sm"
                          style={{
                            background: `linear-gradient(135deg, hsl(${(index * 60) % 360}, 70%, 60%), hsl(${(index * 60 + 30) % 360}, 70%, 50%))`,
                          }}
                        >
                          {exp.duration}
                        </Badge>
                      </div>
                      <div className="space-y-2 sm:space-y-3">
                        {exp.responsibilities.slice(0, 3).map((resp, i) => (
                          <div key={i} className="flex items-start gap-2 sm:gap-3">
                            <Star className="h-3 w-3 sm:h-4 sm:w-4 text-amber-400 fill-current mt-1 flex-shrink-0" />
                            <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">{resp}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </BlurFade>
        )}

        {/* Projects as Art Pieces */}
        {data.projects && data.projects.length > 0 && (
          <BlurFade delay={0.5}>
            <div className="mb-12 sm:mb-16">
              <div className="text-center mb-8 sm:mb-12">
                <div className="flex items-center justify-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-amber-500" />
                  <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">
                    Creative Projects
                  </h2>
                  <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-orange-500" />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                {data.projects.map((project, index) => (
                  <Card
                    key={index}
                    className="group bg-white dark:bg-gray-800 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-4 overflow-hidden"
                  >
                    <div
                      className="h-32 sm:h-48 bg-gradient-to-br from-amber-400 via-orange-500 to-rose-600 relative"
                      style={{
                        background: `linear-gradient(135deg, hsl(${(index * 90) % 360}, 70%, 60%), hsl(${(index * 90 + 60) % 360}, 70%, 50%))`,
                      }}
                    >
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
                            <Badge key={i} className="bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs">
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
          <BlurFade delay={0.6}>
            <div className="text-center">
              <h2 className="text-3xl sm:text-4xl font-black mb-8 sm:mb-12 bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent">
                Learning Journey
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                {data.education.map((edu, index) => (
                  <Card key={index} className="bg-white dark:bg-gray-800 border-0 shadow-xl">
                    <CardContent className="p-6 sm:p-8 text-center">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-orange-500 to-amber-600 rounded-full mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                        <span className="text-white font-bold text-lg sm:text-xl">🎓</span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">{edu.degree}</h3>
                      <p className="text-orange-600 dark:text-orange-400 font-semibold mb-2 text-sm sm:text-base">{edu.institution}</p>
                      <Badge className="bg-gradient-to-r from-orange-500 to-amber-600 text-white text-xs sm:text-sm">{edu.years}</Badge>
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
