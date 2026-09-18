import {
  AlertCircle,
  ArrowRight,
  Award,
  Check,
  CheckCircle2,
  Copy,
  FileCheck,
  Flame,
  HelpCircle,
  ListChecks,
  RefreshCw,
  Sparkles,
  Zap,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import { AiResumeAnalysis, Resume } from '../types';

interface AiResumeImprovementPageProps {
  onNavigate: (page: string) => void;
}

export const AiResumeImprovementPage: React.FC<AiResumeImprovementPageProps> = ({ onNavigate }) => {
  const { success, error } = useToast();
  const [resume, setResume] = useState<Resume | null>(null);
  const [analysis, setAnalysis] = useState<AiResumeAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [applyingSummary, setApplyingSummary] = useState(false);
  const [copiedKeyword, setCopiedKeyword] = useState<string | null>(null);

  // Load existing resume
  useEffect(() => {
    async function loadResume() {
      try {
        const res = await api.resumes.getAll();
        if (res.success && res.resumes.length > 0) {
          setResume(res.resumes[0]);
        }
      } catch (err) {
        console.error('Error fetching resume for AI analysis:', err);
      }
    }
    loadResume();
  }, []);

  const handleRunAnalysis = async () => {
    try {
      setLoading(true);
      const res = await api.ai.improveResume({
        resumeId: resume?._id,
        resumeData: resume,
      });

      if (res.success && res.analysis) {
        setAnalysis(res.analysis);
        success('AI Resume analysis generated successfully!');
      }
    } catch (err: any) {
      error(err.message || 'Failed to analyze resume with AI.');
    } finally {
      setLoading(false);
    }
  };

  const handleApplySummary = async () => {
    if (!analysis?.summarySuggestions?.improvedSummary || !resume?._id) return;
    try {
      setApplyingSummary(true);
      const updated = {
        ...resume,
        summary: analysis.summarySuggestions.improvedSummary,
      };
      const res = await api.resumes.update(resume._id, updated);
      if (res.success) {
        setResume(res.resume);
        success('AI enhanced summary applied to your resume!');
      }
    } catch (err: any) {
      error(err.message || 'Failed to update resume summary.');
    } finally {
      setApplyingSummary(false);
    }
  };

  const copyKeyword = (keyword: string) => {
    navigator.clipboard.writeText(keyword);
    setCopiedKeyword(keyword);
    setTimeout(() => setCopiedKeyword(null), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-8 rounded-2xl shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/30 text-purple-200 text-xs font-semibold mb-3 border border-purple-400/30">
            <Sparkles className="w-3.5 h-3.5 text-purple-300 animate-spin" />
            <span>AI Resume Optimization Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            AI Resume Optimizer &amp; ATS Evaluator
          </h1>
          <p className="text-purple-100 text-sm max-w-2xl leading-relaxed">
            Scan your resume against modern Applicant Tracking Systems (ATS) and hiring benchmarks. Get targeted suggestions for high-impact action verbs, missing technical keywords, and stronger quantified statements.
          </p>
        </div>

        <div className="shrink-0 flex flex-col gap-2">
          <button
            id="btn-run-ai-analysis"
            onClick={handleRunAnalysis}
            disabled={loading}
            className="px-6 py-3 text-sm font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-slate-900" />
                Analyzing with Gemini...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-purple-900" />
                {analysis ? 'Re-Analyze Resume' : 'Improve My Resume'}
              </>
            )}
          </button>
          {resume && (
            <span className="text-[11px] text-purple-200 text-center">
              Active: {resume.title || 'Candidate Resume'}
            </span>
          )}
        </div>
      </div>

      {!analysis && !loading && (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center max-w-2xl mx-auto shadow-2xs space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-xs">
            <Sparkles className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Ready to Elevate Your Resume?</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Click <strong>"Improve My Resume"</strong> to run our AI diagnostic. We inspect your professional summary, action verbs, project impacts, and ATS compliance score.
          </p>
          <button
            onClick={handleRunAnalysis}
            className="px-6 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-2xs inline-flex items-center gap-2"
          >
            Start AI Evaluation Now
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {loading && (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <RefreshCw className="w-10 h-10 text-indigo-600 animate-spin mx-auto" />
          <h3 className="text-lg font-bold text-slate-900">Google Gemini is Analyzing Your Resume...</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Reviewing action verbs, evaluating ATS keyword density, formatting checks, and computing impact scores.
          </p>
        </div>
      )}

      {/* Analysis Results Display */}
      {analysis && !loading && (
        <div className="space-y-8 animate-in fade-in">
          {/* Top Score Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Overall Score */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-5">
              <div className="relative w-20 h-20 rounded-full bg-indigo-50 border-4 border-indigo-600 flex items-center justify-center shrink-0">
                <span className="text-2xl font-black text-indigo-700">{analysis.overallScore}%</span>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Overall AI Score</span>
                <h4 className="text-base font-bold text-slate-900 mt-0.5">
                  {analysis.overallScore >= 80 ? 'Strong Candidate' : 'Good Base, Needs Polish'}
                </h4>
                <p className="text-xs text-slate-500">Benchmark across top tech postings</p>
              </div>
            </div>

            {/* ATS Score */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-5">
              <div className="relative w-20 h-20 rounded-full bg-emerald-50 border-4 border-emerald-600 flex items-center justify-center shrink-0">
                <span className="text-2xl font-black text-emerald-700">{analysis.atsSuggestions.atsScore}%</span>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">ATS Keyword Match</span>
                <h4 className="text-base font-bold text-slate-900 mt-0.5">Applicant Tracking System</h4>
                <p className="text-xs text-slate-500">
                  {analysis.atsSuggestions.missingKeywords.length} missing keywords found
                </p>
              </div>
            </div>

            {/* Completeness Status */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-5">
              <div className="w-20 h-20 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
                <Flame className="w-10 h-10 text-amber-500" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Action Items</span>
                <h4 className="text-base font-bold text-slate-900 mt-0.5">
                  {analysis.completenessChecklist.filter((c) => c.status === 'needs_improvement').length} areas to polish
                </h4>
                <p className="text-xs text-slate-500">Ready for 1-click improvements</p>
              </div>
            </div>
          </div>

          {/* Overall Observations */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-700 flex items-center gap-2">
              <Zap className="w-4 h-4 text-indigo-600" />
              Overall Observations &amp; Executive Assessment
            </h3>
            <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">
              {analysis.overallObservations}
            </p>
          </div>

          {/* Section: Summary Suggestions with 1-Click Apply */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  Professional Summary Transformation
                </h3>
                <p className="text-xs text-slate-500">{analysis.summarySuggestions.reason}</p>
              </div>
              <button
                onClick={handleApplySummary}
                disabled={applyingSummary}
                className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-2xs flex items-center gap-1.5 self-start sm:self-auto disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                {applyingSummary ? 'Applying to Resume...' : 'Apply Improved Summary'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Original Summary:
                </span>
                <p className="text-xs text-slate-600 leading-relaxed italic">
                  "{analysis.summarySuggestions.currentSummary || 'No summary provided in resume'}"
                </p>
              </div>

              <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200">
                <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider block mb-1">
                  Gemini AI Enhanced:
                </span>
                <p className="text-xs text-indigo-950 font-medium leading-relaxed">
                  "{analysis.summarySuggestions.improvedSummary}"
                </p>
              </div>
            </div>
          </div>

          {/* ATS Missing Keywords with Copy Button */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="border-b border-slate-100 pb-2">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-600" />
                ATS Keyword Suggestions &amp; Missing Terms
              </h3>
              <p className="text-xs text-slate-500">
                Click any keyword to copy it and paste into your project or skills section to boost recruiter search ranking.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {analysis.atsSuggestions.missingKeywords.map((kw) => (
                <button
                  key={kw}
                  onClick={() => copyKeyword(kw)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-xs font-semibold transition-colors"
                >
                  <span>{kw}</span>
                  {copiedKeyword === kw ? (
                    <Check className="w-3 h-3 text-emerald-600" />
                  ) : (
                    <Copy className="w-3 h-3 text-amber-700" />
                  )}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <h4 className="text-xs font-bold text-slate-800 mb-2">Formatting &amp; Readability Tips:</h4>
                <ul className="list-disc list-inside space-y-1 text-xs text-slate-600">
                  {analysis.atsSuggestions.formattingTips.map((tip, i) => (
                    <li key={i}>{tip}</li>
                  ))}
                </ul>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <h4 className="text-xs font-bold text-slate-800 mb-2">Immediate ATS Action Items:</h4>
                <ul className="list-disc list-inside space-y-1 text-xs text-slate-600">
                  {analysis.atsSuggestions.actionItems.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Action Verbs Recommended */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Zap className="w-4 h-4 text-purple-600" />
              High-Impact Power Verbs for Experience Bullets
            </h3>
            <div className="flex flex-wrap gap-2">
              {analysis.actionVerbsList.map((verb) => (
                <span
                  key={verb}
                  className="px-2.5 py-1 rounded-md bg-purple-50 border border-purple-200 text-purple-800 text-xs font-semibold"
                >
                  {verb}
                </span>
              ))}
            </div>
          </div>

          {/* Experience Suggestions (Before & After Bullets) */}
          {analysis.experienceSuggestions && analysis.experienceSuggestions.length > 0 && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                <FileCheck className="w-4 h-4 text-indigo-600" />
                Work Experience Bullet Point Enhancements
              </h3>

              <div className="space-y-4">
                {analysis.experienceSuggestions.map((exp, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-900 text-xs">
                        {exp.role} @ {exp.company}
                      </h4>
                      <span className="text-[10px] text-indigo-600 font-semibold">
                        Verbs added: {exp.actionVerbsAdded.join(', ')}
                      </span>
                    </div>

                    <div className="space-y-1 text-xs">
                      <span className="font-bold text-slate-700 block">Improved Bullet Recommendations:</span>
                      <ul className="list-disc list-inside space-y-1 text-slate-700 bg-white p-3 rounded-lg border border-slate-200">
                        {exp.improvedBullets.map((bullet, bIdx) => (
                          <li key={bIdx}>{bullet}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Completeness Checklist */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
              <ListChecks className="w-4 h-4 text-emerald-600" />
              Resume Completeness Checklist
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {analysis.completenessChecklist.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-3"
                >
                  <div className="mt-0.5 shrink-0">
                    {item.status === 'complete' && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    )}
                    {item.status === 'needs_improvement' && (
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                    )}
                    {item.status === 'missing' && (
                      <AlertCircle className="w-4 h-4 text-rose-600" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-bold text-slate-900 text-xs">{item.item}</span>
                      <span
                        className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-md ${
                          item.status === 'complete'
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.status === 'needs_improvement'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {item.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600">{item.tip}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons footer */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-500">Resume optimized with AI intelligence.</span>
            <button
              onClick={() => onNavigate('resume-builder')}
              className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-2xs flex items-center gap-1.5"
            >
              Return to Resume Builder
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
