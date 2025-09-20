import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import logger from '../lib/logger';
import { AuthenticatedRequest, ApiResponse, TimetableEntry } from '../types';
import { asyncHandler, AppError } from '../middleware/errorHandler';

export const getAllTimetableEntries = asyncHandler(async (req: Request, res: Response) => {
  const {
    page = 1,
    limit = 10,
    sortBy = 'day',
    sortOrder = 'asc',
    batchId,
    facultyId,
    roomId,
    day,
    timeSlot,
  } = req.query;

  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  // Build where clause
  const where: any = {};
  if (batchId) where.batchId = batchId;
  if (facultyId) where.facultyId = facultyId;
  if (roomId) where.roomId = roomId;
  if (day) where.day = day;
  if (timeSlot) where.timeSlot = timeSlot;

  const [timetableEntries, total] = await Promise.all([
    prisma.timetableEntry.findMany({
      where,
      skip,
      take,
      orderBy: [
        { day: 'asc' },
        { timeSlot: 'asc' },
      ],
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
        faculty: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
        room: true,
      },
    }),
    prisma.timetableEntry.count({ where }),
  ]);

  const response: ApiResponse = {
    success: true,
    message: 'Timetable entries retrieved successfully',
    data: {
      timetableEntries,
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

export const getTimetableEntryById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const timetableEntry = await prisma.timetableEntry.findUnique({
    where: { id },
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
      faculty: {
        include: {
          user: {
            select: {
              name: true,
            },
          },
        },
      },
      room: true,
    },
  });

  if (!timetableEntry) {
    throw new AppError('Timetable entry not found', 404);
  }

  const response: ApiResponse = {
    success: true,
    message: 'Timetable entry retrieved successfully',
    data: { timetableEntry },
  };

  res.json(response);
});

export const createTimetableEntry = asyncHandler(async (req: Request, res: Response) => {
  const { batchId, subjectId, facultyId, roomId, day, timeSlot } = req.body;

  // Check for conflicts
  await checkTimetableConflicts(batchId, facultyId, roomId, day, timeSlot);

  const timetableEntry = await prisma.timetableEntry.create({
    data: {
      batchId,
      subjectId,
      facultyId,
      roomId,
      day,
      timeSlot,
    },
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
      faculty: {
        include: {
          user: {
            select: {
              name: true,
            },
          },
        },
      },
      room: true,
    },
  });

  logger.info('Timetable entry created', { entryId: timetableEntry.id });

  const response: ApiResponse = {
    success: true,
    message: 'Timetable entry created successfully',
    data: { timetableEntry },
  };

  res.status(201).json(response);
});

export const updateTimetableEntry = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { batchId, subjectId, facultyId, roomId, day, timeSlot } = req.body;

  const existingEntry = await prisma.timetableEntry.findUnique({
    where: { id },
  });

  if (!existingEntry) {
    throw new AppError('Timetable entry not found', 404);
  }

  // Check for conflicts (excluding current entry)
  await checkTimetableConflicts(
    batchId || existingEntry.batchId,
    facultyId || existingEntry.facultyId,
    roomId || existingEntry.roomId,
    day || existingEntry.day,
    timeSlot || existingEntry.timeSlot,
    id
  );

  const timetableEntry = await prisma.timetableEntry.update({
    where: { id },
    data: {
      ...(batchId && { batchId }),
      ...(subjectId && { subjectId }),
      ...(facultyId && { facultyId }),
      ...(roomId && { roomId }),
      ...(day && { day }),
      ...(timeSlot && { timeSlot }),
    },
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
      faculty: {
        include: {
          user: {
            select: {
              name: true,
            },
          },
        },
      },
      room: true,
    },
  });

  logger.info('Timetable entry updated', { entryId: id });

  const response: ApiResponse = {
    success: true,
    message: 'Timetable entry updated successfully',
    data: { timetableEntry },
  };

  res.json(response);
});

export const deleteTimetableEntry = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const timetableEntry = await prisma.timetableEntry.findUnique({
    where: { id },
  });

  if (!timetableEntry) {
    throw new AppError('Timetable entry not found', 404);
  }

  await prisma.timetableEntry.delete({
    where: { id },
  });

  logger.info('Timetable entry deleted', { entryId: id });

  const response: ApiResponse = {
    success: true,
    message: 'Timetable entry deleted successfully',
  };

  res.json(response);
});

export const getTimetableByDay = asyncHandler(async (req: Request, res: Response) => {
  const { day } = req.params;
  const { batchId, facultyId, roomId } = req.query;

  const where: any = { day };
  if (batchId) where.batchId = batchId;
  if (facultyId) where.facultyId = facultyId;
  if (roomId) where.roomId = roomId;

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
      faculty: {
        include: {
          user: {
            select: {
              name: true,
            },
          },
        },
      },
      room: true,
    },
    orderBy: { timeSlot: 'asc' },
  });

  const response: ApiResponse = {
    success: true,
    message: 'Timetable entries retrieved successfully',
    data: { timetableEntries },
  };

  res.json(response);
});

export const getTimetableConflicts = asyncHandler(async (req: Request, res: Response) => {
  const { batchId, facultyId, roomId, day, timeSlot } = req.query;

  const conflicts = await findTimetableConflicts(
    batchId as string,
    facultyId as string,
    roomId as string,
    day as string,
    timeSlot as string
  );

  const response: ApiResponse = {
    success: true,
    message: 'Conflict check completed',
    data: { conflicts },
  };

  res.json(response);
});

// Helper function to check for timetable conflicts
async function checkTimetableConflicts(
  batchId: string,
  facultyId: string,
  roomId: string,
  day: string,
  timeSlot: string,
  excludeId?: string
): Promise<void> {
  const conflicts = await findTimetableConflicts(
    batchId,
    facultyId,
    roomId,
    day,
    timeSlot,
    excludeId
  );

  if (conflicts.length > 0) {
    throw new AppError(`Timetable conflicts detected: ${conflicts.join(', ')}`, 409);
  }
}

// Helper function to find timetable conflicts
async function findTimetableConflicts(
  batchId?: string,
  facultyId?: string,
  roomId?: string,
  day?: string,
  timeSlot?: string,
  excludeId?: string
): Promise<string[]> {
  const conflicts: string[] = [];

  if (!day || !timeSlot) {
    return conflicts;
  }

  const where: any = { day, timeSlot };
  if (excludeId) {
    where.id = { not: excludeId };
  }

  // Check batch conflicts
  if (batchId) {
    const batchConflict = await prisma.timetableEntry.findFirst({
      where: { ...where, batchId },
    });
    if (batchConflict) {
      conflicts.push('Batch already has a class at this time');
    }
  }

  // Check faculty conflicts
  if (facultyId) {
    const facultyConflict = await prisma.timetableEntry.findFirst({
      where: { ...where, facultyId },
    });
    if (facultyConflict) {
      conflicts.push('Faculty already has a class at this time');
    }
  }

  // Check room conflicts
  if (roomId) {
    const roomConflict = await prisma.timetableEntry.findFirst({
      where: { ...where, roomId },
    });
    if (roomConflict) {
      conflicts.push('Room already occupied at this time');
    }
  }

  return conflicts;
}
