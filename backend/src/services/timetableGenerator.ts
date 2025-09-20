import prisma from '../lib/prisma';
import logger from '../lib/logger';
import { TimetableGenerationRequest, TimetableGenerationResult, Conflict } from '../types';
import { AppError } from '../middleware/errorHandler';
import { DayOfWeek } from '@prisma/client';

interface TimeSlot {
  start: string;
  end: string;
  duration: number; // in minutes
}

interface FacultyAvailability {
  [day: string]: string[];
}

interface GenerationConstraints {
  avoidConsecutiveClasses: boolean;
  preferMorningSlots: boolean;
  maxDailyHours: number;
}

export class TimetableGenerator {
  private timeSlots: TimeSlot[] = [];
  private days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
  private conflicts: Conflict[] = [];
  private warnings: string[] = [];

  constructor() {
    this.initializeTimeSlots();
  }

  private initializeTimeSlots(): void {
    // Default time slots (can be customized)
    const slotTimes = [
      '08:00-09:00', '09:00-10:00', '10:00-11:00', '11:00-12:00',
      '12:00-13:00', '13:00-14:00', '14:00-15:00', '15:00-16:00',
      '16:00-17:00', '17:00-18:00'
    ];

    this.timeSlots = slotTimes.map(slot => {
      const [start, end] = slot.split('-');
      return {
        start,
        end,
        duration: this.timeToMinutes(end) - this.timeToMinutes(start)
      };
    });
  }

  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  private minutesToTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  }

  async generateTimetable(request: TimetableGenerationRequest): Promise<TimetableGenerationResult> {
    const startTime = Date.now();
    this.conflicts = [];
    this.warnings = [];

    try {
      logger.info('Starting timetable generation', { request });

      // Validate input
      await this.validateGenerationRequest(request);

      // Get all required data
      const batches = await this.getBatches(request.batchIds);
      const subjects = await this.getSubjectsForBatches(batches);
      const faculty = await this.getFacultyForSubjects(subjects);
      const classrooms = await this.getAvailableClassrooms();
      const existingEntries = await this.getExistingTimetableEntries(request.batchIds);

      // Generate timetable
      const timetable = await this.generateTimetableEntries(
        batches,
        subjects,
        faculty,
        classrooms,
        existingEntries,
        request.preferences
      );

      const generationTime = Date.now() - startTime;

      logger.info('Timetable generation completed', {
        entriesGenerated: timetable.length,
        conflicts: this.conflicts.length,
        warnings: this.warnings.length,
        generationTime
      });

      return {
        success: true,
        timetable,
        conflicts: this.conflicts,
        warnings: this.warnings,
        generationTime
      };

    } catch (error) {
      logger.error('Timetable generation failed', error);
      return {
        success: false,
        timetable: [],
        conflicts: this.conflicts,
        warnings: this.warnings,
        generationTime: Date.now() - startTime
      };
    }
  }

  private async validateGenerationRequest(request: TimetableGenerationRequest): Promise<void> {
    if (!request.batchIds || request.batchIds.length === 0) {
      throw new AppError('At least one batch ID is required', 400);
    }

    if (!request.timeSlots || request.timeSlots.length === 0) {
      throw new AppError('At least one time slot is required', 400);
    }

    // Validate time slots format
    for (const slot of request.timeSlots) {
      if (!/^\d{2}:\d{2}-\d{2}:\d{2}$/.test(slot)) {
        throw new AppError(`Invalid time slot format: ${slot}`, 400);
      }
    }
  }

  private async getBatches(batchIds: string[]) {
    const batches = await prisma.batch.findMany({
      where: { id: { in: batchIds } },
      include: {
        students: true,
      },
    });

    if (batches.length !== batchIds.length) {
      throw new AppError('One or more batches not found', 404);
    }

    return batches;
  }

  private async getSubjectsForBatches(batches: any[]) {
    // Get all subjects that need to be scheduled for these batches
    // This would typically be based on curriculum/semester requirements
    const subjects = await prisma.subject.findMany({
      include: {
        faculty: {
          include: {
            user: true,
          },
        },
      },
    });

    return subjects;
  }

  private async getFacultyForSubjects(subjects: any[]) {
    const facultyIds = [...new Set(subjects.map(s => s.facultyId))];
    
    const faculty = await prisma.faculty.findMany({
      where: { id: { in: facultyIds } },
      include: {
        user: true,
      },
    });

    return faculty;
  }

  private async getAvailableClassrooms() {
    return await prisma.classroom.findMany({
      orderBy: { capacity: 'desc' },
    });
  }

  private async getExistingTimetableEntries(batchIds: string[]) {
    return await prisma.timetableEntry.findMany({
      where: { batchId: { in: batchIds } },
      include: {
        batch: true,
        subject: true,
        faculty: true,
        room: true,
      },
    });
  }

  private async generateTimetableEntries(
    batches: any[],
    subjects: any[],
    faculty: any[],
    classrooms: any[],
    existingEntries: any[],
    preferences?: any
  ): Promise<any[]> {
    const timetable: any[] = [];
    const constraints: GenerationConstraints = {
      avoidConsecutiveClasses: preferences?.avoidConsecutiveClasses ?? true,
      preferMorningSlots: preferences?.preferMorningSlots ?? true,
      maxDailyHours: preferences?.maxDailyHours ?? 8,
    };

    // Group subjects by batch (simplified - in real implementation, this would be based on curriculum)
    const subjectsByBatch = this.groupSubjectsByBatch(batches, subjects);

    for (const batch of batches) {
      const batchSubjects = subjectsByBatch[batch.id] || [];
      
      for (const subject of batchSubjects) {
        const entries = await this.scheduleSubject(
          batch,
          subject,
          faculty,
          classrooms,
          existingEntries,
          timetable,
          constraints
        );
        
        timetable.push(...entries);
      }
    }

    return timetable;
  }

  private groupSubjectsByBatch(batches: any[], subjects: any[]): { [batchId: string]: any[] } {
    const grouped: { [batchId: string]: any[] } = {};
    
    // Simplified grouping - in real implementation, this would be based on curriculum
    for (const batch of batches) {
      grouped[batch.id] = subjects.filter(subject => {
        // Example logic: assign subjects based on department and semester
        return subject.faculty.department === batch.department;
      });
    }

    return grouped;
  }

  private async scheduleSubject(
    batch: any,
    subject: any,
    faculty: any[],
    classrooms: any[],
    existingEntries: any[],
    currentTimetable: any[],
    constraints: GenerationConstraints
  ): Promise<any[]> {
    const entries: any[] = [];
    const subjectFaculty = faculty.find(f => f.id === subject.facultyId);
    
    if (!subjectFaculty) {
      this.warnings.push(`No faculty found for subject: ${subject.name}`);
      return entries;
    }

    const facultyAvailability = subjectFaculty.availability as FacultyAvailability;
    const requiredHours = subject.weeklyHours;
    const hoursPerSession = subject.type === 'LAB' ? 2 : 1;
    const requiredSessions = Math.ceil(requiredHours / hoursPerSession);

    let scheduledSessions = 0;

    // Try to schedule each required session
    for (let session = 0; session < requiredSessions && scheduledSessions < requiredSessions; session++) {
      const slot = this.findBestTimeSlot(
        batch,
        subject,
        subjectFaculty,
        classrooms,
        existingEntries,
        currentTimetable,
        facultyAvailability,
        constraints
      );

      if (slot) {
        const entry = await this.createTimetableEntry(
          batch,
          subject,
          subjectFaculty,
          slot.room,
          slot.day,
          slot.timeSlot
        );

        if (entry) {
          entries.push(entry);
          currentTimetable.push(entry);
          scheduledSessions++;
        }
      }
    }

    if (scheduledSessions < requiredSessions) {
      this.warnings.push(
        `Could not schedule all sessions for ${subject.name} in ${batch.department} ${batch.semester}`
      );
    }

    return entries;
  }

  private findBestTimeSlot(
    batch: any,
    subject: any,
    faculty: any,
    classrooms: any[],
    existingEntries: any[],
    currentTimetable: any[],
    facultyAvailability: FacultyAvailability,
    constraints: GenerationConstraints
  ): { day: string; timeSlot: string; room: any } | null {
    
    // Sort days based on preferences
    const sortedDays = this.sortDaysByPreference(constraints);
    
    for (const day of sortedDays) {
      // Check if faculty is available on this day
      if (!facultyAvailability[day.toLowerCase()] || facultyAvailability[day.toLowerCase()].length === 0) {
        continue;
      }

      // Get available time slots for this day
      const availableSlots = this.getAvailableTimeSlots(
        day,
        batch,
        faculty,
        classrooms,
        existingEntries,
        currentTimetable,
        facultyAvailability[day.toLowerCase()]
      );

      if (availableSlots.length > 0) {
        // Return the best available slot
        return availableSlots[0];
      }
    }

    return null;
  }

  private sortDaysByPreference(constraints: GenerationConstraints): string[] {
    if (constraints.preferMorningSlots) {
      // Prefer weekdays over weekends, and earlier in the week
      return ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    }
    return this.days;
  }

  private getAvailableTimeSlots(
    day: string,
    batch: any,
    faculty: any,
    classrooms: any[],
    existingEntries: any[],
    currentTimetable: any[],
    facultyAvailableSlots: string[]
  ): { day: string; timeSlot: string; room: any }[] {
    const availableSlots: { day: string; timeSlot: string; room: any }[] = [];

    for (const timeSlot of this.timeSlots) {
      const timeSlotStr = `${timeSlot.start}-${timeSlot.end}`;
      
      // Check if faculty is available at this time
      if (!this.isFacultyAvailableAtTime(facultyAvailableSlots, timeSlotStr)) {
        continue;
      }

      // Check for conflicts
      if (this.hasConflicts(day, timeSlotStr, batch, faculty, existingEntries, currentTimetable)) {
        continue;
      }

      // Find suitable classroom
      const suitableRoom = this.findSuitableClassroom(
        day,
        timeSlotStr,
        classrooms,
        existingEntries,
        currentTimetable,
        batch.studentCount
      );

      if (suitableRoom) {
        availableSlots.push({
          day,
          timeSlot: timeSlotStr,
          room: suitableRoom,
        });
      }
    }

    return availableSlots;
  }

  private isFacultyAvailableAtTime(availableSlots: string[], timeSlot: string): boolean {
    // Check if the time slot overlaps with faculty's available time
    for (const availableSlot of availableSlots) {
      if (this.timeSlotsOverlap(availableSlot, timeSlot)) {
        return true;
      }
    }
    return false;
  }

  private timeSlotsOverlap(slot1: string, slot2: string): boolean {
    const [start1, end1] = slot1.split('-');
    const [start2, end2] = slot2.split('-');
    
    const start1Minutes = this.timeToMinutes(start1);
    const end1Minutes = this.timeToMinutes(end1);
    const start2Minutes = this.timeToMinutes(start2);
    const end2Minutes = this.timeToMinutes(end2);

    return start1Minutes < end2Minutes && start2Minutes < end1Minutes;
  }

  private hasConflicts(
    day: string,
    timeSlot: string,
    batch: any,
    faculty: any,
    existingEntries: any[],
    currentTimetable: any[]
  ): boolean {
    const allEntries = [...existingEntries, ...currentTimetable];

    // Check batch conflicts
    const batchConflict = allEntries.find(entry => 
      entry.batchId === batch.id && entry.day === day && entry.timeSlot === timeSlot
    );

    if (batchConflict) {
      this.conflicts.push({
        type: 'batch',
        message: `Batch ${batch.department} ${batch.semester} already has a class at ${day} ${timeSlot}`,
        entries: [batchConflict.id],
      });
      return true;
    }

    // Check faculty conflicts
    const facultyConflict = allEntries.find(entry => 
      entry.facultyId === faculty.id && entry.day === day && entry.timeSlot === timeSlot
    );

    if (facultyConflict) {
      this.conflicts.push({
        type: 'faculty',
        message: `Faculty ${faculty.user.name} already has a class at ${day} ${timeSlot}`,
        entries: [facultyConflict.id],
      });
      return true;
    }

    return false;
  }

  private findSuitableClassroom(
    day: string,
    timeSlot: string,
    classrooms: any[],
    existingEntries: any[],
    currentTimetable: any[],
    studentCount: number
  ): any | null {
    const allEntries = [...existingEntries, ...currentTimetable];

    for (const classroom of classrooms) {
      // Check if classroom has enough capacity
      if (classroom.capacity < studentCount) {
        continue;
      }

      // Check if classroom is available
      const roomConflict = allEntries.find(entry => 
        entry.roomId === classroom.id && entry.day === day && entry.timeSlot === timeSlot
      );

      if (!roomConflict) {
        return classroom;
      }
    }

    return null;
  }

  private async createTimetableEntry(
    batch: any,
    subject: any,
    faculty: any,
    room: any,
    day: string,
    timeSlot: string
  ): Promise<any | null> {
    try {
      const entry = await prisma.timetableEntry.create({
        data: {
          batchId: batch.id,
          subjectId: subject.id,
          facultyId: faculty.id,
          roomId: room.id,
          day: day as DayOfWeek,
          timeSlot,
        },
        include: {
          batch: true,
          subject: {
            include: {
              faculty: {
                include: {
                  user: true,
                },
              },
            },
          },
          faculty: {
            include: {
              user: true,
            },
          },
          room: true,
        },
      });

      return entry;
    } catch (error) {
      logger.error('Failed to create timetable entry', error);
      return null;
    }
  }
}
