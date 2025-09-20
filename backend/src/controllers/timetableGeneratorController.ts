import { Request, Response } from 'express';
import { TimetableGenerator } from '../services/timetableGenerator';
import logger from '../lib/logger';
import { AuthenticatedRequest, ApiResponse } from '../types';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import prisma from '../lib/prisma';

const timetableGenerator = new TimetableGenerator();

export const generateTimetable = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { batchIds, startDate, endDate, timeSlots, preferences } = req.body;

  logger.info('Timetable generation requested', {
    userId: req.user!.id,
    batchIds,
    preferences,
  });

  // Validate that all batches exist
  const batches = await prisma.batch.findMany({
    where: { id: { in: batchIds } },
  });

  if (batches.length !== batchIds.length) {
    throw new AppError('One or more batches not found', 404);
  }

  // Generate timetable
  const result = await timetableGenerator.generateTimetable({
    batchIds,
    startDate,
    endDate,
    timeSlots,
    preferences,
  });

  if (!result.success) {
    throw new AppError('Timetable generation failed', 500);
  }

  logger.info('Timetable generation completed', {
    userId: req.user!.id,
    entriesGenerated: result.timetable.length,
    conflicts: result.conflicts.length,
    warnings: result.warnings.length,
  });

  const response: ApiResponse = {
    success: true,
    message: 'Timetable generated successfully',
    data: result,
  };

  res.json(response);
});

export const generateMultipleTimetables = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { batchIds, startDate, endDate, timeSlots, preferences, count = 3 } = req.body;

  logger.info('Multiple timetable generation requested', {
    userId: req.user!.id,
    batchIds,
    count,
  });

  const results = [];
  
  for (let i = 0; i < count; i++) {
    const result = await timetableGenerator.generateTimetable({
      batchIds,
      startDate,
      endDate,
      timeSlots,
      preferences: {
        ...preferences,
        // Add some randomization for different options
        preferMorningSlots: i % 2 === 0,
      },
    });

    results.push({
      option: i + 1,
      ...result,
    });
  }

  logger.info('Multiple timetable generation completed', {
    userId: req.user!.id,
    optionsGenerated: results.length,
  });

  const response: ApiResponse = {
    success: true,
    message: 'Multiple timetable options generated successfully',
    data: { options: results },
  };

  res.json(response);
});

export const approveTimetable = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { timetableEntryIds } = req.body;

  if (!timetableEntryIds || !Array.isArray(timetableEntryIds)) {
    throw new AppError('Timetable entry IDs are required', 400);
  }

  // Verify all entries exist
  const entries = await prisma.timetableEntry.findMany({
    where: { id: { in: timetableEntryIds } },
  });

  if (entries.length !== timetableEntryIds.length) {
    throw new AppError('One or more timetable entries not found', 404);
  }

  // Create a new timetable version
  const version = await prisma.timetableVersion.create({
    data: {
      version: await getNextVersionNumber(),
      isActive: true,
      generatedBy: req.user!.id,
    },
  });

  // Deactivate previous versions
  await prisma.timetableVersion.updateMany({
    where: { isActive: true },
    data: { isActive: false },
  });

  logger.info('Timetable approved', {
    userId: req.user!.id,
    versionId: version.id,
    entriesCount: entries.length,
  });

  const response: ApiResponse = {
    success: true,
    message: 'Timetable approved successfully',
    data: { version },
  };

  res.json(response);
});

export const getTimetableVersions = asyncHandler(async (req: Request, res: Response) => {
  const { page = 1, limit = 10 } = req.query;

  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  const [versions, total] = await Promise.all([
    prisma.timetableVersion.findMany({
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.timetableVersion.count(),
  ]);

  const response: ApiResponse = {
    success: true,
    message: 'Timetable versions retrieved successfully',
    data: {
      versions,
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

export const activateTimetableVersion = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { versionId } = req.params;

  const version = await prisma.timetableVersion.findUnique({
    where: { id: versionId },
  });

  if (!version) {
    throw new AppError('Timetable version not found', 404);
  }

  // Deactivate all versions
  await prisma.timetableVersion.updateMany({
    where: { isActive: true },
    data: { isActive: false },
  });

  // Activate the selected version
  const activatedVersion = await prisma.timetableVersion.update({
    where: { id: versionId },
    data: { isActive: true },
  });

  logger.info('Timetable version activated', {
    userId: req.user!.id,
    versionId,
  });

  const response: ApiResponse = {
    success: true,
    message: 'Timetable version activated successfully',
    data: { version: activatedVersion },
  };

  res.json(response);
});

// Helper function to get next version number
async function getNextVersionNumber(): Promise<number> {
  const latestVersion = await prisma.timetableVersion.findFirst({
    orderBy: { version: 'desc' },
  });

  return latestVersion ? latestVersion.version + 1 : 1;
}
