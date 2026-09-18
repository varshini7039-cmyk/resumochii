import { Router } from 'express';
import {
  createJob,
  deleteJob,
  getJobById,
  getJobs,
  updateJob,
} from '../controllers/jobController';
import { adminOnly, protect } from '../middleware/auth';

const router = Router();

// Publicly viewable job listings & details
router.get('/', getJobs);
router.get('/:id', getJobById);

// Admin job management
router.post('/', protect, adminOnly, createJob);
router.put('/:id', protect, adminOnly, updateJob);
router.delete('/:id', protect, adminOnly, deleteJob);

export default router;
