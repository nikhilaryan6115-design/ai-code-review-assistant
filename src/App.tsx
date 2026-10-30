import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { ToastContainer } from './components/common/ToastContainer';
import { motion, AnimatePresence } from 'framer-motion';

// Manager Pages
import { ManagerDashboard } from './pages/manager/ManagerDashboard';
import { SubmissionsPage } from './pages/manager/SubmissionsPage';
import { ReviewDetailsPage } from './pages/manager/ReviewDetailsPage';
import { DevelopersPage } from './pages/manager/DevelopersPage';
import { ReviewHistoryPage } from './pages/manager/ReviewHistoryPage';

// Developer Pages
import { DeveloperDashboard } from './pages/developer/DeveloperDashboard';
import { DeveloperSubmissionsPage } from './pages/developer/DeveloperSubmissionsPage';
import { DeveloperRepoPage } from './pages/developer/DeveloperRepoPage';

// Shared Pages
import { LoginPage } from './pages/auth/LoginPage';
import { SettingsPage } from './pages/settings/SettingsPage';
import { RepositoriesPage } from './pages/repositories/RepositoriesPage';
import { NotificationsPage } from './pages/notifications/NotificationsPage';
import { ProfilePage } from './pages/profile/ProfilePage';

// Animated Route Wrapper
const PageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
};

// Main App Layout with Sidebar and Navbar
const AppLayout: React.FC = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-editorial-bg text-[#F2F4F8] flex flex-col font-sans selection:bg-editorial-brass selection:text-editorial-bg">
      <Navbar />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-[1560px] mx-auto w-full">
          <AnimatePresence mode="wait">
            <PageWrapper key={location.pathname}>
              <Outlet />
            </PageWrapper>
          </AnimatePresence>
        </main>
      </div>
      <ToastContainer />
    </div>
  );
};

// Index redirector based on active role
const IndexRedirect: React.FC = () => {
  const { role } = useApp();
  return <Navigate to={role === 'manager' ? '/manager' : '/developer'} replace />;
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Auth */}
          <Route path="/login" element={<LoginPage />} />

          {/* Core App Shell */}
          <Route path="/" element={<AppLayout />}>
            <Route index element={<IndexRedirect />} />

            {/* Manager Experience */}
            <Route path="manager" element={<ManagerDashboard />} />
            <Route path="manager/submissions" element={<SubmissionsPage />} />
            <Route path="manager/reviews/:id" element={<ReviewDetailsPage />} />
            <Route path="manager/developers" element={<DevelopersPage />} />
            <Route path="manager/history" element={<ReviewHistoryPage />} />

            {/* Developer Experience */}
            <Route path="developer" element={<DeveloperDashboard />} />
            <Route path="developer/submissions" element={<DeveloperSubmissionsPage />} />
            <Route path="developer/repositories" element={<DeveloperRepoPage />} />

            {/* Shared Tools */}
            <Route path="repositories" element={<RepositoriesPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
};

export default App;
