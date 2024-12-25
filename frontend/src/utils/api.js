import axios from 'axios';

const API_BASE_URL = 'http://localhost:5500/api';

// Register user
export const registerUser = async (userData) => {
    const res = await axios.post(`${API_BASE_URL}/auth/register`, userData, {
        headers: { 'Content-Type': 'application/json' },
    });
    localStorage.setItem('token', res.data.token);
    return res.data;
};

// Login user
export const loginUser = async (loginData) => {
    try {
        const res = await axios.post(`${API_BASE_URL}/auth/login`, loginData, {
            headers: { 'Content-Type': 'application/json' },
        });
        localStorage.setItem('token', res.data.token);
        return res.data;
    } catch (error) {
        console.error('Error during login:', error.response?.data || error.message);
        throw error;
    }
};

// Create business
export const createBusiness = async (businessData) => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');
    const res = await axios.post(`${API_BASE_URL}/business`, businessData, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
};

// Create operations
export const createOperations = async (data) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");
    const res = await axios.post(`${API_BASE_URL}/operations`, data, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return res.data;
};

// Get user profile
export const getUserProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');
    const res = await axios.get(`${API_BASE_URL}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
};

// Get employees
export const getEmployees = async () => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');
    const res = await axios.get(`${API_BASE_URL}/employees`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
};

// Add an employee
export const addEmployee = async (employeeData) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");
    const res = await axios.post(`${API_BASE_URL}/employees`, employeeData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  };

  export const getOperations = async () => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');
    const res = await axios.get(`${API_BASE_URL}/operations`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  };