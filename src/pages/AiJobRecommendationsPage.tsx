import {
  AlertCircle,
  ArrowRight,
  Briefcase,
  CheckCircle2,
  Clock,
  ExternalLink,
  MapPin,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import { AiJobRecommendation, Job } from '../types';

interface AiJobRecommendationsPageProps {
  onNavigate: (page: string) => void;
  onSelectJob?: (job: Job) => void;
}

export const AiJobRecommendationsPage: React.FC<AiJobRecommendationsPageProps> = ({
  onNavigate,
  onSelectJob,
}) => {
  const { user } = useAuth();
  const { success, error } = useToast();
  const [recommendations, setRecommendations] = useState<AiJobRecommendation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const res = await api.ai.recommendJobs();
      if (res.success && res.recommendations) {
        setRecommendations(res.recommendations);
      }
    } catch (err: any) {
      error(err.message || 'Failed to fetch AI recommendations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-sky-900 text-white p-6 sm:p-8 rounded-2xl shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-200 text-xs font-semibold mb-3 border border-indigo-400/30">
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
            <span>AI Predictive Matching</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            Personalized Job Recommendations
          </h1>
          <p className="text-indigo-100 text-sm max-w-2xl leading-relaxed">
            Curated vacancies matched against your verified skills, experience level, and career aspirations using Google Gemini analysis.
          </p>
        </div>

        <button
          onClick={fetchRecommendations}
          disabled={loading}
          className="px-4 py-2 text-xs font-semibold text-white bg-white/10 hover:bg-white/20 rounded-xl transition-colors border border-white/20 flex items-center gap-2 self-start md:self-auto disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Recommendations
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-700">Calculating Best Job Matches...</p>
          <p className="text-xs text-slate-400">Benchmarking your profile against all active industry vacancies.</p>
        </div>
      ) : recommendations.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <Briefcase className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="font-bold text-slate-900">No high-probability matches yet</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Try adding more skills to your profile or creating an updated resume to unlock personalized AI matches.
          </p>
          <button
            onClick={() => onNavigate('profile')}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-xl"
          >
            Update My Skills
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {recommendations.map((rec) => (
            <div
              key={rec.jobId}
              className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-indigo-200 shadow-2xs hover:shadow-xs transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-3 max-w-2xl">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-bold text-slate-900">{rec.jobTitle}</h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                    {rec.matchScore}% Match
                  </span>
                </div>

                <p className="text-xs font-semibold text-slate-600">
                  {rec.company} • <MapPin className="w-3.5 h-3.5 inline text-slate-400" /> {rec.location}
                </p>

                {/* Reason */}
                <p className="text-xs text-slate-700 bg-indigo-50/50 p-3 rounded-xl border border-indigo-100 leading-relaxed">
                  <strong className="font-bold text-indigo-950">Why recommended: </strong>
                  {rec.recommendationReason}
                </p>

                {/* Matching Skills */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-xs font-semibold text-slate-500 mr-1">Skills:</span>
                  {rec.matchingSkills.map((s) => (
                    <span
                      key={s}
                      className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-medium"
                    >
                      ✓ {s}
                    </span>
                  ))}
                  {rec.missingSkills.slice(0, 3).map((s) => (
                    <span
                      key={s}
                      className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-xs font-medium"
                    >
                      + {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="shrink-0 flex md:flex-col items-center gap-2">
                <button
                  onClick={() => onNavigate('jobs')}
                  className="w-full px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-2xs flex items-center justify-center gap-1.5"
                >
                  View Job &amp; Apply
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
