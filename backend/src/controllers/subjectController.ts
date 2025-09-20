import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import logger from '../lib/logger';
import { AuthenticatedRequest, ApiResponse } from '../types';
import { asyncHandler, AppError } from '../middleware/errorHandler';

export const getAllSubjects = asyncHandler(async (req: Request, res: Response) => {
  const {
    page = 1,
    limit = 10,
    sortBy = 'name',
    sortOrder = 'asc',
    type,
    facultyId,
    search,
  } = req.query;

  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  // Build where clause
  const where: any = {};
  if (type) {
    where.type = type;
  }
  if (facultyId) {
    where.facultyId = facultyId;
  }
  if (search) {
    where.name = { contains: search as string, mode: 'insensitive' };
  }

  const [subjects, total] = await Promise.all([
    prisma.subject.findMany({
      where,
      skip,
      take,
      orderBy: { [sortBy as string]: sortOrder },
      include: {
        faculty: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        timetableEntries: {
          include: {
            batch: true,
            room: true,
          },
        },
      },
    }),
    prisma.subject.count({ where }),
  ]);

  const response: ApiResponse = {
    success: true,
    message: 'Subjects retrieved successfully',
    data: {
      subjects,
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

export const getSubjectById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const subject = await prisma.subject.findUnique({
    where: { id },
    include: {
      faculty: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
      timetableEntries: {
        include: {
          batch: true,
          room: true,
        },
      },
    },
  });

  if (!subject) {
    throw new AppError('Subject not found', 404);
  }

  const response: ApiResponse = {
    success: true,
    message: 'Subject retrieved successfully',
    data: { subject },
  };

  res.json(response);
});

export const createSubject = asyncHandler(async (req: Request, res: Response) => {
  const { name, type, weeklyHours, facultyId } = req.body;

  // Check if faculty exists
  const faculty = await prisma.faculty.findUnique({
    where: { id: facultyId },
  });

  if (!faculty) {
    throw new AppError('Faculty not found', 404);
  }

  // Check if subject with same name already exists
  const existingSubject = await prisma.subject.findFirst({
    where: {
      name: { equals: name, mode: 'insensitive' },
      facultyId,
    },
  });

  if (existingSubject) {
    throw new AppError('Subject with this name already exists for this faculty', 409);
  }

  const subject = await prisma.subject.create({
    data: {
      name,
      type,
      weeklyHours,
      facultyId,
    },
    include: {
      faculty: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });

  logger.info('Subject created', { subjectId: subject.id, facultyId });

  const response: ApiResponse = {
    success: true,
    message: 'Subject created successfully',
    data: { subject },
  };

  res.status(201).json(response);
});

export const updateSubject = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, type, weeklyHours, facultyId } = req.body;

  const subject = await prisma.subject.findUnique({
    where: { id },
  });

  if (!subject) {
    throw new AppError('Subject not found', 404);
  }

  // If facultyId is being changed, check if new faculty exists
  if (facultyId && facultyId !== subject.facultyId) {
    const faculty = await prisma.faculty.findUnique({
      where: { id: facultyId },
    });

    if (!faculty) {
      throw new AppError('Faculty not found', 404);
    }
  }

  // Check for duplicate name if name is being changed
  if (name && name !== subject.name) {
    const existingSubject = await prisma.subject.findFirst({
      where: {
        name: { equals: name, mode: 'insensitive' },
        facultyId: facultyId || subject.facultyId,
        id: { not: id },
      },
    });

    if (existingSubject) {
      throw new AppError('Subject with this name already exists for this faculty', 409);
    }
  }

  const updatedSubject = await prisma.subject.update({
    where: { id },
    data: {
      ...(name && { name }),
      ...(type && { type }),
      ...(weeklyHours !== undefined && { weeklyHours }),
      ...(facultyId && { facultyId }),
    },
    include: {
      faculty: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
      timetableEntries: {
        include: {
          batch: true,
          room: true,
        },
      },
    },
  });

  logger.info('Subject updated', { subjectId: id });

  const response: ApiResponse = {
    success: true,
    message: 'Subject updated successfully',
    data: { subject: updatedSubject },
  };

  res.json(response);
});

export const deleteSubject = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const subject = await prisma.subject.findUnique({
    where: { id },
  });

  if (!subject) {
    throw new AppError('Subject not found', 404);
  }

  // Check if subject has timetable entries
  const timetableEntriesCount = await prisma.timetableEntry.count({
    where: { subjectId: id },
  });

  if (timetableEntriesCount > 0) {
    throw new AppError('Cannot delete subject with existing timetable entries', 400);
  }

  await prisma.subject.delete({
    where: { id },
  });

  logger.info('Subject deleted', { subjectId: id });

  const response: ApiResponse = {
    success: true,
    message: 'Subject deleted successfully',
  };

  res.json(response);
});

export const getSubjectsByFaculty = asyncHandler(async (req: Request, res: Response) => {
  const { facultyId } = req.params;

  const faculty = await prisma.faculty.findUnique({
    where: { id: facultyId },
  });

  if (!faculty) {
    throw new AppError('Faculty not found', 404);
  }

  const subjects = await prisma.subject.findMany({
    where: { facultyId },
    include: {
      timetableEntries: {
        include: {
          batch: true,
          room: true,
        },
      },
    },
    orderBy: { name: 'asc' },
  });

  const response: ApiResponse = {
    success: true,
    message: 'Subjects retrieved successfully',
    data: { subjects },
  };

  res.json(response);
});
