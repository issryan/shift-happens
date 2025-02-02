import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Home from './pages/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import BusinessInfoPage from './pages/BusinessInfo';
import OperationsInfo from './pages/Operations';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Authenticated routes
import Navbar from './components/Navbar/Navbar';
import DashboardPage from './pages/Dashboard';
import SchedulePage from './pages/SchedulesPage';
import ScheduleEditPage from './pages/EditSchedulePage';
import Exports from './components/exports/Exports';
import Profile from './pages/Profile';

// Protected Route Component
const ProtectedRoute = ({ element }) => {
  const { auth, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  return auth.isAuthenticated ? element : <Navigate to="/login" />;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/business-info" element={<BusinessInfoPage />} />
          <Route path="/operations" element={<OperationsInfo />} />

          {/* Authenticated routes */}
          <Route
            path="/dashboard"
            element={<ProtectedRoute element={<><Navbar /><DashboardPage /></>} />}
          />
          <Route path="/schedule" element={<ProtectedRoute element={<SchedulePage />} />} />
          <Route path="/schedule/edit/:id" element={<ProtectedRoute element={<ScheduleEditPage isNew={false} />} />} />
          <Route path="/schedule/edit/new" element={<ProtectedRoute element={<ScheduleEditPage isNew={true} />} />} />
          <Route
            path="/exports"
            element={<ProtectedRoute element={<><Navbar /><Exports /></>} />}
          />
          <Route
            path="/profile"
            element={<ProtectedRoute element={<><Navbar /><Profile /></>} />}
          />
        </Routes>
        <ToastContainer />
      </Router>
    </AuthProvider>
  );
};

export default App;