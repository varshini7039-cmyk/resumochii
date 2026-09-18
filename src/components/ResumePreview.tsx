import {
  Award,
  BookOpen,
  Briefcase,
  Code2,
  Download,
  FolderGit2,
  Globe,
  Languages,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Printer,
  Sparkles,
  User as UserIcon,
} from 'lucide-react';
import React from 'react';
import { Resume } from '../types';

interface ResumePreviewProps {
  resume: Resume;
  onImproveAi?: () => void;
  compact?: boolean;
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({
  resume,
  onImproveAi,
  compact = false,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    window.print();
  };

  const { personalInfo, summary, education, experience, projects, skills, certifications, achievements, languages, interests } = resume;

  return (
    <div className="flex flex-col gap-4">
      {/* Action Toolbar */}
      {!compact && (
        <div className="no-print flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-700">Resume Preview</span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-medium">
              ATS-Optimized Format
            </span>
          </div>
          <div className="flex items-center gap-2">
            {onImproveAi && (
              <button
                onClick={onImproveAi}
                className="px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                Improve with AI
              </button>
            )}
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5" />
              Print
            </button>
            <button
              onClick={handleDownload}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              Download PDF
            </button>
          </div>
        </div>
      )}

      {/* Printable Sheet Container */}
      <div
        id="resume-printable"
        className={`bg-white border border-slate-200 rounded-xl shadow-sm text-slate-800 transition-all ${
          compact ? 'p-6 text-xs' : 'p-8 sm:p-12 text-sm'
        }`}
      >
        {/* Header: Personal Info */}
        <header className="border-b border-slate-200 pb-5 mb-5">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mb-2">
            {personalInfo.fullName || 'Candidate Name'}
          </h1>

          <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4 text-xs text-slate-600">
            {personalInfo.email && (
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {personalInfo.email}
              </span>
            )}
            {personalInfo.phone && (
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                {personalInfo.phone}
              </span>
            )}
            {personalInfo.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {personalInfo.location}
              </span>
            )}
            {personalInfo.linkedin && (
              <a
                href={personalInfo.linkedin.startsWith('http') ? personalInfo.linkedin : `https://${personalInfo.linkedin}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-indigo-600 hover:underline"
              >
                <Linkedin className="w-3.5 h-3.5" />
                LinkedIn
              </a>
            )}
            {personalInfo.github && (
              <a
                href={personalInfo.github.startsWith('http') ? personalInfo.github : `https://${personalInfo.github}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-indigo-600 hover:underline"
              >
                <Code2 className="w-3.5 h-3.5" />
                GitHub
              </a>
            )}
            {personalInfo.portfolio && (
              <a
                href={personalInfo.portfolio.startsWith('http') ? personalInfo.portfolio : `https://${personalInfo.portfolio}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-indigo-600 hover:underline"
              >
                <Globe className="w-3.5 h-3.5" />
                Portfolio
              </a>
            )}
          </div>
        </header>

        {/* Section: Summary */}
        {summary && summary.trim().length > 0 && (
          <section className="mb-5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-900 border-b border-slate-200 pb-1 mb-2 flex items-center gap-1.5">
              <UserIcon className="w-3.5 h-3.5 text-indigo-600" />
              Professional Summary
            </h2>
            <p className="text-slate-700 leading-relaxed text-justify">{summary}</p>
          </section>
        )}

        {/* Section: Technical Skills */}
        {skills && (
          <section className="mb-5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-900 border-b border-slate-200 pb-1 mb-2 flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5 text-indigo-600" />
              Skills &amp; Competencies
            </h2>
            <div className="space-y-1.5 text-xs text-slate-700">
              {skills.programmingLanguages && skills.programmingLanguages.length > 0 && (
                <p>
                  <strong className="font-semibold text-slate-900">Languages: </strong>
                  {skills.programmingLanguages.join(', ')}
                </p>
              )}
              {skills.technical && skills.technical.length > 0 && (
                <p>
                  <strong className="font-semibold text-slate-900">Technical Proficiencies: </strong>
                  {skills.technical.join(', ')}
                </p>
              )}
              {skills.tools && skills.tools.length > 0 && (
                <p>
                  <strong className="font-semibold text-slate-900">Frameworks &amp; Developer Tools: </strong>
                  {skills.tools.join(', ')}
                </p>
              )}
              {skills.softSkills && skills.softSkills.length > 0 && (
                <p>
                  <strong className="font-semibold text-slate-900">Soft Skills: </strong>
                  {skills.softSkills.join(', ')}
                </p>
              )}
            </div>
          </section>
        )}

        {/* Section: Experience */}
        {experience && experience.length > 0 && (
          <section className="mb-5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-900 border-b border-slate-200 pb-1 mb-2.5 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
              Professional Experience
            </h2>
            <div className="space-y-3">
              {experience.map((exp, idx) => (
                <div key={exp.id || idx}>
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-0.5">
                    <span className="font-bold text-slate-900">{exp.position}</span>
                    <span className="text-xs font-medium text-slate-500">
                      {exp.startDate} – {exp.endDate || 'Present'}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-indigo-700 mb-1">{exp.company}</p>
                  {exp.description && (
                    <p className="text-slate-600 text-xs leading-relaxed whitespace-pre-line">
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section: Projects */}
        {projects && projects.length > 0 && (
          <section className="mb-5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-900 border-b border-slate-200 pb-1 mb-2.5 flex items-center gap-1.5">
              <FolderGit2 className="w-3.5 h-3.5 text-indigo-600" />
              Key Projects
            </h2>
            <div className="space-y-3">
              {projects.map((proj, idx) => (
                <div key={proj.id || idx}>
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-bold text-slate-900 flex items-center gap-2">
                      {proj.title}
                      {proj.link && (
                        <a
                          href={proj.link.startsWith('http') ? proj.link : `https://${proj.link}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-indigo-600 font-normal hover:underline"
                        >
                          [Link]
                        </a>
                      )}
                    </span>
                  </div>
                  {proj.technologies && proj.technologies.length > 0 && (
                    <p className="text-[11px] text-slate-500 font-medium mb-1">
                      Tech Stack: {proj.technologies.join(', ')}
                    </p>
                  )}
                  <p className="text-slate-600 text-xs leading-relaxed">{proj.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section: Education */}
        {education && education.length > 0 && (
          <section className="mb-5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-900 border-b border-slate-200 pb-1 mb-2.5 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
              Education
            </h2>
            <div className="space-y-2.5">
              {education.map((edu, idx) => (
                <div key={edu.id || idx} className="flex flex-col sm:flex-row sm:items-baseline justify-between">
                  <div>
                    <span className="font-bold text-slate-900">{edu.degree}</span>
                    {edu.fieldOfStudy && (
                      <span className="text-slate-700 font-medium"> in {edu.fieldOfStudy}</span>
                    )}
                    <p className="text-xs text-slate-600">{edu.institution}</p>
                  </div>
                  <div className="text-right sm:text-right text-xs text-slate-500">
                    <span>
                      {edu.startYear} – {edu.endYear || 'Present'}
                    </span>
                    {edu.grade && (
                      <p className="font-semibold text-slate-700">Grade / CGPA: {edu.grade}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section: Certifications */}
        {certifications && certifications.length > 0 && (
          <section className="mb-5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-900 border-b border-slate-200 pb-1 mb-2 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-indigo-600" />
              Certifications
            </h2>
            <ul className="list-disc list-inside space-y-1 text-xs text-slate-700">
              {certifications.map((c, idx) => (
                <li key={c.id || idx}>
                  <strong className="font-semibold text-slate-900">{c.name}</strong> – {c.organization} ({c.date || 'Active'})
                  {c.link && (
                    <a
                      href={c.link.startsWith('http') ? c.link : `https://${c.link}`}
                      target="_blank"
                      rel="noreferrer"
                      className="ml-1 text-indigo-600 hover:underline"
                    >
                      [Verify]
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Section: Achievements */}
        {achievements && achievements.length > 0 && (
          <section className="mb-5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-900 border-b border-slate-200 pb-1 mb-2 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-indigo-600" />
              Honors &amp; Achievements
            </h2>
            <ul className="list-disc list-inside space-y-1 text-xs text-slate-700">
              {achievements.map((ach, idx) => (
                <li key={idx}>{ach}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Footer info: Languages & Interests */}
        {(languages?.length > 0 || interests?.length > 0) && (
          <section className="pt-2 border-t border-slate-200 text-xs text-slate-600 grid grid-cols-1 sm:grid-cols-2 gap-2">
            {languages && languages.length > 0 && (
              <p className="flex items-center gap-1">
                <Languages className="w-3 h-3 text-slate-400" />
                <strong className="font-semibold text-slate-900">Languages:</strong>{' '}
                {languages.map((l) => `${l.language} (${l.proficiency})`).join(', ')}
              </p>
            )}
            {interests && interests.length > 0 && (
              <p>
                <strong className="font-semibold text-slate-900">Interests:</strong>{' '}
                {interests.join(', ')}
              </p>
            )}
          </section>
        )}
      </div>
    </div>
  );
};
