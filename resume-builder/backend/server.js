const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/resumebuilder', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log('MongoDB Error:', err));

// ============================================
// Resume Schema
// ============================================
const resumeSchema = new mongoose.Schema({
  // Personal Information
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  location: String,
  linkedin: String,
  github: String,
  
  // Resume Type
  resumeType: { type: String, enum: ['fresher', 'experienced'], default: 'fresher' },
  
  // Education
  education: [{
    degree: String,
    institution: String,
    year: String,
    grade: String
  }],
  
  // Experience
  experience: [{
    title: String,
    company: String,
    duration: String,
    description: String
  }],
  
  // Skills
  skills: String,
  
  // Projects
  projects: [{
    name: String,
    description: String,
    technologies: String
  }],
  
  // Metadata
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Resume = mongoose.model('Resume', resumeSchema);

// ============================================
// API Routes
// ============================================

// Create a new resume
app.post('/api/resumes', async (req, res) => {
  try {
    const resume = new Resume(req.body);
    await resume.save();
    res.status(201).json({ success: true, data: resume });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Get all resumes
app.get('/api/resumes', async (req, res) => {
  try {
    const resumes = await Resume.find().sort({ updatedAt: -1 });
    res.status(200).json({ success: true, data: resumes });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get a single resume by ID
app.get('/api/resumes/:id', async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) {
      return res.status(404).json({ success: false, error: 'Resume not found' });
    }
    res.status(200).json({ success: true, data: resume });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update a resume
app.put('/api/resumes/:id', async (req, res) => {
  try {
    req.body.updatedAt = Date.now();
    const resume = await Resume.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!resume) {
      return res.status(404).json({ success: false, error: 'Resume not found' });
    }
    res.status(200).json({ success: true, data: resume });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Delete a resume
app.delete('/api/resumes/:id', async (req, res) => {
  try {
    const resume = await Resume.findByIdAndDelete(req.params.id);
    if (!resume) {
      return res.status(404).json({ success: false, error: 'Resume not found' });
    }
    res.status(200).json({ success: true, message: 'Resume deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is running' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
