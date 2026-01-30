import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Onboarding from './pages/Onboarding';
import VisaExplorer from './pages/VisaExplorer';
import VisaDetail from './pages/VisaDetail';
import EligibilityCheck from './pages/EligibilityCheck';
import ApplicationView from './pages/ApplicationView';
import DocumentUpload from './pages/DocumentUpload';
import KnowledgeHub from './pages/KnowledgeHub';
import ApplicationTracker from './pages/ApplicationTracker';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div className="spinner" />
        <p style={{ marginLeft: '1rem', color: '#6c757d' }}>Loading...</p>
      </div>
    );
  }
  return user ? children : <Navigate to="/login" />;
}

function AppContent() {
  const { user } = useAuth();

  return (
    <Router>
      <div className="app">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Landing />} />
            <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
            <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
            <Route path="/visas" element={<ProtectedRoute><VisaExplorer /></ProtectedRoute>} />
            <Route path="/visas/:id" element={<ProtectedRoute><VisaDetail /></ProtectedRoute>} />
            <Route path="/eligibility" element={<ProtectedRoute><EligibilityCheck /></ProtectedRoute>} />
            <Route path="/applications/:id" element={<ProtectedRoute><ApplicationView /></ProtectedRoute>} />
            <Route path="/applications/:id/documents" element={<ProtectedRoute><DocumentUpload /></ProtectedRoute>} />
            <Route path="/knowledge" element={<KnowledgeHub />} />
            <Route path="/tracker" element={<ProtectedRoute><ApplicationTracker /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
