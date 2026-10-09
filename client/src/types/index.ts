export interface Profile {
  _id?: string;
  name: string;
  avatarUrl: string;
  title: string;
  subtitle?: string;
  shortIntro: string;
  aboutDescription: string;
  bio?: string;
  email: string;
  phone?: string;
  location: string;
  resumeUrl?: string;
  isVisible?: boolean;
  linkedinUrl?: string;
  githubUrl?: string;
  skills?: string[];
  careerInterests?: string[];
  role?: string;
  education?: string;
}

export interface About {
  _id?: string;
  title: string;
  description: string;
  careerGoal: string;
  professionalSummary: string;
  personalIntroduction: string;
}

export interface Education {
  _id?: string;
  degree: string;
  department: string;
  institution: string;
  startYear: string;
  endYear: string;
  description?: string;
  percentageOrCgpa: string;
  order?: number;
}

export interface Skill {
  _id?: string;
  name: string;
  category: string;
  level: string;
  percentage: number;
  icon: string;
  order?: number;
}

export interface Project {
  _id: string;
  title: string;
  description: string;
  fullDescription?: string;
  technologies: string[];
  imageUrl: string;
  githubUrl: string;
  liveDemoUrl: string;
  startDate?: string;
  endDate?: string;
  category?: string;
  featured: boolean;
  order: number;
  createdAt?: string;
}

export interface Certificate {
  _id: string;
  name: string;
  title?: string;
  issuingOrganization: string;
  issueDate: string;
  certificateId?: string;
  imageUrl?: string;
  pdfUrl?: string;
  credentialUrl?: string;
  description?: string;
  skills?: string[];
  createdAt?: string;
}

export interface Experience {
  _id?: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate?: string;
  currentlyWorking: boolean;
  description: string;
  technologies: string[];
  order?: number;
}

export interface Service {
  _id?: string;
  title: string;
  description: string;
  icon: string;
  order?: number;
}

export interface Resume {
  _id?: string;
  title: string;
  fileUrl: string;
  summary: string;
  skillsOverview?: string[];
  experienceSummary?: string;
  educationSummary?: string;
}

export interface ContactMessage {
  _id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead?: boolean;
  createdAt?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface SocialLink {
  _id?: string;
  platform: string;
  url: string;
  icon: string;
  order?: number;
}

export interface SectionsVisibility {
  about: boolean;
  education: boolean;
  skills: boolean;
  projects: boolean;
  certificates: boolean;
  experience: boolean;
  services: boolean;
  resume: boolean;
  contact: boolean;
}

export interface WebsiteSettings {
  _id?: string;
  websiteTitle: string;
  logoText: string;
  heroTitle: string;
  heroSubtitle: string;
  footerText: string;
  contactEmail: string;
  theme: string;
  sectionsVisibility: SectionsVisibility;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  count?: number;
  unreadCount?: number;
  source?: string;
  notice?: string;
}
