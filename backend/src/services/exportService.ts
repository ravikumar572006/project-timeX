import ExcelJS from 'exceljs';
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { ReportFilters, ExportOptions } from '../types';
import { ReportService } from './reportService';
import logger from '../lib/logger';

export class ExportService {
  private reportService: ReportService;

  constructor() {
    this.reportService = new ReportService();
  }

  async exportToExcel(options: ExportOptions): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    
    try {
      if (options.template === 'detailed' || options.template === 'standard') {
        await this.createDetailedTimetableSheet(workbook, options);
      }
      
      if (options.template === 'summary' || options.template === 'standard') {
        await this.createSummarySheet(workbook, options);
      }

      await this.createFacultyWorkloadSheet(workbook, options);
      await this.createClassroomUtilizationSheet(workbook, options);

      const buffer = await workbook.xlsx.writeBuffer();
      return Buffer.from(buffer);
    } catch (error) {
      logger.error('Excel export failed', error);
      throw error;
    }
  }

  async exportToPDF(options: ExportOptions): Promise<Buffer> {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {
      const page = await browser.newPage();
      
      // Generate HTML content
      const htmlContent = await this.generateHTMLContent(options);
      
      await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
      
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20mm',
          right: '15mm',
          bottom: '20mm',
          left: '15mm',
        },
      });

      return Buffer.from(pdfBuffer);
    } catch (error) {
      logger.error('PDF export failed', error);
      throw error;
    } finally {
      await browser.close();
    }
  }

  private async createDetailedTimetableSheet(workbook: ExcelJS.Workbook, options: ExportOptions): Promise<void> {
    const worksheet = workbook.addWorksheet('Detailed Timetable');
    
    // Get timetable data
    const timetableData = await this.reportService.generateTimetableReport(options.filters);
    
    // Set up headers
    const headers = [
      'Day', 'Time Slot', 'Batch', 'Subject', 'Faculty', 'Room', 'Type'
    ];
    
    worksheet.addRow(headers);
    
    // Style headers
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };

    // Add data rows
    for (const entry of timetableData.allEntries) {
      worksheet.addRow([
        entry.day,
        entry.timeSlot,
        `${entry.batch.department} ${entry.batch.semester}`,
        entry.subject.name,
        entry.faculty.user.name,
        entry.room.name,
        entry.subject.type,
      ]);
    }

    // Auto-fit columns
    worksheet.columns.forEach(column => {
      column.width = 15;
    });
  }

  private async createSummarySheet(workbook: ExcelJS.Workbook, options: ExportOptions): Promise<void> {
    const worksheet = workbook.addWorksheet('Summary');
    
    const timetableData = await this.reportService.generateTimetableReport(options.filters);
    
    // Add summary data
    worksheet.addRow(['Timetable Summary', '']);
    worksheet.addRow(['Total Entries', timetableData.summary.totalEntries]);
    worksheet.addRow(['Total Batches', timetableData.summary.totalBatches]);
    worksheet.addRow(['Total Faculty', timetableData.summary.totalFaculty]);
    worksheet.addRow(['Total Rooms', timetableData.summary.totalRooms]);
    
    // Add batch breakdown
    worksheet.addRow(['', '']);
    worksheet.addRow(['Batch Breakdown', '']);
    worksheet.addRow(['Batch', 'Entries']);
    
    for (const [batch, entries] of Object.entries(timetableData.byBatch)) {
      worksheet.addRow([batch, entries.length]);
    }

    // Style headers
    const headerRows = [1, 7];
    headerRows.forEach(rowNum => {
      const row = worksheet.getRow(rowNum);
      row.font = { bold: true };
      row.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE0E0E0' }
      };
    });
  }

  private async createFacultyWorkloadSheet(workbook: ExcelJS.Workbook, options: ExportOptions): Promise<void> {
    const worksheet = workbook.addWorksheet('Faculty Workload');
    
    const facultyReports = await this.reportService.generateFacultyWorkloadReport(options.filters);
    
    // Headers
    worksheet.addRow(['Faculty Workload Report', '']);
    worksheet.addRow(['Faculty Name', 'Department', 'Total Hours', 'Utilization %']);
    
    // Data rows
    for (const report of facultyReports) {
      worksheet.addRow([
        report.facultyName,
        report.department,
        report.totalHours,
        report.utilization,
      ]);
    }

    // Style headers
    const headerRow = worksheet.getRow(2);
    headerRow.font = { bold: true };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };
  }

  private async createClassroomUtilizationSheet(workbook: ExcelJS.Workbook, options: ExportOptions): Promise<void> {
    const worksheet = workbook.addWorksheet('Classroom Utilization');
    
    const roomReports = await this.reportService.generateClassroomUtilizationReport(options.filters);
    
    // Headers
    worksheet.addRow(['Classroom Utilization Report', '']);
    worksheet.addRow(['Room Name', 'Capacity', 'Total Bookings', 'Utilization %', 'Peak Hours']);
    
    // Data rows
    for (const report of roomReports) {
      worksheet.addRow([
        report.roomName,
        report.capacity,
        report.totalBookings,
        report.utilization,
        report.peakHours.join(', '),
      ]);
    }

    // Style headers
    const headerRow = worksheet.getRow(2);
    headerRow.font = { bold: true };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };
  }

  private async generateHTMLContent(options: ExportOptions): Promise<string> {
    const timetableData = await this.reportService.generateTimetableReport(options.filters);
    const facultyReports = await this.reportService.generateFacultyWorkloadReport(options.filters);
    const roomReports = await this.reportService.generateClassroomUtilizationReport(options.filters);

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Timetable Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #333; text-align: center; }
          h2 { color: #666; border-bottom: 2px solid #ddd; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; font-weight: bold; }
          .summary { background-color: #f9f9f9; padding: 15px; border-radius: 5px; }
          .metric { display: inline-block; margin: 10px 20px; }
          .metric-value { font-size: 24px; font-weight: bold; color: #2196F3; }
          .metric-label { font-size: 14px; color: #666; }
        </style>
      </head>
      <body>
        <h1>NEAT Schedule - Timetable Report</h1>
        
        <div class="summary">
          <h2>Summary</h2>
          <div class="metric">
            <div class="metric-value">${timetableData.summary.totalEntries}</div>
            <div class="metric-label">Total Entries</div>
          </div>
          <div class="metric">
            <div class="metric-value">${timetableData.summary.totalBatches}</div>
            <div class="metric-label">Total Batches</div>
          </div>
          <div class="metric">
            <div class="metric-value">${timetableData.summary.totalFaculty}</div>
            <div class="metric-label">Total Faculty</div>
          </div>
          <div class="metric">
            <div class="metric-value">${timetableData.summary.totalRooms}</div>
            <div class="metric-label">Total Rooms</div>
          </div>
        </div>

        <h2>Faculty Workload</h2>
        <table>
          <thead>
            <tr>
              <th>Faculty Name</th>
              <th>Department</th>
              <th>Total Hours</th>
              <th>Utilization %</th>
            </tr>
          </thead>
          <tbody>
            ${facultyReports.map(report => `
              <tr>
                <td>${report.facultyName}</td>
                <td>${report.department}</td>
                <td>${report.totalHours}</td>
                <td>${report.utilization}%</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <h2>Classroom Utilization</h2>
        <table>
          <thead>
            <tr>
              <th>Room Name</th>
              <th>Capacity</th>
              <th>Total Bookings</th>
              <th>Utilization %</th>
              <th>Peak Hours</th>
            </tr>
          </thead>
          <tbody>
            ${roomReports.map(report => `
              <tr>
                <td>${report.roomName}</td>
                <td>${report.capacity}</td>
                <td>${report.totalBookings}</td>
                <td>${report.utilization}%</td>
                <td>${report.peakHours.join(', ')}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        ${options.includeDetails ? `
          <h2>Detailed Timetable</h2>
          <table>
            <thead>
              <tr>
                <th>Day</th>
                <th>Time Slot</th>
                <th>Batch</th>
                <th>Subject</th>
                <th>Faculty</th>
                <th>Room</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              ${timetableData.allEntries.map(entry => `
                <tr>
                  <td>${entry.day}</td>
                  <td>${entry.timeSlot}</td>
                  <td>${entry.batch.department} ${entry.batch.semester}</td>
                  <td>${entry.subject.name}</td>
                  <td>${entry.faculty.user.name}</td>
                  <td>${entry.room.name}</td>
                  <td>${entry.subject.type}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        ` : ''}

        <div style="margin-top: 30px; text-align: center; color: #666; font-size: 12px;">
          Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}
        </div>
      </body>
      </html>
    `;

    return html;
  }
}
