import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Home from './pages/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import BusinessInfoPage from './pages/BusinessInfo';
import OperationsInfo from './pages/Operations';

// Authenticated routes
import Navbar from './components/Navbar/Navbar';
import DashboardPage from './pages/Dashboard';
import Schedule from './components/schedule/Schedule';
import Exports from './components/exports/Exports';
import Profile from './pages/Profile';

// Protected Route Wrapper
const ProtectedRoute = ({ element }) => {
  const { auth } = useContext(AuthContext);
  return auth.isAuthenticated ? element : <Navigate to="/login" />;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/business-info" element={<BusinessInfoPage />} />
          <Route path="/operations" element={<OperationsInfo />} />

          {/* Authenticated routes */}
          <Route path="/dashboard" element={<ProtectedRoute element={<><Navbar /><DashboardPage /></>} />} />
          <Route path="/schedule" element={<ProtectedRoute element={<><Navbar /><Schedule /></>} />} />
          <Route path="/exports" element={<ProtectedRoute element={<><Navbar /><Exports /></>} />} />
          <Route path="/profile" element={<ProtectedRoute element={<><Navbar /><Profile /></>} />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;