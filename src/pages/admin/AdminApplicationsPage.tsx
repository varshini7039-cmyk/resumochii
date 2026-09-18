import {
  ArrowLeft,
  Briefcase,
  CheckCircle2,
  Clock,
  Edit2,
  FileText,
  Mail,
  Phone,
  Search,
  User as UserIcon,
  X,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { api } from '../../services/api';
import { Application } from '../../types';

interface AdminApplicationsPageProps {
  onNavigate: (page: string) => void;
}

export const AdminApplicationsPage: React.FC<AdminApplicationsPageProps> = ({ onNavigate }) => {
  const { success, error } = useToast();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  // Status Update Modal
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [newStatus, setNewStatus] = useState<string>('Under Review');
  const [notes, setNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await api.admin.getApplications();
      if (res.success && res.applications) {
        setApplications(res.applications);
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

  const handleOpenStatusModal = (app: Application) => {
    setSelectedApp(app);
    setNewStatus(app.status);
    setNotes(app.notes || '');
  };

  const handleSaveStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp) return;

    try {
      setUpdating(true);
      const res = await api.admin.updateApplicationStatus(selectedApp._id, newStatus, notes);
      if (res.success) {
        success(`Candidate status updated to '${newStatus}'.`);
        setSelectedApp(null);
        fetchApplications();
      }
    } catch (err: any) {
      error(err.message || 'Failed to update status.');
    } finally {
      setUpdating(false);
    }
  };

  const filtered = applications.filter((app) => {
    const matchesSearch =
      (app.user?.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (app.job?.title || '').toLowerCase().includes(search.toLowerCase()) ||
      (app.job?.company || '').toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'All' || app.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <button
            onClick={() => onNavigate('admin-dashboard')}
            className="text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Admin Console
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Review Candidate Applications</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Screen applicant profiles, update interview statuses, and log recruiter feedback.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="relative max-w-md w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search candidate name, job title, or company..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {['All', 'Applied', 'Under Review', 'Interview', 'Selected', 'Rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                filterStatus === status
                  ? 'bg-amber-400 text-slate-900 font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
                <th className="p-4">Candidate Details</th>
                <th className="p-4">Job Applied For</th>
                <th className="p-4">Applied Date</th>
                <th className="p-4">Current Status</th>
                <th className="p-4">Recruiter Notes</th>
                <th className="p-4 text-right">Update Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    Loading applications...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    No applications found matching criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((app) => (
                  <tr key={app._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-4">
                      <p className="font-bold text-slate-900">{app.user?.name || 'Applicant'}</p>
                      <p className="text-slate-500">{app.user?.email}</p>
                      {app.user?.phone && (
                        <p className="text-[10px] text-slate-400">{app.user.phone}</p>
                      )}
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-slate-900">{app.job?.title || 'Job'}</p>
                      <p className="text-slate-500">{app.job?.company}</p>
                    </td>
                    <td className="p-4 text-slate-600">
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
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
                    </td>
                    <td className="p-4 text-slate-600 max-w-xs truncate">
                      {app.notes || '—'}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleOpenStatusModal(app)}
                        className="px-3 py-1.5 text-xs font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors inline-flex items-center gap-1"
                      >
                        <Edit2 className="w-3 h-3" />
                        Status
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Status Update Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-4 my-auto">
            <div className="flex items-start justify-between border-b pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Update Application Status</h3>
                <p className="text-xs text-slate-500">
                  {selectedApp.user?.name} for {selectedApp.job?.title}
                </p>
              </div>
              <button onClick={() => setSelectedApp(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStatus} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Application Stage</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                >
                  <option value="Applied">Applied</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Interview">Interview</option>
                  <option value="Selected">Selected / Offer Extended</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Recruiter Feedback / Next Steps Notes
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Cleared round 1 technical screen. Scheduled system design interview on Friday at 3 PM..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs leading-relaxed"
                />
              </div>

              {selectedApp.coverLetter && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                  <span className="font-bold text-slate-700 block mb-1">Applicant Cover Note:</span>
                  <p className="text-slate-600 italic">"{selectedApp.coverLetter}"</p>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedApp(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-5 py-2 text-xs font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors shadow-2xs disabled:opacity-50"
                >
                  {updating ? 'Updating...' : 'Save Stage Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
