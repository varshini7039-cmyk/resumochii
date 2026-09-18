import { Request, Response } from 'express';
import { DB } from '../database/store';
import { AuthRequest } from '../middleware/auth';

/**
 * Get all active jobs with search & filters
 * GET /api/jobs
 */
export async function getJobs(req: Request, res: Response): Promise<void> {
  try {
    const { search, location, skills, employmentType, experienceLevel } = req.query as {
      search?: string;
      location?: string;
      skills?: string;
      employmentType?: string;
      experienceLevel?: string;
    };

    const jobs = await DB.getAllJobs({
      search,
      location,
      skills,
      employmentType,
      experienceLevel,
    });

    res.json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve jobs.' });
  }
}

/**
 * Get single job by ID
 * GET /api/jobs/:id
 */
export async function getJobById(req: Request, res: Response): Promise<void> {
  try {
    const job = await DB.getJobById(req.params.id);
    if (!job) {
      res.status(404).json({ success: false, message: 'Job posting not found.' });
      return;
    }

    res.json({ success: true, job });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve job details.' });
  }
}

/**
 * Create a new job (Admin only)
 * POST /api/jobs
 */
export async function createJob(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { title, company, location, description, skills, salary, employmentType, experienceLevel, deadline, department } = req.body;

    if (!title || !company || !location || !description) {
      res.status(400).json({ success: false, message: 'Title, company, location, and description are required.' });
      return;
    }

    const job = await DB.createJob({
      title: title.trim(),
      company: company.trim(),
      location: location.trim(),
      description,
      skills: Array.isArray(skills) ? skills : typeof skills === 'string' ? skills.split(',').map((s) => s.trim()) : [],
      salary: salary || 'Competitive',
      employmentType: employmentType || 'Full-time',
      experienceLevel: experienceLevel || 'Entry-level',
      deadline: deadline || '',
      department: department || 'Engineering',
      createdBy: req.user?._id,
    });

    res.status(201).json({
      success: true,
      message: 'Job listing published successfully.',
      job,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to create job posting.' });
  }
}

/**
 * Update a job (Admin only)
 * PUT /api/jobs/:id
 */
export async function updateJob(req: AuthRequest, res: Response): Promise<void> {
  try {
    const existing = await DB.getJobById(req.params.id);
    if (!existing) {
      res.status(404).json({ success: false, message: 'Job posting not found.' });
      return;
    }

    const updated = await DB.updateJob(req.params.id, req.body);
    res.json({
      success: true,
      message: 'Job listing updated successfully.',
      job: updated,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to update job posting.' });
  }
}

/**
 * Delete a job (Admin only)
 * DELETE /api/jobs/:id
 */
export async function deleteJob(req: AuthRequest, res: Response): Promise<void> {
  try {
    const existing = await DB.getJobById(req.params.id);
    if (!existing) {
      res.status(404).json({ success: false, message: 'Job posting not found.' });
      return;
    }

    await DB.deleteJob(req.params.id);
    res.json({
      success: true,
      message: 'Job listing deleted successfully.',
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to delete job posting.' });
  }
}
