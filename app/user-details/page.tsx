"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Plus, X, ArrowLeft, ArrowRight, User, Briefcase, GraduationCap, Award, Globe, Mail } from "lucide-react"
import BlurFade from "@/components/magicui/blur-fade"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import Navigation from "@/components/Navigation"
import React from "react"

interface UserData {
  name: string
  title: string
  summary: string
  contact: {
    email: string
    phone: string
    location: string
    website: string
    linkedin: string
    github: string
    twitter: string
  }
  skills: string[]
  experience: Array<{
    title: string
    company: string
    location: string
    startDate: string
    endDate: string
    description: string
    responsibilities: string[]
    technologies: string[]
  }>
  education: Array<{
    degree: string
    field: string
    institution: string
    location: string
    startDate: string
    endDate: string
    gpa: string
    achievements: string[]
    courses: string[]
  }>
  projects: Array<{
    name: string
    description: string
    url: string
    github: string
    technologies: string[]
  }>
  certifications: Array<{
    name: string
    issuer: string
    date: string
  }>
  awards: Array<{
    title: string
    issuer: string
    date: string
    description: string
  }>
  languages: Array<{
    language: string
    proficiency: string
  }>
  interests: string[]
  volunteer: Array<{
    role: string
    organization: string
    description: string
    startDate: string
    endDate: string
  }>
  publications: Array<{
    title: string
    authors: string
    journal: string
    date: string
    url: string
  }>
  patents: Array<{
    title: string
    patentNumber: string
    date: string
    description: string
  }>
}

