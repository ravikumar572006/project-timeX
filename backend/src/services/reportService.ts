import prisma from '../lib/prisma';
import logger from '../lib/logger';
import { ReportFilters, FacultyWorkloadReport, ClassroomUtilizationReport } from '../types';

export class ReportService {
  async generateFacultyWorkloadReport(filters: ReportFilters = {}): Promise<FacultyWorkloadReport[]> {
    const where: any = {};
    
    if (filters.department) {
      where.department = { contains: filters.department, mode: 'insensitive' };
    }
    
    if (filters.facultyId) {
      where.id = filters.facultyId;
    }

    const faculty = await prisma.faculty.findMany({
      where,
      include: {
        user: {
          select: {
            name: true,
          },
        },
        subjectsHandled: {
          include: {
            timetableEntries: {
              where: this.buildTimetableWhere(filters),
              include: {
                batch: true,
              },
            },
          },
        },
      },
    });

    const reports: FacultyWorkloadReport[] = faculty.map(f => {
      const totalHours = f.subjectsHandled.reduce((sum, subject) => {
        return sum + (subject.timetableEntries.length * this.getHoursPerSession(subject.type));
      }, 0);

      const subjects = f.subjectsHandled.map(subject => ({
        subjectName: subject.name,
        hours: subject.timetableEntries.length * this.getHoursPerSession(subject.type),
        batches: [...new Set(subject.timetableEntries.map(entry => 
          `${entry.batch.department} ${entry.batch.semester}`
        ))],
      }));

      // Calculate utilization (assuming 40 hours per week as full load)
      const utilization = Math.min((totalHours / 40) * 100, 100);

      return {
        facultyId: f.id,
        facultyName: f.user.name,
        department: f.department,
        totalHours,
        subjects,
        utilization: Math.round(utilization * 100) / 100,
      };
    });

    return reports;
  }

  async generateClassroomUtilizationReport(filters: ReportFilters = {}): Promise<ClassroomUtilizationReport[]> {
    const where: any = {};
    
    if (filters.roomId) {
      where.id = filters.roomId;
    }

    const classrooms = await prisma.classroom.findMany({
      where,
      include: {
        timetableEntries: {
          where: this.buildTimetableWhere(filters),
        },
      },
    });

    const reports: ClassroomUtilizationReport[] = classrooms.map(room => {
      const totalBookings = room.timetableEntries.length;
      
      // Calculate utilization based on available time slots
      const availableSlots = this.getAvailableTimeSlots();
      const totalPossibleBookings = availableSlots.length * 6; // 6 days per week
      const utilization = totalPossibleBookings > 0 
        ? (totalBookings / totalPossibleBookings) * 100 
        : 0;

      // Find peak hours
      const timeSlotCounts: { [key: string]: number } = {};
      room.timetableEntries.forEach(entry => {
        timeSlotCounts[entry.timeSlot] = (timeSlotCounts[entry.timeSlot] || 0) + 1;
      });

      const peakHours = Object.entries(timeSlotCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([timeSlot]) => timeSlot);

      // Find available slots
      const usedSlots = new Set(room.timetableEntries.map(entry => 
        `${entry.day}-${entry.timeSlot}`
      ));
      
      const availableTimeSlots = this.getAvailableTimeSlots().filter(slot => {
        for (const day of ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY']) {
          if (!usedSlots.has(`${day}-${slot}`)) {
            return true;
          }
        }
        return false;
      });

      return {
        roomId: room.id,
        roomName: room.name,
        capacity: room.capacity,
        totalBookings,
        utilization: Math.round(utilization * 100) / 100,
        peakHours,
        availableSlots: availableTimeSlots,
      };
    });

    return reports;
  }

  async generateTimetableReport(filters: ReportFilters = {}) {
    const where = this.buildTimetableWhere(filters);

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
      orderBy: [
        { day: 'asc' },
        { timeSlot: 'asc' },
      ],
    });

    // Group by batch
    const groupedByBatch = timetableEntries.reduce((acc, entry) => {
      const key = `${entry.batch.department} ${entry.batch.semester}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(entry);
      return acc;
    }, {} as { [key: string]: any[] });

    // Group by faculty
    const groupedByFaculty = timetableEntries.reduce((acc, entry) => {
      const key = entry.faculty.user.name;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(entry);
      return acc;
    }, {} as { [key: string]: any[] });

    // Group by room
    const groupedByRoom = timetableEntries.reduce((acc, entry) => {
      const key = entry.room.name;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(entry);
      return acc;
    }, {} as { [key: string]: any[] });

    return {
      summary: {
        totalEntries: timetableEntries.length,
        totalBatches: Object.keys(groupedByBatch).length,
        totalFaculty: Object.keys(groupedByFaculty).length,
        totalRooms: Object.keys(groupedByRoom).length,
      },
      byBatch: groupedByBatch,
      byFaculty: groupedByFaculty,
      byRoom: groupedByRoom,
      allEntries: timetableEntries,
    };
  }

  private buildTimetableWhere(filters: ReportFilters): any {
    const where: any = {};

    if (filters.startDate && filters.endDate) {
      // Note: This would need to be implemented based on how dates are stored
      // For now, we'll assume entries are filtered by creation date
      where.createdAt = {
        gte: new Date(filters.startDate),
        lte: new Date(filters.endDate),
      };
    }

    if (filters.batchId) {
      where.batchId = filters.batchId;
    }

    if (filters.facultyId) {
      where.facultyId = filters.facultyId;
    }

    if (filters.roomId) {
      where.roomId = filters.roomId;
    }

    return where;
  }

  private getHoursPerSession(subjectType: string): number {
    switch (subjectType) {
      case 'LAB':
        return 2;
      case 'LECTURE':
      case 'ELECTIVE':
      default:
        return 1;
    }
  }

  private getAvailableTimeSlots(): string[] {
    return [
      '08:00-09:00', '09:00-10:00', '10:00-11:00', '11:00-12:00',
      '12:00-13:00', '13:00-14:00', '14:00-15:00', '15:00-16:00',
      '16:00-17:00', '17:00-18:00'
    ];
  }
}
