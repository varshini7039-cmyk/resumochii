import mongoose from 'mongoose';

export interface IJob {
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
  createdBy?: string;
  department?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const JobSchema = new mongoose.Schema(
  {
    jobId: { type: String, required: true, unique: true },
    title: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    skills: [{ type: String, trim: true }],
    salary: { type: String, default: 'Competitive' },
    employmentType: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'],
      default: 'Full-time',
    },
    experienceLevel: {
      type: String,
      enum: ['Entry-level', 'Mid-level', 'Senior', 'Lead', 'Intern'],
      default: 'Entry-level',
    },
    postedAt: { type: Date, default: Date.now },
    deadline: { type: String, default: '' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    department: { type: String, default: 'Engineering' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const JobModel = mongoose.models.Job || mongoose.model('Job', JobSchema);
