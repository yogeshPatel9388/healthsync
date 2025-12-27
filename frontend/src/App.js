import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthContext, AuthProvider } from "./context/AuthContext";

// Pages & Components
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

/**
 * ProtectedRoute Component
 * Redirects users to login if they are not authenticated.
 */
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center mt-20 space-y-4">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 dark:text-slate-400 font-medium">
          Loading your session...
        </p>
      </div>
    );

  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        {/* UPDATED: Added dark:bg-slate-950 and dark:text-slate-50 */}
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-50 font-sans transition-colors duration-500">
          {/* Global Navigation Bar */}
          <Navbar />

          <main className="mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12 max-w-7xl">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Private Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all for 404 - Redirect to Home */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>

          {/* Global Footer */}
          <footer className="text-center py-8 text-gray-500 dark:text-slate-500 border-t border-gray-200 dark:border-slate-800 transition-colors duration-300">
            <p className="text-sm">
              © 2025 HealthSync Hospital Management System. All rights reserved.
            </p>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
