"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import BlurFade from "@/components/magicui/blur-fade"
import { Award, TrendingUp, Users, Target, Building, Calendar } from "lucide-react"

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

interface ExecutiveTemplateProps {
  data: Resume
  editMode?: boolean
  onSave?: (data: Resume) => void
}

export default function ExecutiveTemplate({ data, editMode = false, onSave }: ExecutiveTemplateProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-900 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-8 py-16">
        {/* Executive Header */}
        <BlurFade delay={0.1}>
          <Card className="mb-12 bg-white dark:bg-slate-800 shadow-2xl border-0 rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white p-12">
              <div className="flex flex-col lg:flex-row items-center gap-12">
                <Avatar className="w-40 h-40 border-4 border-white shadow-2xl">
                  <AvatarImage src="/placeholder.svg?height=160&width=160" />
                  <AvatarFallback className="text-4xl font-bold bg-gradient-to-br from-slate-600 to-slate-800 text-white">
                    {data.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                <div className="text-center lg:text-left flex-1">
                  <h1 className="text-5xl font-bold mb-4 tracking-tight">{data.name}</h1>
                  <h2 className="text-2xl font-light mb-6 text-gray-300">{data.title}</h2>
                  <div className="flex flex-wrap justify-center lg:justify-start gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      <span>Fortune 500 Experience</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>Team Leadership</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
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
          <Card className="mb-12 bg-white dark:bg-slate-800 shadow-xl border-0 rounded-2xl">
            <CardContent className="p-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-slate-800 dark:bg-slate-700 rounded-full flex items-center justify-center">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Executive Summary</h2>
              </div>
              <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 font-light">{data.summary}</p>
            </CardContent>
          </Card>
        </BlurFade>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Leadership Experience */}
            {data.experience && data.experience.length > 0 && (
              <BlurFade delay={0.3}>
                <Card className="bg-white dark:bg-slate-800 shadow-xl border-0 rounded-2xl">
                  <CardContent className="p-10">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 bg-slate-800 dark:bg-slate-700 rounded-full flex items-center justify-center">
                        <Award className="h-6 w-6 text-white" />
                      </div>
                      <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Leadership Experience</h2>
                    </div>

                    <div className="space-y-10">
                      {data.experience.map((exp, index) => (
                        <div key={index} className="relative">
                          <div className="flex items-start justify-between mb-6">
                            <div>
                              <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">{exp.role}</h3>
                              <p className="text-xl text-slate-600 dark:text-slate-300 font-medium">{exp.company}</p>
                            </div>
                            <Badge className="bg-slate-800 text-white text-sm px-4 py-2">{exp.duration}</Badge>
                          </div>

                          <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-6">
                            <h4 className="font-semibold text-slate-800 dark:text-white mb-4">Key Achievements:</h4>
                            <ul className="space-y-3">
                              {exp.responsibilities.map((resp, i) => (
                                <li key={i} className="flex items-start gap-3">
                                  <div className="w-2 h-2 bg-slate-800 dark:bg-slate-400 rounded-full mt-2 flex-shrink-0"></div>
                                  <span className="text-gray-700 dark:text-gray-300 leading-relaxed">{resp}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {index < data.experience.length - 1 && (
                            <Separator className="mt-10 bg-slate-200 dark:bg-slate-600" />
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
                  <CardContent className="p-10">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 bg-slate-800 dark:bg-slate-700 rounded-full flex items-center justify-center">
                        <TrendingUp className="h-6 w-6 text-white" />
                      </div>
                      <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Strategic Initiatives</h2>
                    </div>

                    <div className="grid gap-8">
                      {data.projects.map((project, index) => (
                        <div key={index} className="border-l-4 border-slate-800 dark:border-slate-400 pl-8">
                          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3">{project.name}</h3>
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">{project.description}</p>
                          {project.techStack && (
                            <div className="flex flex-wrap gap-2">
                              {project.techStack.map((tech, i) => (
                                <Badge
                                  key={i}
                                  variant="outline"
                                  className="border-slate-300 text-slate-700 dark:text-slate-300"
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
          <div className="space-y-8">
            {/* Core Competencies */}
            {data.skills && data.skills.length > 0 && (
              <BlurFade delay={0.5}>
                <Card className="bg-white dark:bg-slate-800 shadow-xl border-0 rounded-2xl">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-slate-800 dark:bg-slate-700 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-white" />
                      </div>
                      <h2 className="text-xl font-bold text-slate-800 dark:text-white">Core Competencies</h2>
                    </div>
                    <div className="space-y-4">
                      {data.skills.map((skill, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-700 last:border-0"
                        >
                          <span className="font-medium text-slate-700 dark:text-slate-300">{skill}</span>
                          <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                              <div
                                key={i}
                                className={`w-2 h-2 rounded-full ${
                                  i < Math.floor(Math.random() * 2) + 4
                                    ? "bg-slate-800 dark:bg-slate-400"
                                    : "bg-slate-200 dark:bg-slate-600"
                                }`}
                              ></div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </BlurFade>
            )}

            {/* Education & Credentials */}
            {data.education && data.education.length > 0 && (
              <BlurFade delay={0.6}>
                <Card className="bg-white dark:bg-slate-800 shadow-xl border-0 rounded-2xl">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-slate-800 dark:bg-slate-700 rounded-full flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-white" />
                      </div>
                      <h2 className="text-xl font-bold text-slate-800 dark:text-white">Education & Credentials</h2>
                    </div>
                    <div className="space-y-6">
                      {data.education.map((edu, index) => (
                        <div
                          key={index}
                          className="pb-6 border-b border-slate-100 dark:border-slate-700 last:border-0 last:pb-0"
                        >
                          <h3 className="font-bold text-slate-800 dark:text-white mb-1">{edu.degree}</h3>
                          <p className="text-slate-600 dark:text-slate-300 text-sm mb-2">{edu.institution}</p>
                          <Badge
                            variant="outline"
                            className="text-xs border-slate-300 text-slate-600 dark:text-slate-400"
                          >
                            {edu.years}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </BlurFade>
            )}

            {/* Executive Metrics */}
            <BlurFade delay={0.7}>
              <Card className="bg-gradient-to-br from-slate-800 to-slate-900 text-white shadow-xl border-0 rounded-2xl">
                <CardContent className="p-8">
                  <h2 className="text-xl font-bold mb-6">Executive Impact</h2>
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold mb-1">15+</div>
                      <div className="text-sm text-gray-300">Years Leadership</div>
                    </div>
                    <Separator className="bg-slate-600" />
                    <div className="text-center">
                      <div className="text-3xl font-bold mb-1">$50M+</div>
                      <div className="text-sm text-gray-300">Revenue Growth</div>
                    </div>
                    <Separator className="bg-slate-600" />
                    <div className="text-center">
                      <div className="text-3xl font-bold mb-1">200+</div>
                      <div className="text-sm text-gray-300">Team Members Led</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </BlurFade>
          </div>
        </div>
      </div>
    </div>
  )
}
