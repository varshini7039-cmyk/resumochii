export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  phone?: string;
  location?: string;
  headline?: string;
  bio?: string;
  skills: string[];
  education?: Array<{
    degree: string;
    institution: string;
    fieldOfStudy?: string;
    startYear?: string;
    endYear?: string;
    grade?: string;
  }>;
  experience?: Array<{
    company: string;
    position: string;
    startDate?: string;
    endDate?: string;
    description?: string;
  }>;
  profileCompletion?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface EducationItem {
  id?: string;
  degree: string;
  institution: string;
  fieldOfStudy?: string;
  startYear?: string;
  endYear?: string;
  grade?: string;
}

export interface ExperienceItem {
  id?: string;
  company: string;
  position: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}

export interface ProjectItem {
  id?: string;
  title: string;
  description: string;
  technologies: string[];
  link?: string;
}

export interface CertificationItem {
  id?: string;
  name: string;
  organization: string;
  date?: string;
  link?: string;
}

export interface LanguageItem {
  language: string;
  proficiency: string;
}

export interface ResumeSkills {
  technical: string[];
  programmingLanguages: string[];
  tools: string[];
  softSkills: string[];
}

export interface Resume {
  _id: string;
  userId: string;
  title: string;
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
    github?: string;
    portfolio?: string;
  };
  summary: string;
  education: EducationItem[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
  skills: ResumeSkills;
  certifications: CertificationItem[];
  achievements: string[];
  languages: LanguageItem[];
  interests: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Job {
  _id: string;
  jobId: string;
  title: string;
  company: string;
  location: string;
  description: string;
  skills: string[];
  salary?: string;
  employmentType: 'Full-time' | 'Part-time' | 'Contract' | 'Internship' | 'Remote';
  experienceLevel: 'Entry-level' | 'Mid-level' | 'Senior' | 'Lead' | 'Intern';
  postedAt: string;
  deadline?: string;
  department?: string;
  isActive: boolean;
  createdBy?: string;
}

export interface Application {
  _id: string;
  applicationId: string;
  userId: string;
  jobId: string;
  resumeId?: string;
  status: 'Applied' | 'Under Review' | 'Interview' | 'Selected' | 'Rejected' | 'Withdrawn';
  appliedAt: string;
  coverLetter?: string;
  notes?: string;
  job?: {
    _id?: string;
    jobId?: string;
    title: string;
    company: string;
    location: string;
    employmentType?: string;
    skills?: string[];
  };
  user?: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    location?: string;
  };
  resume?: {
    _id: string;
    title: string;
  };
}

export interface AiResumeAnalysis {
  overallScore: number;
  overallObservations: string;
  summarySuggestions: {
    currentSummary: string;
    improvedSummary: string;
    reason: string;
  };
  skillsSuggestions: {
    missingSkills: string[];
    recommendedCertifications: string[];
    advice: string;
  };
  experienceSuggestions: Array<{
    company: string;
    role: string;
    originalDescription: string;
    improvedBullets: string[];
    actionVerbsAdded: string[];
  }>;
  projectSuggestions: Array<{
    projectTitle: string;
    suggestions: string;
    impactStatement: string;
  }>;
  atsSuggestions: {
    atsScore: number;
    missingKeywords: string[];
    formattingTips: string[];
    actionItems: string[];
  };
  actionVerbsList: string[];
  completenessChecklist: Array<{
    item: string;
    status: 'complete' | 'needs_improvement' | 'missing';
    tip: string;
  }>;
}

export interface AiJobMatchResult {
  jobId: string;
  jobTitle: string;
  company: string;
  matchScore: number;
  matchingSkills: string[];
  missingSkills: string[];
  relevantExperience: string;
  skillGaps: string[];
  matchExplanation: string;
  learningRoadmap: Array<{
    skill: string;
    priority: 'High' | 'Medium' | 'Low';
    recommendedResource: string;
    estimatedHours: string;
  }>;
  interviewPrepTips: string[];
  disclaimer: string;
}

export interface AiJobRecommendation {
  jobId: string;
  jobTitle: string;
  company: string;
  location: string;
  matchScore: number;
  matchingSkills: string[];
  missingSkills: string[];
  recommendationReason: string;
}

export interface AdminStats {
  totalUsers: number;
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  statusCounts: {
    applied: number;
    underReview: number;
    interview: number;
    selected: number;
    rejected: number;
    withdrawn: number;
  };
  databaseStatus: string;
}