export default function UserDetailsPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [userData, setUserData] = useState<UserData>({
    name: "",
    title: "",
    summary: "",
    contact: {
      email: "",
      phone: "",
      location: "",
      website: "",
      linkedin: "",
      github: "",
      twitter: "",
    },
    skills: [],
    experience: [],
    education: [],
    projects: [],
    certifications: [],
    awards: [],
    languages: [],
    interests: [],
    volunteer: [],
    publications: [],
    patents: [],
  })

  // Form state for adding new items
  const [newSkill, setNewSkill] = useState("")
  const [newInterest, setNewInterest] = useState("")
  const [newLanguage, setNewLanguage] = useState({ language: "", proficiency: "" })
  const [newCertification, setNewCertification] = useState({ name: "", issuer: "", date: "" })
  const [newAward, setNewAward] = useState({ title: "", issuer: "", date: "", description: "" })
  const [newExperience, setNewExperience] = useState({
    title: "",
    company: "",
    location: "",
    startDate: "",
    endDate: "",
    description: "",
    responsibilities: [],
    technologies: [],
  })
  const [newEducation, setNewEducation] = useState({
    degree: "",
    field: "",
    institution: "",
    location: "",
    startDate: "",
    endDate: "",
    gpa: "",
    achievements: [],
    courses: [],
  })
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    url: "",
    github: "",
    technologies: [],
  })
  const [newVolunteer, setNewVolunteer] = useState({
    role: "",
    organization: "",
    description: "",
    startDate: "",
    endDate: "",
  })

  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Check authentication
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (!session?.user) {
        router.push("/login")
      }
    })

    // Load existing data from localStorage if available
    const existingData = localStorage.getItem("parsedResume")
    if (existingData) {
      try {
        const parsed = JSON.parse(existingData)
        setUserData((prev) => ({ ...prev, ...parsed }))
      } catch (error) {
        console.error("Error parsing existing data:", error)
      }
    }

    // Load current step from localStorage
    const savedStep = localStorage.getItem("currentStep")
    if (savedStep) {
      setCurrentStep(Number.parseInt(savedStep))
    }
  }, [router])

  // Save progress to localStorage whenever userData changes
  useEffect(() => {
    localStorage.setItem("parsedResume", JSON.stringify(userData))
    localStorage.setItem("currentStep", currentStep.toString())
  }, [userData, currentStep])

  // Helper functions for managing arrays
  const addSkill = () => {
    if (newSkill.trim() && !userData.skills.includes(newSkill.trim())) {
      setUserData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }))
      setNewSkill("")
    }
  }

  const removeSkill = (skill: string) => {
    setUserData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }))
  }

  const addInterest = () => {
    if (newInterest.trim() && !userData.interests.includes(newInterest.trim())) {
      setUserData((prev) => ({
        ...prev,
        interests: [...prev.interests, newInterest.trim()],
      }))
      setNewInterest("")
    }
  }

  const removeInterest = (interest: string) => {
    setUserData((prev) => ({
      ...prev,
      interests: prev.interests.filter((i) => i !== interest),
    }))
  }

  const addLanguage = () => {
    if (newLanguage.language.trim() && newLanguage.proficiency.trim()) {
      setUserData((prev) => ({
        ...prev,
        languages: [...prev.languages, { ...newLanguage }],
      }))
      setNewLanguage({ language: "", proficiency: "" })
    }
  }

  const removeLanguage = (index: number) => {
    setUserData((prev) => ({
      ...prev,
      languages: prev.languages.filter((_, i) => i !== index),
    }))
  }

  const addCertification = () => {
    if (newCertification.name.trim() && newCertification.issuer.trim()) {
      setUserData((prev) => ({
        ...prev,
        certifications: [...prev.certifications, { ...newCertification }],
      }))
      setNewCertification({ name: "", issuer: "", date: "" })
    }
  }

  const removeCertification = (index: number) => {
    setUserData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index),
    }))
  }

  const addAward = () => {
    if (newAward.title.trim() && newAward.issuer.trim()) {
      setUserData((prev) => ({
        ...prev,
        awards: [...prev.awards, { ...newAward }],
      }))
      setNewAward({ title: "", issuer: "", date: "", description: "" })
    }
  }

  const removeAward = (index: number) => {
    setUserData((prev) => ({
      ...prev,
      awards: prev.awards.filter((_, i) => i !== index),
    }))
  }

  const addExperience = () => {
    if (newExperience.title.trim() && newExperience.company.trim()) {
      setUserData((prev) => ({
        ...prev,
        experience: [...prev.experience, { ...newExperience }],
      }))
      setNewExperience({
        title: "",
        company: "",
        location: "",
        startDate: "",
        endDate: "",
        description: "",
        responsibilities: [],
        technologies: [],
      })
    }
  }

  const removeExperience = (index: number) => {
    setUserData((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }))
  }

  const addEducation = () => {
    if (newEducation.degree.trim() && newEducation.institution.trim()) {
      setUserData((prev) => ({
        ...prev,
        education: [...prev.education, { ...newEducation }],
      }))
      setNewEducation({
        degree: "",
        field: "",
        institution: "",
        location: "",
        startDate: "",
        endDate: "",
        gpa: "",
        achievements: [],
        courses: [],
      })
    }
  }

  const removeEducation = (index: number) => {
    setUserData((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }))
  }

  const addProject = () => {
    if (newProject.name.trim() && newProject.description.trim()) {
      setUserData((prev) => ({
        ...prev,
        projects: [...prev.projects, { ...newProject }],
      }))
      setNewProject({
        name: "",
        description: "",
        url: "",
        github: "",
        technologies: [],
      })
    }
  }

  const removeProject = (index: number) => {
    setUserData((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index),
    }))
  }

  const addVolunteer = () => {
    if (newVolunteer.role.trim() && newVolunteer.organization.trim()) {
      setUserData((prev) => ({
        ...prev,
        volunteer: [...prev.volunteer, { ...newVolunteer }],
      }))
      setNewVolunteer({
        role: "",
        organization: "",
        description: "",
        startDate: "",
        endDate: "",
      })
    }
  }

  const removeVolunteer = (index: number) => {
    setUserData((prev) => ({
      ...prev,
      volunteer: prev.volunteer.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async () => {
    if (!user) return
    setLoading(true)

    try {
      // Save complete data to localStorage for template selection
      localStorage.setItem("parsedResume", JSON.stringify(userData))
      localStorage.removeItem("currentStep") // Clear step progress

      toast({
        title: "Information saved! 🎉",
        description: "Your details have been saved successfully. Choose a template next!",
      })

      // Redirect to template selection
      router.push("/onboarding")
    } catch (error) {
      console.error("Error saving user data:", error)

      toast({
        title: "Error saving information",
        description: "Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const steps = [
    { id: 1, title: "Basic Info", icon: User },
    { id: 2, title: "Contact", icon: Mail },
    { id: 3, title: "Skills", icon: Award },
    { id: 4, title: "Experience", icon: Briefcase, optional: true },
    { id: 5, title: "Education", icon: GraduationCap, optional: true },
    { id: 6, title: "Projects", icon: Globe, optional: true },
    { id: 7, title: "Additional", icon: Award, optional: true },
  ]

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <BlurFade delay={0.1}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-3 sm:p-4 lg:p-6">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={userData.name || ""}
                    onChange={(e) => setUserData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="John Doe"
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="title">Professional Title</Label>
                  <Input
                    id="title"
                    value={userData.title || ""}
                    onChange={(e) => setUserData((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="Software Engineer, Designer, etc."
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="summary">Professional Summary</Label>
                  <Textarea
                    id="summary"
                    value={userData.summary || ""}
                    onChange={(e) => setUserData((prev) => ({ ...prev, summary: e.target.value }))}
                    placeholder="A brief overview of your professional background, skills, and career objectives..."
                    rows={4}
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>
          </BlurFade>
        )

      case 2:
        return (
          <BlurFade delay={0.1}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-3 sm:p-4 lg:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={userData.contact.email || ""}
                      onChange={(e) =>
                        setUserData((prev) => ({
                          ...prev,
                          contact: { ...prev.contact, email: e.target.value },
                        }))
                      }
                      placeholder="john@example.com"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={userData.contact.phone || ""}
                      onChange={(e) =>
                        setUserData((prev) => ({
                          ...prev,
                          contact: { ...prev.contact, phone: e.target.value },
                        }))
                      }
                      placeholder="+1 (555) 123-4567"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={userData.contact.location || ""}
                      onChange={(e) =>
                        setUserData((prev) => ({
                          ...prev,
                          contact: { ...prev.contact, location: e.target.value },
                        }))
                      }
                      placeholder="San Francisco, CA"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="website">Personal Website</Label>
                    <Input
                      id="website"
                      type="url"
                      value={userData.contact.website || ""}
                      onChange={(e) =>
                        setUserData((prev) => ({
                          ...prev,
                          contact: { ...prev.contact, website: e.target.value },
                        }))
                      }
                      placeholder="https://johndoe.com"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  <div>
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    <Input
                      id="linkedin"
                      type="url"
                      value={userData.contact.linkedin || ""}
                      onChange={(e) =>
                        setUserData((prev) => ({
                          ...prev,
                          contact: { ...prev.contact, linkedin: e.target.value },
                        }))
                      }
                      placeholder="LinkedIn URL"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="github">GitHub</Label>
                    <Input
                      id="github"
                      type="url"
                      value={userData.contact.github || ""}
                      onChange={(e) =>
                        setUserData((prev) => ({
                          ...prev,
                          contact: { ...prev.contact, github: e.target.value },
                        }))
                      }
                      placeholder="GitHub URL"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="twitter">Twitter</Label>
                    <Input
                      id="twitter"
                      type="url"
                      value={userData.contact.twitter || ""}
                      onChange={(e) =>
                        setUserData((prev) => ({
                          ...prev,
                          contact: { ...prev.contact, twitter: e.target.value },
                        }))
                      }
                      placeholder="Twitter URL"
                      className="mt-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </BlurFade>
        )

      case 3:
        return (
          <BlurFade delay={0.1}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Skills & Interests
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-3 sm:p-4 lg:p-6">
                <div>
                  <Label>Skills</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Add a skill"
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                      className="flex-1"
                    />
                    <Button onClick={addSkill} size="sm" type="button">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2">
                    {userData.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {skill}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => removeSkill(skill)} />
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Languages</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-2">
                    <Input
                      value={newLanguage.language}
                      onChange={(e) => setNewLanguage((prev) => ({ ...prev, language: e.target.value }))}
                      placeholder="Language"
                    />
                    <Input
                      value={newLanguage.proficiency}
                      onChange={(e) => setNewLanguage((prev) => ({ ...prev, proficiency: e.target.value }))}
                      placeholder="Proficiency level"
                    />
                    <Button onClick={addLanguage} size="sm" type="button" className="w-full sm:w-auto">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {userData.languages.map((lang, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {lang.language} ({lang.proficiency})
                        <X className="h-3 w-3 cursor-pointer" onClick={() => removeLanguage(index)} />
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Interests</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      value={newInterest}
                      onChange={(e) => setNewInterest(e.target.value)}
                      placeholder="Add an interest"
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addInterest())}
                      className="flex-1"
                    />
                    <Button onClick={addInterest} size="sm" type="button">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2">
                    {userData.interests.map((interest, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {interest}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => removeInterest(interest)} />
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </BlurFade>
        )

      case 4:
        return (
          <BlurFade delay={0.1}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Work Experience (Optional)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-3 sm:p-4 lg:p-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <Label>Job Title</Label>
                      <Input
                        value={newExperience.title || ""}
                        onChange={(e) => setNewExperience((prev) => ({ ...prev, title: e.target.value }))}
                        placeholder="Software Engineer"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Company</Label>
                      <Input
                        value={newExperience.company || ""}
                        onChange={(e) => setNewExperience((prev) => ({ ...prev, company: e.target.value }))}
                        placeholder="Tech Corp"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                    <div>
                      <Label>Location</Label>
                      <Input
                        value={newExperience.location || ""}
                        onChange={(e) => setNewExperience((prev) => ({ ...prev, location: e.target.value }))}
                        placeholder="San Francisco, CA"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Start Date</Label>
                      <Input
                        type="month"
                        value={newExperience.startDate || ""}
                        onChange={(e) => setNewExperience((prev) => ({ ...prev, startDate: e.target.value }))}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>End Date</Label>
                      <Input
                        type="month"
                        value={newExperience.endDate || ""}
                        onChange={(e) => setNewExperience((prev) => ({ ...prev, endDate: e.target.value }))}
                        placeholder="Present"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={newExperience.description || ""}
                      onChange={(e) => setNewExperience((prev) => ({ ...prev, description: e.target.value }))}
                      placeholder="Brief description of your role and responsibilities..."
                      rows={3}
                      className="mt-1"
                    />
                  </div>

                  <Button onClick={addExperience} className="w-full" type="button">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Experience
                  </Button>
                </div>

                <div className="space-y-4">
                  {userData.experience.map((exp, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold">{exp.title}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{exp.company}</p>
                          <p className="text-xs text-gray-500">
                            {exp.startDate} - {exp.endDate || "Present"}
                          </p>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => removeExperience(index)} type="button">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-sm">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </BlurFade>
        )

      case 5:
        return (
          <BlurFade delay={0.1}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Education (Optional)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-3 sm:p-4 lg:p-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <Label>Degree</Label>
                      <Input
                        value={newEducation.degree || ""}
                        onChange={(e) => setNewEducation((prev) => ({ ...prev, degree: e.target.value }))}
                        placeholder="Bachelor of Science"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Field of Study</Label>
                      <Input
                        value={newEducation.field || ""}
                        onChange={(e) => setNewEducation((prev) => ({ ...prev, field: e.target.value }))}
                        placeholder="Computer Science"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <Label>Institution</Label>
                      <Input
                        value={newEducation.institution || ""}
                        onChange={(e) => setNewEducation((prev) => ({ ...prev, institution: e.target.value }))}
                        placeholder="University Name"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Location</Label>
                      <Input
                        value={newEducation.location || ""}
                        onChange={(e) => setNewEducation((prev) => ({ ...prev, location: e.target.value }))}
                        placeholder="City, State"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                    <div>
                      <Label>Start Date</Label>
                      <Input
                        type="month"
                        value={newEducation.startDate || ""}
                        onChange={(e) => setNewEducation((prev) => ({ ...prev, startDate: e.target.value }))}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>End Date</Label>
                      <Input
                        type="month"
                        value={newEducation.endDate || ""}
                        onChange={(e) => setNewEducation((prev) => ({ ...prev, endDate: e.target.value }))}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>GPA (Optional)</Label>
                      <Input
                        value={newEducation.gpa || ""}
                        onChange={(e) => setNewEducation((prev) => ({ ...prev, gpa: e.target.value }))}
                        placeholder="3.8"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <Button onClick={addEducation} className="w-full" type="button">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Education
                  </Button>
                </div>

                <div className="space-y-4">
                  {userData.education.map((edu, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold">
                            {edu.degree} in {edu.field}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{edu.institution}</p>
                          <p className="text-xs text-gray-500">
                            {edu.startDate} - {edu.endDate}
                          </p>
                          {edu.gpa && <p className="text-xs text-gray-500">GPA: {edu.gpa}</p>}
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => removeEducation(index)} type="button">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </BlurFade>
        )

      case 6:
        return (
          <BlurFade delay={0.1}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Projects (Optional)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-3 sm:p-4 lg:p-6">
                <div className="space-y-4">
                  <div>
                    <Label>Project Name</Label>
                    <Input
                      value={newProject.name || ""}
                      onChange={(e) => setNewProject((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="My Awesome Project"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={newProject.description || ""}
                      onChange={(e) => setNewProject((prev) => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe your project, technologies used, and your role..."
                      rows={3}
                      className="mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <Label>Live Demo URL</Label>
                      <Input
                        type="url"
                        value={newProject.url || ""}
                        onChange={(e) => setNewProject((prev) => ({ ...prev, url: e.target.value }))}
                        placeholder="https://project-demo.com"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>GitHub Repository</Label>
                      <Input
                        type="url"
                        value={newProject.github || ""}
                        onChange={(e) => setNewProject((prev) => ({ ...prev, github: e.target.value }))}
                        placeholder="https://github.com/username/project"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <Button onClick={addProject} className="w-full" type="button">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Project
                  </Button>
                </div>

                <div className="space-y-4">
                  {userData.projects.map((project, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold">{project.name}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{project.description}</p>
                          {(project.url || project.github) && (
                            <div className="flex gap-2 mt-2">
                              {project.url && (
                                <a
                                  href={project.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-blue-600 hover:underline"
                                >
                                  Live Demo
                                </a>
                              )}
                              {project.github && (
                                <a
                                  href={project.github}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-blue-600 hover:underline"
                                >
                                  GitHub
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => removeProject(index)} type="button">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </BlurFade>
        )

      case 7:
        return (
          <BlurFade delay={0.1}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Additional Information (Optional)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-3 sm:p-4 lg:p-6">
                <div>
                  <Label>Certifications</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-2">
                    <Input
                      value={newCertification.name || ""}
                      onChange={(e) => setNewCertification((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="Certification Name"
                    />
                    <Input
                      value={newCertification.issuer || ""}
                      onChange={(e) => setNewCertification((prev) => ({ ...prev, issuer: e.target.value }))}
                      placeholder="Issuing Organization"
                    />
                    <div className="flex gap-2">
                      <Input
                        type="month"
                        value={newCertification.date || ""}
                        onChange={(e) => setNewCertification((prev) => ({ ...prev, date: e.target.value }))}
                        className="flex-1"
                      />
                      <Button onClick={addCertification} size="sm" type="button">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {userData.certifications.map((cert, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {cert.name} - {cert.issuer}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => removeCertification(index)} />
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Awards & Recognition</Label>
                  <div className="space-y-2 mt-2">
                    <Input
                      value={newAward.title || ""}
                      onChange={(e) => setNewAward((prev) => ({ ...prev, title: e.target.value }))}
                      placeholder="Award Title"
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <Input
                        value={newAward.issuer || ""}
                        onChange={(e) => setNewAward((prev) => ({ ...prev, issuer: e.target.value }))}
                        placeholder="Issuing Organization"
                      />
                      <Input
                        type="month"
                        value={newAward.date || ""}
                        onChange={(e) => setNewAward((prev) => ({ ...prev, date: e.target.value }))}
                      />
                    </div>
                    <Textarea
                      value={newAward.description || ""}
                      onChange={(e) => setNewAward((prev) => ({ ...prev, description: e.target.value }))}
                      placeholder="Description of the award..."
                      rows={2}
                    />
                    <Button onClick={addAward} size="sm" type="button">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Award
                    </Button>
                  </div>
                  <div className="space-y-2 mt-4">
                    {userData.awards.map((award, index) => (
                      <div key={index} className="border rounded-lg p-3">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h5 className="font-medium">{award.title}</h5>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{award.issuer}</p>
                            {award.description && <p className="text-xs text-gray-500 mt-1">{award.description}</p>}
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => removeAward(index)} type="button">
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Volunteer Experience</Label>
                  <div className="space-y-2 mt-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <Input
                        value={newVolunteer.role || ""}
                        onChange={(e) => setNewVolunteer((prev) => ({ ...prev, role: e.target.value }))}
                        placeholder="Volunteer Role"
                      />
                      <Input
                        value={newVolunteer.organization || ""}
                        onChange={(e) => setNewVolunteer((prev) => ({ ...prev, organization: e.target.value }))}
                        placeholder="Organization"
                      />
                    </div>
                    <Textarea
                      value={newVolunteer.description || ""}
                      onChange={(e) => setNewVolunteer((prev) => ({ ...prev, description: e.target.value }))}
                      placeholder="Description of your volunteer work..."
                      rows={2}
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <Input
                        type="month"
                        value={newVolunteer.startDate || ""}
                        onChange={(e) => setNewVolunteer((prev) => ({ ...prev, startDate: e.target.value }))}
                        placeholder="Start Date"
                      />
                      <Input
                        type="month"
                        value={newVolunteer.endDate || ""}
                        onChange={(e) => setNewVolunteer((prev) => ({ ...prev, endDate: e.target.value }))}
                        placeholder="End Date (or Present)"
                      />
                    </div>
                    <Button onClick={addVolunteer} size="sm" type="button">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Volunteer Experience
                    </Button>
                  </div>
                  <div className="space-y-2 mt-4">
                    {userData.volunteer.map((vol, index) => (
                      <div key={index} className="border rounded-lg p-3">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h5 className="font-medium">{vol.role}</h5>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{vol.organization}</p>
                            <p className="text-xs text-gray-500">
                              {vol.startDate} - {vol.endDate || "Present"}
                            </p>
                            {vol.description && <p className="text-xs text-gray-500 mt-1">{vol.description}</p>}
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => removeVolunteer(index)} type="button">
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </BlurFade>
        )

      default:
        return null
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <Navigation />
      <div className="pt-16 sm:pt-20 p-3 sm:p-6 lg:p-8">
        <div className="w-full max-w-full sm:max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-4 sm:mb-6 lg:mb-8">
            <Link href="/upload">
              <Button variant="ghost" className="mb-3 sm:mb-4 -ml-2 sm:ml-0">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Upload
              </Button>
            </Link>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Tell Us About Yourself
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
              Fill in your details to create a personalized portfolio. You can skip optional sections if you don't have
              that information yet.
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-6 sm:mb-8">
            {/* Mobile Progress - Show only current step */}
            <div className="block sm:hidden">
              <div className="flex items-center justify-center mb-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 text-white">
                  {steps[currentStep - 1].icon && React.createElement(steps[currentStep - 1].icon)}
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{steps[currentStep - 1].title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Step {currentStep} of {steps.length}
                  {steps[currentStep - 1].optional && " (Optional)"}
                </p>
              </div>
              {/* Mobile progress bar */}
              <div className="mt-4">
                <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(currentStep / steps.length) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Progress</span>
                  <span>{Math.round((currentStep / steps.length) * 100)}%</span>
                </div>
              </div>
            </div>

            {/* Desktop Progress - Show all steps */}
            <div className="hidden sm:block">
              <div className="flex items-center justify-between overflow-x-auto pb-2">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex items-center min-w-0 flex-1">
                    <div
                      className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 flex-shrink-0 ${
                        currentStep >= step.id
                          ? "bg-blue-600 border-blue-600 text-white"
                          : "border-gray-300 dark:border-gray-600 text-gray-500"
                      }`}
                    >
                      {step.icon && <step.icon className="h-4 w-4 sm:h-5 sm:w-5" />}
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`flex-1 h-0.5 mx-2 ${
                          currentStep > step.id ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-2 text-xs sm:text-sm">
                {steps.map((step) => (
                  <span
                    key={step.id}
                    className={`text-center flex-1 ${currentStep >= step.id ? "text-blue-600" : "text-gray-500"}`}
                  >
                    <span className="block">{step.title}</span>
                    {step.optional && <span className="text-gray-400 text-xs">(Optional)</span>}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Step Content */}
          <div className="mb-6 sm:mb-8 px-1 sm:px-0">{renderStep()}</div>

          {/* Navigation */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-0 justify-between sticky bottom-0 sm:static bg-white dark:bg-slate-900 p-4 sm:p-0 -mx-4 sm:mx-0 border-t sm:border-t-0 border-gray-200 dark:border-gray-700">
            <Button
              variant="outline"
              onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
              disabled={currentStep === 1}
              className="w-full sm:w-auto bg-white dark:bg-slate-900 order-1 sm:order-none"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            {currentStep < steps.length ? (
              <Button
                onClick={() => setCurrentStep((prev) => prev + 1)}
                disabled={currentStep === steps.length}
                className="w-full sm:w-auto order-2 sm:order-none"
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={loading || !userData.name}
                className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto order-2 sm:order-none"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    Save & Continue
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
