"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
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

interface ProfessionalTemplateProps {
  data: Resume
  editMode?: boolean
  onSave?: (data: Resume) => void
}

export default function ProfessionalTemplate({ data, editMode = false, onSave }: ProfessionalTemplateProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Professional Header */}
        <BlurFade delay={0.1}>
          <Card className="mb-8 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <Avatar className="w-32 h-32 border-4 border-gray-200 dark:border-slate-600">
                  <AvatarImage src="/placeholder.svg?height=128&width=128" />
                  <AvatarFallback className="text-2xl font-bold bg-gray-600 text-white">
                    {data.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                <div className="text-center md:text-left flex-1">
                  <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{data.name}</h1>
                  <h2 className="text-xl text-gray-600 dark:text-gray-300 mb-4">{data.title}</h2>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{data.summary}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </BlurFade>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Experience */}
            {data.experience && data.experience.length > 0 && (
              <BlurFade delay={0.2}>
                <Card className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                      Professional Experience
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {data.experience.map((exp, index) => (
                      <div key={index}>
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{exp.role}</h3>
                            <p className="text-gray-600 dark:text-gray-300 font-medium">{exp.company}</p>
                          </div>
                          <Badge variant="outline" className="ml-4">
                            {exp.duration}
                          </Badge>
                        </div>
                        <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300 text-sm">
                          {exp.responsibilities.map((resp, i) => (
                            <li key={i}>{resp}</li>
                          ))}
                        </ul>
                        {index < data.experience.length - 1 && <Separator className="mt-6" />}
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
                    <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">Key Projects</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {data.projects.map((project, index) => (
                      <div key={index}>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{project.name}</h3>
                        <p className="text-gray-700 dark:text-gray-300 mb-3">{project.description}</p>
                        {project.techStack && (
                          <div className="flex flex-wrap gap-2">
                            {project.techStack.map((tech, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        )}
                        {data.projects && index < data.projects.length - 1 && <Separator className="mt-6" />}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </BlurFade>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Skills */}
            {data.skills && data.skills.length > 0 && (
              <BlurFade delay={0.4}>
                <Card className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">Core Skills</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {data.skills.map((skill, index) => (
                        <div key={index} className="flex items-center justify-between py-2">
                          <span className="text-gray-700 dark:text-gray-300 font-medium">{skill}</span>
                          <div className="w-24 bg-gray-200 dark:bg-slate-600 rounded-full h-2">
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
                    <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">Education</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {data.education.map((edu, index) => (
                      <div key={index}>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{edu.degree}</h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm">{edu.institution}</p>
                        <Badge variant="outline" className="mt-1 text-xs">
                          {edu.years}
                        </Badge>
                        {index < data.education.length - 1 && <Separator className="mt-4" />}
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
