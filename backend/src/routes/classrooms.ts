import { Router } from 'express';
import {
  getAllClassrooms,
  getClassroomById,
  createClassroom,
  updateClassroom,
  deleteClassroom,
  getClassroomAvailability,
} from '../controllers/classroomController';
import { authenticate, authorize } from '../middleware/auth';
import {
  validateClassroom,
  validateId,
  validatePagination,
} from '../middleware/validation';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Public routes (authenticated users)
router.get('/', validatePagination, getAllClassrooms);
router.get('/:id', validateId, getClassroomById);
router.get('/:id/availability', validateId, getClassroomAvailability);

// Admin only routes
router.post('/', authorize('ADMIN'), validateClassroom, createClassroom);
router.put('/:id', authorize('ADMIN'), validateId, validateClassroom, updateClassroom);
router.delete('/:id', authorize('ADMIN'), validateId, deleteClassroom);

export default router;
