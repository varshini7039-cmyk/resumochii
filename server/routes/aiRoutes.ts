import { Router } from 'express';
import {
  improveResume,
  matchJob,
  recommendJobs,
} from '../controllers/aiController';
import { protect } from '../middleware/auth';

const router = Router();

router.use(protect); // AI features require authentication

router.post('/improve-resume', improveResume);
router.post('/match-job', matchJob);
router.post('/recommend-jobs', recommendJobs);

export default router;
