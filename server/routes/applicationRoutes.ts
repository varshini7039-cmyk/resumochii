import { Router } from 'express';
import {
  applyJob,
  deleteApplication,
  getApplications,
  updateApplication,
} from '../controllers/applicationController';
import { protect } from '../middleware/auth';

const router = Router();

router.use(protect); // All application routes require authentication

router.get('/', getApplications);
router.post('/', applyJob);
router.put('/:id', updateApplication);
router.delete('/:id', deleteApplication);

export default router;
