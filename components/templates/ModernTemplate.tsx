"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import BlurFade from "@/components/magicui/blur-fade"

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

interface ModernTemplateProps {
  data: Resume
  editMode?: boolean
  onSave?: (data: Resume) => void
}

export default function ModernTemplate({ data, editMode = false, onSave }: ModernTemplateProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <BlurFade delay={0.1}>
          <div className="text-center mb-16">
            <Avatar className="w-32 h-32 mx-auto mb-6 border-4 border-white shadow-xl">
              <AvatarImage src="/placeholder.svg?height=128&width=128" />
              <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                {data.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>

            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">{data.name}</h1>

            <h2 className="text-xl text-indigo-600 dark:text-indigo-400 font-medium">{data.title}</h2>
          </div>
        </BlurFade>

        {/* About Section */}
        <BlurFade delay={0.2}>
          <Card className="mb-12 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">About Me</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{data.summary}</p>
            </CardContent>
          </Card>
        </BlurFade>

        {/* Skills Section */}
        {data.skills && data.skills.length > 0 && (
          <BlurFade delay={0.3}>
            <Card className="mb-12 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">Skills & Expertise</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {data.skills.map((skill, index) => (
                    <Badge
                      key={index}
                      className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 text-sm font-medium"
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
            <Card className="mb-12 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                  Professional Experience
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                {data.experience.map((exp, index) => (
                  <div key={index} className="border-l-4 border-indigo-500 pl-6 pb-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{exp.role}</h3>
                    <p className="text-indigo-600 dark:text-indigo-400 font-medium mb-2">
                      {exp.company} • {exp.duration}
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
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
            <Card className="mb-12 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">Featured Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {data.projects.map((project, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-br from-white to-gray-50 dark:from-slate-700 dark:to-slate-800 rounded-lg p-6 shadow-lg"
                    >
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{project.name}</h3>
                      <p className="text-gray-700 dark:text-gray-300 mb-4">{project.description}</p>
                      {project.techStack && (
                        <div className="flex flex-wrap gap-2">
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
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">Education</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {data.education.map((edu, index) => (
                  <div key={index} className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">{edu.degree}</h3>
                      <p className="text-indigo-600 dark:text-indigo-400 font-medium">{edu.institution}</p>
                    </div>
                    <Badge variant="outline" className="ml-4">
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
