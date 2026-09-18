import {
  ArrowRight,
  Award,
  Briefcase,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileCheck,
  FileEdit,
  MapPin,
  Sparkles,
  TrendingUp,
  UserCheck,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Application, Job, Resume } from '../types';

interface DashboardPageProps {
  onNavigate: (page: string) => void;
  onSelectJob?: (job: Job) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate, onSelectJob }) => {
  const { user } = useAuth();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [recommendedJobs, setRecommendedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        const [resumesRes, appsRes, jobsRes] = await Promise.all([
          api.resumes.getAll().catch(() => ({ success: false, resumes: [] })),
          api.applications.getAll().catch(() => ({ success: false, applications: [], stats: { total: 0 } })),
          api.jobs.getAll().catch(() => ({ success: false, jobs: [] })),
        ]);

        if (resumesRes.success) setResumes(resumesRes.resumes);
        if (appsRes.success) setApplications(appsRes.applications);

        // Pick top 3 recommended jobs
        if (jobsRes.success && jobsRes.jobs) {
          const userSkills = user?.skills || [];
          const sorted = [...jobsRes.jobs].sort((a, b) => {
            const matchA = a.skills.filter((s) => userSkills.includes(s)).length;
            const matchB = b.skills.filter((s) => userSkills.includes(s)).length;
            return matchB - matchA;
          });
          setRecommendedJobs(sorted.slice(0, 3));
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, [user]);

  const activeResume = resumes.length > 0 ? resumes[0] : null;
  const profileCompletion = user?.profileCompletion || 65;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-pink-950 via-purple-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-pink-950/20 relative overflow-hidden border border-pink-500/20">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 text-xs font-bold mb-3 border border-pink-400/30">
            <Sparkles className="w-3.5 h-3.5 text-pink-300" />
            <span>ResuMochi Career Radar Active 🍡</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2 font-heading">
            Welcome back, {user?.name || 'Friend'}! ✨
          </h1>
          <p className="text-pink-100/90 text-sm leading-relaxed mb-6">
            Your cute AI career toolkit is ready. Update your skills, polish your resume against ATS criteria, and apply to hand-picked opportunities tailored to your profile.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              id="dash-btn-builder"
              onClick={() => onNavigate('resume-builder')}
              className="px-4 py-2 text-xs sm:text-sm font-bold text-slate-900 bg-white hover:bg-pink-50 rounded-2xl transition-all shadow-xs flex items-center gap-2 active:scale-95"
            >
              <FileEdit className="w-4 h-4 text-pink-600" />
              {activeResume ? 'Edit Mochi Resume' : 'Create Resume 🍡'}
            </button>
            <button
              id="dash-btn-ai-improve"
              onClick={() => onNavigate('ai-resume')}
              className="px-4 py-2 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-pink-500 to-violet-600 hover:opacity-90 rounded-2xl transition-all shadow-xs flex items-center gap-2 border border-pink-400/30 active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              AI Resume Polish ✨
            </button>
            <button
              id="dash-btn-explore-jobs"
              onClick={() => onNavigate('jobs')}
              className="px-4 py-2 text-xs sm:text-sm font-bold text-pink-200 hover:text-white rounded-2xl transition-colors"
            >
              Find Jobs &rarr;
            </button>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-pink-500/20 to-transparent pointer-events-none hidden md:block"></div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Profile Completion */}
        <div className="bg-white p-5 rounded-2xl border border-pink-100 shadow-2xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Profile Strength</span>
            <span className="text-xs font-bold text-pink-600">{profileCompletion}%</span>
          </div>
          <div className="w-full bg-pink-50 h-2.5 rounded-full overflow-hidden mb-3">
            <div
              className="bg-gradient-to-r from-pink-500 to-violet-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${profileCompletion}%` }}
            ></div>
          </div>
          <p className="text-xs text-slate-500 flex items-center justify-between">
            <span>{user?.skills?.length || 0} skills listed</span>
            <button onClick={() => onNavigate('profile')} className="text-pink-600 font-bold hover:underline">
              Edit profile &rarr;
            </button>
          </p>
        </div>

        {/* Total Applications */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Applications</span>
            <Briefcase className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 mb-1">{applications.length}</p>
          <p className="text-xs text-slate-500 flex items-center justify-between">
            <span>
              {applications.filter((a) => a.status === 'Under Review' || a.status === 'Interview').length} active in pipeline
            </span>
            <button onClick={() => onNavigate('applications')} className="text-indigo-600 font-semibold hover:underline">
              View all &rarr;
            </button>
          </p>
        </div>

        {/* Resume Status */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Resume Status</span>
            <FileCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-lg font-bold text-slate-900 mb-1 truncate">
            {activeResume ? activeResume.title : 'No Resume Yet'}
          </p>
          <p className="text-xs text-slate-500 flex items-center justify-between">
            <span>{activeResume ? 'ATS Optimized' : 'Setup required'}</span>
            <button onClick={() => onNavigate('resume-builder')} className="text-indigo-600 font-semibold hover:underline">
              {activeResume ? 'Preview' : 'Create'} &rarr;
            </button>
          </p>
        </div>

        {/* AI Recommendations */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">AI Skill Matches</span>
            <Sparkles className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 mb-1">{recommendedJobs.length}+</p>
          <p className="text-xs text-slate-500 flex items-center justify-between">
            <span>Based on your profile</span>
            <button onClick={() => onNavigate('recommendations')} className="text-indigo-600 font-semibold hover:underline">
              Match jobs &rarr;
            </button>
          </p>
        </div>
      </div>

      {/* Recommended Jobs & Recent Applications Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recommended Jobs Column (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                Recommended Jobs For You
              </h2>
              <p className="text-xs text-slate-500">Personalized matches based on your technical skills and profile</p>
            </div>
            <button
              onClick={() => onNavigate('recommendations')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              View all recommendations <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {recommendedJobs.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-sm">
                No job postings found. Check back soon or browse the full listings.
              </div>
            ) : (
              recommendedJobs.map((job) => {
                const userSkills = user?.skills || [];
                const matchedCount = job.skills.filter((s) => userSkills.includes(s)).length;
                const matchPct = Math.round((matchedCount / Math.max(job.skills.length, 1)) * 100);

                return (
                  <div
                    key={job._id}
                    className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-indigo-200 shadow-2xs hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-slate-900 hover:text-indigo-600 transition-colors">
                          {job.title}
                        </h3>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                          {job.employmentType}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-slate-600 mb-2">
                        {job.company} • <MapPin className="w-3 h-3 inline text-slate-400" /> {job.location}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {job.skills.slice(0, 4).map((skill) => (
                          <span
                            key={skill}
                            className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${
                              userSkills.includes(skill)
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {skill}
                          </span>
                        ))}
                        {job.skills.length > 4 && (
                          <span className="text-[11px] text-slate-400 self-center">
                            +{job.skills.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <span className="text-xs font-bold text-emerald-600 block">{matchPct}% Match</span>
                        <span className="text-[10px] text-slate-400">{job.salary || 'Competitive'}</span>
                      </div>
                      <button
                        onClick={() => {
                          if (onSelectJob) onSelectJob(job);
                          onNavigate('jobs');
                        }}
                        className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
                      >
                        View Job
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Sidebar: Recent Applications & AI Quick Actions */}
        <div className="space-y-6">
          {/* Recent Applications Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-slate-500" />
                Recent Applications
              </h3>
              <button
                onClick={() => onNavigate('applications')}
                className="text-xs text-indigo-600 font-semibold hover:underline"
              >
                Track &rarr;
              </button>
            </div>

            {applications.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">
                You haven't submitted any applications yet. Browse jobs to apply!
              </p>
            ) : (
              <div className="space-y-3">
                {applications.slice(0, 3).map((app) => (
                  <div key={app._id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                    <div className="flex items-start justify-between mb-1">
                      <p className="font-bold text-slate-900">{app.job?.title || 'Role Title'}</p>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          app.status === 'Selected'
                            ? 'bg-emerald-100 text-emerald-800'
                            : app.status === 'Interview'
                            ? 'bg-purple-100 text-purple-800'
                            : app.status === 'Under Review'
                            ? 'bg-sky-100 text-sky-800'
                            : app.status === 'Rejected'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {app.status}
                      </span>
                    </div>
                    <p className="text-slate-500">{app.job?.company || 'Company'}</p>
                    <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Applied: {new Date(app.appliedAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick AI Pro-Tip Box */}
          <div className="p-5 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-950">
            <div className="flex items-center gap-2 mb-2 text-indigo-700 font-bold text-xs">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>AI Resume Optimization Tip</span>
            </div>
            <p className="text-xs text-indigo-900 leading-relaxed mb-3">
              Recruiters and ATS scanners prioritize quantified achievements (e.g. "increased speed by 40%") over passive descriptions. Run our AI optimizer to transform your project bullet points.
            </p>
            <button
              onClick={() => onNavigate('ai-resume')}
              className="text-xs font-bold text-indigo-700 hover:text-indigo-800 underline"
            >
              Analyze Resume with AI &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
