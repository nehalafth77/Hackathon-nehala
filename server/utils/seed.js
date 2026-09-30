import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Material from '../models/Material.js';
import Announcement from '../models/Announcement.js';
import Notification from '../models/Notification.js';
import Bookmark from '../models/Bookmark.js';

const SUBJECTS = ['DBMS', 'Operating Systems', 'Computer Networks', 'Java', 'Computer Graphics', 'Data Structures'];

const MATERIALS_DATA = [
  {
    title: 'DBMS Normalization Complete Notes',
    description: 'Comprehensive notes on database normalization including 1NF, 2NF, 3NF, and BCNF with examples',
    subject: 'DBMS',
    topic: 'Normalization',
    unit: 'Unit 3',
    type: 'pdf',
    tags: ['Important', 'Exam', 'Normalization', 'Revision'],
    status: 'verified',
    isOfficial: true,
    isImportant: true,
    usefulCount: 34,
    fileUrl: 'https://www.w3.org/WAI/WCAG21/Techniques/pdf/PDF1',
    fileName: 'DBMS_Normalization_Notes.pdf',
    fileSize: 2400000,
  },
  {
    title: 'OS Deadlock Notes',
    description: 'Complete notes on deadlock prevention, avoidance, detection and recovery with Bankers Algorithm',
    subject: 'Operating Systems',
    topic: 'Deadlock',
    unit: 'Unit 3',
    type: 'pdf',
    tags: ['Important', 'Deadlock', 'Exam', 'OS', 'Unit 3'],
    status: 'verified',
    isOfficial: true,
    isImportant: true,
    usefulCount: 42,
    fileUrl: '',
    fileName: 'OS_Deadlock_Notes.pdf',
    fileSize: 1800000,
  },
  {
    title: 'Computer Networks TCP/UDP Protocol',
    description: 'Detailed comparison of TCP and UDP protocols with use cases and examples',
    subject: 'Computer Networks',
    topic: 'Transport Layer',
    unit: 'Unit 4',
    type: 'pdf',
    tags: ['TCP', 'UDP', 'Networks', 'Important'],
    status: 'verified',
    isOfficial: false,
    usefulCount: 28,
    fileUrl: '',
    fileName: 'CN_TCP_UDP.pdf',
    fileSize: 1200000,
  },
  {
    title: 'Java OOP Concepts',
    description: 'Complete Java Object-Oriented Programming concepts: Inheritance, Polymorphism, Encapsulation, Abstraction',
    subject: 'Java',
    topic: 'OOP',
    unit: 'Unit 2',
    type: 'pdf',
    tags: ['Java', 'OOP', 'Important', 'Revision'],
    status: 'verified',
    isOfficial: true,
    usefulCount: 56,
    fileUrl: '',
    fileName: 'Java_OOP_Notes.pdf',
    fileSize: 2100000,
  },
  {
    title: 'DBMS Question Bank',
    description: 'Previous year questions and expected exam questions for DBMS',
    subject: 'DBMS',
    topic: 'All Topics',
    unit: 'All Units',
    type: 'question-paper',
    tags: ['Question Paper', 'Exam', 'DBMS', 'Important'],
    status: 'verified',
    isOfficial: true,
    isImportant: true,
    usefulCount: 67,
    fileUrl: '',
    fileName: 'DBMS_Question_Bank.pdf',
    fileSize: 980000,
  },
  {
    title: 'Data Structures - Trees & Graphs',
    description: 'Complete guide to trees, binary trees, AVL trees, and graph algorithms',
    subject: 'Data Structures',
    topic: 'Trees and Graphs',
    unit: 'Unit 4',
    type: 'notes',
    tags: ['Trees', 'Graphs', 'DSA', 'Important', 'Revision'],
    status: 'verified',
    isOfficial: false,
    usefulCount: 39,
    fileUrl: '',
    fileName: 'DS_Trees_Graphs.pdf',
    fileSize: 1500000,
  },
  {
    title: 'Computer Graphics Rendering Pipeline',
    description: 'Understanding the graphics rendering pipeline, shaders, and GPU architecture',
    subject: 'Computer Graphics',
    topic: 'Rendering',
    unit: 'Unit 2',
    type: 'pdf',
    tags: ['Graphics', 'Rendering', 'GPU'],
    status: 'verified',
    isOfficial: false,
    usefulCount: 15,
    fileUrl: '',
    fileName: 'CG_Rendering.pdf',
    fileSize: 3200000,
  },
  {
    title: 'OS Process Scheduling Algorithms',
    description: 'FCFS, SJF, Round Robin, Priority scheduling with solved examples',
    subject: 'Operating Systems',
    topic: 'Process Scheduling',
    unit: 'Unit 2',
    type: 'notes',
    tags: ['Scheduling', 'OS', 'Important', 'Algorithms'],
    status: 'pending',
    isOfficial: false,
    usefulCount: 0,
    fileUrl: '',
    fileName: 'OS_Scheduling.pdf',
    fileSize: 890000,
  },
  {
    title: 'CN - OSI Model Layers',
    description: 'Complete explanation of all 7 OSI layers with protocols and functions',
    subject: 'Computer Networks',
    topic: 'OSI Model',
    unit: 'Unit 1',
    type: 'pdf',
    tags: ['OSI', 'Networks', 'Layers', 'Exam'],
    status: 'verified',
    isOfficial: false,
    usefulCount: 31,
    fileUrl: '',
    fileName: 'CN_OSI_Layers.pdf',
    fileSize: 1100000,
  },
  {
    title: 'Java Exception Handling Notes',
    description: 'Try-catch, finally, throw, throws, custom exceptions with examples',
    subject: 'Java',
    topic: 'Exception Handling',
    unit: 'Unit 3',
    type: 'notes',
    tags: ['Java', 'Exceptions', 'Important'],
    status: 'pending',
    isOfficial: false,
    usefulCount: 0,
    fileUrl: '',
    fileName: 'Java_Exceptions.pdf',
    fileSize: 650000,
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Material.deleteMany({});
    await Announcement.deleteMany({});
    await Notification.deleteMany({});
    await Bookmark.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create users
    const teacher1 = await User.create({
      name: 'Prof. Sharma',
      email: 'teacher@studysphere.com',
      password: 'teacher123',
      role: 'teacher',
      college: 'Engineering College',
      course: 'Computer Science',
    });

    const teacher2 = await User.create({
      name: 'Dr. Priya Nair',
      email: 'drpriya@studysphere.com',
      password: 'teacher123',
      role: 'teacher',
      college: 'Engineering College',
      course: 'Computer Science',
    });

    const student1 = await User.create({
      name: 'Rahul Verma',
      email: 'student@studysphere.com',
      password: 'student123',
      role: 'student',
      college: 'Engineering College',
      course: 'B.Tech CSE',
      semester: '5th',
    });

    const student2 = await User.create({
      name: 'Priya Sharma',
      email: 'priya@studysphere.com',
      password: 'student123',
      role: 'student',
      college: 'Engineering College',
      course: 'B.Tech CSE',
      semester: '5th',
    });

    const student3 = await User.create({
      name: 'Arjun Singh',
      email: 'arjun@studysphere.com',
      password: 'student123',
      role: 'student',
      college: 'Engineering College',
      course: 'B.Tech CSE',
      semester: '5th',
    });

    console.log('👥 Created users');

    // Create materials
    const uploaders = [teacher1._id, teacher1._id, student1._id, teacher1._id, teacher2._id, student2._id, teacher2._id, student1._id, student3._id, student2._id];
    const materials = [];

    for (let i = 0; i < MATERIALS_DATA.length; i++) {
      const m = MATERIALS_DATA[i];
      const uploadedBy = uploaders[i];
      const isTeacher = [teacher1._id, teacher2._id].includes(uploadedBy);

      const mat = await Material.create({
        ...m,
        uploadedBy,
        status: isTeacher ? 'verified' : m.status,
        isOfficial: isTeacher ? m.isOfficial : false,
        verifiedBy: m.status === 'verified' ? teacher1._id : undefined,
        verifiedAt: m.status === 'verified' ? new Date() : undefined,
      });
      materials.push(mat);
    }

    console.log('📚 Created materials');

    // Create bookmarks for student1
    await Bookmark.create([
      { user: student1._id, material: materials[0]._id },
      { user: student1._id, material: materials[1]._id },
      { user: student1._id, material: materials[4]._id },
    ]);

    console.log('🔖 Created bookmarks');

    // Create announcements
    await Announcement.create([
      {
        teacher: teacher1._id,
        title: '📢 DBMS Internal Exam Schedule',
        message: 'Unit 1 to Unit 4 will be covered in the upcoming internal exam. Focus on normalization, SQL queries, and ER diagrams.',
        subject: 'DBMS',
        priority: 'high',
        isPinned: true,
      },
      {
        teacher: teacher2._id,
        title: '📢 OS Assignment Submission Deadline',
        message: 'Please submit your OS assignment on process scheduling by this Friday. Late submissions will not be accepted.',
        subject: 'Operating Systems',
        priority: 'high',
        isPinned: false,
      },
      {
        teacher: teacher1._id,
        title: '📚 New Study Materials Uploaded',
        message: 'Official notes for Computer Networks Unit 3-4 have been uploaded. Please review them before the next class.',
        subject: 'Computer Networks',
        priority: 'medium',
        isPinned: false,
      },
    ]);

    console.log('📢 Created announcements');

    // Create notifications for student1
    await Notification.create([
      {
        user: student1._id,
        title: 'Material Approved! 🎉',
        message: 'Your DBMS notes have been approved by Prof. Sharma.',
        type: 'verification',
        isRead: false,
      },
      {
        user: student1._id,
        title: '📢 New Announcement',
        message: 'DBMS Internal Exam Schedule has been posted.',
        type: 'announcement',
        isRead: false,
      },
      {
        user: student1._id,
        title: 'New material uploaded',
        message: 'New Java OOP notes are available for download.',
        type: 'material',
        isRead: true,
      },
    ]);

    console.log('🔔 Created notifications');

    console.log('\n✅ Database seeded successfully!\n');
    console.log('Demo accounts:');
    console.log('  📧 student@studysphere.com | 🔑 student123');
    console.log('  📧 teacher@studysphere.com | 🔑 teacher123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
}

seed();
