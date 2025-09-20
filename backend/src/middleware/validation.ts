import { Request, Response, NextFunction } from 'express';
import { body, param, query, validationResult } from 'express-validator';
import { ApiResponse } from '../types';

export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const response: ApiResponse = {
      success: false,
      message: 'Validation failed',
      error: JSON.stringify(errors.array().map(err => ({
        field: err.type === 'field' ? err.path : 'unknown',
        message: err.msg,
        value: err.type === 'field' ? err.value : undefined,
      }))),
    };
    res.status(400).json(response);
    return;
  }
  next();
};

// User validation rules
export const validateUserRegistration = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('role')
    .isIn(['ADMIN', 'FACULTY', 'STUDENT'])
    .withMessage('Role must be ADMIN, FACULTY, or STUDENT'),
  handleValidationErrors,
];

export const validateUserLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors,
];

// Faculty validation rules
export const validateFaculty = [
  body('department')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Department must be between 2 and 100 characters'),
  body('availability')
    .isObject()
    .withMessage('Availability must be a valid object'),
  body('leavesPerMonth')
    .optional()
    .isInt({ min: 0, max: 10 })
    .withMessage('Leaves per month must be between 0 and 10'),
  handleValidationErrors,
];

// Subject validation rules
export const validateSubject = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Subject name must be between 2 and 100 characters'),
  body('type')
    .isIn(['LECTURE', 'LAB', 'ELECTIVE'])
    .withMessage('Subject type must be LECTURE, LAB, or ELECTIVE'),
  body('weeklyHours')
    .isInt({ min: 1, max: 20 })
    .withMessage('Weekly hours must be between 1 and 20'),
  body('facultyId')
    .isUUID()
    .withMessage('Faculty ID must be a valid UUID'),
  handleValidationErrors,
];

// Classroom validation rules
export const validateClassroom = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Classroom name must be between 2 and 50 characters'),
  body('capacity')
    .isInt({ min: 1, max: 500 })
    .withMessage('Capacity must be between 1 and 500'),
  body('type')
    .isIn(['LECTURE_HALL', 'LAB'])
    .withMessage('Room type must be LECTURE_HALL or LAB'),
  handleValidationErrors,
];

// Batch validation rules
export const validateBatch = [
  body('department')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Department must be between 2 and 100 characters'),
  body('semester')
    .isInt({ min: 1, max: 12 })
    .withMessage('Semester must be between 1 and 12'),
  body('studentCount')
    .isInt({ min: 1, max: 200 })
    .withMessage('Student count must be between 1 and 200'),
  handleValidationErrors,
];

// Timetable entry validation rules
export const validateTimetableEntry = [
  body('batchId')
    .isUUID()
    .withMessage('Batch ID must be a valid UUID'),
  body('subjectId')
    .isUUID()
    .withMessage('Subject ID must be a valid UUID'),
  body('facultyId')
    .isUUID()
    .withMessage('Faculty ID must be a valid UUID'),
  body('roomId')
    .isUUID()
    .withMessage('Room ID must be a valid UUID'),
  body('day')
    .isIn(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'])
    .withMessage('Day must be a valid day of the week'),
  body('timeSlot')
    .matches(/^\d{2}:\d{2}-\d{2}:\d{2}$/)
    .withMessage('Time slot must be in format HH:MM-HH:MM'),
  handleValidationErrors,
];

// Timetable generation validation rules
export const validateTimetableGeneration = [
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
  handleValidationErrors,
];

// Parameter validation rules
export const validateId = [
  param('id')
    .isUUID()
    .withMessage('ID must be a valid UUID'),
  handleValidationErrors,
];

// Pagination validation rules
export const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('sortBy')
    .optional()
    .isString()
    .withMessage('Sort by must be a string'),
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc'),
  handleValidationErrors,
];
