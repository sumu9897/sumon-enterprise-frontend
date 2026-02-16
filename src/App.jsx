import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import { ProjectProvider } from './context/ProjectContext';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import ProjectManager from './pages/admin/ProjectManager';
import ProjectForm from './pages/admin/ProjectForm';
import InquiryManager from './pages/admin/InquiryManager';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import PrivateRoute from './components/common/PrivateRoute';
import NotFound from './pages/NotFound';


function App() {
  return (
    <AuthProvider>
      <ProjectProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/services" element={<Services />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/projects/:slug" element={<ProjectDetail />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="*" element={<NotFound />} />


                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route
                  path="/admin/dashboard"
                  element={
                    <PrivateRoute>
                      <AdminDashboard />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/admin/projects"
                  element={
                    <PrivateRoute>
                      <ProjectManager />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/admin/projects/new"
                  element={
                    <PrivateRoute>
                      <ProjectForm />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/admin/projects/edit/:id"
                  element={
                    <PrivateRoute>
                      <ProjectForm />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/admin/inquiries"
                  element={
                    <PrivateRoute>
                      <InquiryManager />
                    </PrivateRoute>
                  }
                />
              </Routes>
            </main>
            <Footer />
          </div>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </Router>
      </ProjectProvider>
    </AuthProvider>
  );
}

export default App;