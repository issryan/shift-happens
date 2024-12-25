import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

const App = () => {
  const isAuthenticated = true; // Replace with your authentication logic

  return (
    <Router>
      {/* Display Navbar only for authenticated users */}
      {isAuthenticated && <Navbar />}
      
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/business-info" element={<BusinessInfoPage />} />
        <Route path="/operations" element={<OperationsInfo />} />

        {/* Authenticated Routes */}
        {isAuthenticated && (
          <>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/exports" element={<Exports />} />
            <Route path="/profile" element={<Profile />} />
          </>
        )}
      </Routes>
    </Router>
  );
};

export default App;