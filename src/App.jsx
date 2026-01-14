import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import './App.css';
import LandingPage from './components/LandingPage/LandingPage.jsx';
import AuthPage from './components/Auth/AuthPage.jsx';
import DocumentUploadPage from './components/Upload/DocumentUploadPage.jsx';
import AIAgentPage from './components/AIAgent/AIAgentPage.jsx';
import AIAgent2Page from './components/AIAgent/AIAgent2Page.jsx';
import LoadingSpinner from './components/common/LoadingSpinner.jsx'; // You can create this component

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || import.meta.env.REACT_APP_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.REACT_APP_SUPABASE_ANON_KEY
);

// Protected Route Component
const ProtectedRoute = ({ children, user }) => {
  return user ? children : <Navigate to="/auth" replace />;
};

// Public Route Component (redirect to landing if authenticated)
const PublicRoute = ({ children, user }) => {
  return !user ? children : <Navigate to="/" replace />;
};

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [documentsUploaded, setDocumentsUploaded] = useState(true); // Add this state

  useEffect(() => {
    // Check for existing session
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
        } else if (session) {
          setUser(session.user);
        }
      } catch (error) {
        console.error('Error in getSession:', error);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);

        if (session) {
          setUser(session.user);
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleUserAuth = (userData) => {
    setUser(userData);
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error in handleLogout:', error);
    }
  };

  const handlePageChange = (page) => {
    // This function can be used for programmatic navigation
    // For now, we'll use it for any page-specific logic
    console.log('Page change requested:', page);
    // You can add navigation logic here if needed
  };

  // Show loading spinner while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-manu-light to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-manu-green mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Landing Page - Accessible to all */}
          <Route
            path="/"
            element={
              <LandingPage
                user={user}
                onLogout={handleLogout}
              />
            }
          />

          {/* Auth Page - Only accessible when not logged in */}
          <Route
            path="/auth"
            element={
              <PublicRoute user={user}>
                <AuthPage onUserAuth={handleUserAuth} />
              </PublicRoute>
            }
          />

          {/* Protected Routes - Only accessible when logged in */}
          <Route
            path="/upload"
            element={
              <ProtectedRoute user={user}>
                <DocumentUploadPage
                  user={user}
                  onLogout={handleLogout}
                />
              </ProtectedRoute>
            }
          />

          <Route
            path="/ai-agent"
            element={
              <ProtectedRoute user={user}>
                <AIAgentPage
                  user={user}
                  onLogout={handleLogout}
                />
              </ProtectedRoute>
            }
          />

          <Route
            path="/ai-agent-2"
            element={
              <ProtectedRoute user={user}>
                <AIAgent2Page
                  user={user}
                  onPageChange={handlePageChange}
                  onLogout={handleLogout}
                  documentsUploaded={documentsUploaded}
                />
              </ProtectedRoute>
            }
          />

          {/* Catch all route - redirect to landing */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;