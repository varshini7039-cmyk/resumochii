import {
  Briefcase,
  CheckCircle2,
  Clock,
  Database,
  Eye,
  FileText,
  Plus,
  Shield,
  TrendingUp,
  Users,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { AdminStats, Application, Job } from '../../types';

interface AdminDashboardPageProps {
  onNavigate: (page: string) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onNavigate }) => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentApps, setRecentApps] = useState<Application[]>([]);
  const [recentJobs, setRecentJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAdminData() {
      try {
        setLoading(true);
        const res = await api.admin.getDashboard();
        if (res.success) {
          setStats(res.stats);
          setRecentApps(res.recentApplications || []);
          setRecentJobs(res.recentJobs || []);
        }
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    }

    loadAdminData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Admin Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-amber-900 text-white p-6 sm:p-8 rounded-2xl shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 text-xs font-semibold mb-3 border border-pink-400/30">
            <Shield className="w-3.5 h-3.5 text-pink-400" />
            <span>Recruiter &amp; Administrator Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2 font-heading">
            ResuMochi Admin Console 🍡
          </h1>
          <p className="text-pink-100/90 text-sm max-w-2xl leading-relaxed">
            Monitor candidate placement metrics, publish new vacancies, update application pipelines, and inspect user activity.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onNavigate('admin-jobs')}
            className="px-4 py-2 text-xs font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors shadow-2xs flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            Post New Job
          </button>
          <button
            onClick={() => onNavigate('admin-applications')}
            className="px-4 py-2 text-xs font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-colors"
          >
            Review Applications &rarr;
          </button>
        </div>
      </div>

      {/* Admin Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Registered Users</span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-3xl font-black text-slate-900 mb-1">{stats?.totalUsers || 0}</p>
          <button onClick={() => onNavigate('admin-users')} className="text-xs text-indigo-600 font-semibold hover:underline">
            Manage candidates &rarr;
          </button>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Job Postings</span>
            <Briefcase className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-3xl font-black text-slate-900 mb-1">{stats?.activeJobs || 0}</p>
          <button onClick={() => onNavigate('admin-jobs')} className="text-xs text-indigo-600 font-semibold hover:underline">
            Manage listings &rarr;
          </button>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Candidate Applications</span>
            <FileText className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-3xl font-black text-slate-900 mb-1">{stats?.totalApplications || 0}</p>
          <button onClick={() => onNavigate('admin-applications')} className="text-xs text-indigo-600 font-semibold hover:underline">
            Review submissions &rarr;
          </button>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Storage Engine</span>
            <Database className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-base font-bold text-slate-900 mb-1 truncate">
            {stats?.databaseStatus || 'Unified Store'}
          </p>
          <p className="text-xs text-emerald-600 font-semibold">Active &amp; Ready</p>
        </div>
      </div>

      {/* 2 Column View: Recent Applications & Recent Postings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Applications Table */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm">Recent Applicant Submissions</h3>
            <button
              onClick={() => onNavigate('admin-applications')}
              className="text-xs text-indigo-600 font-semibold hover:underline"
            >
              View All &rarr;
            </button>
          </div>

          {recentApps.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No applications logged yet.</p>
          ) : (
            <div className="space-y-3">
              {recentApps.map((app) => (
                <div key={app._id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-slate-900">{app.user?.name || 'Applicant'}</p>
                    <p className="text-slate-500">
                      Applied for: <span className="font-semibold text-slate-700">{app.job?.title}</span>
                    </p>
                    <span className="text-[10px] text-slate-400">
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </span>
                  </div>
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
              ))}
            </div>
          )}
        </div>

        {/* Recent Jobs Table */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm">Active Job Openings</h3>
            <button
              onClick={() => onNavigate('admin-jobs')}
              className="text-xs text-indigo-600 font-semibold hover:underline"
            >
              Manage All &rarr;
            </button>
          </div>

          {recentJobs.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No job postings created.</p>
          ) : (
            <div className="space-y-3">
              {recentJobs.map((job) => (
                <div key={job._id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-slate-900">{job.title}</p>
                    <p className="text-slate-500">{job.company} • {job.location}</p>
                    <span className="text-[10px] text-slate-400">
                      Posted: {new Date(job.postedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {job.employmentType}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
