import { Router } from 'express';
import {
  getAdminApplications,
  getAdminJobs,
  getAdminUsers,
  getDashboard,
  updateAppStatus,
} from '../controllers/adminController';
import {
  createJob,
  deleteJob,
  updateJob,
} from '../controllers/jobController';
import { adminOnly, protect } from '../middleware/auth';

const router = Router();

// Protect all admin routes
router.use(protect, adminOnly);

router.get('/dashboard', getDashboard);
router.get('/jobs', getAdminJobs);
router.post('/jobs', createJob);
router.put('/jobs/:id', updateJob);
router.delete('/jobs/:id', deleteJob);
router.get('/applications', getAdminApplications);
router.put('/applications/:id/status', updateAppStatus);
router.get('/users', getAdminUsers);

export default router;
