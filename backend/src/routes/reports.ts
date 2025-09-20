import { Router } from 'express';
import {
  getFacultyWorkloadReport,
  getClassroomUtilizationReport,
  getTimetableReport,
  exportReport,
  getReportSummary,
} from '../controllers/reportController';
import { authenticate, authorize } from '../middleware/auth';
import {
  validatePagination,
} from '../middleware/validation';
import { body } from 'express-validator';
import { handleValidationErrors } from '../middleware/validation';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Public routes (authenticated users)
router.get('/summary', getReportSummary);
router.get('/faculty-workload', getFacultyWorkloadReport);
router.get('/classroom-utilization', getClassroomUtilizationReport);
router.get('/timetable', getTimetableReport);

// Admin only routes
router.post('/export', authorize('ADMIN'), [
  body('format')
    .isIn(['pdf', 'excel'])
    .withMessage('Format must be either pdf or excel'),
  body('includeDetails')
    .optional()
    .isBoolean()
    .withMessage('Include details must be a boolean'),
  body('template')
    .optional()
    .isIn(['standard', 'detailed', 'summary'])
    .withMessage('Template must be standard, detailed, or summary'),
  body('filters')
    .optional()
    .isObject()
    .withMessage('Filters must be an object'),
  handleValidationErrors,
], exportReport);

export default router;
