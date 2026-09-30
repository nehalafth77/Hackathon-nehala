import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Context Providers
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';

// Public Pages
import LandingPage from './pages/public/LandingPage';
import Login from './pages/public/Login';
import Register from './pages/public/Register';

// Student Pages
import StudentDashboard from './pages/student/Dashboard';
import StudentMaterials from './pages/student/Materials';
import StudentMaterialDetail from './pages/student/MaterialDetail';
import StudentSearch from './pages/student/Search';
import StudentBookmarks from './pages/student/Bookmarks';
import StudentUpload from './pages/student/Upload';
import StudentAIAssistant from './pages/student/AIAssistant';
import StudentAnnouncements from './pages/student/Announcements';
import StudentSettings from './pages/student/Settings';

// Teacher Pages
import TeacherDashboard from './pages/teacher/Dashboard';
import TeacherVerification from './pages/teacher/Verification';
import TeacherMaterials from './pages/teacher/Materials';
import TeacherUpload from './pages/teacher/Upload';
import TeacherAnnouncements from './pages/teacher/Announcements';
import TeacherReports from './pages/teacher/Reports';
import TeacherSettings from './pages/teacher/Settings';

// Public Route Guard (Redirect to dashboard if already logged in)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) {
    return <Navigate to={`/${user.role}/dashboard`} replace />;
  }
  return children;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3500,
              style: {
                borderRadius: '12px',
                background: '#1e293b',
                color: '#fff',
                fontSize: '13px',
              },
            }}
          />

          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />

            {/* Student Protected Routes */}
            <Route
              path="/student"
              element={<DashboardLayout requiredRole="student" />}
            >
              <Route index element={<Navigate to="/student/dashboard" replace />} />
              <Route path="dashboard" element={<StudentDashboard />} />
              <Route path="materials" element={<StudentMaterials />} />
              <Route path="material/:id" element={<StudentMaterialDetail />} />
              <Route path="search" element={<StudentSearch />} />
              <Route path="bookmarks" element={<StudentBookmarks />} />
              <Route path="upload" element={<StudentUpload />} />
              <Route path="ai" element={<StudentAIAssistant />} />
              <Route path="announcements" element={<StudentAnnouncements />} />
              <Route path="settings" element={<StudentSettings />} />
            </Route>

            {/* Teacher Protected Routes */}
            <Route
              path="/teacher"
              element={<DashboardLayout requiredRole="teacher" />}
            >
              <Route index element={<Navigate to="/teacher/dashboard" replace />} />
              <Route path="dashboard" element={<TeacherDashboard />} />
              <Route path="verification" element={<TeacherVerification />} />
              <Route path="materials" element={<TeacherMaterials />} />
              <Route path="upload" element={<TeacherUpload />} />
              <Route path="announcements" element={<TeacherAnnouncements />} />
              <Route path="reports" element={<TeacherReports />} />
              <Route path="settings" element={<TeacherSettings />} />
            </Route>

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
