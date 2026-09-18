/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { Footer } from './components/Footer';
import { Navbar } from './components/Navbar';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { AdminApplicationsPage } from './pages/admin/AdminApplicationsPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { ManageJobsPage } from './pages/admin/ManageJobsPage';
import { AiJobRecommendationsPage } from './pages/AiJobRecommendationsPage';
import { AiResumeImprovementPage } from './pages/AiResumeImprovementPage';
import { ApplicationTrackerPage } from './pages/ApplicationTrackerPage';
import { DashboardPage } from './pages/DashboardPage';
import { JobListingPage } from './pages/JobListingPage';
import { LoginPage } from './pages/LoginPage';
import { ProfilePage } from './pages/ProfilePage';
import { RegisterPage } from './pages/RegisterPage';
import { ResumeBuilderPage } from './pages/ResumeBuilderPage';
import { SettingsPage } from './pages/SettingsPage';
import { LandingPage } from './pages/LandingPage';

function AppContent() {
  const { isAuthenticated, isAdmin } = useAuth();

  // Initialize page from hash or default to landing/dashboard
  const getInitialPage = () => {
    const hash = window.location.hash.replace('#/', '').replace('#', '');
    if (hash) return hash;
    return isAuthenticated ? 'dashboard' : 'landing';
  };

  const [currentPage, setCurrentPage] = useState<string>(getInitialPage);

  // Sync hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '').replace('#', '');
      if (hash && hash !== currentPage) {
        setCurrentPage(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [currentPage]);

  const navigate = (page: string) => {
    setCurrentPage(page);
    window.location.hash = `#/${page}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Route protection
  const renderActivePage = () => {
    // If not authenticated and attempting protected routes, show login or landing
    const protectedRoutes = [
      'dashboard',
      'resume-builder',
      'ai-resume',
      'ai-improve',
      'recommendations',
      'applications',
      'profile',
      'settings',
      'admin-dashboard',
      'admin-jobs',
      'admin-applications',
      'admin-users',
    ];

    if (!isAuthenticated && protectedRoutes.includes(currentPage)) {
      return <LoginPage onNavigate={navigate} />;
    }

    // Admin protected routes
    if (currentPage.startsWith('admin') && !isAdmin) {
      return <DashboardPage onNavigate={navigate} />;
    }

    switch (currentPage) {
      case 'landing':
        return <LandingPage onNavigate={navigate} />;
      case 'login':
        return <LoginPage onNavigate={navigate} />;
      case 'register':
        return <RegisterPage onNavigate={navigate} />;
      case 'dashboard':
        return <DashboardPage onNavigate={navigate} />;
      case 'resume-builder':
        return <ResumeBuilderPage onNavigate={navigate} />;
      case 'ai-resume':
      case 'ai-improve':
        return <AiResumeImprovementPage onNavigate={navigate} />;
      case 'jobs':
        return <JobListingPage onNavigate={navigate} />;
      case 'recommendations':
        return <AiJobRecommendationsPage onNavigate={navigate} />;
      case 'applications':
        return <ApplicationTrackerPage onNavigate={navigate} />;
      case 'profile':
        return <ProfilePage onNavigate={navigate} />;
      case 'settings':
        return <SettingsPage onNavigate={navigate} />;
      case 'admin-dashboard':
        return <AdminDashboardPage onNavigate={navigate} />;
      case 'admin-jobs':
        return <ManageJobsPage onNavigate={navigate} />;
      case 'admin-applications':
        return <AdminApplicationsPage onNavigate={navigate} />;
      case 'admin-users':
        return <AdminUsersPage onNavigate={navigate} />;
      default:
        return isAuthenticated ? (
          <DashboardPage onNavigate={navigate} />
        ) : (
          <LandingPage onNavigate={navigate} />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <Navbar currentPage={currentPage} onNavigate={navigate} />
      <main className="flex-1">
        {renderActivePage()}
      </main>
      <Footer onNavigate={navigate} />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ToastProvider>
  );
}
