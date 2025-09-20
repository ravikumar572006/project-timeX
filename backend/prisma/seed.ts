import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@neatschedule.com' },
    update: {},
    create: {
      email: 'admin@neatschedule.com',
      password: adminPassword,
      name: 'System Administrator',
      role: 'ADMIN',
    },
  });

  console.log('✅ Admin user created:', adminUser.email);

  // Create sample faculty users
  const facultyData = [
    {
      email: 'john.doe@neatschedule.com',
      name: 'Dr. John Doe',
      department: 'Computer Science',
      availability: {
        monday: ['09:00-17:00'],
        tuesday: ['09:00-17:00'],
        wednesday: ['09:00-17:00'],
        thursday: ['09:00-17:00'],
        friday: ['09:00-17:00'],
        saturday: ['09:00-13:00']
      },
      leavesPerMonth: 2
    },
    {
      email: 'jane.smith@neatschedule.com',
      name: 'Prof. Jane Smith',
      department: 'Mathematics',
      availability: {
        monday: ['08:00-16:00'],
        tuesday: ['08:00-16:00'],
        wednesday: ['08:00-16:00'],
        thursday: ['08:00-16:00'],
        friday: ['08:00-16:00'],
        saturday: []
      },
      leavesPerMonth: 1
    },
    {
      email: 'mike.wilson@neatschedule.com',
      name: 'Dr. Mike Wilson',
      department: 'Physics',
      availability: {
        monday: ['10:00-18:00'],
        tuesday: ['10:00-18:00'],
        wednesday: ['10:00-18:00'],
        thursday: ['10:00-18:00'],
        friday: ['10:00-18:00'],
        saturday: ['10:00-14:00']
      },
      leavesPerMonth: 2
    }
  ];

  const facultyUsers = [];
  for (const faculty of facultyData) {
    const password = await bcrypt.hash('faculty123', 12);
    const user = await prisma.user.upsert({
      where: { email: faculty.email },
      update: {},
      create: {
        email: faculty.email,
        password,
        name: faculty.name,
        role: 'FACULTY',
      },
    });

    const facultyRecord = await prisma.faculty.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        department: faculty.department,
        availability: faculty.availability,
        leavesPerMonth: faculty.leavesPerMonth,
      },
    });

    facultyUsers.push(facultyRecord);
  }

  console.log('✅ Faculty users created:', facultyUsers.length);

  // Create sample classrooms
  const classrooms = [
    { name: 'CS-101', capacity: 60, type: 'LECTURE_HALL' },
    { name: 'CS-102', capacity: 60, type: 'LECTURE_HALL' },
    { name: 'CS-Lab-1', capacity: 30, type: 'LAB' },
    { name: 'CS-Lab-2', capacity: 30, type: 'LAB' },
    { name: 'Math-201', capacity: 80, type: 'LECTURE_HALL' },
    { name: 'Physics-Lab', capacity: 25, type: 'LAB' },
  ];

  const createdClassrooms = [];
  for (const room of classrooms) {
    const classroom = await prisma.classroom.upsert({
      where: { name: room.name },
      update: {},
      create: room as any,
    });
    createdClassrooms.push(classroom);
  }

  console.log('✅ Classrooms created:', createdClassrooms.length);

  // Create sample batches
  const batches = [
    { department: 'Computer Science', semester: 1, studentCount: 45 },
    { department: 'Computer Science', semester: 3, studentCount: 42 },
    { department: 'Computer Science', semester: 5, studentCount: 38 },
    { department: 'Mathematics', semester: 1, studentCount: 35 },
    { department: 'Physics', semester: 1, studentCount: 30 },
  ];

  const createdBatches = [];
  for (const batch of batches) {
    const batchRecord = await prisma.batch.upsert({
      where: {
        department_semester: {
          department: batch.department,
          semester: batch.semester,
        },
      },
      update: {},
      create: batch,
    });
    createdBatches.push(batchRecord);
  }

  console.log('✅ Batches created:', createdBatches.length);

  // Create sample subjects
  const subjects = [
    {
      name: 'Data Structures',
      type: 'LECTURE',
      weeklyHours: 4,
      facultyId: facultyUsers[0].id,
    },
    {
      name: 'Data Structures Lab',
      type: 'LAB',
      weeklyHours: 2,
      facultyId: facultyUsers[0].id,
    },
    {
      name: 'Calculus',
      type: 'LECTURE',
      weeklyHours: 3,
      facultyId: facultyUsers[1].id,
    },
    {
      name: 'Linear Algebra',
      type: 'LECTURE',
      weeklyHours: 3,
      facultyId: facultyUsers[1].id,
    },
    {
      name: 'Mechanics',
      type: 'LECTURE',
      weeklyHours: 3,
      facultyId: facultyUsers[2].id,
    },
    {
      name: 'Physics Lab',
      type: 'LAB',
      weeklyHours: 2,
      facultyId: facultyUsers[2].id,
    },
  ];

  const createdSubjects = [];
  for (const subject of subjects) {
    const subjectRecord = await prisma.subject.create({
      data: subject as any,
    });
    createdSubjects.push(subjectRecord);
  }

  console.log('✅ Subjects created:', createdSubjects.length);

  // Create sample student users
  const studentData = [
    { email: 'student1@neatschedule.com', name: 'Alice Johnson', rollNumber: 'CS2023001', batchId: createdBatches[0].id },
    { email: 'student2@neatschedule.com', name: 'Bob Smith', rollNumber: 'CS2023002', batchId: createdBatches[0].id },
    { email: 'student3@neatschedule.com', name: 'Charlie Brown', rollNumber: 'CS2021001', batchId: createdBatches[1].id },
  ];

  for (const student of studentData) {
    const password = await bcrypt.hash('student123', 12);
    const user = await prisma.user.upsert({
      where: { email: student.email },
      update: {},
      create: {
        email: student.email,
        password,
        name: student.name,
        role: 'STUDENT',
      },
    });

    await prisma.student.upsert({
      where: { rollNumber: student.rollNumber },
      update: {},
      create: {
        userId: user.id,
        batchId: student.batchId,
        rollNumber: student.rollNumber,
      },
    });
  }

  console.log('✅ Student users created:', studentData.length);

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
