import mongoose from 'mongoose';

export interface IApplication {
  _id: string;
  applicationId: string;
  userId: string;
  jobId: string;
  resumeId?: string;
  status: 'Applied' | 'Under Review' | 'Interview' | 'Selected' | 'Rejected' | 'Withdrawn';
  appliedAt: string;
  coverLetter?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

const ApplicationSchema = new mongoose.Schema(
  {
    applicationId: { type: String, required: true, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    resumeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Resume' },
    status: {
      type: String,
      enum: ['Applied', 'Under Review', 'Interview', 'Selected', 'Rejected', 'Withdrawn'],
      default: 'Applied',
    },
    appliedAt: { type: Date, default: Date.now },
    coverLetter: { type: String, default: '' },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

// Prevent duplicate application from same user to same job
ApplicationSchema.index({ userId: 1, jobId: 1 }, { unique: true });

export const ApplicationModel = mongoose.models.Application || mongoose.model('Application', ApplicationSchema);
