import {
  CheckCircle2,
  Database,
  Info,
  RefreshCw,
  Server,
  Shield,
  Sparkles,
  Trash2,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';

interface SettingsPageProps {
  onNavigate: (page: string) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onNavigate }) => {
  const { user, isAdmin } = useAuth();
  const { success, error } = useToast();
  const [health, setHealth] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const checkHealth = async () => {
    try {
      setLoading(true);
      const res = await api.system.health();
      setHealth(res);
      success('System health check completed.');
    } catch (err: any) {
      error('Could not reach backend API.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  const handleClearCache = () => {
    sessionStorage.clear();
    success('Session cache cleared successfully.');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">System Status &amp; Settings</h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Inspect backend connectivity, database status, and active engine configuration.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Backend & AI Diagnostic Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Server className="w-4 h-4 text-indigo-600" />
              Service Status
            </h3>
            <button
              onClick={checkHealth}
              disabled={loading}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              title="Refresh Health"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-600 font-medium">Backend API:</span>
              <span className="inline-flex items-center gap-1 font-bold text-emerald-600">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Operational
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-600 font-medium">Database Layer:</span>
              <span className="font-bold text-indigo-600">
                {health?.database || 'Unified Store'}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-600 font-medium">Gemini AI Model:</span>
              <span className="inline-flex items-center gap-1 font-bold text-purple-700">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                gemini-2.5-flash
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-600 font-medium">Server Timestamp:</span>
              <span className="text-slate-500">
                {health?.timestamp ? new Date(health.timestamp).toLocaleTimeString() : 'Active'}
              </span>
            </div>
          </div>
        </div>

        {/* Account Details Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-600" />
            Session Details
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-slate-400 font-medium block">Active User:</span>
              <p className="font-bold text-slate-900 text-sm">{user?.name || 'Guest'}</p>
              <p className="text-slate-500">{user?.email}</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <span className="text-slate-600 font-medium">Account Role:</span>
              <span
                className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${
                  isAdmin ? 'bg-amber-100 text-amber-800' : 'bg-indigo-50 text-indigo-700'
                }`}
              >
                {isAdmin ? 'Administrator' : 'Standard Candidate'}
              </span>
            </div>

            <div className="pt-2">
              <button
                onClick={handleClearCache}
                className="w-full px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5 text-slate-500" />
                Clear Local Session Cache
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
