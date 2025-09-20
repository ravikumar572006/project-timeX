import { Router } from 'express';
import {
  getAllFaculty,
  getFacultyById,
  createFaculty,
  updateFaculty,
  deleteFaculty,
  getFacultyAvailability,
  updateFacultyAvailability,
} from '../controllers/facultyController';
import { authenticate, authorize } from '../middleware/auth';
import {
  validateFaculty,
  validateId,
  validatePagination,
} from '../middleware/validation';
import { body } from 'express-validator';
import { handleValidationErrors } from '../middleware/validation';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Public routes (authenticated users)
router.get('/', validatePagination, getAllFaculty);
router.get('/:id', validateId, getFacultyById);
router.get('/:id/availability', validateId, getFacultyAvailability);

// Admin only routes
router.post('/', authorize('ADMIN'), [
  body('userId')
    .isUUID()
    .withMessage('User ID must be a valid UUID'),
  ...validateFaculty,
], createFaculty);

router.put('/:id', authorize('ADMIN'), validateId, [
  body('department')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Department must be between 2 and 100 characters'),
  body('availability')
    .optional()
    .isObject()
    .withMessage('Availability must be a valid object'),
  body('leavesPerMonth')
    .optional()
    .isInt({ min: 0, max: 10 })
    .withMessage('Leaves per month must be between 0 and 10'),
  handleValidationErrors,
], updateFaculty);

router.delete('/:id', authorize('ADMIN'), validateId, deleteFaculty);

// Faculty can update their own availability
router.put('/:id/availability', [
  body('availability')
    .isObject()
    .withMessage('Availability must be a valid object'),
  handleValidationErrors,
], updateFacultyAvailability);

export default router;
