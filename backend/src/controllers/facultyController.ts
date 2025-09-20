import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import logger from '../lib/logger';
import { AuthenticatedRequest, ApiResponse, PaginationParams } from '../types';
import { asyncHandler, AppError } from '../middleware/errorHandler';

export const getAllFaculty = asyncHandler(async (req: Request, res: Response) => {
  const {
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    department,
    search,
  } = req.query;

  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  // Build where clause
  const where: any = {};
  if (department) {
    where.department = { contains: department as string, mode: 'insensitive' };
  }
  if (search) {
    where.OR = [
      { user: { name: { contains: search as string, mode: 'insensitive' } } },
      { department: { contains: search as string, mode: 'insensitive' } },
    ];
  }

  const [faculty, total] = await Promise.all([
    prisma.faculty.findMany({
      where,
      skip,
      take,
      orderBy: { [sortBy as string]: sortOrder },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
          },
        },
        subjectsHandled: {
          include: {
            timetableEntries: {
              include: {
                batch: true,
              },
            },
          },
        },
      },
    }),
    prisma.faculty.count({ where }),
  ]);

  const response: ApiResponse = {
    success: true,
    message: 'Faculty retrieved successfully',
    data: {
      faculty,
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

export const getFacultyById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const faculty = await prisma.faculty.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
        },
      },
      subjectsHandled: {
        include: {
          timetableEntries: {
            include: {
              batch: true,
              room: true,
            },
          },
        },
      },
    },
  });

  if (!faculty) {
    throw new AppError('Faculty not found', 404);
  }

  const response: ApiResponse = {
    success: true,
    message: 'Faculty retrieved successfully',
    data: { faculty },
  };

  res.json(response);
});

export const createFaculty = asyncHandler(async (req: Request, res: Response) => {
  const { userId, department, availability, leavesPerMonth } = req.body;

  // Check if user exists and is a faculty
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  if (user.role !== 'FACULTY') {
    throw new AppError('User must have FACULTY role', 400);
  }

  // Check if faculty record already exists
  const existingFaculty = await prisma.faculty.findUnique({
    where: { userId },
  });

  if (existingFaculty) {
    throw new AppError('Faculty record already exists for this user', 409);
  }

  const faculty = await prisma.faculty.create({
    data: {
      userId,
      department,
      availability,
      leavesPerMonth: leavesPerMonth || 2,
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
        },
      },
    },
  });

  logger.info('Faculty created', { facultyId: faculty.id, userId });

  const response: ApiResponse = {
    success: true,
    message: 'Faculty created successfully',
    data: { faculty },
  };

  res.status(201).json(response);
});

export const updateFaculty = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { department, availability, leavesPerMonth } = req.body;

  const faculty = await prisma.faculty.findUnique({
    where: { id },
  });

  if (!faculty) {
    throw new AppError('Faculty not found', 404);
  }

  const updatedFaculty = await prisma.faculty.update({
    where: { id },
    data: {
      ...(department && { department }),
      ...(availability && { availability }),
      ...(leavesPerMonth !== undefined && { leavesPerMonth }),
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
        },
      },
      subjectsHandled: true,
    },
  });

  logger.info('Faculty updated', { facultyId: id });

  const response: ApiResponse = {
    success: true,
    message: 'Faculty updated successfully',
    data: { faculty: updatedFaculty },
  };

  res.json(response);
});

export const deleteFaculty = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const faculty = await prisma.faculty.findUnique({
    where: { id },
  });

  if (!faculty) {
    throw new AppError('Faculty not found', 404);
  }

  // Check if faculty has assigned subjects
  const subjectsCount = await prisma.subject.count({
    where: { facultyId: id },
  });

  if (subjectsCount > 0) {
    throw new AppError('Cannot delete faculty with assigned subjects', 400);
  }

  await prisma.faculty.delete({
    where: { id },
  });

  logger.info('Faculty deleted', { facultyId: id });

  const response: ApiResponse = {
    success: true,
    message: 'Faculty deleted successfully',
  };

  res.json(response);
});

export const getFacultyAvailability = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const faculty = await prisma.faculty.findUnique({
    where: { id },
    select: {
      id: true,
      availability: true,
      user: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!faculty) {
    throw new AppError('Faculty not found', 404);
  }

  const response: ApiResponse = {
    success: true,
    message: 'Faculty availability retrieved successfully',
    data: {
      facultyId: faculty.id,
      facultyName: faculty.user.name,
      availability: faculty.availability,
    },
  };

  res.json(response);
});

export const updateFacultyAvailability = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { availability } = req.body;

  // Check if user is updating their own availability or is admin
  const faculty = await prisma.faculty.findUnique({
    where: { id },
    include: { user: true },
  });

  if (!faculty) {
    throw new AppError('Faculty not found', 404);
  }

  if (req.user!.role !== 'ADMIN' && faculty.userId !== req.user!.id) {
    throw new AppError('You can only update your own availability', 403);
  }

  const updatedFaculty = await prisma.faculty.update({
    where: { id },
    data: { availability },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
        },
      },
    },
  });

  logger.info('Faculty availability updated', { facultyId: id, userId: req.user!.id });

  const response: ApiResponse = {
    success: true,
    message: 'Faculty availability updated successfully',
    data: { faculty: updatedFaculty },
  };

  res.json(response);
});
