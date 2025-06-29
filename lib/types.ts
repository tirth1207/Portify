export interface Contact {
  email?: string
  phone?: string
  location?: string
  website?: string
  linkedin?: string
  github?: string
  twitter?: string
}

export interface Project {
  name: string
  description: string
  technologies: string[]
  url?: string
  github?: string
  image?: string
}

export interface Education {
  institution: string
  degree: string
  field?: string
  startDate: string
  endDate: string
  location?: string
  gpa?: string
  courses?: string[]
  achievements?: string[]
}

export interface Experience {
  company: string
  title: string
  startDate: string
  endDate: string
  location?: string
  description: string
  responsibilities: string[]
  achievements?: string[]
  technologies?: string[]
}

export interface Certification {
  name: string
  issuer: string
  date: string
  url?: string
  expiryDate?: string
}

export interface Award {
  title: string
  issuer: string
  date: string
  description?: string
}

export interface Language {
  language: string
  proficiency: string
}

export interface Volunteer {
  organization: string
  role: string
  startDate: string
  endDate: string
  description: string
}

export interface Publication {
  title: string
  publisher: string
  date: string
  url?: string
}

export interface Patent {
  title: string
  patentNumber: string
  date: string
  description?: string
}

export interface PortfolioData {
  name: string
  title: string
  summary: string
  contact?: Contact
  skills?: string[]
  projects?: Project[]
  education?: Education[]
  experience?: Experience[]
  certifications?: Certification[]
  awards?: Award[]
  languages?: Language[]
  interests?: string[]
  volunteer?: Volunteer[]
  publications?: Publication[]
  patents?: Patent[]
}

// Legacy interface for backward compatibility
export interface Resume extends PortfolioData {}

// Template props interface
export interface TemplateProps {
  data: PortfolioData
  editMode?: boolean
  onSave?: (data: PortfolioData) => void
} 