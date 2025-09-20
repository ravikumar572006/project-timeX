import { Router } from 'express';
import {
  createTimetableSuggestion,
  getAllTimetableSuggestions,
  getTimetableSuggestionById,
  approveTimetableSuggestion,
  rejectTimetableSuggestion,
  getMyTimetableSuggestions,
} from '../controllers/timetableSuggestionController';
import { authenticate, authorize } from '../middleware/auth';
import {
  validateId,
  validatePagination,
} from '../middleware/validation';
import { body } from 'express-validator';
import { handleValidationErrors } from '../middleware/validation';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Public routes (authenticated users)
router.post('/', [
  body('entryId')
    .isUUID()
    .withMessage('Entry ID must be a valid UUID'),
  body('changes')
    .isObject()
    .withMessage('Changes must be a valid object'),
  body('changes.facultyId')
    .optional()
    .isUUID()
    .withMessage('Faculty ID must be a valid UUID'),
  body('changes.roomId')
    .optional()
    .isUUID()
    .withMessage('Room ID must be a valid UUID'),
  body('changes.timeSlot')
    .optional()
    .matches(/^\d{2}:\d{2}-\d{2}:\d{2}$/)
    .withMessage('Time slot must be in format HH:MM-HH:MM'),
  body('changes.day')
    .optional()
    .isIn(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'])
    .withMessage('Day must be a valid day of the week'),
  body('reason')
    .optional()
    .isString()
    .isLength({ max: 500 })
    .withMessage('Reason must be a string with maximum 500 characters'),
  handleValidationErrors,
], createTimetableSuggestion);

router.get('/my-suggestions', validatePagination, getMyTimetableSuggestions);
router.get('/:id', validateId, getTimetableSuggestionById);

// Admin only routes
router.get('/', validatePagination, getAllTimetableSuggestions);
router.put('/:id/approve', authorize('ADMIN'), validateId, approveTimetableSuggestion);
router.put('/:id/reject', authorize('ADMIN'), [
  body('reason')
    .optional()
    .isString()
    .isLength({ max: 500 })
    .withMessage('Reason must be a string with maximum 500 characters'),
  handleValidationErrors,
], validateId, rejectTimetableSuggestion);

export default router;
