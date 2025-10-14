import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AdminAuthProvider } from './contexts/AdminAuthContext';
import { ToastProvider } from './contexts/ToastContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import WhatsAppButton from './components/WhatsAppButton';

// Pages
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/Dashboard';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Router>
      <AuthProvider>
        <AdminAuthProvider>
          <ToastProvider>
            <div className="font-inter">
              <Routes>
                {/* Landing Page */}
                <Route path="/" element={<Landing />} />
              
              {/* Authentication Routes */}
              <Route path="/signup" element={<SignUp />} />
              <Route path="/login" element={<SignIn />} />
              <Route path="/auth" element={<Auth />} />

              {/* User Dashboard - Protected */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <UserDashboard />
                  </ProtectedRoute>
                } 
              />

              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route 
                path="/admin/dashboard" 
                element={
                  <AdminProtectedRoute>
                    <AdminDashboard />
                  </AdminProtectedRoute>
                } 
              />

              {/* Catch-all route */}
              <Route path="*" element={
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <h1 className="text-6xl font-bold text-gray-400">404</h1>
                    <p className="text-xl text-gray-600 mt-4">Page not found</p>
                    <Link 
                      to="/" 
                      className="mt-6 inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                    >
                      Go Home
                    </Link>
                  </div>
                </div>
              } />
            </Routes>
            <WhatsAppButton />
          </div>
          </ToastProvider>
        </AdminAuthProvider>
      </AuthProvider>
    </Router>
  );
}

export default App
