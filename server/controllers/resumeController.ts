import { Response } from 'express';
import { DB } from '../database/store';
import { AuthRequest } from '../middleware/auth';

/**
 * Get all resumes for current user
 * GET /api/resumes
 */
export async function getResumes(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const resumes = await DB.getResumesByUserId(req.user._id);
    res.json({ success: true, count: resumes.length, resumes });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve resumes.' });
  }
}

/**
 * Get resume by ID
 * GET /api/resumes/:id
 */
export async function getResumeById(req: AuthRequest, res: Response): Promise<void> {
  try {
    const resume = await DB.getResumeById(req.params.id);
    if (!resume) {
      res.status(404).json({ success: false, message: 'Resume not found.' });
      return;
    }

    // Check ownership unless admin
    if (req.user && req.user.role !== 'admin' && resume.userId !== req.user._id) {
      res.status(403).json({ success: false, message: 'Unauthorized to access this resume.' });
      return;
    }

    res.json({ success: true, resume });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve resume.' });
  }
}

/**
 * Create a new resume
 * POST /api/resumes
 */
export async function createResume(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const {
      title,
      personalInfo,
      summary,
      education,
      experience,
      projects,
      skills,
      certifications,
      achievements,
      languages,
      interests,
    } = req.body;

    const resume = await DB.createResume({
      userId: req.user._id,
      title: title || 'My Professional Resume',
      personalInfo: personalInfo || {
        fullName: req.user.name,
        email: req.user.email,
        phone: req.user.phone || '',
        location: req.user.location || '',
      },
      summary: summary || '',
      education: Array.isArray(education) ? education : [],
      experience: Array.isArray(experience) ? experience : [],
      projects: Array.isArray(projects) ? projects : [],
      skills: skills || { technical: [], programmingLanguages: [], tools: [], softSkills: [] },
      certifications: Array.isArray(certifications) ? certifications : [],
      achievements: Array.isArray(achievements) ? achievements : [],
      languages: Array.isArray(languages) ? languages : [],
      interests: Array.isArray(interests) ? interests : [],
    });

    res.status(201).json({
      success: true,
      message: 'Resume created successfully.',
      resume,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to create resume.' });
  }
}

/**
 * Update existing resume
 * PUT /api/resumes/:id
 */
export async function updateResume(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const existing = await DB.getResumeById(req.params.id);
    if (!existing) {
      res.status(404).json({ success: false, message: 'Resume not found.' });
      return;
    }

    if (req.user.role !== 'admin' && existing.userId !== req.user._id) {
      res.status(403).json({ success: false, message: 'Unauthorized to edit this resume.' });
      return;
    }

    const updated = await DB.updateResume(req.params.id, req.body);

    res.json({
      success: true,
      message: 'Resume saved and updated successfully.',
      resume: updated,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to update resume.' });
  }
}

/**
 * Delete resume
 * DELETE /api/resumes/:id
 */
export async function deleteResume(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const existing = await DB.getResumeById(req.params.id);
    if (!existing) {
      res.status(404).json({ success: false, message: 'Resume not found.' });
      return;
    }

    if (req.user.role !== 'admin' && existing.userId !== req.user._id) {
      res.status(403).json({ success: false, message: 'Unauthorized to delete this resume.' });
      return;
    }

    await DB.deleteResume(req.params.id);

    res.json({
      success: true,
      message: 'Resume deleted successfully.',
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to delete resume.' });
  }
}
