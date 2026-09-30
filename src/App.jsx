import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { VaultProvider } from './context/VaultContext';

// Layout & Navigation Shell
import AppLayout from './components/layout/AppLayout';

// StudyVault Pages
import Dashboard from './pages/Dashboard';
import MyVault from './pages/MyVault';
import SmartSearch from './pages/SmartSearch';
import MaterialDetails from './pages/MaterialDetails';
import Upload from './pages/Upload';
import AIStudy from './pages/AIStudy';
import Revision from './pages/Revision';
import QuizGenerator from './pages/QuizGenerator';
import VerifiedMaterials from './pages/VerifiedMaterials';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
import Login from './pages/Login';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <VaultProvider>
          <BrowserRouter>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3500,
                style: {
                  borderRadius: '14px',
                  background: '#0B1120',
                  color: '#fff',
                  border: '1px solid #1E293B',
                  fontSize: '13px',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
                },
              }}
            />

            <Routes>
              {/* Login / Welcome Screen */}
              <Route path="/login" element={<Login />} />

              {/* Main StudyVault Application Shell */}
              <Route path="/" element={<AppLayout />}>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="vault" element={<MyVault />} />
                <Route path="search" element={<SmartSearch />} />
                <Route path="material/:id" element={<MaterialDetails />} />
                <Route path="upload" element={<Upload />} />
                <Route path="ai" element={<AIStudy />} />
                <Route path="quiz" element={<QuizGenerator />} />
                <Route path="revision" element={<Revision />} />
                <Route path="verified" element={<VerifiedMaterials />} />
                <Route path="notifications" element={<Notifications />} />
                <Route path="settings" element={<Settings />} />
              </Route>

              {/* Backwards compatibility redirects for old routes */}
              <Route path="/student/*" element={<Navigate to="/dashboard" replace />} />
              <Route path="/teacher/*" element={<Navigate to="/verified" replace />} />

              {/* Catch-all redirect */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </BrowserRouter>
        </VaultProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
