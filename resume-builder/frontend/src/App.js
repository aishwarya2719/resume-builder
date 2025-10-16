import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FileText, Download, User, Briefcase, GraduationCap, Award, Code, Save, List } from 'lucide-react';
import './App.css';

const API_URL = 'http://localhost:5000/api';

function App() {
  const [activeTab, setActiveTab] = useState('fresher');
  const [savedResumes, setSavedResumes] = useState([]);
  const [currentResumeId, setCurrentResumeId] = useState(null);
  const [showSavedResumes, setShowSavedResumes] = useState(false);
  
  // Personal Information
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [github, setGithub] = useState('');
  
  // Education
  const [education, setEducation] = useState([{ 
    degree: '', 
    institution: '', 
    year: '', 
    grade: '' 
  }]);
  
  // Experience
  const [experience, setExperience] = useState([{
    title: '',
    company: '',
    duration: '',
    description: ''
  }]);
  
  // Skills
  const [skills, setSkills] = useState('');
  
  // Projects
  const [projects, setProjects] = useState([{
    name: '',
    description: '',
    technologies: ''
  }]);

  // Load saved resumes on component mount
  useEffect(() => {
    fetchSavedResumes();
  }, []);

  const fetchSavedResumes = async () => {
    try {
      const response = await axios.get(`${API_URL}/resumes`);
      setSavedResumes(response.data.data);
    } catch (error) {
      console.error('Error fetching resumes:', error);
    }
  };

  const saveResume = async () => {
    const resumeData = {
      fullName,
      email,
      phone,
      location,
      linkedin,
      github,
      resumeType: activeTab,
      education,
      experience,
      skills,
      projects
    };

    try {
      if (currentResumeId) {
        // Update existing resume
        const response = await axios.put(`${API_URL}/resumes/${currentResumeId}`, resumeData);
        alert('Resume updated successfully!');
      } else {
        // Create new resume
        const response = await axios.post(`${API_URL}/resumes`, resumeData);
        setCurrentResumeId(response.data.data._id);
        alert('Resume saved successfully!');
      }
      fetchSavedResumes();
    } catch (error) {
      console.error('Error saving resume:', error);
      alert('Failed to save resume. Please try again.');
    }
  };

  const loadResume = async (id) => {
    try {
      const response = await axios.get(`${API_URL}/resumes/${id}`);
      const resume = response.data.data;
      
      setFullName(resume.fullName);
      setEmail(resume.email);
      setPhone(resume.phone || '');
      setLocation(resume.location || '');
      setLinkedin(resume.linkedin || '');
      setGithub(resume.github || '');
      setActiveTab(resume.resumeType);
      setEducation(resume.education.length > 0 ? resume.education : [{ degree: '', institution: '', year: '', grade: '' }]);
      setExperience(resume.experience.length > 0 ? resume.experience : [{ title: '', company: '', duration: '', description: '' }]);
      setSkills(resume.skills || '');
      setProjects(resume.projects.length > 0 ? resume.projects : [{ name: '', description: '', technologies: '' }]);
      setCurrentResumeId(id);
      setShowSavedResumes(false);
    } catch (error) {
      console.error('Error loading resume:', error);
      alert('Failed to load resume.');
    }
  };

  const deleteResume = async (id) => {
    if (window.confirm('Are you sure you want to delete this resume?')) {
      try {
        await axios.delete(`${API_URL}/resumes/${id}`);
        fetchSavedResumes();
        if (currentResumeId === id) {
          clearForm();
        }
        alert('Resume deleted successfully!');
      } catch (error) {
        console.error('Error deleting resume:', error);
        alert('Failed to delete resume.');
      }
    }
  };

  const clearForm = () => {
    setFullName('');
    setEmail('');
    setPhone('');
    setLocation('');
    setLinkedin('');
    setGithub('');
    setEducation([{ degree: '', institution: '', year: '', grade: '' }]);
    setExperience([{ title: '', company: '', duration: '', description: '' }]);
    setSkills('');
    setProjects([{ name: '', description: '', technologies: '' }]);
    setCurrentResumeId(null);
  };

  const addEducation = () => {
    setEducation([...education, { degree: '', institution: '', year: '', grade: '' }]);
  };

  const updateEducation = (index, field, value) => {
    const newEducation = [...education];
    newEducation[index][field] = value;
    setEducation(newEducation);
  };

  const removeEducation = (index) => {
    if (education.length > 1) {
      setEducation(education.filter((_, i) => i !== index));
    }
  };

  const addExperience = () => {
    setExperience([...experience, { title: '', company: '', duration: '', description: '' }]);
  };

  const updateExperience = (index, field, value) => {
    const newExperience = [...experience];
    newExperience[index][field] = value;
    setExperience(newExperience);
  };

  const removeExperience = (index) => {
    if (experience.length > 1) {
      setExperience(experience.filter((_, i) => i !== index));
    }
  };

  const addProject = () => {
    setProjects([...projects, { name: '', description: '', technologies: '' }]);
  };

  const updateProject = (index, field, value) => {
    const newProjects = [...projects];
    newProjects[index][field] = value;
    setProjects(newProjects);
  };

  const removeProject = (index) => {
    if (projects.length > 1) {
      setProjects(projects.filter((_, i) => i !== index));
    }
  };

  const handleDownload = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-orange-100 to-amber-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-rose-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Resume Builder</h1>
                <p className="text-gray-600">Create professional resumes instantly</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowSavedResumes(!showSavedResumes)}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <List className="w-4 h-4" />
                Saved Resumes ({savedResumes.length})
              </button>
              <button
                onClick={saveResume}
                className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                Save Resume
              </button>
              <button
                onClick={clearForm}
                className="flex items-center gap-2 bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                New Resume
              </button>
            </div>
          </div>
        </div>

        {/* Saved Resumes List */}
        {showSavedResumes && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Your Saved Resumes</h2>
            {savedResumes.length === 0 ? (
              <p className="text-gray-500">No saved resumes yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedResumes.map((resume) => (
                  <div key={resume._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <h3 className="font-semibold text-lg mb-2">{resume.fullName}</h3>
                    <p className="text-sm text-gray-600 mb-1">{resume.email}</p>
                    <p className="text-xs text-gray-500 mb-3">
                      Updated: {new Date(resume.updatedAt).toLocaleDateString()}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => loadResume(resume._id)}
                        className="flex-1 bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
                      >
                        Load
                      </button>
                      <button
                        onClick={() => deleteResume(resume._id)}
                        className="bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab Selection */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('fresher')}
            className={`px-8 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'fresher'
                ? 'bg-gray-800 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Fresher
          </button>
          <button
            onClick={() => setActiveTab('experienced')}
            className={`px-8 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'experienced'
                ? 'bg-gray-800 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Experienced
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Information Panel */}
          <div className="bg-white rounded-2xl shadow-lg p-6 max-h-[800px] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Information</h2>
            <p className="text-gray-500 text-sm mb-6">Complete the sections below</p>

            {/* Personal Information */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-rose-600" />
                <h3 className="font-semibold text-gray-800">Personal Information</h3>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91-8010289332"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="City, Country"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
                    <input
                      type="text"
                      value={linkedin}
                      onChange={(e) => setLinkedin(e.target.value)}
                      placeholder="LinkedIn"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">GitHub</label>
                    <input
                      type="text"
                      value={github}
                      onChange={(e) => setGithub(e.target.value)}
                      placeholder="Github"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Education */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <GraduationCap className="w-5 h-5 text-rose-600" />
                <h3 className="font-semibold text-gray-800">Education</h3>
              </div>
              
              {education.map((edu, idx) => (
                <div key={idx} className="space-y-3 mb-4 p-4 bg-gray-50 rounded-lg relative">
                  {education.length > 1 && (
                    <button
                      onClick={() => removeEducation(idx)}
                      className="absolute top-2 right-2 text-red-600 hover:text-red-800"
                    >
                      ✕
                    </button>
                  )}
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) => updateEducation(idx, 'degree', e.target.value)}
                    placeholder="Degree/Course"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    value={edu.institution}
                    onChange={(e) => updateEducation(idx, 'institution', e.target.value)}
                    placeholder="Institution"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={edu.year}
                      onChange={(e) => updateEducation(idx, 'year', e.target.value)}
                      placeholder="Year"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      value={edu.grade}
                      onChange={(e) => updateEducation(idx, 'grade', e.target.value)}
                      placeholder="Grade/CGPA"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    />
                  </div>
                </div>
              ))}
              <button
                onClick={addEducation}
                className="text-rose-600 hover:text-rose-700 font-medium text-sm"
              >
                + Add Education
              </button>
            </div>

            {/* Experience (for experienced) */}
            {activeTab === 'experienced' && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <Briefcase className="w-5 h-5 text-rose-600" />
                  <h3 className="font-semibold text-gray-800">Experience</h3>
                </div>
                
                {experience.map((exp, idx) => (
                  <div key={idx} className="space-y-3 mb-4 p-4 bg-gray-50 rounded-lg relative">
                    {experience.length > 1 && (
                      <button
                        onClick={() => removeExperience(idx)}
                        className="absolute top-2 right-2 text-red-600 hover:text-red-800"
                      >
                        ✕
                      </button>
                    )}
                    <input
                      type="text"
                      value={exp.title}
                      onChange={(e) => updateExperience(idx, 'title', e.target.value)}
                      placeholder="Job Title"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => updateExperience(idx, 'company', e.target.value)}
                      placeholder="Company"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      value={exp.duration}
                      onChange={(e) => updateExperience(idx, 'duration', e.target.value)}
                      placeholder="Duration (e.g., Jan 2023 - Present)"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    />
                    <textarea
                      value={exp.description}
                      onChange={(e) => updateExperience(idx, 'description', e.target.value)}
                      placeholder="Description"
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    />
                  </div>
                ))}
                <button
                  onClick={addExperience}
                  className="text-rose-600 hover:text-rose-700 font-medium text-sm"
                >
                  + Add Experience
                </button>
              </div>
            )}

            {/* Skills */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Code className="w-5 h-5 text-rose-600" />
                <h3 className="font-semibold text-gray-800">Skills</h3>
              </div>
              <textarea
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="List your skills (comma separated)"
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              />
            </div>

            {/* Projects */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-5 h-5 text-rose-600" />
                <h3 className="font-semibold text-gray-800">Projects</h3>
              </div>
              
              {projects.map((proj, idx) => (
                <div key={idx} className="space-y-3 mb-4 p-4 bg-gray-50 rounded-lg relative">
                  {projects.length > 1 && (
                    <button
                      onClick={() => removeProject(idx)}
                      className="absolute top-2 right-2 text-red-600 hover:text-red-800"
                    >
                      ✕
                    </button>
                  )}
                  <input
                    type="text"
                    value={proj.name}
                    onChange={(e) => updateProject(idx, 'name', e.target.value)}
                    placeholder="Project Name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  />
                  <textarea
                    value={proj.description}
                    onChange={(e) => updateProject(idx, 'description', e.target.value)}
                    placeholder="Project Description"
                    rows="2"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    value={proj.technologies}
                    onChange={(e) => updateProject(idx, 'technologies', e.target.value)}
                    placeholder="Technologies Used"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  />
                </div>
              ))}
              <button
                onClick={addProject}
                className="text-rose-600 hover:text-rose-700 font-medium text-sm"
              >
                + Add Project
              </button>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Preview</h2>
                <p className="text-gray-500 text-sm">Real-time view</p>
              </div>
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </button>
            </div>

            {/* Resume Preview */}
            <div className="bg-white border-2 border-gray-200 rounded-lg p-8 min-h-[600px] max-h-[700px] overflow-y-auto">
              {!fullName ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-20">
                  <FileText className="w-16 h-16 text-gray-300 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    Begin Creating Your Resume
                  </h3>
                  <p className="text-gray-400">
                    Fill out the form to see your resume come to life
                  </p>
                </div>
              ) : (
                <div>
                  {/* Header */}
                  <div className="text-center mb-6 pb-4 border-b-2 border-gray-300">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                      {fullName || 'YOUR NAME'}
                    </h1>
                    <div className="text-sm text-gray-600 space-y-1">
                      {email && <div>{email}</div>}
                      {phone && <div>{phone}</div>}
                      {location && <div>{location}</div>}
                      <div className="flex justify-center gap-4">
                        {linkedin && <span>{linkedin}</span>}
                        {github && <span>{github}</span>}
                      </div>
                    </div>
                  </div>

                  {/* Education */}
                  {education.some(e => e.degree || e.institution) && (
                    <div className="mb-6">
                      <h2 className="text-lg font-bold text-gray-800 mb-3 pb-1 border-b border-gray-300">
                        EDUCATION
                      </h2>
                      {education.map((edu, idx) => (
                        (edu.degree || edu.institution) && (
                          <div key={idx} className="mb-3">
                            <div className="flex justify-between">
                              <div className="font-semibold">{edu.degree}</div>
                              <div className="text-sm text-gray-600">{edu.year}</div>
                            </div>
                            <div className="text-sm text-gray-700">{edu.institution}</div>
                            {edu.grade && <div className="text-sm text-gray-600">{edu.grade}</div>}
                          </div>
                        )
                      ))}
                    </div>
                  )}

                  {/* Experience */}
                  {activeTab === 'experienced' && experience.some(e => e.title || e.company) && (
                    <div className="mb-6">
                      <h2 className="text-lg font-bold text-gray-800 mb-3 pb-1 border-b border-gray-300">
                        EXPERIENCE
                      </h2>
                      {experience.map((exp, idx) => (
                        (exp.title || exp.company) && (
                          <div key={idx} className="mb-4">
                            <div className="flex justify-between">
                              <div className="font-semibold">{exp.title}</div>
                              <div className="text-sm text-gray-600">{exp.duration}</div>
                            </div>
                            <div className="text-sm text-gray-700 mb-1">{exp.company}</div>
                            <div className="text-sm text-gray-600">{exp.description}</div>
                          </div>
                        )
                      ))}
                    </div>
                  )}

                  {/* Skills */}
                  {skills && (
                    <div className="mb-6">
                      <h2 className="text-lg font-bold text-gray-800 mb-3 pb-1 border-b border-gray-300">
                        SKILLS
                      </h2>
                      <div className="text-sm text-gray-700">{skills}</div>
                    </div>
                  )}

                  {/* Projects */}
                  {projects.some(p => p.name || p.description) && (
                    <div className="mb-6">
                      <h2 className="text-lg font-bold text-gray-800 mb-3 pb-1 border-b border-gray-300">
                        PROJECTS
                      </h2>
                      {projects.map((proj, idx) => (
                        (proj.name || proj.description) && (
                          <div key={idx} className="mb-4">
                            <div className="font-semibold">{proj.name}</div>
                            <div className="text-sm text-gray-700 mb-1">{proj.description}</div>
                            {proj.technologies && (
                              <div className="text-sm text-gray-600 italic">
                                Technologies: {proj.technologies}
                              </div>
                            )}
                          </div>
                        )
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
