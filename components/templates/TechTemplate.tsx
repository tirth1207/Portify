"use client"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import BlurFade from "@/components/magicui/blur-fade"
import { Code, Terminal, Zap, Github, ExternalLink, Calendar } from "lucide-react"

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

interface TechTemplateProps {
  data: Resume
  editMode?: boolean
  onSave?: (data: Resume) => void
}

export default function TechTemplate({ data, editMode = false, onSave }: TechTemplateProps) {
  return (
    <div className="min-h-screen bg-slate-900 text-green-400 font-mono">
      {/* Terminal Header */}
      <div className="bg-slate-800 border-b border-green-500/30 p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="ml-4 text-sm text-green-400">portfolio.sh</span>
        </div>
        <div className="text-sm">
          <span className="text-green-500">$</span> cat {data.name.toLowerCase().replace(" ", "_")}.json
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-8">
        {/* JSON-style Header */}
        <BlurFade delay={0.1}>
          <div className="mb-12">
            <div className="text-green-500 mb-4">{"{"}</div>
            <div className="ml-4 space-y-2">
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
          </div>
        </BlurFade>

        {/* Terminal-style About */}
        <BlurFade delay={0.2}>
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <Terminal className="h-5 w-5 text-green-500" />
              <span className="text-green-500">$ whoami</span>
            </div>
            <div className="bg-slate-800/50 border border-green-500/30 rounded p-6 ml-8">
              <p className="text-green-300 leading-relaxed">{data.summary}</p>
            </div>
          </div>
        </BlurFade>

        {/* Skills as Code */}
        {data.skills && data.skills.length > 0 && (
          <BlurFade delay={0.3}>
            <div className="mb-12">
              <div className="flex items-center gap-2 mb-4">
                <Code className="h-5 w-5 text-green-500" />
                <span className="text-green-500">$ ls -la skills/</span>
              </div>
              <div className="bg-slate-800/50 border border-green-500/30 rounded p-6 ml-8">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {data.skills.map((skill, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="text-green-500">&gt;</span>
                      <span className="text-green-300">{skill}</span>
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
            <div className="mb-12">
              <div className="flex items-center gap-2 mb-4">
                <Github className="h-5 w-5 text-green-500" />
                <span className="text-green-500">$ git log --oneline --graph</span>
              </div>
              <div className="bg-slate-800/50 border border-green-500/30 rounded p-6 ml-8">
                {data.experience.map((exp, index) => (
                  <div key={index} className="mb-6 last:mb-0">
                    <div className="flex items-start gap-4">
                      <div className="text-yellow-400 font-mono text-sm mt-1">
                        {Math.random().toString(36).substr(2, 7)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-green-300 font-semibold">{exp.role}</span>
                          <span className="text-blue-400">@</span>
                          <span className="text-blue-300">{exp.company}</span>
                          <Badge variant="outline" className="text-xs border-green-500/30 text-green-400">
                            {exp.duration}
                          </Badge>
                        </div>
                        <ul className="space-y-1 text-sm text-green-200">
                          {exp.responsibilities.slice(0, 2).map((resp, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-green-500 mt-1">+</span>
                              {resp}
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
            <div className="mb-12">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="h-5 w-5 text-green-500" />
                <span className="text-green-500">$ find ./projects -type f -name "*.md"</span>
              </div>
              <div className="space-y-4 ml-8">
                {data.projects.map((project, index) => (
                  <Card key={index} className="bg-slate-800/50 border-green-500/30 border">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-green-300 mb-2">{project.name}</h3>
                          <p className="text-green-200 text-sm leading-relaxed">{project.description}</p>
                        </div>
                        <div className="flex gap-2">
                          <ExternalLink className="h-4 w-4 text-green-500 cursor-pointer hover:text-green-300" />
                          <Github className="h-4 w-4 text-green-500 cursor-pointer hover:text-green-300" />
                        </div>
                      </div>
                      {project.techStack && (
                        <div className="flex flex-wrap gap-2">
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
            <div className="mb-12">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="h-5 w-5 text-green-500" />
                <span className="text-green-500">$ cat education.log</span>
              </div>
              <div className="bg-slate-800/50 border border-green-500/30 rounded p-6 ml-8">
                {data.education.map((edu, index) => (
                  <div key={index} className="flex justify-between items-center py-2">
                    <div>
                      <span className="text-green-300">{edu.degree}</span>
                      <span className="text-blue-400 ml-2">from</span>
                      <span className="text-blue-300 ml-2">{edu.institution}</span>
                    </div>
                    <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">{edu.years}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </BlurFade>
        )}

        {/* Footer */}
        <BlurFade delay={0.7}>
          <div className="text-center">
            <div className="text-green-500">{"}"}</div>
            <div className="mt-4 text-sm text-green-400">
              <span className="text-green-500">$</span> echo "Thanks for visiting! 🚀"
            </div>
          </div>
        </BlurFade>
      </div>
    </div>
  )
}
