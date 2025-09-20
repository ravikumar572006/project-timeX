import { Request } from 'express';
import { UserRole } from '@prisma/client';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: UserRole;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface TimetableGenerationRequest {
  batchIds: string[];
  startDate: string;
  endDate: string;
  timeSlots: string[];
  preferences?: {
    avoidConsecutiveClasses?: boolean;
    preferMorningSlots?: boolean;
    maxDailyHours?: number;
  };
}

export interface TimetableGenerationResult {
  success: boolean;
  timetable: TimetableEntry[];
  conflicts: Conflict[];
  warnings: string[];
  generationTime: number;
}

export interface Conflict {
  type: 'faculty' | 'room' | 'batch';
  message: string;
  entries: string[];
}

export interface TimetableEntry {
  id: string;
  batchId: string;
  subjectId: string;
  facultyId: string;
  roomId: string;
  day: string;
  timeSlot: string;
  batch?: {
    department: string;
    semester: number;
  };
  subject?: {
    name: string;
    type: string;
  };
  faculty?: {
    name: string;
    department: string;
  };
  room?: {
    name: string;
    capacity: number;
    type: string;
  };
}

export interface FacultyAvailability {
  [day: string]: string[];
}

export interface TimetableSuggestion {
  id: string;
  entryId: string;
  suggestedBy: string;
  changes: {
    facultyId?: string;
    roomId?: string;
    timeSlot?: string;
    day?: string;
  };
  reason?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
}

export interface ReportFilters {
  startDate?: string;
  endDate?: string;
  department?: string;
  facultyId?: string;
  batchId?: string;
  roomId?: string;
}

export interface FacultyWorkloadReport {
  facultyId: string;
  facultyName: string;
  department: string;
  totalHours: number;
  subjects: Array<{
    subjectName: string;
    hours: number;
    batches: string[];
  }>;
  utilization: number; // percentage
}

export interface ClassroomUtilizationReport {
  roomId: string;
  roomName: string;
  capacity: number;
  totalBookings: number;
  utilization: number; // percentage
  peakHours: string[];
  availableSlots: string[];
}

export interface ExportOptions {
  format: 'pdf' | 'excel';
  includeDetails?: boolean;
  filters?: ReportFilters;
  template?: 'standard' | 'detailed' | 'summary';
}
