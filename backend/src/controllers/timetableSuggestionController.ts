import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import logger from '../lib/logger';
import { AuthenticatedRequest, ApiResponse } from '../types';
import { asyncHandler, AppError } from '../middleware/errorHandler';

export const createTimetableSuggestion = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { entryId, changes, reason } = req.body;

  // Verify timetable entry exists
  const timetableEntry = await prisma.timetableEntry.findUnique({
    where: { id: entryId },
    include: {
      batch: true,
      subject: true,
      faculty: true,
      room: true,
    },
  });

  if (!timetableEntry) {
    throw new AppError('Timetable entry not found', 404);
  }

  // Validate changes
  const validatedChanges = await validateSuggestionChanges(changes, timetableEntry);

  // Create suggestion
  const suggestion = await prisma.timetableSuggestion.create({
    data: {
      entryId,
      suggestedBy: req.user!.id,
      changes: validatedChanges,
      reason: reason || null,
      status: 'pending',
    },
  });

  logger.info('Timetable suggestion created', {
    suggestionId: suggestion.id,
    entryId,
    suggestedBy: req.user!.id,
  });

  const response: ApiResponse = {
    success: true,
    message: 'Timetable suggestion created successfully',
    data: { suggestion },
  };

  res.status(201).json(response);
});

export const getAllTimetableSuggestions = asyncHandler(async (req: Request, res: Response) => {
  const {
    page = 1,
    limit = 10,
    status,
    entryId,
    suggestedBy,
  } = req.query;

  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  // Build where clause
  const where: any = {};
  if (status) where.status = status;
  if (entryId) where.entryId = entryId;
  if (suggestedBy) where.suggestedBy = suggestedBy;

  const [suggestions, total] = await Promise.all([
    prisma.timetableSuggestion.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.timetableSuggestion.count({ where }),
  ]);

  const response: ApiResponse = {
    success: true,
    message: 'Timetable suggestions retrieved successfully',
    data: {
      suggestions,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    },
  };

  res.json(response);
});

export const getTimetableSuggestionById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const suggestion = await prisma.timetableSuggestion.findUnique({
    where: { id },
  });

  if (!suggestion) {
    throw new AppError('Timetable suggestion not found', 404);
  }

  const response: ApiResponse = {
    success: true,
    message: 'Timetable suggestion retrieved successfully',
    data: { suggestion },
  };

  res.json(response);
});

export const approveTimetableSuggestion = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  const suggestion = await prisma.timetableSuggestion.findUnique({
    where: { id },
  });

  if (!suggestion) {
    throw new AppError('Timetable suggestion not found', 404);
  }

  if (suggestion.status !== 'pending') {
    throw new AppError('Suggestion has already been processed', 400);
  }

  // Get the original timetable entry
  const timetableEntry = await prisma.timetableEntry.findUnique({
    where: { id: suggestion.entryId },
  });

  if (!timetableEntry) {
    throw new AppError('Original timetable entry not found', 404);
  }

  // Check for conflicts with the suggested changes
  const conflicts = await checkSuggestionConflicts(suggestion.changes, suggestion.entryId);

  if (conflicts.length > 0) {
    // Update suggestion status to rejected with conflict details
    await prisma.timetableSuggestion.update({
      where: { id },
      data: {
        status: 'rejected',
        reason: `Rejected due to conflicts: ${conflicts.join(', ')}`,
      },
    });

    throw new AppError(`Cannot approve suggestion due to conflicts: ${conflicts.join(', ')}`, 409);
  }

  // Apply the changes to the timetable entry
  const changes = suggestion.changes as any;
  const updatedEntry = await prisma.timetableEntry.update({
    where: { id: suggestion.entryId },
    data: {
      ...(changes.facultyId && { facultyId: changes.facultyId }),
      ...(changes.roomId && { roomId: changes.roomId }),
      ...(changes.timeSlot && { timeSlot: changes.timeSlot }),
      ...(changes.day && { day: changes.day }),
    },
    include: {
      batch: true,
      subject: true,
      faculty: true,
      room: true,
    },
  });

  // Update suggestion status to approved
  await prisma.timetableSuggestion.update({
    where: { id },
    data: { status: 'approved' },
  });

  logger.info('Timetable suggestion approved', {
    suggestionId: id,
    entryId: suggestion.entryId,
    approvedBy: req.user!.id,
  });

  const response: ApiResponse = {
    success: true,
    message: 'Timetable suggestion approved and applied successfully',
    data: { 
      suggestion: { ...suggestion, status: 'approved' },
      updatedEntry,
    },
  };

  res.json(response);
});

