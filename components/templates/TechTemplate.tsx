"use client"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import BlurFade from "@/components/magicui/blur-fade"
import { Code, Terminal, Zap, Github, ExternalLink, Calendar, Mail, Phone, MapPin, Globe, Linkedin } from "lucide-react"
import { useTheme } from "next-themes"

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

interface TechTemplateProps {
  data: Resume
  editMode?: boolean
  onSave?: (data: Resume) => void
}

export default function TechTemplate({ data, editMode = false, onSave }: TechTemplateProps) {
  const { theme, resolvedTheme } = useTheme();
  const contact = data.contact || {}
  
  return (
    <div className="min-h-screen bg-slate-900 text-green-400 font-mono">
      {/* Terminal Header */}
      <div className="bg-slate-800 border-b border-green-500/30 p-2 sm:p-4">
        <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
          <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-500"></div>
          <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-yellow-500"></div>
          <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500"></div>
          <span className="ml-2 sm:ml-4 text-xs sm:text-sm text-green-400">portfolio.sh</span>
        </div>
        <div className="text-xs sm:text-sm">
          <span className="text-green-500">$</span> cat {data.name.toLowerCase().replace(" ", "_")}.json
        </div>
      </div>

      <div className="w-full max-w-6xl mx-auto p-2 sm:p-8">
        {/* JSON-style Header */}
        <BlurFade delay={0.1}>
          <div className="mb-8 sm:mb-12">
            <div className="text-green-500 mb-3 sm:mb-4 text-sm sm:text-base">{"{"}</div>
            <div className="ml-4 space-y-1 sm:space-y-2 text-sm sm:text-base">
              <div>
                <span className="text-blue-400">"name"</span>: <span className="text-yellow-300">"{data.name}"</span>,
              </div>
              <div>
                <span className="text-blue-400">"role"</span>: <span className="text-yellow-300">"{data.title}"</span>,
              </div>
              <div>
                <span className="text-blue-400">"status"</span>:{" "}
                <span className="text-yellow-300">"available_for_hire"</span>,
              </div>
              <div>
                <span className="text-blue-400">"location"</span>:{" "}
                <span className="text-yellow-300">"remote_friendly"</span>
              </div>
            </div>
            <div className="text-green-500 text-sm sm:text-base">{"}"}</div>
          </div>
        </BlurFade>

        {/* Contact Information */}
        {(contact.email || contact.phone || contact.location || contact.website || contact.linkedin || contact.github) && (
          <BlurFade delay={0.15}>
            <div className="mb-8 sm:mb-12">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <Terminal className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                <span className="text-green-500 text-sm sm:text-base">$ cat contact.json</span>
              </div>
              <div className="bg-slate-800/50 border border-green-500/30 rounded p-4 sm:p-6 ml-6 sm:ml-8">
                <div className="text-green-500 text-sm sm:text-base">{"{"}</div>
                <div className="ml-4 space-y-1 sm:space-y-2 text-sm sm:text-base">
                  {contact.email && (
                    <div>
                      <span className="text-blue-400">"email"</span>: <span className="text-yellow-300">"{contact.email}"</span>,
                    </div>
                  )}
                  {contact.phone && (
                    <div>
                      <span className="text-blue-400">"phone"</span>: <span className="text-yellow-300">"{contact.phone}"</span>,
                    </div>
                  )}
                  {contact.location && (
                    <div>
                      <span className="text-blue-400">"location"</span>: <span className="text-yellow-300">"{contact.location}"</span>,
                    </div>
                  )}
                  {contact.website && (
                    <div>
                      <span className="text-blue-400">"website"</span>: <span className="text-yellow-300">"{contact.website}"</span>,
                    </div>
                  )}
                  {contact.linkedin && (
                    <div>
                      <span className="text-blue-400">"linkedin"</span>: <span className="text-yellow-300">"{contact.linkedin}"</span>,
                    </div>
                  )}
                  {contact.github && (
                    <div>
                      <span className="text-blue-400">"github"</span>: <span className="text-yellow-300">"{contact.github}"</span>
                    </div>
                  )}
                </div>
                <div className="text-green-500 text-sm sm:text-base">{"}"}</div>
              </div>
            </div>
          </BlurFade>
        )}

        {/* Terminal-style About */}
        <BlurFade delay={0.2}>
          <div className="mb-8 sm:mb-12">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <Terminal className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
              <span className="text-green-500 text-sm sm:text-base">$ whoami</span>
            </div>
            <div className="bg-slate-800/50 border border-green-500/30 rounded p-4 sm:p-6 ml-6 sm:ml-8">
              <p className="text-green-300 leading-relaxed text-sm sm:text-base">{data.summary}</p>
            </div>
          </div>
        </BlurFade>

        {/* Skills as Code */}
        {data.skills && data.skills.length > 0 && (
          <BlurFade delay={0.3}>
            <div className="mb-8 sm:mb-12">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <Code className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                <span className="text-green-500 text-sm sm:text-base">$ ls -la skills/</span>
              </div>
              <div className="bg-slate-800/50 border border-green-500/30 rounded p-4 sm:p-6 ml-6 sm:ml-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                  {data.skills.map((skill, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="text-green-500">&gt;</span>
                      <span className="text-green-300 text-sm sm:text-base">{skill}</span>
                      <div className="flex-1 border-b border-dotted border-green-500/30"></div>
                      <span className="text-yellow-400 text-xs">{Math.floor(Math.random() * 3) + 3}y</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </BlurFade>
        )}

        {/* Experience as Git Log */}
        {data.experience && data.experience.length > 0 && (
          <BlurFade delay={0.4}>
            <div className="mb-8 sm:mb-12">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <Github className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                <span className="text-green-500 text-sm sm:text-base">$ git log --oneline --graph</span>
              </div>
              <div className="bg-slate-800/50 border border-green-500/30 rounded p-4 sm:p-6 ml-6 sm:ml-8">
                {data.experience.map((exp, index) => (
                  <div key={index} className="mb-4 sm:mb-6 last:mb-0">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="text-yellow-400 font-mono text-xs sm:text-sm mt-1">
                        {Math.random().toString(36).substr(2, 7)}
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-2">
                          <span className="text-green-300 font-semibold text-sm sm:text-base">{exp.role}</span>
                          <span className="text-blue-400">@</span>
                          <span className="text-blue-300 text-sm sm:text-base">{exp.company}</span>
                          <Badge variant="outline" className="text-xs border-green-500/30 text-green-400 w-fit">
                            {exp.duration}
                          </Badge>
                        </div>
                        <ul className="space-y-1 text-xs sm:text-sm text-green-200">
                          {exp.responsibilities.slice(0, 2).map((resp, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-green-500 mt-1">+</span>
                              <span className="text-sm sm:text-base">{resp}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </BlurFade>
        )}

        {/* Projects as Repository List */}
        {data.projects && data.projects.length > 0 && (
          <BlurFade delay={0.5}>
            <div className="mb-8 sm:mb-12">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                <span className="text-green-500 text-sm sm:text-base">$ find ./projects -type f -name "*.md"</span>
              </div>
              <div className="space-y-3 sm:space-y-4 ml-6 sm:ml-8">
                {data.projects.map((project, index) => (
                  <Card key={index} className="bg-slate-800/50 border-green-500/30 border">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-start justify-between mb-3 sm:mb-4">
                        <div>
                          <h3 className="text-base sm:text-lg font-semibold text-green-300 mb-2">{project.name}</h3>
                          <p className="text-green-200 text-xs sm:text-sm leading-relaxed">{project.description}</p>
                        </div>
                        <div className="flex gap-2">
                          <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 cursor-pointer hover:text-green-300" />
                          <Github className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 cursor-pointer hover:text-green-300" />
                        </div>
                      </div>
                      {project.techStack && (
                        <div className="flex flex-wrap gap-1 sm:gap-2">
                          {project.techStack.map((tech, i) => (
                            <Badge key={i} className="bg-green-500/20 text-green-300 border-green-500/30 text-xs">
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
            <div className="mb-8 sm:mb-12">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                <span className="text-green-500 text-sm sm:text-base">$ cat education.log</span>
              </div>
              <div className="bg-slate-800/50 border border-green-500/30 rounded p-4 sm:p-6 ml-6 sm:ml-8">
                {data.education.map((edu, index) => (
                  <div key={index} className="mb-3 sm:mb-4 last:mb-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                      <span className="text-green-300 font-semibold text-sm sm:text-base">{edu.degree}</span>
                      <span className="text-blue-400">@</span>
                      <span className="text-blue-300 text-sm sm:text-base">{edu.institution}</span>
                      <Badge variant="outline" className="text-xs border-green-500/30 text-green-400 w-fit">
                        {edu.years}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </BlurFade>
        )}
      </div>
    </div>
  )
}
