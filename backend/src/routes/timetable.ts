import { Router } from 'express';
import {
  getAllTimetableEntries,
  getTimetableEntryById,
  createTimetableEntry,
  updateTimetableEntry,
  deleteTimetableEntry,
  getTimetableByDay,
  getTimetableConflicts,
} from '../controllers/timetableController';
import { authenticate, authorize } from '../middleware/auth';
import {
  validateTimetableEntry,
  validateId,
  validatePagination,
} from '../middleware/validation';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Public routes (authenticated users)
router.get('/', validatePagination, getAllTimetableEntries);
router.get('/conflicts', getTimetableConflicts);
router.get('/day/:day', getTimetableByDay);
router.get('/:id', validateId, getTimetableEntryById);

// Admin only routes
router.post('/', authorize('ADMIN'), validateTimetableEntry, createTimetableEntry);
router.put('/:id', authorize('ADMIN'), validateId, validateTimetableEntry, updateTimetableEntry);
router.delete('/:id', authorize('ADMIN'), validateId, deleteTimetableEntry);

export default router;