export const rejectTimetableSuggestion = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { reason } = req.body;

  const suggestion = await prisma.timetableSuggestion.findUnique({
    where: { id },
  });

  if (!suggestion) {
    throw new AppError('Timetable suggestion not found', 404);
  }

  if (suggestion.status !== 'pending') {
    throw new AppError('Suggestion has already been processed', 400);
  }

  // Update suggestion status to rejected
  await prisma.timetableSuggestion.update({
    where: { id },
    data: {
      status: 'rejected',
      reason: reason || 'Rejected by administrator',
    },
  });

  logger.info('Timetable suggestion rejected', {
    suggestionId: id,
    rejectedBy: req.user!.id,
    reason,
  });

  const response: ApiResponse = {
    success: true,
    message: 'Timetable suggestion rejected successfully',
    data: { suggestion: { ...suggestion, status: 'rejected' } },
  };

  res.json(response);
});

export const getMyTimetableSuggestions = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { page = 1, limit = 10, status } = req.query;

  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  const where: any = { suggestedBy: req.user!.id };
  if (status) where.status = status;

  const [suggestions, total] = await Promise.all([
    prisma.timetableSuggestion.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.timetableSuggestion.count({ where }),
  ]);

  const response: ApiResponse = {
    success: true,
    message: 'Your timetable suggestions retrieved successfully',
    data: {
      suggestions,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    },
  };

  res.json(response);
});

// Helper function to validate suggestion changes
async function validateSuggestionChanges(changes: any, timetableEntry: any): Promise<any> {
  const validatedChanges: any = {};

  // Validate faculty change
  if (changes.facultyId) {
    const faculty = await prisma.faculty.findUnique({
      where: { id: changes.facultyId },
    });
    if (!faculty) {
      throw new AppError('Invalid faculty ID', 400);
    }
    validatedChanges.facultyId = changes.facultyId;
  }

  // Validate room change
  if (changes.roomId) {
    const room = await prisma.classroom.findUnique({
      where: { id: changes.roomId },
    });
    if (!room) {
      throw new AppError('Invalid room ID', 400);
    }
    validatedChanges.roomId = changes.roomId;
  }

  // Validate time slot change
  if (changes.timeSlot) {
    if (!/^\d{2}:\d{2}-\d{2}:\d{2}$/.test(changes.timeSlot)) {
      throw new AppError('Invalid time slot format', 400);
    }
    validatedChanges.timeSlot = changes.timeSlot;
  }

  // Validate day change
  if (changes.day) {
    const validDays = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    if (!validDays.includes(changes.day)) {
      throw new AppError('Invalid day', 400);
    }
    validatedChanges.day = changes.day;
  }

  return validatedChanges;
}

// Helper function to check for conflicts with suggested changes
async function checkSuggestionConflicts(changes: any, excludeEntryId: string): Promise<string[]> {
  const conflicts: string[] = [];

  if (!changes.day || !changes.timeSlot) {
    return conflicts;
  }

  const where: any = {
    day: changes.day,
    timeSlot: changes.timeSlot,
    id: { not: excludeEntryId },
  };

  // Check faculty conflicts
  if (changes.facultyId) {
    const facultyConflict = await prisma.timetableEntry.findFirst({
      where: { ...where, facultyId: changes.facultyId },
    });
    if (facultyConflict) {
      conflicts.push('Faculty already has a class at this time');
    }
  }

  // Check room conflicts
  if (changes.roomId) {
    const roomConflict = await prisma.timetableEntry.findFirst({
      where: { ...where, roomId: changes.roomId },
    });
    if (roomConflict) {
      conflicts.push('Room already occupied at this time');
    }
  }

  return conflicts;
}
