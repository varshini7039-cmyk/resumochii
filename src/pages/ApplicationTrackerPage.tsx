import {
  AlertCircle,
  ArrowRight,
  Briefcase,
  CheckCircle2,
  Clock,
  Filter,
  Trash2,
  XCircle,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import { Application } from '../types';

interface ApplicationTrackerPageProps {
  onNavigate: (page: string) => void;
}

export const ApplicationTrackerPage: React.FC<ApplicationTrackerPageProps> = ({ onNavigate }) => {
  const { success, error } = useToast();
  const [applications, setApplications] = useState<Application[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    underReview: 0,
    interview: 0,
    selected: 0,
    rejected: 0,
    applied: 0,
  });
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await api.applications.getAll();
      if (res.success) {
        setApplications(res.applications);
        if (res.stats) setStats(res.stats);
      }
    } catch (err: any) {
      error(err.message || 'Failed to load applications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleWithdraw = async (appId: string) => {
    if (!window.confirm('Are you sure you want to withdraw this application?')) return;
    try {
      const res = await api.applications.withdraw(appId);
      if (res.success) {
        success('Application withdrawn.');
        fetchApplications();
      }
    } catch (err: any) {
      error(err.message || 'Failed to withdraw application.');
    }
  };

  const filteredApps = applications.filter((app) => {
    if (filterStatus === 'All') return true;
    return app.status === filterStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Application Tracker</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Monitor the status of every role you've applied for in real-time.
          </p>
        </div>

        <button
          onClick={() => onNavigate('jobs')}
          className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-2xs flex items-center gap-1.5 self-start sm:self-auto"
        >
          Find More Jobs
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 5 Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Total Applied</span>
          <p className="text-2xl font-black text-slate-900">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-sky-600 uppercase tracking-wider block mb-1">Under Review</span>
          <p className="text-2xl font-black text-sky-900">{stats.underReview}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-purple-600 uppercase tracking-wider block mb-1">Interviewing</span>
          <p className="text-2xl font-black text-purple-900">{stats.interview}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider block mb-1">Selected</span>
          <p className="text-2xl font-black text-emerald-900">{stats.selected}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-rose-600 uppercase tracking-wider block mb-1">Rejected</span>
          <p className="text-2xl font-black text-rose-900">{stats.rejected}</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-2xs">
        {['All', 'Applied', 'Under Review', 'Interview', 'Selected', 'Rejected'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              filterStatus === status
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Applications List */}
      {loading ? (
        <div className="py-16 text-center space-y-2">
          <p className="text-sm font-semibold text-slate-700">Loading Applications...</p>
        </div>
      ) : filteredApps.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <Briefcase className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="font-bold text-slate-900">No applications found in this view</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {filterStatus === 'All'
              ? "You haven't submitted any job applications yet. Browse openings and submit your resume!"
              : `No applications currently in '${filterStatus}' status.`}
          </p>
          <button
            onClick={() => onNavigate('jobs')}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-xl"
          >
            Explore Job Openings
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApps.map((app) => (
            <div
              key={app._id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">
                    {app.job?.title || 'Job Title'}
                  </h3>
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

                <p className="text-xs font-semibold text-slate-600">
                  {app.job?.company || 'Company'} • {app.job?.location || 'Location'}
                </p>

                <p className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Applied on {new Date(app.appliedAt).toLocaleDateString()}
                  {app.notes && (
                    <span className="text-slate-500 font-medium ml-2">
                      • Note: {app.notes}
                    </span>
                  )}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {app.status !== 'Withdrawn' && app.status !== 'Rejected' && (
                  <button
                    onClick={() => handleWithdraw(app._id)}
                    className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-slate-200"
                  >
                    Withdraw
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
