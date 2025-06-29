"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import BlurFade from "@/components/magicui/blur-fade"
import { Mail, Phone, MapPin, Globe, Linkedin, Github, Twitter, ExternalLink, Award, GraduationCap, Languages, BookOpen, Star } from "lucide-react"
import { PortfolioData, TemplateProps } from "@/lib/types"

export default function MinimalTemplate({ data, editMode = false, onSave }: TemplateProps) {
  const contact = data.contact || {}
  
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

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-8 py-12 sm:py-20">
        {/* Header */}
        <BlurFade delay={0.1}>
          <div className="text-center mb-16 sm:mb-24 border-b border-gray-100 dark:border-gray-800 pb-12 sm:pb-16">
            <Avatar className="w-20 h-20 sm:w-28 sm:h-28 mx-auto mb-6 sm:mb-10 border-2 border-gray-200 dark:border-gray-700 shadow-lg">
              <AvatarImage src="/placeholder.svg?height=112&width=112" alt={`${data.name} avatar`} />
              <AvatarFallback className="text-xl sm:text-2xl font-medium bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300">
                {getInitials(data.name)}
              </AvatarFallback>
            </Avatar>

            <h1 className="text-3xl sm:text-5xl font-light text-gray-900 dark:text-white mb-3 sm:mb-6 tracking-wide break-words leading-tight">
              {data.name}
            </h1>

            <h2 className="text-base sm:text-xl text-gray-600 dark:text-gray-400 font-light tracking-wide mb-6 sm:mb-10 max-w-2xl mx-auto leading-relaxed">
              {data.title}
            </h2>

            {/* Contact Information */}
            <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-3 sm:gap-8 text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-6 sm:mb-8">
              {contact.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <a href={`mailto:${contact.email}`} className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200">
                    {contact.email}
                  </a>
                </div>
              )}
              {contact.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <a href={`tel:${contact.phone}`} className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200">
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
            {(contact.website || contact.linkedin || contact.github || contact.twitter) && (
              <div className="flex justify-center items-center gap-4 sm:gap-6 mt-6 sm:mt-8">
                {contact.website && (
                  <a
                    href={contact.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 p-2 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800"
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
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 p-2 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800"
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
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 p-2 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800"
                    aria-label="GitHub profile"
                  >
                    <Github className="h-4 w-4" />
                  </a>
                )}
                {contact.twitter && (
                  <a
                    href={contact.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 p-2 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800"
                    aria-label="Twitter profile"
                  >
                    <Twitter className="h-4 w-4" />
                  </a>
                )}
              </div>
            )}
          </div>
        </BlurFade>

        {/* About */}
        <BlurFade delay={0.2}>
          <div className="mb-16 sm:mb-24">
            <h2 className="text-xs sm:text-sm uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-6 sm:mb-10 font-medium">
              About
            </h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-base sm:text-lg leading-relaxed text-gray-700 dark:text-gray-300 font-light">
                {data.summary}
              </p>
            </div>
          </div>
        </BlurFade>

        {/* Experience */}
        {data.experience && data.experience.length > 0 && (
          <BlurFade delay={0.3}>
            <div className="mb-16 sm:mb-24">
              <h2 className="text-xs sm:text-sm uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-6 sm:mb-10 font-medium">
                Experience
              </h2>
              <div className="space-y-8 sm:space-y-16">
                {data.experience.map((exp, index) => (
                  <div key={index} className="group">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-6 mb-4 sm:mb-6">
                      <div className="flex-1">
                        <h3 className="text-lg sm:text-2xl font-light text-gray-900 dark:text-white mb-2">
                          {exp.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 font-light text-base sm:text-lg">
                          {exp.company}
                          {exp.location && ` • ${exp.location}`}
                        </p>
                      </div>
                      <span className="text-sm sm:text-base text-gray-500 dark:text-gray-400 font-light whitespace-nowrap">
                        {formatDate(exp.startDate)} - {exp.endDate === "Present" ? "Present" : formatDate(exp.endDate)}
                      </span>
                    </div>
                    <div className="max-w-4xl">
                      <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-light mb-4 leading-relaxed">
                        {exp.description}
                      </p>
                      <ul className="space-y-2 sm:space-y-3 text-gray-700 dark:text-gray-300 font-light">
                        {exp.responsibilities.slice(0, 4).map((resp, i) => (
                          <li key={i} className="flex items-start">
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2.5 mr-3 sm:mr-4 flex-shrink-0"></span>
                            <span className="text-sm sm:text-base leading-relaxed">{resp}</span>
                          </li>
                        ))}
                      </ul>
                      {exp.technologies && exp.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-2 sm:gap-3 mt-4 sm:mt-6">
                          {exp.technologies.map((tech, i) => (
                            <Badge key={i} variant="secondary" className="text-xs sm:text-sm font-light px-3 py-1">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </BlurFade>
        )}

        {/* Projects */}
        {data.projects && data.projects.length > 0 && (
          <BlurFade delay={0.4}>
            <div className="mb-16 sm:mb-24">
              <h2 className="text-xs sm:text-sm uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-6 sm:mb-10 font-medium">
                Projects
              </h2>
              <div className="space-y-8 sm:space-y-12">
                {data.projects.map((project, index) => (
                  <div key={index} className="group">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-6 mb-4 sm:mb-6">
                      <div className="flex-1">
                        <h3 className="text-lg sm:text-2xl font-light text-gray-900 dark:text-white flex items-center gap-2 mb-2">
                          {project.name}
                          {(project.url || project.github) && (
                            <ExternalLink className="h-4 w-4 text-gray-400" />
                          )}
                        </h3>
                      </div>
                      <div className="flex gap-3 sm:gap-4">
                        {project.url && (
                          <a
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200 font-light"
                          >
                            Live Demo
                          </a>
                        )}
                        {project.github && (
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200 font-light"
                          >
                            Code
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="max-w-4xl">
                      <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-light mb-4 leading-relaxed">
                        {project.description}
                      </p>
                      {project.technologies && project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-2 sm:gap-3">
                          {project.technologies.map((tech, i) => (
                            <Badge key={i} variant="secondary" className="text-xs sm:text-sm font-light px-3 py-1">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </BlurFade>
        )}

        {/* Education */}
        {data.education && data.education.length > 0 && (
          <BlurFade delay={0.5}>
            <div className="mb-16 sm:mb-24">
              <h2 className="text-xs sm:text-sm uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-6 sm:mb-10 font-medium flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                Education
              </h2>
              <div className="space-y-8 sm:space-y-12">
                {data.education.map((edu, index) => (
                  <div key={index} className="group">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-6 mb-4 sm:mb-6">
                      <div className="flex-1">
                        <h3 className="text-lg sm:text-2xl font-light text-gray-900 dark:text-white mb-2">
                          {edu.degree}
                          {edu.field && ` in ${edu.field}`}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 font-light text-base sm:text-lg">
                          {edu.institution}
                          {edu.location && ` • ${edu.location}`}
                        </p>
                      </div>
                      <span className="text-sm sm:text-base text-gray-500 dark:text-gray-400 font-light whitespace-nowrap">
                        {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                      </span>
                    </div>
                    <div className="max-w-4xl">
                      {edu.gpa && (
                        <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-light mb-3">
                          GPA: {edu.gpa}
                        </p>
                      )}
                      {edu.achievements && edu.achievements.length > 0 && (
                        <div className="flex flex-wrap gap-2 sm:gap-3 mb-3">
                          {edu.achievements.map((achievement, i) => (
                            <Badge key={i} variant="secondary" className="text-xs sm:text-sm font-light px-3 py-1">
                              {achievement}
                            </Badge>
                          ))}
                        </div>
                      )}
                      {edu.courses && edu.courses.length > 0 && (
                        <p className="text-sm text-gray-600 dark:text-gray-500 font-light">
                          Key courses: {edu.courses.slice(0, 5).join(", ")}
                          {edu.courses.length > 5 && "..."}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </BlurFade>
        )}

        {/* Skills */}
        {data.skills && data.skills.length > 0 && (
          <BlurFade delay={0.6}>
            <div className="mb-16 sm:mb-24">
              <h2 className="text-xs sm:text-sm uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-6 sm:mb-10 font-medium">
                Skills
              </h2>
              <div className="flex flex-wrap gap-3 sm:gap-4">
                {data.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-lg font-light hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </BlurFade>
        )}

        {/* Certifications */}
        {data.certifications && data.certifications.length > 0 && (
          <BlurFade delay={0.7}>
            <div className="mb-16 sm:mb-24">
              <h2 className="text-xs sm:text-sm uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-6 sm:mb-10 font-medium flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Certifications
              </h2>
              <div className="space-y-6 sm:space-y-8">
                {data.certifications.map((cert, index) => (
                  <div key={index} className="group">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-6">
                      <div className="flex-1">
                        <h3 className="text-base sm:text-lg font-light text-gray-900 dark:text-white mb-1">
                          {cert.name}
                        </h3>
                        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-light">
                          {cert.issuer}
                        </p>
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400 font-light whitespace-nowrap">
                        {formatDate(cert.date)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </BlurFade>
        )}

        {/* Awards */}
        {data.awards && data.awards.length > 0 && (
          <BlurFade delay={0.8}>
            <div className="mb-16 sm:mb-24">
              <h2 className="text-xs sm:text-sm uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-6 sm:mb-10 font-medium flex items-center gap-2">
                <Award className="h-4 w-4" />
                Awards & Recognition
              </h2>
              <div className="space-y-6 sm:space-y-8">
                {data.awards.map((award, index) => (
                  <div key={index} className="group">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-6">
                      <div className="flex-1">
                        <h3 className="text-base sm:text-lg font-light text-gray-900 dark:text-white mb-1">
                          {award.title}
                        </h3>
                        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-light mb-2">
                          {award.issuer}
                        </p>
                        {award.description && (
                          <p className="text-sm text-gray-500 dark:text-gray-500 font-light">
                            {award.description}
                          </p>
                        )}
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400 font-light whitespace-nowrap">
                        {formatDate(award.date)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </BlurFade>
        )}

        {/* Languages */}
        {data.languages && data.languages.length > 0 && (
          <BlurFade delay={0.9}>
            <div className="mb-16 sm:mb-24">
              <h2 className="text-xs sm:text-sm uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-6 sm:mb-10 font-medium flex items-center gap-2">
                <Languages className="h-4 w-4" />
                Languages
              </h2>
              <div className="flex flex-wrap gap-4 sm:gap-6">
                {data.languages.map((lang, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-sm sm:text-base font-light text-gray-900 dark:text-white">
                      {lang.language}
                    </span>
                    <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-light">
                      ({lang.proficiency})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </BlurFade>
        )}

        {/* Interests */}
        {data.interests && data.interests.length > 0 && (
          <BlurFade delay={1.0}>
            <div className="mb-16 sm:mb-24">
              <h2 className="text-xs sm:text-sm uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-6 sm:mb-10 font-medium flex items-center gap-2">
                <Star className="h-4 w-4" />
                Interests
              </h2>
              <div className="flex flex-wrap gap-3 sm:gap-4">
                {data.interests.map((interest, index) => (
                  <span
                    key={index}
                    className="px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-lg font-light"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          </BlurFade>
        )}
      </div>
    </div>
  )
}
