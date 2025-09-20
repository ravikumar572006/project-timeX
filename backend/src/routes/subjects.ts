import { Router } from 'express';
import {
  getAllSubjects,
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject,
  getSubjectsByFaculty,
} from '../controllers/subjectController';
import { authenticate, authorize } from '../middleware/auth';
import {
  validateSubject,
  validateId,
  validatePagination,
} from '../middleware/validation';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Public routes (authenticated users)
router.get('/', validatePagination, getAllSubjects);
router.get('/:id', validateId, getSubjectById);
router.get('/faculty/:facultyId', validateId, getSubjectsByFaculty);

// Admin only routes
router.post('/', authorize('ADMIN'), validateSubject, createSubject);
router.put('/:id', authorize('ADMIN'), validateId, validateSubject, updateSubject);
router.delete('/:id', authorize('ADMIN'), validateId, deleteSubject);

export default router;
