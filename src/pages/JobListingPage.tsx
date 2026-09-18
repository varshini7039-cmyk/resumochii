import {
  Briefcase,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  Filter,
  Layers,
  MapPin,
  Search,
  Send,
  Sparkles,
  X,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import { Job, Resume } from '../types';
import { AiJobMatchingModal } from './AiJobMatchingModal';

interface JobListingPageProps {
  onNavigate: (page: string) => void;
  selectedJobInit?: Job | null;
}

export const JobListingPage: React.FC<JobListingPageProps> = ({ onNavigate, selectedJobInit }) => {
  const { user, isAuthenticated } = useAuth();
  const { success, error } = useToast();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [skillFilter, setSkillFilter] = useState('');

  // Modals
  const [matchingJob, setMatchingJob] = useState<Job | null>(null);
  const [applyingJob, setApplyingJob] = useState<Job | null>(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [submittingApp, setSubmittingApp] = useState(false);

  // User resumes for apply dialog
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<string>('');

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await api.jobs.getAll({
        search: search || undefined,
        location: locationFilter || undefined,
        employmentType: typeFilter || undefined,
        experienceLevel: levelFilter || undefined,
        skills: skillFilter || undefined,
      });

      if (res.success && res.jobs) {
        setJobs(res.jobs);
      }
    } catch (err: any) {
      error(err.message || 'Failed to load jobs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [search, locationFilter, typeFilter, levelFilter, skillFilter]);

  // Load resumes when applying
  useEffect(() => {
    if (isAuthenticated) {
      api.resumes.getAll().then((res) => {
        if (res.success && res.resumes.length > 0) {
          setResumes(res.resumes);
          setSelectedResumeId(res.resumes[0]._id);
        }
      }).catch(() => {});
    }
  }, [isAuthenticated]);

  const handleClearFilters = () => {
    setSearch('');
    setLocationFilter('');
    setTypeFilter('');
    setLevelFilter('');
    setSkillFilter('');
  };

  const handleOpenApply = (job: Job) => {
    if (!isAuthenticated) {
      onNavigate('login');
      return;
    }
    setApplyingJob(job);
    setCoverLetter('');
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyingJob) return;

    try {
      setSubmittingApp(true);
      const res = await api.applications.apply({
        jobId: applyingJob._id,
        resumeId: selectedResumeId || undefined,
        coverLetter: coverLetter.trim() || undefined,
      });

      if (res.success) {
        success(res.message || 'Application submitted successfully!');
        setApplyingJob(null);
      }
    } catch (err: any) {
      error(err.message || 'Failed to submit application.');
    } finally {
      setSubmittingApp(false);
    }
  };

  const activeFilterCount = [
    Boolean(search),
    Boolean(locationFilter),
    Boolean(typeFilter),
    Boolean(levelFilter),
    Boolean(skillFilter),
  ].filter(Boolean).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Job Opportunities</h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200">
              {jobs.length} Available
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Explore active software engineering roles and run AI skill gap analyses against your resume.
          </p>
        </div>

        {isAuthenticated && (
          <button
            onClick={() => onNavigate('recommendations')}
            className="px-4 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl transition-colors flex items-center gap-1.5 self-start md:self-auto"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            AI Recommended For You &rarr;
          </button>
        )}
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Keyword Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Job title, skills, or company..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            />
          </div>

          {/* Location */}
          <div className="relative">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              placeholder="City, State, or Remote..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            />
          </div>

          {/* Employment Type */}
          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            >
              <option value="">All Employment Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
              <option value="Remote">Remote</option>
            </select>
          </div>

          {/* Experience Level */}
          <div>
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            >
              <option value="">All Experience Levels</option>
              <option value="Intern">Intern</option>
              <option value="Entry-level">Entry-level / Fresher</option>
              <option value="Mid-level">Mid-level (2-4 yrs)</option>
              <option value="Senior">Senior (5+ yrs)</option>
            </select>
          </div>
        </div>

        {/* Clear Filters indicator */}
        {activeFilterCount > 0 && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
            <span>{activeFilterCount} active filters</span>
            <button
              onClick={handleClearFilters}
              className="text-indigo-600 font-semibold hover:underline flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Jobs Grid */}
      {loading ? (
        <div className="py-16 text-center space-y-2">
          <p className="text-sm font-semibold text-slate-700">Loading Job Opportunities...</p>
        </div>
      ) : jobs.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <Briefcase className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="font-bold text-slate-900">No matching jobs found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search criteria or resetting filters to see all available openings.
          </p>
          <button
            onClick={handleClearFilters}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-xl"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => {
            const userSkills = user?.skills || [];
            const matchingCount = job.skills.filter((s) => userSkills.includes(s)).length;
            const matchScore = Math.round((matchingCount / Math.max(job.skills.length, 1)) * 100);

            return (
              <div
                key={job._id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-indigo-200 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between p-5 space-y-4"
              >
                <div>
                  {/* Top Badge & Date */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {job.employmentType}
                    </span>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(job.postedAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Title & Company */}
                  <h3 className="font-bold text-slate-900 text-base hover:text-indigo-600 transition-colors">
                    {job.title}
                  </h3>
                  <p className="text-xs font-semibold text-slate-700 mb-1">{job.company}</p>
                  <p className="text-xs text-slate-500 mb-3 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {job.location}
                  </p>

                  {/* Description snippet */}
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
                    {job.description}
                  </p>

                  {/* Skill Badges */}
                  <div className="flex flex-wrap gap-1 mb-2">
                    {job.skills.slice(0, 4).map((s) => (
                      <span
                        key={s}
                        className={`text-[10px] px-2 py-0.5 rounded-md font-medium ${
                          userSkills.includes(s)
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {s}
                      </span>
                    ))}
                    {job.skills.length > 4 && (
                      <span className="text-[10px] text-slate-400 self-center">
                        +{job.skills.length - 4}
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Footer: Salary + Actions */}
                <div className="pt-3 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">{job.salary || 'Competitive'}</span>
                    {isAuthenticated && userSkills.length > 0 && (
                      <span className="text-[11px] font-bold text-emerald-600">
                        {matchScore}% Skill Match
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setMatchingJob(job)}
                      className="px-3 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors flex items-center justify-center gap-1 border border-indigo-200"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      AI Match
                    </button>
                    <button
                      onClick={() => handleOpenApply(job)}
                      className="px-3 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors flex items-center justify-center gap-1 shadow-2xs"
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* AI Job Matching Modal */}
      {matchingJob && (
        <AiJobMatchingModal
          job={matchingJob}
          isOpen={Boolean(matchingJob)}
          onClose={() => setMatchingJob(null)}
          onApply={(j) => handleOpenApply(j)}
        />
      )}

      {/* Apply Modal */}
      {applyingJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4 my-auto">
            <div className="flex items-start justify-between border-b pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Apply for Position</h3>
                <p className="text-xs text-slate-500">
                  {applyingJob.title} at {applyingJob.company}
                </p>
              </div>
              <button
                onClick={() => setApplyingJob(null)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitApplication} className="space-y-4">
              {/* Select Resume */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Select Resume to Attach</label>
                {resumes.length > 0 ? (
                  <select
                    value={selectedResumeId}
                    onChange={(e) => setSelectedResumeId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  >
                    {resumes.map((r) => (
                      <option key={r._id} value={r._id}>
                        {r.title} (Updated {new Date(r.updatedAt || '').toLocaleDateString()})
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-xs text-amber-700 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                    No custom resume saved yet. Your profile details will be submitted as your candidate profile.
                  </p>
                )}
              </div>

              {/* Cover Letter */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Cover Note / Pitch (Optional)
                </label>
                <textarea
                  rows={4}
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Briefly explain why you're a great fit for this position..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setApplyingJob(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingApp}
                  className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-2xs flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  {submittingApp ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
