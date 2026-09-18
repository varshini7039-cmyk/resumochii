import mongoose from 'mongoose';

export interface IResume {
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
  education: Array<{
    id?: string;
    degree: string;
    institution: string;
    fieldOfStudy?: string;
    startYear?: string;
    endYear?: string;
    grade?: string;
  }>;
  experience: Array<{
    id?: string;
    company: string;
    position: string;
    startDate?: string;
    endDate?: string;
    description?: string;
  }>;
  projects: Array<{
    id?: string;
    title: string;
    description: string;
    technologies: string[];
    link?: string;
  }>;
  skills: {
    technical: string[];
    programmingLanguages: string[];
    tools: string[];
    softSkills: string[];
  };
  certifications: Array<{
    id?: string;
    name: string;
    organization: string;
    date?: string;
    link?: string;
  }>;
  achievements: string[];
  languages: Array<{
    language: string;
    proficiency: string;
  }>;
  interests: string[];
  createdAt: string;
  updatedAt: string;
}

const ResumeSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, default: 'My Professional Resume' },
    personalInfo: {
      fullName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, default: '' },
      location: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      github: { type: String, default: '' },
      portfolio: { type: String, default: '' },
    },
    summary: { type: String, default: '' },
    education: [
      {
        id: String,
        degree: String,
        institution: String,
        fieldOfStudy: String,
        startYear: String,
        endYear: String,
        grade: String,
      },
    ],
    experience: [
      {
        id: String,
        company: String,
        position: String,
        startDate: String,
        endDate: String,
        description: String,
      },
    ],
    projects: [
      {
        id: String,
        title: String,
        description: String,
        technologies: [String],
        link: String,
      },
    ],
    skills: {
      technical: [String],
      programmingLanguages: [String],
      tools: [String],
      softSkills: [String],
    },
    certifications: [
      {
        id: String,
        name: String,
        organization: String,
        date: String,
        link: String,
      },
    ],
    achievements: [String],
    languages: [
      {
        language: String,
        proficiency: String,
      },
    ],
    interests: [String],
  },
  { timestamps: true }
);

export const ResumeModel = mongoose.models.Resume || mongoose.model('Resume', ResumeSchema);
