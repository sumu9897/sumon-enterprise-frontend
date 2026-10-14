import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import { ProjectProvider } from './context/ProjectContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import Footer from './components/common/Footer';
import Header from './components/common/Header';
import LoadingSpinner from './components/common/LoadingSpinner';
import PrivateRoute from './components/common/PrivateRoute';
import RouteEffects from './components/common/RouteEffects';
import Home from './pages/Home';

const About = lazy(() => import('./pages/About'));
const Services = lazy(() => import('./pages/Services'));
const Projects = lazy(() => import('./pages/Projects'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Contact = lazy(() => import('./pages/Contact'));
const NotFound = lazy(() => import('./pages/NotFound'));
const AdminLogin = lazy(() => import('./pages/admin/Login'));
const ForgotPassword = lazy(() => import('./pages/admin/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/admin/ResetPassword'));
const AuthMessage = lazy(() => import('./pages/admin/AuthMessage'));
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const ProjectManager = lazy(() => import('./pages/admin/ProjectManager'));
const ProjectForm = lazy(() => import('./pages/admin/ProjectForm'));
const InquiryManager = lazy(() => import('./pages/admin/InquiryManager'));
const AdminSettings = lazy(() => import('./pages/admin/Settings'));
const ContentManager = lazy(() => import('./pages/admin/ContentManager'));
const UserManager = lazy(() => import('./pages/admin/UserManager'));

const protectedPage = (element, permission) => <PrivateRoute permission={permission}>{element}</PrivateRoute>;

const RouterContent = () => {
  const { pathname } = useLocation();
  const isAdminRoute = pathname.startsWith('/admin');

  return (
    <div className="flex min-h-screen flex-col">
      <RouteEffects />
      {!isAdminRoute ? <Header /> : null}
      <main className="flex-grow" id="main-content">
        <Suspense fallback={<LoadingSpinner fullPage text="Loading page…" />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:slug" element={<ProjectDetail />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/forgot-password" element={<ForgotPassword />} />
            <Route path="/admin/reset-password" element={<ResetPassword />} />
            <Route path="/admin/access-denied" element={<AuthMessage tone="warning" title="Access denied" message="Your administrator account does not have permission to open this area." />} />
            <Route path="/admin/session-expired" element={<AuthMessage tone="warning" title="Session expired" message="For your security, this session is no longer valid. Sign in again to continue." />} />
            <Route path="/admin/dashboard" element={protectedPage(<AdminDashboard />)} />
            <Route path="/admin/projects" element={protectedPage(<ProjectManager />, 'projects.view')} />
            <Route path="/admin/projects/new" element={protectedPage(<ProjectForm />, 'projects.create')} />
            <Route path="/admin/projects/edit/:id" element={protectedPage(<ProjectForm />, 'projects.update')} />
            <Route path="/admin/inquiries" element={protectedPage(<InquiryManager />, 'inquiries.view')} />
            <Route path="/admin/settings" element={protectedPage(<AdminSettings />)} />
            <Route path="/admin/content" element={protectedPage(<ContentManager />, 'content.update')} />
            <Route path="/admin/users" element={protectedPage(<UserManager />, 'users.manage')} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      {!isAdminRoute ? <Footer /> : null}
      <ToastContainer
        position="bottom-right"
        autoClose={4500}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        pauseOnHover
        theme="colored"
        limit={3}
      />
    </div>
  );
};

const App = () => (
  <ErrorBoundary>
    <AuthProvider>
      <ProjectProvider>
        <BrowserRouter>
          <RouterContent />
        </BrowserRouter>
      </ProjectProvider>
    </AuthProvider>
  </ErrorBoundary>
);

export default App;
