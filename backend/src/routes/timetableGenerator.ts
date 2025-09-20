import { Router } from 'express';
import {
  generateTimetable,
  generateMultipleTimetables,
  approveTimetable,
  getTimetableVersions,
  activateTimetableVersion,
} from '../controllers/timetableGeneratorController';
import { authenticate, authorize } from '../middleware/auth';
import {
  validateTimetableGeneration,
  validateId,
  validatePagination,
} from '../middleware/validation';
import { body } from 'express-validator';
import { handleValidationErrors } from '../middleware/validation';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Admin only routes
router.post('/generate', authorize('ADMIN'), validateTimetableGeneration, generateTimetable);

router.post('/generate-multiple', authorize('ADMIN'), [
  body('batchIds')
    .isArray({ min: 1 })
    .withMessage('At least one batch ID is required'),
  body('batchIds.*')
    .isUUID()
    .withMessage('Each batch ID must be a valid UUID'),
  body('startDate')
    .isISO8601()
    .withMessage('Start date must be a valid ISO date'),
  body('endDate')
    .isISO8601()
    .withMessage('End date must be a valid ISO date'),
  body('timeSlots')
    .isArray({ min: 1 })
    .withMessage('At least one time slot is required'),
  body('timeSlots.*')
    .matches(/^\d{2}:\d{2}-\d{2}:\d{2}$/)
    .withMessage('Each time slot must be in format HH:MM-HH:MM'),
  body('count')
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage('Count must be between 1 and 10'),
  handleValidationErrors,
], generateMultipleTimetables);

router.post('/approve', authorize('ADMIN'), [
  body('timetableEntryIds')
    .isArray({ min: 1 })
    .withMessage('At least one timetable entry ID is required'),
  body('timetableEntryIds.*')
    .isUUID()
    .withMessage('Each timetable entry ID must be a valid UUID'),
  handleValidationErrors,
], approveTimetable);

router.get('/versions', validatePagination, getTimetableVersions);

router.put('/versions/:versionId/activate', authorize('ADMIN'), validateId, activateTimetableVersion);

export default router;
