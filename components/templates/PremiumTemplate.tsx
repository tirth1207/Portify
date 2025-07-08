"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import BlurFade from "@/components/magicui/blur-fade"
import { 
  Mail, 
  MapPin, 
  Phone, 
  Globe, 
  Github, 
  Linkedin, 
  Twitter,
  ExternalLink,
  Star,
  Award,
  Calendar,
  Building,
  GraduationCap,
  Code,
  Palette,
  Zap,
  Heart,
  Sparkles,
  BookOpen,
  Languages,
  Users,
  FileText
} from "lucide-react"
import { PortfolioData, TemplateProps } from "@/lib/types"
import { useTheme } from "next-themes"

export default function PremiumTemplate({ data, editMode = false, onSave }: TemplateProps) {
  const { theme, resolvedTheme } = useTheme();
  const [currentSection, setCurrentSection] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    const interval = setInterval(() => {
      setCurrentSection((prev) => (prev + 1) % 4)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString + "-01")
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short" })
  }

  const contact = data.contact || {}

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-20 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-16">
        {/* Premium Header */}
        <BlurFade delay={0.1}>
          <div className="text-center mb-12 sm:mb-20">
            <div className="relative inline-block mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 rounded-full blur-2xl opacity-30 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-purple-600 via-pink-600 to-yellow-600 p-1 rounded-full">
                <Avatar className="w-24 h-24 sm:w-32 sm:h-32 border-4 border-white shadow-2xl">
                  <AvatarImage src="/placeholder.svg?height=128&width=128" />
                  <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                    {getInitials(data.name)}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-yellow-400 animate-pulse" />
                <Badge variant="secondary" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                  Premium Portfolio
                </Badge>
                <Sparkles className="h-5 w-5 text-yellow-400 animate-pulse" />
              </div>
              
              <h1 className="text-3xl sm:text-6xl font-black bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                {data.name}
              </h1>
              
              <h2 className="text-lg sm:text-2xl text-purple-300 font-medium mb-6">
                {data.title}
              </h2>

              <div className="max-w-2xl mx-auto">
                <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                  {data.summary}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-3 sm:gap-6 text-sm text-gray-400 mt-6">
                {contact.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-purple-400" />
                    <a href={`mailto:${contact.email}`} className="hover:text-purple-300 transition-colors">
                      {contact.email}
                    </a>
                  </div>
                )}
                {contact.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-purple-400" />
                    <span>{contact.location}</span>
                  </div>
                )}
                {contact.website && (
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-purple-400" />
                    <a href={contact.website} target="_blank" rel="noopener noreferrer" className="hover:text-purple-300 transition-colors">
                      {contact.website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                )}
              </div>

              {/* Social Links */}
              <div className="flex justify-center items-center gap-4 mt-6">
                {[
                  { icon: Github, href: contact.github, label: "GitHub" },
                  { icon: Linkedin, href: contact.linkedin, label: "LinkedIn" },
                  { icon: Twitter, href: contact.twitter, label: "Twitter" }
                ].filter(social => social.href).map((social) => (
                  <Button
                    key={social.label}
                    variant="ghost"
                    size="sm"
                    className="w-10 h-10 p-0 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20"
                    asChild
                  >
                    <a href={social.href} target="_blank" rel="noopener noreferrer">
                      <social.icon className="h-4 w-4" />
                    </a>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </BlurFade>

        {/* Skills Section */}
        {data.skills && data.skills.length > 0 && (
          <BlurFade delay={0.2}>
            <div className="mb-12 sm:mb-20">
              <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-4xl font-bold text-white mb-2">Expertise</h2>
                <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full"></div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
                {data.skills.map((skill, index) => (
                  <div
                    key={index}
                    className="group relative overflow-hidden rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:border-purple-500/50 transition-all duration-300 hover:scale-105"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative p-4 text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Code className="h-5 w-5 text-purple-400" />
                      </div>
                      <span className="text-sm font-medium text-white">{skill}</span>
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
              <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-4xl font-bold text-white mb-2">Experience</h2>
                <div className="w-24 h-1 bg-gradient-to-r from-pink-500 to-yellow-500 mx-auto rounded-full"></div>
              </div>
              
              <div className="relative">
                <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
                {data.experience.map((exp, index) => (
                  <div
                    key={index}
                    className={`flex flex-col sm:flex-row items-center mb-8 ${index % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"}`}
                  >
                    <div className={`w-full sm:w-1/2 ${index % 2 === 0 ? "sm:pr-8 sm:text-right" : "sm:pl-8 sm:text-left"}`}>
                      <Card className="bg-white/10 backdrop-blur-sm border border-white/20 hover:border-purple-500/50 transition-all duration-300 hover:scale-105">
                        <CardContent className="p-4 sm:p-6">
                          <div className="flex items-center gap-2 mb-2">
                            <Building className="h-4 w-4 text-purple-400" />
                            <span className="text-sm text-purple-300">{exp.company}</span>
                          </div>
                          <h3 className="text-lg font-bold text-white mb-1">{exp.title}</h3>
                          <div className="flex items-center gap-2 mb-3">
                            <Calendar className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-400">
                              {formatDate(exp.startDate)} - {exp.endDate === "Present" ? "Present" : formatDate(exp.endDate)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-300 leading-relaxed mb-3">{exp.description}</p>
                          <ul className="space-y-1 text-xs text-gray-400">
                            {exp.responsibilities.slice(0, 3).map((resp, i) => (
                              <li key={i} className="flex items-start">
                                <span className="w-1 h-1 bg-purple-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                                <span>{resp}</span>
                              </li>
                            ))}
                          </ul>
                          {exp.technologies && exp.technologies.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-3">
                              {exp.technologies.map((tech, i) => (
                                <Badge key={i} variant="secondary" className="bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs">
                                  {tech}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 sm:w-6 sm:h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full border-4 border-slate-900 shadow-lg"></div>
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
              <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-4xl font-bold text-white mb-2">Featured Projects</h2>
                <div className="w-24 h-1 bg-gradient-to-r from-yellow-500 to-purple-500 mx-auto rounded-full"></div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                {data.projects.map((project, index) => (
                  <Card
                    key={index}
                    className="group relative overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20 hover:border-purple-500/50 transition-all duration-300 hover:scale-105"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <CardContent className="relative p-4 sm:p-6">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                          {project.name}
                          {(project.url || project.github) && (
                            <ExternalLink className="h-4 w-4 text-purple-400" />
                          )}
                        </h3>
                        <div className="flex gap-2">
                          {project.url && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-8 h-8 p-0 rounded-full bg-white/10 hover:bg-white/20 text-white"
                              asChild
                            >
                              <a href={project.url} target="_blank" rel="noopener noreferrer">
                                <Globe className="h-4 w-4" />
                              </a>
                            </Button>
                          )}
                          {project.github && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-8 h-8 p-0 rounded-full bg-white/10 hover:bg-white/20 text-white"
                              asChild
                            >
                              <a href={project.github} target="_blank" rel="noopener noreferrer">
                                <Github className="h-4 w-4" />
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                      <p className="text-gray-300 text-sm mb-4 leading-relaxed">{project.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech, techIndex) => (
                          <Badge
                            key={techIndex}
                            variant="secondary"
                            className="bg-purple-500/20 text-purple-300 border border-purple-500/30"
                          >
                            {tech}
                          </Badge>
                        ))}
                      </div>
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
            <div className="mb-12 sm:mb-20">
              <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-4xl font-bold text-white mb-2">Education</h2>
                <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-yellow-500 mx-auto rounded-full"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.education.map((edu, index) => (
                  <Card
                    key={index}
                    className="bg-white/10 backdrop-blur-sm border border-white/20 hover:border-purple-500/50 transition-all duration-300 hover:scale-105"
                  >
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <GraduationCap className="h-4 w-4 text-purple-400" />
                        <span className="text-sm text-purple-300">{edu.institution}</span>
                      </div>
                      <h3 className="text-lg font-bold text-white mb-1">
                        {edu.degree}
                        {edu.field && ` in ${edu.field}`}
                      </h3>
                      <div className="flex items-center gap-2 mb-3">
                        <Calendar className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-400">
                          {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                        </span>
                      </div>
                      {edu.gpa && (
                        <p className="text-sm text-gray-300 mb-2">GPA: {edu.gpa}</p>
                      )}
                      {edu.achievements && edu.achievements.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {edu.achievements.map((achievement, i) => (
                            <Badge key={i} variant="secondary" className="bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs">
                              {achievement}
                            </Badge>
                          ))}
                        </div>
                      )}
                      {edu.courses && edu.courses.length > 0 && (
                        <p className="text-xs text-gray-400">
                          Key courses: {edu.courses.slice(0, 3).join(", ")}
                          {edu.courses.length > 3 && "..."}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </BlurFade>
        )}

        {/* Certifications */}
        {data.certifications && data.certifications.length > 0 && (
          <BlurFade delay={0.6}>
            <div className="mb-12 sm:mb-20">
              <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-4xl font-bold text-white mb-2">Certifications</h2>
                <div className="w-24 h-1 bg-gradient-to-r from-yellow-500 to-purple-500 mx-auto rounded-full"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {data.certifications.map((cert, index) => (
                  <Card
                    key={index}
                    className="bg-white/10 backdrop-blur-sm border border-white/20 hover:border-purple-500/50 transition-all duration-300 hover:scale-105"
                  >
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <BookOpen className="h-4 w-4 text-purple-400" />
                        <span className="text-sm text-purple-300">{cert.issuer}</span>
                      </div>
                      <h3 className="text-base font-bold text-white mb-1">{cert.name}</h3>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-400">{formatDate(cert.date)}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </BlurFade>
        )}

        {/* Awards */}
        {data.awards && data.awards.length > 0 && (
          <BlurFade delay={0.7}>
            <div className="mb-12 sm:mb-20">
              <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-4xl font-bold text-white mb-2">Awards & Recognition</h2>
                <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {data.awards.map((award, index) => (
                  <Card
                    key={index}
                    className="bg-white/10 backdrop-blur-sm border border-white/20 hover:border-purple-500/50 transition-all duration-300 hover:scale-105"
                  >
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <Award className="h-4 w-4 text-yellow-400" />
                        <span className="text-sm text-purple-300">{award.issuer}</span>
                      </div>
                      <h3 className="text-base font-bold text-white mb-1">{award.title}</h3>
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-400">{formatDate(award.date)}</span>
                      </div>
                      {award.description && (
                        <p className="text-xs text-gray-400">{award.description}</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </BlurFade>
        )}

        {/* Languages */}
        {data.languages && data.languages.length > 0 && (
          <BlurFade delay={0.8}>
            <div className="mb-12 sm:mb-20">
              <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-4xl font-bold text-white mb-2">Languages</h2>
                <div className="w-24 h-1 bg-gradient-to-r from-pink-500 to-yellow-500 mx-auto rounded-full"></div>
              </div>
              
              <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
                {data.languages.map((lang, index) => (
                  <div
                    key={index}
                    className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 text-center hover:border-purple-500/50 transition-all duration-300 hover:scale-105"
                  >
                    <div className="flex items-center justify-center mb-2">
                      <Languages className="h-5 w-5 text-purple-400" />
                    </div>
                    <h3 className="text-sm font-bold text-white mb-1">{lang.language}</h3>
                    <p className="text-xs text-gray-400">{lang.proficiency}</p>
                  </div>
                ))}
              </div>
            </div>
          </BlurFade>
        )}

        {/* Interests */}
        {data.interests && data.interests.length > 0 && (
          <BlurFade delay={0.9}>
            <div className="mb-12 sm:mb-20">
              <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-4xl font-bold text-white mb-2">Interests</h2>
                <div className="w-24 h-1 bg-gradient-to-r from-yellow-500 to-purple-500 mx-auto rounded-full"></div>
              </div>
              
              <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                {data.interests.map((interest, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-white/10 text-white border border-white/20 hover:border-purple-500/50 transition-all duration-300"
                  >
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>
          </BlurFade>
        )}

        {/* Footer */}
        <BlurFade delay={1.0}>
          <div className="text-center pt-8 border-t border-white/20">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Heart className="h-4 w-4 text-pink-500 animate-pulse" />
              <span className="text-gray-400 text-sm">Crafted with passion</span>
              <Heart className="h-4 w-4 text-pink-500 animate-pulse" />
            </div>
            <p className="text-xs text-gray-500">
              © 2024 {data.name}. All rights reserved.
            </p>
          </div>
        </BlurFade>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
} 