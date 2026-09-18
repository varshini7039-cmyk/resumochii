import { Response } from 'express';
import { DB } from '../database/store';
import { AuthRequest } from '../middleware/auth';
import {
  analyzeAndImproveResume,
  matchSkillsWithJob,
  recommendJobsForCandidate,
} from '../services/geminiService';

/**
 * AI Resume Improvement
 * POST /api/ai/improve-resume
 */
export async function improveResume(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const { resumeId, resumeData } = req.body;

    let targetResume = resumeData;
    if (!targetResume && resumeId) {
      targetResume = await DB.getResumeById(resumeId);
    }

    if (!targetResume) {
      // Look for the user's latest resume
      const userResumes = await DB.getResumesByUserId(req.user._id);
      if (userResumes.length > 0) {
        targetResume = userResumes[0];
      }
    }

    if (!targetResume) {
      res.status(400).json({
        success: false,
        message: 'No resume found. Please create or provide resume details first.',
      });
      return;
    }

    const analysis = await analyzeAndImproveResume(targetResume);

    res.json({
      success: true,
      analysis,
    });
  } catch (err: any) {
    console.error('AI resume improvement failed:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to analyze resume with AI. Please try again.',
    });
  }
}

/**
 * AI Job Match
 * POST /api/ai/match-job
 */
export async function matchJob(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const { jobId, resumeId } = req.body;

    if (!jobId) {
      res.status(400).json({ success: false, message: 'Job ID is required for AI matching.' });
      return;
    }

    const job = await DB.getJobById(jobId);
    if (!job) {
      res.status(404).json({ success: false, message: 'Job posting not found.' });
      return;
    }

    // Retrieve resume
    let resume = null;
    if (resumeId) {
      resume = await DB.getResumeById(resumeId);
    } else {
      const userResumes = await DB.getResumesByUserId(req.user._id);
      if (userResumes.length > 0) {
        resume = userResumes[0];
      }
    }

    const userSkills = req.user.skills || [];
    const matchAnalysis = await matchSkillsWithJob(userSkills, resume, job);

    res.json({
      success: true,
      match: matchAnalysis,
    });
  } catch (err: any) {
    console.error('AI job matching failed:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to perform AI job match analysis.',
    });
  }
}

/**
 * AI Job Recommendations
 * POST /api/ai/recommend-jobs
 */
export async function recommendJobs(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const { resumeId } = req.body;

    let resume = null;
    if (resumeId) {
      resume = await DB.getResumeById(resumeId);
    } else {
      const userResumes = await DB.getResumesByUserId(req.user._id);
      if (userResumes.length > 0) {
        resume = userResumes[0];
      }
    }

    const allJobs = await DB.getAllJobs();
    const recommendations = await recommendJobsForCandidate(req.user.skills || [], resume, allJobs);

    res.json({
      success: true,
      count: recommendations.length,
      recommendations,
    });
  } catch (err: any) {
    console.error('AI job recommendation failed:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to generate AI job recommendations.',
    });
  }
}
