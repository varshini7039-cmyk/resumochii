import { Response } from 'express';
import { DB } from '../database/store';
import { AuthRequest } from '../middleware/auth';

/**
 * Get Admin Dashboard Overview Statistics
 * GET /api/admin/dashboard
 */
export async function getDashboard(req: AuthRequest, res: Response): Promise<void> {
  try {
    const stats = await DB.getAdminStats();
    const recentApplications = (await DB.getAllApplications()).slice(0, 5);
    const recentJobs = (await DB.getAllJobs()).slice(0, 5);

    res.json({
      success: true,
      stats,
      recentApplications,
      recentJobs,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to load admin dashboard statistics.' });
  }
}

/**
 * Get all jobs for admin management
 * GET /api/admin/jobs
 */
export async function getAdminJobs(req: AuthRequest, res: Response): Promise<void> {
  try {
    const jobs = await DB.getAllJobs();
    res.json({ success: true, count: jobs.length, jobs });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to load jobs.' });
  }
}

/**
 * Get all job applications for admin review
 * GET /api/admin/applications
 */
export async function getAdminApplications(req: AuthRequest, res: Response): Promise<void> {
  try {
    const applications = await DB.getAllApplications();
    res.json({ success: true, count: applications.length, applications });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to load applications.' });
  }
}

/**
 * Update candidate application status
 * PUT /api/admin/applications/:id/status
 */
export async function updateAppStatus(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { status, notes } = req.body;

    if (!['Applied', 'Under Review', 'Interview', 'Selected', 'Rejected', 'Withdrawn'].includes(status)) {
      res.status(400).json({ success: false, message: 'Invalid status value provided.' });
      return;
    }

    const updated = await DB.updateApplicationStatus(req.params.id, status, notes);
    if (!updated) {
      res.status(404).json({ success: false, message: 'Application not found.' });
      return;
    }

    res.json({
      success: true,
      message: `Application status updated to ${status}.`,
      application: updated,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to update application status.' });
  }
}

/**
 * Get all registered users
 * GET /api/admin/users
 */
export async function getAdminUsers(req: AuthRequest, res: Response): Promise<void> {
  try {
    const users = await DB.getAllUsers();
    res.json({ success: true, count: users.length, users });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to load users.' });
  }
}
