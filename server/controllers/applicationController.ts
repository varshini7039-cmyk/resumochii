import { Response } from 'express';
import { DB } from '../database/store';
import { AuthRequest } from '../middleware/auth';

/**
 * Get user applications
 * GET /api/applications
 */
export async function getApplications(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const applications = await DB.getApplicationsByUserId(req.user._id);

    // Calculate tracker stats
    const stats = {
      total: applications.length,
      underReview: applications.filter((a) => a.status === 'Under Review').length,
      interview: applications.filter((a) => a.status === 'Interview').length,
      selected: applications.filter((a) => a.status === 'Selected').length,
      rejected: applications.filter((a) => a.status === 'Rejected').length,
      applied: applications.filter((a) => a.status === 'Applied').length,
    };

    res.json({
      success: true,
      count: applications.length,
      stats,
      applications,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve applications.' });
  }
}

/**
 * Apply to a job
 * POST /api/applications
 */
export async function applyJob(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const { jobId, resumeId, coverLetter } = req.body;

    if (!jobId) {
      res.status(400).json({ success: false, message: 'Job ID is required.' });
      return;
    }

    // Verify job exists
    const job = await DB.getJobById(jobId);
    if (!job) {
      res.status(404).json({ success: false, message: 'Job posting not found.' });
      return;
    }

    // Pick resume if not specified
    let selectedResumeId = resumeId;
    if (!selectedResumeId) {
      const userResumes = await DB.getResumesByUserId(req.user._id);
      if (userResumes.length > 0) {
        selectedResumeId = userResumes[0]._id;
      }
    }

    const result = await DB.createApplication({
      userId: req.user._id,
      jobId,
      resumeId: selectedResumeId,
      coverLetter,
    });

    if (result.error) {
      res.status(400).json({ success: false, message: result.error });
      return;
    }

    res.status(201).json({
      success: true,
      message: `Successfully applied for ${job.title} at ${job.company}!`,
      application: result.application,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to submit application.' });
  }
}

/**
 * Update application (e.g. withdraw by user or update notes)
 * PUT /api/applications/:id
 */
export async function updateApplication(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const app = await DB.getApplicationById(req.params.id);
    if (!app) {
      res.status(404).json({ success: false, message: 'Application not found.' });
      return;
    }

    if (req.user.role !== 'admin' && app.userId !== req.user._id) {
      res.status(403).json({ success: false, message: 'Unauthorized.' });
      return;
    }

    const { status, notes } = req.body;

    // Normal users can only withdraw
    let targetStatus = status;
    if (req.user.role !== 'admin' && status !== 'Withdrawn') {
      targetStatus = 'Withdrawn';
    }

    const updated = await DB.updateApplicationStatus(req.params.id, targetStatus, notes);

    res.json({
      success: true,
      message: 'Application updated.',
      application: updated,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to update application.' });
  }
}

/**
 * Delete application
 * DELETE /api/applications/:id
 */
export async function deleteApplication(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const app = await DB.getApplicationById(req.params.id);
    if (!app) {
      res.status(404).json({ success: false, message: 'Application not found.' });
      return;
    }

    if (req.user.role !== 'admin' && app.userId !== req.user._id) {
      res.status(403).json({ success: false, message: 'Unauthorized.' });
      return;
    }

    await DB.updateApplicationStatus(req.params.id, 'Withdrawn', 'Withdrawn by candidate');

    res.json({ success: true, message: 'Application withdrawn successfully.' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to withdraw application.' });
  }
}
