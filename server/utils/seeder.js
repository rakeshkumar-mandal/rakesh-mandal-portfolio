const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const Project = require('../models/Project');

const defaultProjects = [
  {
    title: 'AI Resume Builder',
    description: 'Full-stack MERN application that uses Gemini AI to generate professional, ATS-optimized resumes. Includes JWT auth, ImageKit profile uploads, Redux state management, and PDF export.',
    emoji: '🤖',
    gradient: 'linear-gradient(135deg,#0a1628,#1a0540)',
    tags: [
      { name: 'React', type: 'cyan' },
      { name: 'Node.js', type: 'violet' },
      { name: 'MongoDB', type: 'green' },
      { name: 'Gemini AI', type: 'orange' },
      { name: 'Redux', type: 'cyan' },
      { name: 'JWT', type: 'violet' },
    ],
    featured: true, featuredLabel: 'Featured', order: 1,
  },
  {
    title: 'E-Commerce T-Shirt Store',
    description: 'Feature-rich online store with product filtering, cart management, Razorpay payment integration, order tracking, and admin dashboard for inventory management.',
    emoji: '🛒',
    gradient: 'linear-gradient(135deg,#0a1a0a,#001a1a)',
    tags: [
      { name: 'React', type: 'cyan' },
      { name: 'Express.js', type: 'violet' },
      { name: 'MongoDB', type: 'green' },
      { name: 'Razorpay', type: 'orange' },
      { name: 'Tailwind', type: 'cyan' },
    ],
    order: 2,
  },
  {
    title: 'AI Recommendation System',
    description: 'Collaborative filtering + content-based hybrid recommendation engine with React frontend and FastAPI backend. Trained on real user interaction data with >82% accuracy.',
    emoji: '🧠',
    gradient: 'linear-gradient(135deg,#1a0a2e,#0a1a2e)',
    tags: [
      { name: 'Python', type: 'cyan' },
      { name: 'FastAPI', type: 'violet' },
      { name: 'Scikit-learn', type: 'green' },
      { name: 'React', type: 'orange' },
      { name: 'MongoDB', type: 'cyan' },
    ],
    featured: true, featuredLabel: 'AI', order: 3,
  },
  {
    title: 'Mental Health AI App',
    description: 'AI-powered mental wellness companion built with Gemini AI for empathetic conversational support, mood tracking, journaling, and curated coping resources.',
    emoji: '💚',
    gradient: 'linear-gradient(135deg,#1a0a14,#0a1428)',
    tags: [
      { name: 'React', type: 'cyan' },
      { name: 'Gemini AI', type: 'violet' },
      { name: 'Node.js', type: 'green' },
      { name: 'MongoDB', type: 'orange' },
      { name: 'Socket.io', type: 'cyan' },
    ],
    featured: true, featuredLabel: 'Featured', order: 4,
  },
  {
    title: 'Ganesh Manpower Solution',
    description: 'Production staffing agency website for a Delhi-NCR business. Built with React + Vite + Tailwind. Includes WhatsApp integration, dynamic service cards, and a contact form.',
    emoji: '👷',
    gradient: 'linear-gradient(135deg,#0a1a14,#1a1400)',
    tags: [
      { name: 'React', type: 'cyan' },
      { name: 'Vite', type: 'violet' },
      { name: 'Tailwind CSS', type: 'green' },
      { name: 'WhatsApp API', type: 'orange' },
    ],
    order: 5,
  },
  {
    title: 'AI Resume Screening System',
    description: 'BERT-based resume screening system with FastAPI backend and React frontend. Parses PDFs, ranks candidates using NLP similarity scoring, and outputs structured analytics for HR teams.',
    emoji: '🔬',
    gradient: 'linear-gradient(135deg,#001428,#280014)',
    tags: [
      { name: 'BERT', type: 'cyan' },
      { name: 'FastAPI', type: 'violet' },
      { name: 'MongoDB', type: 'green' },
      { name: 'React', type: 'orange' },
      { name: 'NLP', type: 'cyan' },
    ],
    order: 6,
  },
];

const seedDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI not found in .env file. Please create server/.env from server/.env.example');
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');

    // Create admin user
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@portfolio.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Rcb@2027';
    const adminExists = await User.findOne({ email: adminEmail });

    if (!adminExists) {
      await User.create({ email: adminEmail, password: adminPassword, name: 'Admin' });
      console.log(`✅ Admin user created: ${adminEmail}`);
    } else {
      // Force update password so .env changes always take effect
      adminExists.password = adminPassword;
      await adminExists.save();
      console.log(`✅ Admin password updated: ${adminEmail}`);
    }

    // Seed projects
    const projectCount = await Project.countDocuments();
    if (projectCount === 0) {
      await Project.insertMany(defaultProjects);
      console.log(`✅ ${defaultProjects.length} projects seeded`);
    } else {
      console.log(`ℹ️  Projects already exist (${projectCount}). Skipping seed.`);
    }

    console.log('\n🎉 Database seeding complete!');
    console.log(`📧 Admin Email: ${adminEmail}`);
    console.log(`🔑 Admin Password: ${adminPassword}`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
    process.exit(1);
  }
};

seedDB();
