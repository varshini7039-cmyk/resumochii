import {
  AdminStats,
  AiJobMatchResult,
  AiJobRecommendation,
  AiResumeAnalysis,
  Application,
  Job,
  Resume,
  User,
} from '../types';

const TOKEN_KEY = 'resumochi_auth_token';

export const authStorage = {
  getToken: () => localStorage.getItem(TOKEN_KEY) || localStorage.getItem('skill_vedanth_auth_token'),
  setToken: (token: string) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.removeItem('skill_vedanth_auth_token');
  },
  removeToken: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem('skill_vedanth_auth_token');
  },
};

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = authStorage.getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data;
}

export const api = {
  // Auth API
  auth: {
    register: (payload: { name: string; email: string; password: string; confirmPassword?: string }) =>
      request<{ success: boolean; token: string; user: User }>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    login: (payload: { email: string; password: string }) =>
      request<{ success: boolean; token: string; user: User }>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    getMe: () => request<{ success: boolean; user: User }>('/api/auth/me'),
    logout: () => request<{ success: boolean }>('/api/auth/logout', { method: 'POST' }),
  },

  // Profile API
  users: {
    getProfile: () => request<{ success: boolean; user: User }>('/api/users/profile'),
    updateProfile: (profileData: Partial<User>) =>
      request<{ success: boolean; user: User; message: string }>('/api/users/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData),
      }),
  },

  // Resumes API
  resumes: {
    getAll: () => request<{ success: boolean; resumes: Resume[] }>('/api/resumes'),
    getById: (id: string) => request<{ success: boolean; resume: Resume }>(`/api/resumes/${id}`),
    create: (resumeData: Partial<Resume>) =>
      request<{ success: boolean; resume: Resume; message: string }>('/api/resumes', {
        method: 'POST',
        body: JSON.stringify(resumeData),
      }),
    update: (id: string, resumeData: Partial<Resume>) =>
      request<{ success: boolean; resume: Resume; message: string }>(`/api/resumes/${id}`, {
        method: 'PUT',
        body: JSON.stringify(resumeData),
      }),
    delete: (id: string) =>
      request<{ success: boolean; message: string }>(`/api/resumes/${id}`, {
        method: 'DELETE',
      }),
  },

  // Jobs API
  jobs: {
    getAll: (params?: {
      search?: string;
      location?: string;
      skills?: string;
      employmentType?: string;
      experienceLevel?: string;
    }) => {
      const query = new URLSearchParams();
      if (params?.search) query.append('search', params.search);
      if (params?.location) query.append('location', params.location);
      if (params?.skills) query.append('skills', params.skills);
      if (params?.employmentType) query.append('employmentType', params.employmentType);
      if (params?.experienceLevel) query.append('experienceLevel', params.experienceLevel);
      const qs = query.toString();
      return request<{ success: boolean; count: number; jobs: Job[] }>(`/api/jobs${qs ? `?${qs}` : ''}`);
    },
    getById: (id: string) => request<{ success: boolean; job: Job }>(`/api/jobs/${id}`),
  },

  // Applications API
  applications: {
    getAll: () =>
      request<{
        success: boolean;
        count: number;
        stats: {
          total: number;
          underReview: number;
          interview: number;
          selected: number;
          rejected: number;
          applied: number;
        };
        applications: Application[];
      }>('/api/applications'),
    apply: (payload: { jobId: string; resumeId?: string; coverLetter?: string }) =>
      request<{ success: boolean; message: string; application: Application }>('/api/applications', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    withdraw: (id: string) =>
      request<{ success: boolean; message: string }>(`/api/applications/${id}`, {
        method: 'DELETE',
      }),
  },

  // AI API
  ai: {
    improveResume: (payload: { resumeId?: string; resumeData?: any }) =>
      request<{ success: boolean; analysis: AiResumeAnalysis }>('/api/ai/improve-resume', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    matchJob: (payload: { jobId: string; resumeId?: string }) =>
      request<{ success: boolean; match: AiJobMatchResult }>('/api/ai/match-job', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    recommendJobs: (payload?: { resumeId?: string }) =>
      request<{ success: boolean; count: number; recommendations: AiJobRecommendation[] }>(
        '/api/ai/recommend-jobs',
        {
          method: 'POST',
          body: JSON.stringify(payload || {}),
        }
      ),
  },

  // Admin API
  admin: {
    getDashboard: () =>
      request<{
        success: boolean;
        stats: AdminStats;
        recentApplications: Application[];
        recentJobs: Job[];
      }>('/api/admin/dashboard'),
    getJobs: () => request<{ success: boolean; count: number; jobs: Job[] }>('/api/admin/jobs'),
    createJob: (jobData: Partial<Job>) =>
      request<{ success: boolean; message: string; job: Job }>('/api/admin/jobs', {
        method: 'POST',
        body: JSON.stringify(jobData),
      }),
    updateJob: (id: string, jobData: Partial<Job>) =>
      request<{ success: boolean; message: string; job: Job }>(`/api/admin/jobs/${id}`, {
        method: 'PUT',
        body: JSON.stringify(jobData),
      }),
    deleteJob: (id: string) =>
      request<{ success: boolean; message: string }>(`/api/admin/jobs/${id}`, {
        method: 'DELETE',
      }),
    getApplications: () =>
      request<{ success: boolean; count: number; applications: Application[] }>('/api/admin/applications'),
    updateApplicationStatus: (id: string, status: string, notes?: string) =>
      request<{ success: boolean; message: string; application: Application }>(
        `/api/admin/applications/${id}/status`,
        {
          method: 'PUT',
          body: JSON.stringify({ status, notes }),
        }
      ),
    getUsers: () => request<{ success: boolean; count: number; users: User[] }>('/api/admin/users'),
  },
  system: {
    health: () => request<{ status: string; database: string; timestamp: string }>('/api/health'),
  },
};
