import axios from 'axios';

const API_BASE_URL = 'http://localhost:5500/api';

// Helper for Auth Headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No token found');
  return { Authorization: `Bearer ${token}` };
};

// Get authenticated user
export const getAuthenticatedUser = async () => {
  const res = await axios.get(`${API_BASE_URL}/auth/me`, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

//register new user
export const registerUser = async (userData) => {
  const res = await axios.post(`${API_BASE_URL}/auth/register`, userData, {
    headers: { 'Content-Type': 'application/json' },
  });
  localStorage.setItem('token', res.data.token);
  return res.data;
};

//login user
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
  const res = await axios.post(`${API_BASE_URL}/business`, businessData, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

// Create operations
export const createOperations = async (data) => {
  const res = await axios.post(`${API_BASE_URL}/operations`, data, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

// Get user profile
export const getUserProfile = async () => {
  const res = await axios.get(`${API_BASE_URL}/auth/profile`, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

// Get employees
export const getEmployees = async () => {
  const res = await axios.get(`${API_BASE_URL}/employees`, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

// Add an employee
export const addEmployee = async (employeeData) => {
  const res = await axios.post(`${API_BASE_URL}/employees`, employeeData, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

//get operation hours for add employee modal
export const getOperations = async () => {
  const res = await axios.get(`${API_BASE_URL}/operations`, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

//delete employee
export const deleteEmployee = async (employeeId) => {
  const res = await axios.delete(`${API_BASE_URL}/employees/${employeeId}`, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

//update employee
export const updateEmployee = async (employeeId, updatedData) => {
  const res = await axios.put(`${API_BASE_URL}/employees/${employeeId}`, updatedData, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

// Get analytics for the dashboard
export const getAnalytics = async () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No token found');

  const res = await axios.get(`${API_BASE_URL}/employees/analytics`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data;
};

// Fetch all schedules
export const getSchedules = async () => {
  const res = await axios.get(`${API_BASE_URL}/schedule`, { headers: getAuthHeaders() });
  return res.data;
};

// Fetch schedule by ID
export const getScheduleById = async (id) => {
  const res = await axios.get(`${API_BASE_URL}/schedule/${id}`, { headers: getAuthHeaders() });
  return res.data;
};

// Update a schedule
export const updateSchedule = async (id, data) => {
  const res = await axios.put(`${API_BASE_URL}/schedule/${id}`, data, { headers: getAuthHeaders() });
  return res.data;
};

// Generate a new schedule
export const generateSchedule = async ({ month }) => {
  try {
    const res = await axios.post(
      `${API_BASE_URL}/schedule/generate`,
      { month },
      { headers: getAuthHeaders() }
    );
    return res.data;
  } catch (error) {
    console.error('Error generating schedule:', error.message);
    throw error;
  }
};

// Delete a schedule
export const deleteSchedule = async (id) => {
  const res = await axios.delete(`${API_BASE_URL}/schedule/${id}`, { headers: getAuthHeaders() });
  return res.data;
};