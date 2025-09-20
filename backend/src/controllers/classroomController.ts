import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import logger from '../lib/logger';
import { ApiResponse } from '../types';
import { asyncHandler, AppError } from '../middleware/errorHandler';

export const getAllClassrooms = asyncHandler(async (req: Request, res: Response) => {
  const {
    page = 1,
    limit = 10,
    sortBy = 'name',
    sortOrder = 'asc',
    type,
    minCapacity,
    maxCapacity,
    search,
  } = req.query;

  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  // Build where clause
  const where: any = {};
  if (type) {
    where.type = type;
  }
  if (minCapacity || maxCapacity) {
    where.capacity = {};
    if (minCapacity) where.capacity.gte = Number(minCapacity);
    if (maxCapacity) where.capacity.lte = Number(maxCapacity);
  }
  if (search) {
    where.name = { contains: search as string, mode: 'insensitive' };
  }

  const [classrooms, total] = await Promise.all([
    prisma.classroom.findMany({
      where,
      skip,
      take,
      orderBy: { [sortBy as string]: sortOrder },
      include: {
        timetableEntries: {
          include: {
            batch: true,
            subject: {
              include: {
                faculty: {
                  include: {
                    user: {
                      select: {
                        name: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    }),
    prisma.classroom.count({ where }),
  ]);

  const response: ApiResponse = {
    success: true,
    message: 'Classrooms retrieved successfully',
    data: {
      classrooms,
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

export const getClassroomById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const classroom = await prisma.classroom.findUnique({
    where: { id },
    include: {
      timetableEntries: {
        include: {
          batch: true,
          subject: {
            include: {
              faculty: {
                include: {
                  user: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
            },
          },
        },
        orderBy: [
          { day: 'asc' },
          { timeSlot: 'asc' },
        ],
      },
    },
  });

  if (!classroom) {
    throw new AppError('Classroom not found', 404);
  }

  const response: ApiResponse = {
    success: true,
    message: 'Classroom retrieved successfully',
    data: { classroom },
  };

  res.json(response);
});

export const createClassroom = asyncHandler(async (req: Request, res: Response) => {
  const { name, capacity, type } = req.body;

  // Check if classroom with same name already exists
  const existingClassroom = await prisma.classroom.findUnique({
    where: { name },
  });

  if (existingClassroom) {
    throw new AppError('Classroom with this name already exists', 409);
  }

  const classroom = await prisma.classroom.create({
    data: {
      name,
      capacity,
      type,
    },
  });

  logger.info('Classroom created', { classroomId: classroom.id });

  const response: ApiResponse = {
    success: true,
    message: 'Classroom created successfully',
    data: { classroom },
  };

  res.status(201).json(response);
});

export const updateClassroom = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, capacity, type } = req.body;

  const classroom = await prisma.classroom.findUnique({
    where: { id },
  });

  if (!classroom) {
    throw new AppError('Classroom not found', 404);
  }

  // Check for duplicate name if name is being changed
  if (name && name !== classroom.name) {
    const existingClassroom = await prisma.classroom.findUnique({
      where: { name },
    });

    if (existingClassroom) {
      throw new AppError('Classroom with this name already exists', 409);
    }
  }

  const updatedClassroom = await prisma.classroom.update({
    where: { id },
    data: {
      ...(name && { name }),
      ...(capacity !== undefined && { capacity }),
      ...(type && { type }),
    },
    include: {
      timetableEntries: {
        include: {
          batch: true,
          subject: {
            include: {
              faculty: {
                include: {
                  user: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  logger.info('Classroom updated', { classroomId: id });

  const response: ApiResponse = {
    success: true,
    message: 'Classroom updated successfully',
    data: { classroom: updatedClassroom },
  };

  res.json(response);
});

export const deleteClassroom = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const classroom = await prisma.classroom.findUnique({
    where: { id },
  });

  if (!classroom) {
    throw new AppError('Classroom not found', 404);
  }

  // Check if classroom has timetable entries
  const timetableEntriesCount = await prisma.timetableEntry.count({
    where: { roomId: id },
  });

  if (timetableEntriesCount > 0) {
    throw new AppError('Cannot delete classroom with existing timetable entries', 400);
  }

  await prisma.classroom.delete({
    where: { id },
  });

  logger.info('Classroom deleted', { classroomId: id });

  const response: ApiResponse = {
    success: true,
    message: 'Classroom deleted successfully',
  };

  res.json(response);
});

export const getClassroomAvailability = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { day, timeSlot } = req.query;

  const classroom = await prisma.classroom.findUnique({
    where: { id },
  });

  if (!classroom) {
    throw new AppError('Classroom not found', 404);
  }

  // Build where clause for timetable entries
  const where: any = { roomId: id };
  if (day) where.day = day;
  if (timeSlot) where.timeSlot = timeSlot;

  const timetableEntries = await prisma.timetableEntry.findMany({
    where,
    include: {
      batch: true,
      subject: {
        include: {
          faculty: {
            include: {
              user: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: [
      { day: 'asc' },
      { timeSlot: 'asc' },
    ],
  });

  const response: ApiResponse = {
    success: true,
    message: 'Classroom availability retrieved successfully',
    data: {
      classroom: {
        id: classroom.id,
        name: classroom.name,
        capacity: classroom.capacity,
        type: classroom.type,
      },
      timetableEntries,
    },
  };

  res.json(response);
});
