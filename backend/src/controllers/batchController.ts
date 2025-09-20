import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import logger from '../lib/logger';
import { ApiResponse } from '../types';
import { asyncHandler, AppError } from '../middleware/errorHandler';

export const getAllBatches = asyncHandler(async (req: Request, res: Response) => {
  const {
    page = 1,
    limit = 10,
    sortBy = 'department',
    sortOrder = 'asc',
    department,
    semester,
    search,
  } = req.query;

  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  // Build where clause
  const where: any = {};
  if (department) {
    where.department = { contains: department as string, mode: 'insensitive' };
  }
  if (semester) {
    where.semester = Number(semester);
  }
  if (search) {
    where.OR = [
      { department: { contains: search as string, mode: 'insensitive' } },
    ];
  }

  const [batches, total] = await Promise.all([
    prisma.batch.findMany({
      where,
      skip,
      take,
      orderBy: { [sortBy as string]: sortOrder },
      include: {
        students: {
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
            room: true,
          },
        },
      },
    }),
    prisma.batch.count({ where }),
  ]);

  const response: ApiResponse = {
    success: true,
    message: 'Batches retrieved successfully',
    data: {
      batches,
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

export const getBatchById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const batch = await prisma.batch.findUnique({
    where: { id },
    include: {
      students: {
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
          room: true,
        },
        orderBy: [
          { day: 'asc' },
          { timeSlot: 'asc' },
        ],
      },
    },
  });

  if (!batch) {
    throw new AppError('Batch not found', 404);
  }

  const response: ApiResponse = {
    success: true,
    message: 'Batch retrieved successfully',
    data: { batch },
  };

  res.json(response);
});

export const createBatch = asyncHandler(async (req: Request, res: Response) => {
  const { department, semester, studentCount } = req.body;

  // Check if batch with same department and semester already exists
  const existingBatch = await prisma.batch.findUnique({
    where: {
      department_semester: {
        department,
        semester,
      },
    },
  });

  if (existingBatch) {
    throw new AppError('Batch with this department and semester already exists', 409);
  }

  const batch = await prisma.batch.create({
    data: {
      department,
      semester,
      studentCount,
    },
  });

  logger.info('Batch created', { batchId: batch.id });

  const response: ApiResponse = {
    success: true,
    message: 'Batch created successfully',
    data: { batch },
  };

  res.status(201).json(response);
});

export const updateBatch = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { department, semester, studentCount } = req.body;

  const batch = await prisma.batch.findUnique({
    where: { id },
  });

  if (!batch) {
    throw new AppError('Batch not found', 404);
  }

  // Check for duplicate department-semester combination if being changed
  if ((department && department !== batch.department) || 
      (semester && semester !== batch.semester)) {
    const existingBatch = await prisma.batch.findUnique({
      where: {
        department_semester: {
          department: department || batch.department,
          semester: semester || batch.semester,
        },
      },
    });

    if (existingBatch && existingBatch.id !== id) {
      throw new AppError('Batch with this department and semester already exists', 409);
    }
  }

  const updatedBatch = await prisma.batch.update({
    where: { id },
    data: {
      ...(department && { department }),
      ...(semester !== undefined && { semester }),
      ...(studentCount !== undefined && { studentCount }),
    },
    include: {
      students: {
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
          room: true,
        },
      },
    },
  });

  logger.info('Batch updated', { batchId: id });

  const response: ApiResponse = {
    success: true,
    message: 'Batch updated successfully',
    data: { batch: updatedBatch },
  };

  res.json(response);
});

export const deleteBatch = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const batch = await prisma.batch.findUnique({
    where: { id },
  });

  if (!batch) {
    throw new AppError('Batch not found', 404);
  }

  // Check if batch has students
  const studentsCount = await prisma.student.count({
    where: { batchId: id },
  });

  if (studentsCount > 0) {
    throw new AppError('Cannot delete batch with existing students', 400);
  }

  // Check if batch has timetable entries
  const timetableEntriesCount = await prisma.timetableEntry.count({
    where: { batchId: id },
  });

  if (timetableEntriesCount > 0) {
    throw new AppError('Cannot delete batch with existing timetable entries', 400);
  }

  await prisma.batch.delete({
    where: { id },
  });

  logger.info('Batch deleted', { batchId: id });

  const response: ApiResponse = {
    success: true,
    message: 'Batch deleted successfully',
  };

  res.json(response);
});

export const getBatchTimetable = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { day } = req.query;

  const batch = await prisma.batch.findUnique({
    where: { id },
  });

  if (!batch) {
    throw new AppError('Batch not found', 404);
  }

  // Build where clause for timetable entries
  const where: any = { batchId: id };
  if (day) where.day = day;

  const timetableEntries = await prisma.timetableEntry.findMany({
    where,
    include: {
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
      room: true,
    },
    orderBy: [
      { day: 'asc' },
      { timeSlot: 'asc' },
    ],
  });

  const response: ApiResponse = {
    success: true,
    message: 'Batch timetable retrieved successfully',
    data: {
      batch: {
        id: batch.id,
        department: batch.department,
        semester: batch.semester,
        studentCount: batch.studentCount,
      },
      timetableEntries,
    },
  };

  res.json(response);
});
