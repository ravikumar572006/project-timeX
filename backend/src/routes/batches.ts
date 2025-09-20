import { Router } from 'express';
import {
  getAllBatches,
  getBatchById,
  createBatch,
  updateBatch,
  deleteBatch,
  getBatchTimetable,
} from '../controllers/batchController';
import { authenticate, authorize } from '../middleware/auth';
import {
  validateBatch,
  validateId,
  validatePagination,
} from '../middleware/validation';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Public routes (authenticated users)
router.get('/', validatePagination, getAllBatches);
router.get('/:id', validateId, getBatchById);
router.get('/:id/timetable', validateId, getBatchTimetable);

// Admin only routes
router.post('/', authorize('ADMIN'), validateBatch, createBatch);
router.put('/:id', authorize('ADMIN'), validateId, validateBatch, updateBatch);
router.delete('/:id', authorize('ADMIN'), validateId, deleteBatch);

export default router;
