import { Router } from 'express';
import {
  createResume,
  deleteResume,
  getResumeById,
  getResumes,
  updateResume,
} from '../controllers/resumeController';
import { protect } from '../middleware/auth';

const router = Router();

router.use(protect); // All resume routes are protected

router.get('/', getResumes);
router.get('/:id', getResumeById);
router.post('/', createResume);
router.put('/:id', updateResume);
router.delete('/:id', deleteResume);

export default router;
