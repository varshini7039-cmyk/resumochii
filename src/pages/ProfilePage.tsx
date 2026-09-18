import {
  Award,
  BookOpen,
  Briefcase,
  CheckCircle2,
  Mail,
  MapPin,
  Phone,
  Plus,
  Save,
  Trash2,
  User as UserIcon,
  X,
} from 'lucide-react';
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';

interface ProfilePageProps {
  onNavigate?: (page: string) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onNavigate }) => {
  const { user, refreshUser } = useAuth();
  const { success, error } = useToast();

  const [name, setName] = useState(user?.name || '');
  const [email] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [location, setLocation] = useState(user?.location || '');
  const [headline, setHeadline] = useState(user?.headline || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [skills, setSkills] = useState<string[]>(user?.skills || []);
  const [newSkill, setNewSkill] = useState('');

  // Education list
  const [education, setEducation] = useState(
    user?.education && user.education.length > 0
      ? user.education
      : [
          {
            degree: 'B.Tech / B.E.',
            institution: 'National Institute of Technology',
            fieldOfStudy: 'Computer Science and Engineering',
            startYear: '2021',
            endYear: '2025',
            grade: '8.8 / 10 CGPA',
          },
        ]
  );

  // Experience list
  const [experience, setExperience] = useState(
    user?.experience && user.experience.length > 0
      ? user.experience
      : [
          {
            company: 'Tech Innovations Lab',
            position: 'Software Engineering Intern',
            startDate: 'Jun 2024',
            endDate: 'Aug 2024',
            description: 'Assisted in building REST APIs with Node.js and Express. Implemented Redis caching to optimize database queries.',
          },
        ]
  );

  const [saving, setSaving] = useState(false);

  const handleAddSkill = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    if (!newSkill.trim()) return;
    const trimmed = newSkill.trim();
    if (!skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
    }
    setNewSkill('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleAddEducation = () => {
    setEducation([
      ...education,
      {
        degree: '',
        institution: '',
        fieldOfStudy: '',
        startYear: '',
        endYear: '',
        grade: '',
      },
    ]);
  };

  const handleRemoveEducation = (index: number) => {
    setEducation(education.filter((_, i) => i !== index));
  };

  const handleAddExperience = () => {
    setExperience([
      ...experience,
      {
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        description: '',
      },
    ]);
  };

  const handleRemoveExperience = (index: number) => {
    setExperience(experience.filter((_, i) => i !== index));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.users.updateProfile({
        name,
        phone,
        location,
        headline,
        bio,
        skills,
        education,
        experience,
      });

      if (res.success) {
        success('Profile updated successfully!');
        await refreshUser();
      }
    } catch (err: any) {
      error(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  // Completion calculation
  let points = 0;
  if (name) points += 20;
  if (phone) points += 10;
  if (location) points += 10;
  if (headline) points += 15;
  if (skills.length >= 3) points += 20;
  if (education.length > 0) points += 15;
  if (experience.length > 0) points += 10;
  const completionPct = Math.min(100, points);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">My Profile</h1>
          <p className="text-sm text-slate-500">
            Manage your personal credentials, contact info, skills, and background.
          </p>
        </div>

        {/* Profile Strength Indicator */}
        <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-right">
            <span className="text-xs font-bold text-slate-700 block">Profile Strength</span>
            <span className="text-[11px] text-slate-400">
              {completionPct >= 80 ? 'All Star Profile' : 'Needs attention'}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center font-black text-indigo-700 text-sm">
            {completionPct}%
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <UserIcon className="w-5 h-5 text-indigo-600" />
            Personal &amp; Contact Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email (Registered)</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  disabled
                  value={email}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-500 cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Current Location</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Bangalore, India"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Professional Headline</label>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Full Stack Developer | React, Node.js &amp; Cloud Enthusiast"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Short Bio</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Brief summary of your passions, engineering focus, and ambitions..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            />
          </div>
        </div>

        {/* Technical Skills with Tag Adder */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Award className="w-5 h-5 text-indigo-600" />
            Skills &amp; Technologies
          </h2>

          <p className="text-xs text-slate-500">
            Add your primary technical skills, programming languages, frameworks, and databases. These are used for AI job recommendations and job matching.
          </p>

          <div className="flex gap-2">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={handleAddSkill}
              placeholder="Type a skill (e.g. TypeScript, React, Docker, Python) and press Enter"
              className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            />
            <button
              type="button"
              onClick={handleAddSkill}
              className="px-4 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Add Skill
            </button>
          </div>

          {/* Render Tag Badges */}
          <div className="flex flex-wrap gap-2 pt-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-semibold shadow-2xs"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="p-0.5 text-indigo-400 hover:text-indigo-700 rounded-full"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
            {skills.length === 0 && (
              <p className="text-xs text-slate-400 italic">No skills added yet. Add at least 3 skills for accurate matching.</p>
            )}
          </div>
        </div>

        {/* Education Records */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              Education Records
            </h2>
            <button
              type="button"
              onClick={handleAddEducation}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Degree
            </button>
          </div>

          <div className="space-y-4">
            {education.map((edu, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 relative space-y-3">
                <button
                  type="button"
                  onClick={() => handleRemoveEducation(idx)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-rose-600 p-1"
                  title="Remove education"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Degree / Certification</label>
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => {
                        const copy = [...education];
                        copy[idx].degree = e.target.value;
                        setEducation(copy);
                      }}
                      placeholder="e.g. B.Tech Computer Science"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Institution / University</label>
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) => {
                        const copy = [...education];
                        copy[idx].institution = e.target.value;
                        setEducation(copy);
                      }}
                      placeholder="e.g. National Institute of Technology"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Field of Study</label>
                    <input
                      type="text"
                      value={edu.fieldOfStudy}
                      onChange={(e) => {
                        const copy = [...education];
                        copy[idx].fieldOfStudy = e.target.value;
                        setEducation(copy);
                      }}
                      placeholder="e.g. Artificial Intelligence"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Start Year</label>
                      <input
                        type="text"
                        value={edu.startYear}
                        onChange={(e) => {
                          const copy = [...education];
                          copy[idx].startYear = e.target.value;
                          setEducation(copy);
                        }}
                        placeholder="2021"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">End Year</label>
                      <input
                        type="text"
                        value={edu.endYear}
                        onChange={(e) => {
                          const copy = [...education];
                          copy[idx].endYear = e.target.value;
                          setEducation(copy);
                        }}
                        placeholder="2025"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Grade / CGPA</label>
                      <input
                        type="text"
                        value={edu.grade}
                        onChange={(e) => {
                          const copy = [...education];
                          copy[idx].grade = e.target.value;
                          setEducation(copy);
                        }}
                        placeholder="8.9 CGPA"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Experience Records */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-indigo-600" />
              Work &amp; Internship Experience
            </h2>
            <button
              type="button"
              onClick={handleAddExperience}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Experience
            </button>
          </div>

          <div className="space-y-4">
            {experience.map((exp, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 relative space-y-3">
                <button
                  type="button"
                  onClick={() => handleRemoveExperience(idx)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-rose-600 p-1"
                  title="Remove experience"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Job Title / Position</label>
                    <input
                      type="text"
                      value={exp.position}
                      onChange={(e) => {
                        const copy = [...experience];
                        copy[idx].position = e.target.value;
                        setExperience(copy);
                      }}
                      placeholder="e.g. Frontend Developer Intern"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Company / Organization</label>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => {
                        const copy = [...experience];
                        copy[idx].company = e.target.value;
                        setExperience(copy);
                      }}
                      placeholder="e.g. Razorpay / Infosys"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Start Date</label>
                    <input
                      type="text"
                      value={exp.startDate}
                      onChange={(e) => {
                        const copy = [...experience];
                        copy[idx].startDate = e.target.value;
                        setExperience(copy);
                      }}
                      placeholder="e.g. Jun 2024"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">End Date</label>
                    <input
                      type="text"
                      value={exp.endDate}
                      onChange={(e) => {
                        const copy = [...experience];
                        copy[idx].endDate = e.target.value;
                        setExperience(copy);
                      }}
                      placeholder="e.g. Aug 2024 or Present"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Description &amp; Key Responsibilities</label>
                  <textarea
                    rows={2}
                    value={exp.description}
                    onChange={(e) => {
                      const copy = [...experience];
                      copy[idx].description = e.target.value;
                      setExperience(copy);
                    }}
                    placeholder="Describe your role, outcomes, and technologies utilized..."
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Save Bar */}
        <div className="sticky bottom-6 z-20 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200 shadow-lg flex items-center justify-between">
          <p className="text-xs text-slate-500">Ensure all relevant career details are saved.</p>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving changes...' : 'Save Profile Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};
