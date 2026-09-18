import {
  Award,
  BookOpen,
  Briefcase,
  Check,
  Code2,
  Download,
  Eye,
  FileCheck,
  FolderGit2,
  Languages,
  Plus,
  Printer,
  Save,
  Sparkles,
  Trash2,
  User as UserIcon,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { ResumePreview } from '../components/ResumePreview';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import { Resume } from '../types';

interface ResumeBuilderPageProps {
  onNavigate: (page: string) => void;
}

const DEFAULT_RESUME: Resume = {
  _id: '',
  userId: '',
  title: 'Full Stack Software Engineer Resume',
  personalInfo: {
    fullName: 'Varshini Rao',
    email: 'varshini.rao@example.com',
    phone: '+91 98765 43210',
    location: 'Bangalore, India',
    linkedin: 'linkedin.com/in/varshinirao',
    github: 'github.com/varshinirao',
    portfolio: 'varshinirao.dev',
  },
  summary:
    'Proactive and results-driven Computer Science graduate with hands-on expertise in building scalable web applications with React, TypeScript, Node.js, and MongoDB. Proven capability in optimizing REST APIs and deploying containerized cloud microservices.',
  education: [
    {
      degree: 'Bachelor of Technology (B.Tech)',
      institution: 'National Institute of Technology Karnataka (NITK)',
      fieldOfStudy: 'Computer Science and Engineering',
      startYear: '2021',
      endYear: '2025',
      grade: '8.8 / 10 CGPA',
    },
  ],
  experience: [
    {
      company: 'Tech Innovations Lab',
      position: 'Software Engineer Intern',
      startDate: 'Jun 2024',
      endDate: 'Aug 2024',
      description:
        '• Engineered responsive React components, reducing initial page load times by 32%.\n• Designed and documented 14 secure RESTful endpoints in Node.js with JWT authentication.\n• Collaborated closely in an Agile sprint environment with Git version control.',
    },
  ],
  projects: [
    {
      title: 'ResuMochi - AI Resume & Job Matching Platform',
      description:
        'Architected a full-stack career platform integrating Google Gemini 2.5 Flash for real-time ATS resume optimization, skill gap calculation, and automated applicant tracking.',
      technologies: ['React 19', 'Node.js', 'Express', 'Gemini AI', 'Tailwind CSS', 'MongoDB'],
      link: 'https://github.com/resumochi/resumochi-app',
    },
    {
      title: 'Cloud Distributed Task Scheduler',
      description:
        'Developed an asynchronous distributed worker queue supporting high-throughput jobs with Redis and Docker.',
      technologies: ['TypeScript', 'Redis', 'Docker', 'Express'],
      link: 'https://github.com/varshinirao/task-scheduler',
    },
  ],
  skills: {
    technical: ['Data Structures & Algorithms', 'System Design', 'RESTful API Architecture', 'Cloud Deployment'],
    programmingLanguages: ['TypeScript', 'JavaScript (ES6+)', 'Python', 'Java', 'SQL'],
    tools: ['React', 'Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'Docker', 'Git', 'Vite', 'Tailwind CSS'],
    softSkills: ['Problem Solving', 'Team Leadership', 'Agile Collaboration', 'Technical Communication'],
  },
  certifications: [
    {
      name: 'Google Cloud Certified Associate Cloud Engineer',
      organization: 'Google Cloud',
      date: '2024',
      link: 'https://cloud.google.com',
    },
    {
      name: 'Meta Front-End Developer Specialization',
      organization: 'Meta / Coursera',
      date: '2023',
    },
  ],
  achievements: [
    'First Place Winner, National University Hackathon 2024 (out of 120 participating engineering teams).',
    'Authored technical tutorial blog on React state management viewed by over 15,000 developers.',
  ],
  languages: [
    { language: 'English', proficiency: 'Fluent (Professional)' },
    { language: 'Hindi', proficiency: 'Native / Bilingual' },
    { language: 'Kannada', proficiency: 'Conversational' },
  ],
  interests: ['Open Source Contributions', 'System Architecture', 'Chess', 'Competitive Programming'],
};

export const ResumeBuilderPage: React.FC<ResumeBuilderPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { success, error } = useToast();

  const [resume, setResume] = useState<Resume>(DEFAULT_RESUME);
  const [activeTab, setActiveTab] = useState<
    'personal' | 'summary' | 'education' | 'experience' | 'projects' | 'skills' | 'certifications' | 'achievements'
  >('personal');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mobileView, setMobileView] = useState<'editor' | 'preview'>('editor');

  // Load existing user resume if available
  useEffect(() => {
    async function loadResume() {
      try {
        setLoading(true);
        const res = await api.resumes.getAll();
        if (res.success && res.resumes.length > 0) {
          setResume(res.resumes[0]);
        } else if (user) {
          // Prefill with user profile if brand new
          setResume((prev) => ({
            ...prev,
            personalInfo: {
              ...prev.personalInfo,
              fullName: user.name || prev.personalInfo.fullName,
              email: user.email || prev.personalInfo.email,
              phone: user.phone || prev.personalInfo.phone,
              location: user.location || prev.personalInfo.location,
            },
          }));
        }
      } catch (err) {
        console.error('Failed to load resume:', err);
      } finally {
        setLoading(false);
      }
    }

    loadResume();
  }, [user]);

  const handleSaveResume = async () => {
    try {
      setSaving(true);
      if (resume._id) {
        const res = await api.resumes.update(resume._id, resume);
        if (res.success) {
          success('Resume saved successfully!');
          setResume(res.resume);
        }
      } else {
        const res = await api.resumes.create(resume);
        if (res.success) {
          success('Resume created and saved!');
          setResume(res.resume);
        }
      }
    } catch (err: any) {
      error(err.message || 'Failed to save resume.');
    } finally {
      setSaving(false);
    }
  };

  // Helper mutators
  const updatePersonalInfo = (field: keyof Resume['personalInfo'], value: string) => {
    setResume((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value,
      },
    }));
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Top Action Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-6 border-b border-pink-100 no-print">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-extrabold text-slate-900 font-heading flex items-center gap-2">
              <span>🍡</span> ResuMochi Builder
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-pink-100/70 text-pink-700 font-bold border border-pink-200">
              Live Preview ✨
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Edit sections on the left; your recruiter-ready, ATS-compliant cute resume updates in real-time.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Mobile switcher */}
          <div className="lg:hidden flex bg-pink-50 p-1 rounded-2xl border border-pink-100">
            <button
              onClick={() => setMobileView('editor')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                mobileView === 'editor' ? 'bg-white text-pink-700 shadow-2xs' : 'text-slate-600'
              }`}
            >
              Form Editor
            </button>
            <button
              onClick={() => setMobileView('preview')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                mobileView === 'preview' ? 'bg-white text-pink-700 shadow-2xs' : 'text-slate-600'
              }`}
            >
              Live Preview
            </button>
          </div>

          <button
            id="builder-improve-ai-btn"
            onClick={() => onNavigate('ai-resume')}
            className="px-3.5 py-2 text-xs font-bold text-pink-700 bg-pink-50 hover:bg-pink-100/70 border border-pink-200 rounded-2xl transition-all flex items-center gap-1.5 shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-pink-500" />
            AI Resume Polish ✨
          </button>

          <button
            id="builder-save-btn"
            onClick={handleSaveResume}
            disabled={saving}
            className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-600 hover:opacity-95 rounded-2xl transition-all shadow-md shadow-pink-500/20 flex items-center gap-1.5 disabled:opacity-50 active:scale-95"
          >
            <Save className="w-3.5 h-3.5" />
            {saving ? 'Saving...' : 'Save Resume 🌸'}
          </button>
        </div>
      </div>

      {/* Main Split Screen Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Form Editor (5 Cols) */}
        <div className={`lg:col-span-6 space-y-6 ${mobileView === 'preview' ? 'hidden lg:block' : 'block'}`}>
          {/* Section Navigation Tabs */}
          <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap gap-1">
            {[
              { key: 'personal', label: 'Personal', icon: UserIcon },
              { key: 'summary', label: 'Summary', icon: FileCheck },
              { key: 'education', label: 'Education', icon: BookOpen },
              { key: 'experience', label: 'Experience', icon: Briefcase },
              { key: 'projects', label: 'Projects', icon: FolderGit2 },
              { key: 'skills', label: 'Skills', icon: Code2 },
              { key: 'certifications', label: 'Certifications', icon: Award },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Form Container */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-5">
            {/* TAB: Personal Info */}
            {activeTab === 'personal' && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 border-b pb-2">Personal Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={resume.personalInfo.fullName}
                      onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={resume.personalInfo.email}
                      onChange={(e) => updatePersonalInfo('email', e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={resume.personalInfo.phone}
                      onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Location</label>
                    <input
                      type="text"
                      value={resume.personalInfo.location}
                      onChange={(e) => updatePersonalInfo('location', e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">LinkedIn Profile</label>
                    <input
                      type="text"
                      value={resume.personalInfo.linkedin || ''}
                      onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                      placeholder="linkedin.com/in/username"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">GitHub Profile</label>
                    <input
                      type="text"
                      value={resume.personalInfo.github || ''}
                      onChange={(e) => updatePersonalInfo('github', e.target.value)}
                      placeholder="github.com/username"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Portfolio / Personal Website</label>
                    <input
                      type="text"
                      value={resume.personalInfo.portfolio || ''}
                      onChange={(e) => updatePersonalInfo('portfolio', e.target.value)}
                      placeholder="myportfolio.dev"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB: Summary */}
            {activeTab === 'summary' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <h3 className="text-sm font-bold text-slate-900">Professional Summary</h3>
                  <button
                    onClick={() => onNavigate('ai-resume')}
                    className="text-xs text-indigo-600 font-semibold flex items-center gap-1 hover:underline"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    AI Polish Summary
                  </button>
                </div>
                <textarea
                  rows={6}
                  value={resume.summary}
                  onChange={(e) => setResume({ ...resume, summary: e.target.value })}
                  placeholder="Summarize your years of experience, core technical specialties, major achievements, and career objective..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs leading-relaxed"
                />
              </div>
            )}

            {/* TAB: Education */}
            {activeTab === 'education' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <h3 className="text-sm font-bold text-slate-900">Education Details</h3>
                  <button
                    onClick={() =>
                      setResume({
                        ...resume,
                        education: [
                          ...resume.education,
                          {
                            degree: '',
                            institution: '',
                            fieldOfStudy: '',
                            startYear: '',
                            endYear: '',
                            grade: '',
                          },
                        ],
                      })
                    }
                    className="text-xs text-indigo-600 font-semibold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Degree
                  </button>
                </div>

                <div className="space-y-4">
                  {resume.education.map((edu, idx) => (
                    <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 relative space-y-3">
                      <button
                        onClick={() =>
                          setResume({
                            ...resume,
                            education: resume.education.filter((_, i) => i !== idx),
                          })
                        }
                        className="absolute right-3 top-3 text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Degree</label>
                          <input
                            type="text"
                            value={edu.degree}
                            onChange={(e) => {
                              const copy = [...resume.education];
                              copy[idx].degree = e.target.value;
                              setResume({ ...resume, education: copy });
                            }}
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Institution</label>
                          <input
                            type="text"
                            value={edu.institution}
                            onChange={(e) => {
                              const copy = [...resume.education];
                              copy[idx].institution = e.target.value;
                              setResume({ ...resume, education: copy });
                            }}
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Field of Study</label>
                          <input
                            type="text"
                            value={edu.fieldOfStudy || ''}
                            onChange={(e) => {
                              const copy = [...resume.education];
                              copy[idx].fieldOfStudy = e.target.value;
                              setResume({ ...resume, education: copy });
                            }}
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Graduation Year</label>
                            <input
                              type="text"
                              value={edu.endYear || ''}
                              onChange={(e) => {
                                const copy = [...resume.education];
                                copy[idx].endYear = e.target.value;
                                setResume({ ...resume, education: copy });
                              }}
                              className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">CGPA / Grade</label>
                            <input
                              type="text"
                              value={edu.grade || ''}
                              onChange={(e) => {
                                const copy = [...resume.education];
                                copy[idx].grade = e.target.value;
                                setResume({ ...resume, education: copy });
                              }}
                              className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: Experience */}
            {activeTab === 'experience' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <h3 className="text-sm font-bold text-slate-900">Work Experience &amp; Internships</h3>
                  <button
                    onClick={() =>
                      setResume({
                        ...resume,
                        experience: [
                          ...resume.experience,
                          {
                            company: '',
                            position: '',
                            startDate: '',
                            endDate: '',
                            description: '',
                          },
                        ],
                      })
                    }
                    className="text-xs text-indigo-600 font-semibold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Experience
                  </button>
                </div>

                <div className="space-y-4">
                  {resume.experience.map((exp, idx) => (
                    <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 relative space-y-3">
                      <button
                        onClick={() =>
                          setResume({
                            ...resume,
                            experience: resume.experience.filter((_, i) => i !== idx),
                          })
                        }
                        className="absolute right-3 top-3 text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Job Title</label>
                          <input
                            type="text"
                            value={exp.position}
                            onChange={(e) => {
                              const copy = [...resume.experience];
                              copy[idx].position = e.target.value;
                              setResume({ ...resume, experience: copy });
                            }}
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Company</label>
                          <input
                            type="text"
                            value={exp.company}
                            onChange={(e) => {
                              const copy = [...resume.experience];
                              copy[idx].company = e.target.value;
                              setResume({ ...resume, experience: copy });
                            }}
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Start Date</label>
                          <input
                            type="text"
                            value={exp.startDate || ''}
                            onChange={(e) => {
                              const copy = [...resume.experience];
                              copy[idx].startDate = e.target.value;
                              setResume({ ...resume, experience: copy });
                            }}
                            placeholder="e.g. Jun 2024"
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">End Date</label>
                          <input
                            type="text"
                            value={exp.endDate || ''}
                            onChange={(e) => {
                              const copy = [...resume.experience];
                              copy[idx].endDate = e.target.value;
                              setResume({ ...resume, experience: copy });
                            }}
                            placeholder="e.g. Aug 2024 or Present"
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Bullet Point Responsibilities</label>
                        <textarea
                          rows={3}
                          value={exp.description || ''}
                          onChange={(e) => {
                            const copy = [...resume.experience];
                            copy[idx].description = e.target.value;
                            setResume({ ...resume, experience: copy });
                          }}
                          placeholder="Use action verbs and quantify metrics (e.g. • Improved API response latency by 45%)..."
                          className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-xs leading-relaxed"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: Projects */}
            {activeTab === 'projects' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <h3 className="text-sm font-bold text-slate-900">Key Projects</h3>
                  <button
                    onClick={() =>
                      setResume({
                        ...resume,
                        projects: [
                          ...resume.projects,
                          {
                            title: '',
                            description: '',
                            technologies: [],
                            link: '',
                          },
                        ],
                      })
                    }
                    className="text-xs text-indigo-600 font-semibold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Project
                  </button>
                </div>

                <div className="space-y-4">
                  {resume.projects.map((proj, idx) => (
                    <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 relative space-y-3">
                      <button
                        onClick={() =>
                          setResume({
                            ...resume,
                            projects: resume.projects.filter((_, i) => i !== idx),
                          })
                        }
                        className="absolute right-3 top-3 text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Project Title</label>
                          <input
                            type="text"
                            value={proj.title}
                            onChange={(e) => {
                              const copy = [...resume.projects];
                              copy[idx].title = e.target.value;
                              setResume({ ...resume, projects: copy });
                            }}
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Project Link (GitHub/Demo)</label>
                          <input
                            type="text"
                            value={proj.link || ''}
                            onChange={(e) => {
                              const copy = [...resume.projects];
                              copy[idx].link = e.target.value;
                              setResume({ ...resume, projects: copy });
                            }}
                            placeholder="github.com/username/project"
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Technologies Used (comma separated)
                        </label>
                        <input
                          type="text"
                          value={proj.technologies ? proj.technologies.join(', ') : ''}
                          onChange={(e) => {
                            const copy = [...resume.projects];
                            copy[idx].technologies = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
                            setResume({ ...resume, projects: copy });
                          }}
                          placeholder="React, TypeScript, Node.js, MongoDB"
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Project Impact &amp; Architecture</label>
                        <textarea
                          rows={2}
                          value={proj.description}
                          onChange={(e) => {
                            const copy = [...resume.projects];
                            copy[idx].description = e.target.value;
                            setResume({ ...resume, projects: copy });
                          }}
                          placeholder="Describe problem solved, technical approach, and key outcome..."
                          className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-xs"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: Skills */}
            {activeTab === 'skills' && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 border-b pb-2">Skills &amp; Proficiencies</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Programming Languages</label>
                    <input
                      type="text"
                      value={resume.skills.programmingLanguages ? resume.skills.programmingLanguages.join(', ') : ''}
                      onChange={(e) =>
                        setResume({
                          ...resume,
                          skills: {
                            ...resume.skills,
                            programmingLanguages: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                          },
                        })
                      }
                      placeholder="TypeScript, Python, Java, SQL, C++"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Technical Skills &amp; Concepts</label>
                    <input
                      type="text"
                      value={resume.skills.technical ? resume.skills.technical.join(', ') : ''}
                      onChange={(e) =>
                        setResume({
                          ...resume,
                          skills: {
                            ...resume.skills,
                            technical: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                          },
                        })
                      }
                      placeholder="Data Structures, System Design, REST APIs, Microservices"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Frameworks, Libraries &amp; Tools</label>
                    <input
                      type="text"
                      value={resume.skills.tools ? resume.skills.tools.join(', ') : ''}
                      onChange={(e) =>
                        setResume({
                          ...resume,
                          skills: {
                            ...resume.skills,
                            tools: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                          },
                        })
                      }
                      placeholder="React, Express, MongoDB, Docker, Git, Redis"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Soft Skills</label>
                    <input
                      type="text"
                      value={resume.skills.softSkills ? resume.skills.softSkills.join(', ') : ''}
                      onChange={(e) =>
                        setResume({
                          ...resume,
                          skills: {
                            ...resume.skills,
                            softSkills: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                          },
                        })
                      }
                      placeholder="Problem Solving, Communication, Team Collaboration"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB: Certifications */}
            {activeTab === 'certifications' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <h3 className="text-sm font-bold text-slate-900">Certifications</h3>
                  <button
                    onClick={() =>
                      setResume({
                        ...resume,
                        certifications: [
                          ...resume.certifications,
                          {
                            name: '',
                            organization: '',
                            date: '',
                          },
                        ],
                      })
                    }
                    className="text-xs text-indigo-600 font-semibold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Certification
                  </button>
                </div>

                <div className="space-y-3">
                  {resume.certifications.map((cert, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 relative space-y-2">
                      <button
                        onClick={() =>
                          setResume({
                            ...resume,
                            certifications: resume.certifications.filter((_, i) => i !== idx),
                          })
                        }
                        className="absolute right-3 top-3 text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Certification Name</label>
                          <input
                            type="text"
                            value={cert.name}
                            onChange={(e) => {
                              const copy = [...resume.certifications];
                              copy[idx].name = e.target.value;
                              setResume({ ...resume, certifications: copy });
                            }}
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Issuing Organization</label>
                          <input
                            type="text"
                            value={cert.organization}
                            onChange={(e) => {
                              const copy = [...resume.certifications];
                              copy[idx].organization = e.target.value;
                              setResume({ ...resume, certifications: copy });
                            }}
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Live Resume Preview (6 Cols) */}
        <div className={`lg:col-span-6 sticky top-24 ${mobileView === 'editor' ? 'hidden lg:block' : 'block'}`}>
          <ResumePreview
            resume={resume}
            onImproveAi={() => onNavigate('ai-resume')}
          />
        </div>
      </div>
    </div>
  );
};
