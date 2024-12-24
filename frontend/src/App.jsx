import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import BusinessInfoPage from './pages/BusinessInfo';
import DashboardPage from './pages/Dashboard';
import OperationsInfo from './pages/Operations';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/business-info" element={<BusinessInfoPage />} />
        <Route path="/operations" element={<OperationsInfo />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </Router>
  );
};

export default App;