import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { ApplicationModel, IApplication } from '../models/Application';
import { IJob, JobModel } from '../models/Job';
import { IResume, ResumeModel } from '../models/Resume';
import { IUser, UserModel } from '../models/User';

let isMongoConnected = false;

// Initial sample jobs required by assignment
const initialJobs: IJob[] = [
  {
    _id: 'job_001',
    jobId: 'JOB-DEV-001',
    title: 'Software Developer',
    company: 'FinTech Innovations',
    location: 'Bengaluru, India (Hybrid)',
    description: 'We are seeking a talented Software Developer to build scalable payment microservices, maintain secure REST APIs, and integrate core banking services. You will collaborate with product architects and write clean, maintainable, tested code.',
    skills: ['Java', 'Spring Boot', 'SQL', 'REST APIs', 'Docker', 'Microservices'],
    salary: '₹8,00,000 - ₹14,00,000 / yr',
    employmentType: 'Full-time',
    experienceLevel: 'Entry-level',
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    deadline: '2026-10-30',
    department: 'Core Banking Engineering',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'job_002',
    jobId: 'JOB-FE-002',
    title: 'Frontend Developer',
    company: 'TechCorp Global',
    location: 'Remote',
    description: 'Looking for a passionate Frontend Developer with deep React.js, TypeScript, and modern responsive CSS expertise. Build lightning-fast web interfaces, optimize web vitals, and work directly with UI/UX design teams.',
    skills: ['React.js', 'TypeScript', 'Tailwind CSS', 'Next.js', 'Redux', 'HTML5', 'CSS3'],
    salary: '₹7,50,000 - ₹12,00,000 / yr',
    employmentType: 'Full-time',
    experienceLevel: 'Mid-level',
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
    deadline: '2026-11-15',
    department: 'Product Experience',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'job_003',
    jobId: 'JOB-BE-003',
    title: 'Backend Developer',
    company: 'CloudScale Systems',
    location: 'Hyderabad, India',
    description: 'Design and deploy robust distributed backend services using Node.js, Express, MongoDB, and Redis. Responsible for caching layers, database indexing, API security, and high throughput event-driven architectures.',
    skills: ['Node.js', 'Express.js', 'MongoDB', 'Redis', 'TypeScript', 'AWS', 'Docker'],
    salary: '₹9,00,000 - ₹16,00,000 / yr',
    employmentType: 'Full-time',
    experienceLevel: 'Mid-level',
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    deadline: '2026-11-05',
    department: 'Platform Architecture',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'job_004',
    jobId: 'JOB-FS-004',
    title: 'Full Stack Developer',
    company: 'NextGen Ventures',
    location: 'Pune, India (Hybrid)',
    description: 'Build end-to-end features for our AI-powered SaaS product. Deliver clean React frontends coupled with performant Node/Express backends, database models in MongoDB, and automated testing pipelines.',
    skills: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'TypeScript', 'REST APIs', 'Git'],
    salary: '₹10,00,000 - ₹18,00,000 / yr',
    employmentType: 'Full-time',
    experienceLevel: 'Mid-level',
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
    deadline: '2026-10-25',
    department: 'SaaS Solutions',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'job_005',
    jobId: 'JOB-JAVA-005',
    title: 'Java Developer',
    company: 'Enterprise Software Solutions',
    location: 'Chennai, India',
    description: 'Join our Enterprise Cloud Services team maintaining large-scale enterprise ERP modules. Excellent opportunity for developers proficient in Java 17+, Hibernate/JPA, PostgreSQL/Oracle, and Spring Cloud.',
    skills: ['Java', 'Spring Boot', 'Hibernate', 'PostgreSQL', 'Kafka', 'JUnit'],
    salary: '₹8,50,000 - ₹15,00,000 / yr',
    employmentType: 'Full-time',
    experienceLevel: 'Mid-level',
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    deadline: '2026-11-20',
    department: 'Enterprise Cloud',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'job_006',
    jobId: 'JOB-PY-006',
    title: 'Python Developer',
    company: 'DataMinds AI',
    location: 'Mumbai, India',
    description: 'Work with fast-growing AI engineering team building high-performance data transformation workflows, FastAPI microservices, automated scraping engines, and machine learning pipelines.',
    skills: ['Python', 'FastAPI', 'Django', 'PostgreSQL', 'Pandas', 'Docker', 'Celery'],
    salary: '₹9,00,000 - ₹15,50,000 / yr',
    employmentType: 'Full-time',
    experienceLevel: 'Entry-level',
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
    deadline: '2026-11-10',
    department: 'Data Platforms',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'job_007',
    jobId: 'JOB-DA-007',
    title: 'Data Analyst',
    company: 'Insight Analytics',
    location: 'Gurugram, India (Hybrid)',
    description: 'Transform complex business datasets into clear actionable insights, executive KPI dashboards, and statistical models using SQL, Python, Power BI, and Tableau.',
    skills: ['SQL', 'Python', 'Excel', 'Power BI', 'Tableau', 'Statistics', 'Data Visualization'],
    salary: '₹6,50,000 - ₹11,00,000 / yr',
    employmentType: 'Full-time',
    experienceLevel: 'Entry-level',
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    deadline: '2026-10-31',
    department: 'Business Intelligence',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'job_008',
    jobId: 'JOB-ML-008',
    title: 'Machine Learning Intern',
    company: 'NeuroLabs AI',
    location: 'Remote',
    description: 'Exciting 6-month paid internship working on Generative AI, Large Language Models (LLMs), prompt evaluation frameworks, and fine-tuning computer vision classifiers.',
    skills: ['Python', 'PyTorch', 'TensorFlow', 'Scikit-Learn', 'Generative AI', 'NLP'],
    salary: '₹35,000 - ₹50,000 / month stipend',
    employmentType: 'Internship',
    experienceLevel: 'Intern',
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
    deadline: '2026-10-15',
    department: 'AI Research',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'job_009',
    jobId: 'JOB-WEB-009',
    title: 'Web Developer',
    company: 'CreativePixel Studio',
    location: 'New Delhi, India',
    description: 'Design, develop, and deploy dynamic responsive websites, web portals, and e-commerce stores with exceptional UX animations, accessibility compliance, and SEO optimization.',
    skills: ['JavaScript', 'HTML5', 'CSS3', 'WordPress', 'React.js', 'Tailwind CSS', 'SEO'],
    salary: '₹5,50,000 - ₹9,50,000 / yr',
    employmentType: 'Full-time',
    experienceLevel: 'Entry-level',
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(),
    deadline: '2026-11-25',
    department: 'Digital Agency',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'job_010',
    jobId: 'JOB-SEI-010',
    title: 'Software Engineering Intern',
    company: 'Apex Innovations',
    location: 'Hyderabad, India (Hybrid)',
    description: 'Opportunity for pre-final and final year computer science students to collaborate on production codebase, write unit tests, participate in agile sprints, and receive 1-on-1 mentorship.',
    skills: ['Data Structures', 'Algorithms', 'Java', 'Python', 'Git', 'Problem Solving'],
    salary: '₹30,000 - ₹45,000 / month stipend',
    employmentType: 'Internship',
    experienceLevel: 'Intern',
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    deadline: '2026-10-20',
    department: 'Student Accelerator',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// In-memory backing tables
let memoryUsers: IUser[] = [];
let memoryResumes: IResume[] = [];
let memoryJobs: IJob[] = [...initialJobs];
let memoryApplications: IApplication[] = [];

// Initialize default demo users and sample resume
export async function initializeDatabase() {
  const mongoUri = process.env.MONGODB_URI;

  if (mongoUri && mongoUri.trim() !== '') {
    try {
      console.log('Connecting to MongoDB at:', mongoUri.split('@').pop() || mongoUri);
      await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 3000 });
      isMongoConnected = true;
      console.log('MongoDB successfully connected.');
    } catch (err: any) {
      console.warn('MongoDB connection failed or skipped. Using synchronized in-memory database store:', err.message);
      isMongoConnected = false;
    }
  } else {
    console.log('No MONGODB_URI provided in environment. Initializing local database store.');
    isMongoConnected = false;
  }

  // Pre-seed admin and normal user
  const adminPasswordHash = await bcrypt.hash('Admin@123', 10);
  const userPasswordHash = await bcrypt.hash('User@123', 10);

  const adminUser: IUser = {
    _id: 'usr_admin_001',
    name: 'Mochi Recruiter & Admin',
    email: 'admin@resumochi.ai',
    password: adminPasswordHash,
    role: 'admin',
    phone: '+91 98765 43210',
    location: 'Bengaluru, India',
    headline: 'Chief Technology Officer & Lead Recruiter',
    bio: 'Overseeing technical hiring, talent curation, and AI architecture at ResuMochi.',
    skills: ['Talent Acquisition', 'System Design', 'React.js', 'Node.js', 'MongoDB', 'Team Leadership'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const demoUser: IUser = {
    _id: 'usr_demo_002',
    name: 'Varshini Rao',
    email: 'user@resumochi.ai',
    password: userPasswordHash,
    role: 'user',
    phone: '+91 91234 56789',
    location: 'Hyderabad, India',
    headline: 'Aspiring Full Stack Engineer & Computer Science Graduate',
    bio: 'Passionate computer science student with a strong foundation in modern web technologies, algorithms, and distributed backend architectures. Eager to solve real-world problems using React, Node.js, and AI systems.',
    skills: ['JavaScript', 'TypeScript', 'React.js', 'Node.js', 'Express.js', 'MongoDB', 'SQL', 'Python', 'Git', 'REST APIs'],
    education: [
      {
        degree: 'Bachelor of Technology (B.Tech)',
        institution: 'National Institute of Technology',
        fieldOfStudy: 'Computer Science & Engineering',
        startYear: '2022',
        endYear: '2026',
        grade: '8.8 CGPA',
      },
    ],
    experience: [
      {
        company: 'Innovatech Labs',
        position: 'Software Development Intern',
        startDate: 'May 2025',
        endDate: 'July 2025',
        description: 'Engineered responsive dashboard modules in React, improved API response times by 30% through caching, and implemented JWT authentication across internal services.',
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  memoryUsers = [adminUser, demoUser];

  // Seed sample resume for demo user
  const sampleResume: IResume = {
    _id: 'res_001',
    userId: demoUser._id,
    title: 'Full Stack Software Engineer Resume',
    personalInfo: {
      fullName: 'Varshini Rao',
      email: 'user@resumochi.ai',
      phone: '+91 91234 56789',
      location: 'Hyderabad, India',
      linkedin: 'https://linkedin.com/in/varshinirao',
      github: 'https://github.com/varshinirao',
      portfolio: 'https://varshinirao.dev',
    },
    summary: 'Results-driven Computer Science graduate specializing in Full Stack web engineering and scalable API design. Hands-on experience developing end-to-end web applications with React, Node.js, Express, and MongoDB. Strong problem-solving aptitude with over 300 algorithmic problems solved across competitive coding platforms.',
    education: [
      {
        id: 'edu_1',
        degree: 'Bachelor of Technology (B.Tech)',
        institution: 'National Institute of Technology',
        fieldOfStudy: 'Computer Science & Engineering',
        startYear: '2022',
        endYear: '2026',
        grade: '8.8 / 10 CGPA',
      },
      {
        id: 'edu_2',
        degree: 'Higher Secondary Certificate (Class XII)',
        institution: 'Kendriya Vidyalaya',
        fieldOfStudy: 'Science (PCM & Computer Science)',
        startYear: '2020',
        endYear: '2022',
        grade: '94.2%',
      },
    ],
    experience: [
      {
        id: 'exp_1',
        company: 'Innovatech Labs',
        position: 'Software Development Intern',
        startDate: 'May 2025',
        endDate: 'July 2025',
        description: 'Engineered responsive dashboard analytics interfaces using React 19 and Tailwind CSS. Implemented microservice communication with Node.js and MongoDB, resulting in 25% faster data retrieval. Built automated test suites in Jest achieving 88% unit test coverage.',
      },
    ],
    projects: [
      {
        id: 'proj_1',
        title: 'ResuMochi - Cute AI Resume & Job Matching Platform',
        description: 'Engineered a full-stack platform integrating Google Gemini AI for automated ATS resume scoring, keyword enhancement, and job compatibility matching.',
        technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Gemini API', 'Tailwind CSS'],
        link: 'https://github.com/resumochi/resumochi-platform',
      },
      {
        id: 'proj_2',
        title: 'Distributed Cloud Task Scheduler',
        description: 'Designed an asynchronous task queue processing background batch jobs with exponential backoff retries and Redis caching.',
        technologies: ['Node.js', 'TypeScript', 'Redis', 'Docker', 'PostgreSQL'],
        link: 'https://github.com/varshinirao/task-scheduler',
      },
    ],
    skills: {
      technical: ['Full Stack Development', 'RESTful API Design', 'Microservices', 'Database Indexing', 'Authentication (JWT/OAuth)', 'Object-Oriented Design'],
      programmingLanguages: ['JavaScript (ES6+)', 'TypeScript', 'Java', 'Python', 'SQL', 'C++'],
      tools: ['Git & GitHub', 'Docker', 'Postman', 'VS Code', 'MongoDB Compass', 'Linux Shell'],
      softSkills: ['Analytical Problem Solving', 'Technical Communication', 'Agile/Scrum', 'Team Collaboration', 'Fast Learner'],
    },
    certifications: [
      {
        id: 'cert_1',
        name: 'AWS Certified Cloud Practitioner',
        organization: 'Amazon Web Services',
        date: 'Jan 2025',
        link: 'https://aws.amazon.com/verification',
      },
      {
        id: 'cert_2',
        name: 'Meta Front-End Developer Professional Certificate',
        organization: 'Meta / Coursera',
        date: 'Nov 2024',
        link: 'https://coursera.org/verify/professional-cert',
      },
    ],
    achievements: [
      'Ranked in top 5% out of 10,000+ participants in National Coding Hackathon 2025.',
      'Solved 350+ data structures and algorithmic challenges on LeetCode & GeeksForGeeks.',
      'Lead Technical Coordinator of University Open Source Club, mentoring 120+ freshmen.',
    ],
    languages: [
      { language: 'English', proficiency: 'Full Professional' },
      { language: 'Hindi', proficiency: 'Native / Bilingual' },
      { language: 'Telugu', proficiency: 'Conversational' },
    ],
    interests: ['Open Source Contributions', 'Artificial Intelligence & LLMs', 'Robotics', 'Chess', 'Technical Blogging'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  memoryResumes = [sampleResume];

  // Seed sample applications
  memoryApplications = [
    {
      _id: 'app_001',
      applicationId: 'APP-2026-001',
      userId: demoUser._id,
      jobId: 'job_004', // Full Stack Developer
      resumeId: sampleResume._id,
      status: 'Under Review',
      appliedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
      coverLetter: 'I am excited to apply for the Full Stack Developer position at NextGen Ventures. My technical skillset in React, Node.js, and MongoDB matches your job requirements closely.',
      notes: 'Shortlisted for initial screening',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: 'app_002',
      applicationId: 'APP-2026-002',
      userId: demoUser._id,
      jobId: 'job_002', // Frontend Developer
      resumeId: sampleResume._id,
      status: 'Interview',
      appliedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
      coverLetter: 'I have hands-on production experience building responsive React and TypeScript frontends with Tailwind CSS.',
      notes: 'Technical round scheduled for Friday',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  console.log(`Database initialized. Ready with ${memoryJobs.length} jobs, ${memoryUsers.length} users, ${memoryResumes.length} resumes.`);
}

// Unified Database Store Service
export const DB = {
  // USER METHODS
  async findUserByEmail(email: string): Promise<IUser | null> {
    let cleanEmail = email.toLowerCase().trim();
    if (cleanEmail === 'user@skillvedanth.com') cleanEmail = 'user@resumochi.ai';
    if (cleanEmail === 'admin@skillvedanth.com') cleanEmail = 'admin@resumochi.ai';
    if (isMongoConnected) {
      try {
        const user = await UserModel.findOne({ email: cleanEmail }).lean();
        if (user) return { ...user, _id: user._id.toString() } as IUser;
      } catch (e) {
        console.error('MongoDB query error:', e);
      }
    }
    const mem = memoryUsers.find((u) => u.email.toLowerCase() === cleanEmail);
    return mem || null;
  },

  async findUserById(id: string): Promise<IUser | null> {
    if (isMongoConnected) {
      try {
        const user = await UserModel.findById(id).lean();
        if (user) return { ...user, _id: user._id.toString() } as IUser;
      } catch (e) {
        // fallback
      }
    }
    const mem = memoryUsers.find((u) => u._id === id);
    return mem || null;
  },

  async createUser(userData: Partial<IUser>): Promise<IUser> {
    const newUser: IUser = {
      _id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: userData.name || '',
      email: (userData.email || '').toLowerCase().trim(),
      password: userData.password || '',
      role: userData.role || 'user',
      phone: userData.phone || '',
      location: userData.location || '',
      headline: userData.headline || '',
      bio: userData.bio || '',
      skills: userData.skills || [],
      education: userData.education || [],
      experience: userData.experience || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (isMongoConnected) {
      try {
        const doc = await UserModel.create(newUser);
        return { ...doc.toObject(), _id: doc._id.toString() } as IUser;
      } catch (e) {
        console.error('MongoDB create user error:', e);
      }
    }

    memoryUsers.push(newUser);
    return newUser;
  },

  async updateUser(id: string, updates: Partial<IUser>): Promise<IUser | null> {
    if (isMongoConnected) {
      try {
        const doc = await UserModel.findByIdAndUpdate(id, { ...updates, updatedAt: new Date() }, { new: true }).lean();
        if (doc) return { ...doc, _id: doc._id.toString() } as IUser;
      } catch (e) {
        console.error('MongoDB update user error:', e);
      }
    }

    const idx = memoryUsers.findIndex((u) => u._id === id);
    if (idx === -1) return null;
    memoryUsers[idx] = {
      ...memoryUsers[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return memoryUsers[idx];
  },

  async getAllUsers(): Promise<IUser[]> {
    if (isMongoConnected) {
      try {
        const docs = await UserModel.find().select('-password').lean();
        return docs.map((d: any) => ({ ...d, _id: d._id.toString() }));
      } catch (e) {
        // fallback
      }
    }
    return memoryUsers.map(({ password, ...rest }) => rest as IUser);
  },

  // RESUME METHODS
  async getResumesByUserId(userId: string): Promise<IResume[]> {
    if (isMongoConnected) {
      try {
        const docs = await ResumeModel.find({ userId }).lean();
        if (docs && docs.length > 0) {
          return docs.map((d: any) => ({ ...d, _id: d._id.toString() }));
        }
      } catch (e) {}
    }
    return memoryResumes.filter((r) => r.userId === userId);
  },

  async getResumeById(id: string): Promise<IResume | null> {
    if (isMongoConnected) {
      try {
        const doc = await ResumeModel.findById(id).lean();
        if (doc) return { ...doc, _id: doc._id.toString() } as IResume;
      } catch (e) {}
    }
    const mem = memoryResumes.find((r) => r._id === id);
    return mem || null;
  },

  async createResume(resumeData: Partial<IResume>): Promise<IResume> {
    const newResume: IResume = {
      _id: `res_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId: resumeData.userId || '',
      title: resumeData.title || 'My Professional Resume',
      personalInfo: resumeData.personalInfo || {
        fullName: '',
        email: '',
        phone: '',
        location: '',
      },
      summary: resumeData.summary || '',
      education: resumeData.education || [],
      experience: resumeData.experience || [],
      projects: resumeData.projects || [],
      skills: resumeData.skills || {
        technical: [],
        programmingLanguages: [],
        tools: [],
        softSkills: [],
      },
      certifications: resumeData.certifications || [],
      achievements: resumeData.achievements || [],
      languages: resumeData.languages || [],
      interests: resumeData.interests || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (isMongoConnected) {
      try {
        const doc = await ResumeModel.create(newResume);
        return { ...doc.toObject(), _id: doc._id.toString() } as IResume;
      } catch (e) {
        console.error('MongoDB create resume error:', e);
      }
    }

    memoryResumes.push(newResume);
    return newResume;
  },

  async updateResume(id: string, updates: Partial<IResume>): Promise<IResume | null> {
    if (isMongoConnected) {
      try {
        const doc = await ResumeModel.findByIdAndUpdate(id, { ...updates, updatedAt: new Date() }, { new: true }).lean();
        if (doc) return { ...doc, _id: doc._id.toString() } as IResume;
      } catch (e) {}
    }

    const idx = memoryResumes.findIndex((r) => r._id === id);
    if (idx === -1) return null;
    memoryResumes[idx] = {
      ...memoryResumes[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return memoryResumes[idx];
  },

  async deleteResume(id: string): Promise<boolean> {
    if (isMongoConnected) {
      try {
        await ResumeModel.findByIdAndDelete(id);
      } catch (e) {}
    }
    const initialLen = memoryResumes.length;
    memoryResumes = memoryResumes.filter((r) => r._id !== id);
    return memoryResumes.length < initialLen;
  },

  // JOB METHODS
  async getAllJobs(filters?: {
    search?: string;
    location?: string;
    skills?: string;
    employmentType?: string;
    experienceLevel?: string;
  }): Promise<IJob[]> {
    let jobs = [...memoryJobs];

    if (isMongoConnected) {
      try {
        const docs = await JobModel.find({ isActive: true }).lean();
        if (docs && docs.length > 0) {
          jobs = docs.map((d: any) => ({ ...d, _id: d._id.toString() }));
        }
      } catch (e) {}
    }

    if (!filters) return jobs;

    return jobs.filter((job) => {
      if (!job.isActive) return false;

      // Search term matches title, company, description, or skills
      if (filters.search) {
        const term = filters.search.toLowerCase().trim();
        const matchesTitle = job.title.toLowerCase().includes(term);
        const matchesCompany = job.company.toLowerCase().includes(term);
        const matchesDesc = job.description.toLowerCase().includes(term);
        const matchesSkill = job.skills.some((s) => s.toLowerCase().includes(term));
        const matchesLoc = job.location.toLowerCase().includes(term);
        if (!matchesTitle && !matchesCompany && !matchesDesc && !matchesSkill && !matchesLoc) {
          return false;
        }
      }

      // Location filter
      if (filters.location && filters.location !== 'All') {
        const loc = filters.location.toLowerCase();
        if (!job.location.toLowerCase().includes(loc)) return false;
      }

      // Employment type filter
      if (filters.employmentType && filters.employmentType !== 'All') {
        if (job.employmentType !== filters.employmentType) return false;
      }

      // Experience level filter
      if (filters.experienceLevel && filters.experienceLevel !== 'All') {
        if (job.experienceLevel !== filters.experienceLevel) return false;
      }

      // Skill filter
      if (filters.skills && filters.skills !== 'All') {
        const sk = filters.skills.toLowerCase();
        if (!job.skills.some((s) => s.toLowerCase().includes(sk))) return false;
      }

      return true;
    });
  },

  async getJobById(id: string): Promise<IJob | null> {
    if (isMongoConnected) {
      try {
        const doc = await JobModel.findById(id).lean();
        if (doc) return { ...doc, _id: doc._id.toString() } as IJob;
      } catch (e) {}
    }
    const mem = memoryJobs.find((j) => j._id === id || j.jobId === id);
    return mem || null;
  },

  async createJob(jobData: Partial<IJob>): Promise<IJob> {
    const newJob: IJob = {
      _id: `job_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      jobId: jobData.jobId || `JOB-${Date.now().toString().slice(-4)}`,
      title: jobData.title || '',
      company: jobData.company || '',
      location: jobData.location || '',
      description: jobData.description || '',
      skills: jobData.skills || [],
      salary: jobData.salary || 'Competitive',
      employmentType: jobData.employmentType || 'Full-time',
      experienceLevel: jobData.experienceLevel || 'Entry-level',
      postedAt: new Date().toISOString(),
      deadline: jobData.deadline || '',
      createdBy: jobData.createdBy,
      department: jobData.department || 'General',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (isMongoConnected) {
      try {
        const doc = await JobModel.create(newJob);
        return { ...doc.toObject(), _id: doc._id.toString() } as IJob;
      } catch (e) {
        console.error('MongoDB create job error:', e);
      }
    }

    memoryJobs.unshift(newJob);
    return newJob;
  },

  async updateJob(id: string, updates: Partial<IJob>): Promise<IJob | null> {
    if (isMongoConnected) {
      try {
        const doc = await JobModel.findByIdAndUpdate(id, { ...updates, updatedAt: new Date() }, { new: true }).lean();
        if (doc) return { ...doc, _id: doc._id.toString() } as IJob;
      } catch (e) {}
    }

    const idx = memoryJobs.findIndex((j) => j._id === id || j.jobId === id);
    if (idx === -1) return null;
    memoryJobs[idx] = {
      ...memoryJobs[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return memoryJobs[idx];
  },

  async deleteJob(id: string): Promise<boolean> {
    if (isMongoConnected) {
      try {
        await JobModel.findByIdAndDelete(id);
      } catch (e) {}
    }
    const initialLen = memoryJobs.length;
    memoryJobs = memoryJobs.filter((j) => j._id !== id && j.jobId !== id);
    return memoryJobs.length < initialLen;
  },

  // APPLICATION METHODS
  async getApplicationsByUserId(userId: string): Promise<any[]> {
    const apps = memoryApplications.filter((a) => a.userId === userId);
    // Enrich with job info
    return apps.map((app) => {
      const job = memoryJobs.find((j) => j._id === app.jobId || j.jobId === app.jobId);
      return {
        ...app,
        job: job || {
          title: 'Software Developer',
          company: 'Tech Enterprise',
          location: 'Remote',
          skills: [],
        },
      };
    });
  },

  async getApplicationById(id: string): Promise<IApplication | null> {
    const mem = memoryApplications.find((a) => a._id === id || a.applicationId === id);
    return mem || null;
  },

  async createApplication(appData: {
    userId: string;
    jobId: string;
    resumeId?: string;
    coverLetter?: string;
  }): Promise<{ application?: IApplication; error?: string }> {
    // Check if user already applied to this job
    const existing = memoryApplications.find(
      (a) => a.userId === appData.userId && a.jobId === appData.jobId && a.status !== 'Withdrawn'
    );
    if (existing) {
      return { error: 'You have already submitted an active application for this job.' };
    }

    const newApp: IApplication = {
      _id: `app_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      applicationId: `APP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: appData.userId,
      jobId: appData.jobId,
      resumeId: appData.resumeId,
      status: 'Applied',
      appliedAt: new Date().toISOString(),
      coverLetter: appData.coverLetter || '',
      notes: 'Application received and queued for review',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (isMongoConnected) {
      try {
        await ApplicationModel.create(newApp);
      } catch (e) {}
    }

    memoryApplications.unshift(newApp);
    return { application: newApp };
  },

  async updateApplicationStatus(
    id: string,
    status: IApplication['status'],
    notes?: string
  ): Promise<IApplication | null> {
    const idx = memoryApplications.findIndex((a) => a._id === id || a.applicationId === id);
    if (idx === -1) return null;

    memoryApplications[idx] = {
      ...memoryApplications[idx],
      status,
      notes: notes !== undefined ? notes : memoryApplications[idx].notes,
      updatedAt: new Date().toISOString(),
    };
    return memoryApplications[idx];
  },

  async getAllApplications(): Promise<any[]> {
    // Enrich with user and job details
    return memoryApplications.map((app) => {
      const user = memoryUsers.find((u) => u._id === app.userId);
      const job = memoryJobs.find((j) => j._id === app.jobId || j.jobId === app.jobId);
      const resume = memoryResumes.find((r) => r._id === app.resumeId);

      return {
        ...app,
        user: user
          ? {
              _id: user._id,
              name: user.name,
              email: user.email,
              phone: user.phone,
              location: user.location,
            }
          : { name: 'Applicant', email: 'applicant@example.com' },
        job: job
          ? {
              _id: job._id,
              jobId: job.jobId,
              title: job.title,
              company: job.company,
              location: job.location,
              employmentType: job.employmentType,
            }
          : { title: 'Unknown Job', company: 'Company' },
        resume: resume ? { _id: resume._id, title: resume.title } : null,
      };
    });
  },

  // ADMIN DASHBOARD STATS
  async getAdminStats() {
    const totalUsers = memoryUsers.length;
    const totalJobs = memoryJobs.length;
    const activeJobs = memoryJobs.filter((j) => j.isActive).length;
    const totalApplications = memoryApplications.length;

    const statusCounts = {
      applied: memoryApplications.filter((a) => a.status === 'Applied').length,
      underReview: memoryApplications.filter((a) => a.status === 'Under Review').length,
      interview: memoryApplications.filter((a) => a.status === 'Interview').length,
      selected: memoryApplications.filter((a) => a.status === 'Selected').length,
      rejected: memoryApplications.filter((a) => a.status === 'Rejected').length,
      withdrawn: memoryApplications.filter((a) => a.status === 'Withdrawn').length,
    };

    return {
      totalUsers,
      totalJobs,
      activeJobs,
      totalApplications,
      statusCounts,
      databaseStatus: isMongoConnected ? 'MongoDB (Connected)' : 'Local Storage Engine (Active)',
    };
  },
};
