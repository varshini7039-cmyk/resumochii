import {
  AlertCircle,
  ArrowRight,
  Award,
  BookOpen,
  Briefcase,
  CheckCircle2,
  Clock,
  ExternalLink,
  Lightbulb,
  RefreshCw,
  Sparkles,
  X,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import { AiJobMatchResult, Job } from '../types';

interface AiJobMatchingModalProps {
  job: Job;
  isOpen: boolean;
  onClose: () => void;
  onApply: (job: Job) => void;
}

export const AiJobMatchingModal: React.FC<AiJobMatchingModalProps> = ({
  job,
  isOpen,
  onClose,
  onApply,
}) => {
  const { user } = useAuth();
  const { error } = useToast();
  const [matchResult, setMatchResult] = useState<AiJobMatchResult | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && job) {
      fetchMatchAnalysis();
    } else {
      setMatchResult(null);
    }
  }, [isOpen, job]);

  const fetchMatchAnalysis = async () => {
    try {
      setLoading(true);
      const res = await api.ai.matchJob({ jobId: job._id });
      if (res.success && res.match) {
        setMatchResult(res.match);
      }
    } catch (err: any) {
      error(err.message || 'Failed to analyze job match.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white flex items-start justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 text-[11px] font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
              <span>Google Gemini AI Match Analysis</span>
            </div>
            <h2 className="text-xl font-bold">{job.title}</h2>
            <p className="text-xs text-indigo-200">
              {job.company} • {job.location} • {job.employmentType}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-indigo-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-800">
          {loading && (
            <div className="py-16 text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
              <p className="text-sm font-semibold text-slate-700">Evaluating Skill Compatibility...</p>
              <p className="text-xs text-slate-400">Comparing your profile proficiencies against {job.company}'s requirements.</p>
            </div>
          )}

          {matchResult && !loading && (
            <div className="space-y-6">
              {/* Score card */}
              <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">
                    Calculated Compatibility
                  </span>
                  <h3 className="text-2xl font-black text-indigo-950 mt-0.5">
                    {matchResult.matchScore}% Match
                  </h3>
                  <p className="text-xs text-indigo-800/80 mt-1 max-w-sm">
                    {matchResult.matchExplanation}
                  </p>
                </div>
                <div className="w-16 h-16 rounded-full bg-white border-4 border-indigo-600 flex items-center justify-center font-black text-indigo-700 text-lg shadow-xs">
                  {matchResult.matchScore}%
                </div>
              </div>

              {/* Skills Breakdown */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Skills Assessment
                </h4>

                {/* Matching Skills */}
                <div>
                  <span className="text-xs font-semibold text-emerald-700 block mb-1.5 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Matching Skills ({matchResult.matchingSkills.length})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {matchResult.matchingSkills.length > 0 ? (
                      matchResult.matchingSkills.map((s) => (
                        <span
                          key={s}
                          className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-medium"
                        >
                          {s}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400 italic">No exact matching skills found.</span>
                    )}
                  </div>
                </div>

                {/* Missing Skills */}
                {matchResult.missingSkills.length > 0 && (
                  <div>
                    <span className="text-xs font-semibold text-amber-800 block mb-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      Missing / Recommended Skills ({matchResult.missingSkills.length})
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {matchResult.missingSkills.map((s) => (
                        <span
                          key={s}
                          className="px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 border border-amber-200 text-xs font-medium"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Actionable Learning Roadmap */}
              {matchResult.learningRoadmap && matchResult.learningRoadmap.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                    Skill Gap Learning Roadmap
                  </h4>
                  <div className="space-y-2">
                    {matchResult.learningRoadmap.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-start justify-between text-xs"
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-slate-900">{item.skill}</span>
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                                item.priority === 'High'
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'bg-indigo-100 text-indigo-800'
                              }`}
                            >
                              {item.priority} Priority
                            </span>
                          </div>
                          <p className="text-slate-600 text-[11px]">{item.recommendedResource}</p>
                        </div>
                        <span className="text-slate-500 text-[11px] flex items-center gap-1 shrink-0">
                          <Clock className="w-3 h-3" />
                          ~{item.estimatedHours}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Interview Prep Tips */}
              {matchResult.interviewPrepTips && matchResult.interviewPrepTips.length > 0 && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                    Interview Preparation Tips
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-xs text-slate-600">
                    {matchResult.interviewPrepTips.map((tip, i) => (
                      <li key={i}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Disclaimer */}
              <p className="text-[11px] text-slate-400 italic bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                {matchResult.disclaimer}
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg"
          >
            Close
          </button>

          <button
            id="modal-apply-btn"
            onClick={() => {
              onClose();
              onApply(job);
            }}
            className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-2xs flex items-center gap-1.5"
          >
            Apply for Position
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
