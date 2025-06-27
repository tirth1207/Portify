"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import BlurFade from "@/components/magicui/blur-fade"
import { Palette, Brush, Sparkles, Heart, Star } from "lucide-react"

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

interface ArtisticTemplateProps {
  data: Resume
  editMode?: boolean
  onSave?: (data: Resume) => void
}

export default function ArtisticTemplate({ data, editMode = false, onSave }: ArtisticTemplateProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 dark:from-rose-950 dark:via-orange-950 dark:to-amber-950 relative overflow-hidden">
      {/* Artistic Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-pink-300 to-rose-400 rounded-full opacity-20 blur-xl"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-orange-300 to-amber-400 rounded-full opacity-20 blur-xl"></div>
        <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-gradient-to-br from-purple-300 to-pink-400 rounded-full opacity-15 blur-xl"></div>
        <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-gradient-to-br from-amber-300 to-orange-400 rounded-full opacity-20 blur-xl"></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-8 py-16">
        {/* Artistic Header */}
        <BlurFade delay={0.1}>
          <div className="text-center mb-20 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-rose-200/30 to-transparent h-px top-1/2 transform -translate-y-1/2"></div>

            <div className="relative bg-gradient-to-br from-rose-50 to-orange-50 dark:from-rose-950 dark:to-orange-950 rounded-full w-40 h-40 mx-auto mb-8 flex items-center justify-center border-4 border-white dark:border-gray-800 shadow-2xl">
              <Avatar className="w-32 h-32">
                <AvatarImage src="/placeholder.svg?height=128&width=128" />
                <AvatarFallback className="text-3xl font-bold bg-gradient-to-br from-rose-400 to-orange-500 text-white">
                  {data.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </div>

            <h1 className="text-6xl font-black mb-4 bg-gradient-to-r from-rose-600 via-orange-500 to-amber-500 bg-clip-text text-transparent">
              {data.name}
            </h1>
            <h2 className="text-2xl font-light text-gray-700 dark:text-gray-300 mb-8 italic">{data.title}</h2>

            <div className="flex justify-center items-center gap-4">
              <div className="w-16 h-px bg-gradient-to-r from-transparent to-rose-400"></div>
              <Heart className="h-6 w-6 text-rose-400 fill-current" />
              <div className="w-16 h-px bg-gradient-to-l from-transparent to-rose-400"></div>
            </div>
          </div>
        </BlurFade>

        {/* Artistic About Section */}
        <BlurFade delay={0.2}>
          <Card className="mb-16 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-0 shadow-2xl rounded-3xl overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-rose-400 via-orange-400 to-amber-400"></div>
            <CardContent className="p-12">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-rose-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Brush className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">My Story</h2>
              </div>
              <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 font-light italic">
                "{data.summary}"
              </p>
            </CardContent>
          </Card>
        </BlurFade>

        {/* Creative Skills Palette */}
        {data.skills && data.skills.length > 0 && (
          <BlurFade delay={0.3}>
            <div className="mb-16">
              <div className="text-center mb-12">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <Palette className="h-8 w-8 text-rose-500" />
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-rose-600 to-orange-500 bg-clip-text text-transparent">
                    Creative Palette
                  </h2>
                  <Palette className="h-8 w-8 text-orange-500" />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {data.skills.map((skill, index) => (
                  <div
                    key={index}
                    className="group relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-l-4 border-gradient-to-b from-rose-400 to-orange-500"
                    style={{
                      borderLeftColor: `hsl(${(index * 137.5) % 360}, 70%, 60%)`,
                    }}
                  >
                    <div className="text-center">
                      <div
                        className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold"
                        style={{
                          background: `linear-gradient(135deg, hsl(${(index * 137.5) % 360}, 70%, 60%), hsl(${(index * 137.5 + 30) % 360}, 70%, 50%))`,
                        }}
                      >
                        {skill.charAt(0)}
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{skill}</h3>
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
            <div className="mb-16">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent mb-4">
                  Experience Gallery
                </h2>
                <p className="text-gray-600 dark:text-gray-400 italic">
                  A curated collection of my professional journey
                </p>
              </div>

              <div className="space-y-8">
                {data.experience.map((exp, index) => (
                  <Card
                    key={index}
                    className="bg-white dark:bg-gray-800 border-0 shadow-xl rounded-3xl overflow-hidden transform hover:scale-105 transition-all duration-300"
                  >
                    <div
                      className="h-3"
                      style={{
                        background: `linear-gradient(90deg, hsl(${(index * 60) % 360}, 70%, 60%), hsl(${(index * 60 + 60) % 360}, 70%, 50%))`,
                      }}
                    ></div>
                    <CardContent className="p-8">
                      <div className="flex items-start justify-between mb-6">
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{exp.role}</h3>
                          <p className="text-lg text-gray-600 dark:text-gray-400 font-medium">{exp.company}</p>
                        </div>
                        <Badge
                          className="text-white border-0"
                          style={{
                            background: `linear-gradient(135deg, hsl(${(index * 60) % 360}, 70%, 60%), hsl(${(index * 60 + 30) % 360}, 70%, 50%))`,
                          }}
                        >
                          {exp.duration}
                        </Badge>
                      </div>
                      <div className="space-y-3">
                        {exp.responsibilities.slice(0, 3).map((resp, i) => (
                          <div key={i} className="flex items-start gap-3">
                            <Star className="h-4 w-4 text-amber-400 fill-current mt-1 flex-shrink-0" />
                            <p className="text-gray-700 dark:text-gray-300">{resp}</p>
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
            <div className="mb-16">
              <div className="text-center mb-12">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <Sparkles className="h-8 w-8 text-amber-500" />
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-rose-500 bg-clip-text text-transparent">
                    Featured Creations
                  </h2>
                  <Sparkles className="h-8 w-8 text-rose-500" />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {data.projects.map((project, index) => (
                  <Card
                    key={index}
                    className="group bg-white dark:bg-gray-800 border-0 shadow-2xl rounded-3xl overflow-hidden hover:shadow-3xl transition-all duration-500"
                  >
                    <div
                      className="h-48 relative"
                      style={{
                        background: `linear-gradient(135deg, hsl(${(index * 90) % 360}, 70%, 60%), hsl(${(index * 90 + 60) % 360}, 70%, 50%))`,
                      }}
                    >
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-2xl font-bold text-white mb-2">{project.name}</h3>
                      </div>
                    </div>
                    <CardContent className="p-8">
                      <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">{project.description}</p>
                      {project.techStack && (
                        <div className="flex flex-wrap gap-2">
                          {project.techStack.map((tech, i) => (
                            <Badge
                              key={i}
                              className="text-white border-0 text-xs"
                              style={{
                                background: `linear-gradient(135deg, hsl(${(index * 90 + i * 30) % 360}, 60%, 50%), hsl(${(index * 90 + i * 30 + 30) % 360}, 60%, 40%))`,
                              }}
                            >
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
            <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-0 shadow-2xl rounded-3xl overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-amber-400 via-rose-400 to-purple-400"></div>
              <CardContent className="p-12">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-rose-500 bg-clip-text text-transparent">
                    Learning Journey
                  </h2>
                </div>
                <div className="space-y-6">
                  {data.education.map((edu, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-6 bg-gradient-to-r from-purple-50 to-rose-50 dark:from-purple-950 dark:to-rose-950 rounded-2xl"
                    >
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{edu.degree}</h3>
                        <p className="text-gray-600 dark:text-gray-400">{edu.institution}</p>
                      </div>
                      <Badge className="bg-gradient-to-r from-purple-500 to-rose-500 text-white border-0">
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
  )
}
