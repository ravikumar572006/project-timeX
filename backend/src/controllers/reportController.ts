import { Request, Response } from 'express';
import { ReportService } from '../services/reportService';
import { ExportService } from '../services/exportService';
import logger from '../lib/logger';
import { AuthenticatedRequest, ApiResponse, ReportFilters, ExportOptions } from '../types';
import { asyncHandler, AppError } from '../middleware/errorHandler';

const reportService = new ReportService();
const exportService = new ExportService();

export const getFacultyWorkloadReport = asyncHandler(async (req: Request, res: Response) => {
  const filters: ReportFilters = {
    department: req.query.department as string,
    facultyId: req.query.facultyId as string,
    startDate: req.query.startDate as string,
    endDate: req.query.endDate as string,
  };

  const reports = await reportService.generateFacultyWorkloadReport(filters);

  const response: ApiResponse = {
    success: true,
    message: 'Faculty workload report generated successfully',
    data: { reports },
  };

  res.json(response);
});

export const getClassroomUtilizationReport = asyncHandler(async (req: Request, res: Response) => {
  const filters: ReportFilters = {
    roomId: req.query.roomId as string,
    startDate: req.query.startDate as string,
    endDate: req.query.endDate as string,
  };

  const reports = await reportService.generateClassroomUtilizationReport(filters);

  const response: ApiResponse = {
    success: true,
    message: 'Classroom utilization report generated successfully',
    data: { reports },
  };

  res.json(response);
});

export const getTimetableReport = asyncHandler(async (req: Request, res: Response) => {
  const filters: ReportFilters = {
    batchId: req.query.batchId as string,
    facultyId: req.query.facultyId as string,
    roomId: req.query.roomId as string,
    department: req.query.department as string,
    startDate: req.query.startDate as string,
    endDate: req.query.endDate as string,
  };

  const report = await reportService.generateTimetableReport(filters);

  const response: ApiResponse = {
    success: true,
    message: 'Timetable report generated successfully',
    data: { report },
  };

  res.json(response);
});

export const exportReport = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { format, includeDetails, template, filters } = req.body;

  if (!format || !['pdf', 'excel'].includes(format)) {
    throw new AppError('Invalid export format. Must be pdf or excel', 400);
  }

  const exportOptions: ExportOptions = {
    format,
    includeDetails: includeDetails || false,
    template: template || 'standard',
    filters: filters || {},
  };

  logger.info('Export requested', {
    userId: req.user!.id,
    format,
    template,
    includeDetails,
  });

  let buffer: Buffer;
  let filename: string;
  let contentType: string;

  if (format === 'excel') {
    buffer = await exportService.exportToExcel(exportOptions);
    filename = `timetable-report-${Date.now()}.xlsx`;
    contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  } else {
    buffer = await exportService.exportToPDF(exportOptions);
    filename = `timetable-report-${Date.now()}.pdf`;
    contentType = 'application/pdf';
  }

  logger.info('Export completed', {
    userId: req.user!.id,
    format,
    filename,
    size: buffer.length,
  });

  res.setHeader('Content-Type', contentType);
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.setHeader('Content-Length', buffer.length);
  res.send(buffer);
});

export const getReportSummary = asyncHandler(async (req: Request, res: Response) => {
  const filters: ReportFilters = {
    startDate: req.query.startDate as string,
    endDate: req.query.endDate as string,
    department: req.query.department as string,
  };

  const timetableReport = await reportService.generateTimetableReport(filters);
  const facultyReports = await reportService.generateFacultyWorkloadReport(filters);
  const roomReports = await reportService.generateClassroomUtilizationReport(filters);

  const summary = {
    timetable: {
      totalEntries: timetableReport.summary.totalEntries,
      totalBatches: timetableReport.summary.totalBatches,
      totalFaculty: timetableReport.summary.totalFaculty,
      totalRooms: timetableReport.summary.totalRooms,
    },
    faculty: {
      totalFaculty: facultyReports.length,
      averageUtilization: facultyReports.length > 0 
        ? Math.round(facultyReports.reduce((sum, f) => sum + f.utilization, 0) / facultyReports.length * 100) / 100
        : 0,
      overUtilized: facultyReports.filter(f => f.utilization > 100).length,
      underUtilized: facultyReports.filter(f => f.utilization < 50).length,
    },
    classrooms: {
      totalRooms: roomReports.length,
      averageUtilization: roomReports.length > 0
        ? Math.round(roomReports.reduce((sum, r) => sum + r.utilization, 0) / roomReports.length * 100) / 100
        : 0,
      fullyUtilized: roomReports.filter(r => r.utilization >= 90).length,
      underUtilized: roomReports.filter(r => r.utilization < 30).length,
    },
  };

  const response: ApiResponse = {
    success: true,
    message: 'Report summary generated successfully',
    data: { summary },
  };

  res.json(response);
});
