import axios from 'axios';

const API_BASE_URL = 'http://localhost:5500/api';

// Helper for Auth Headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No token found');
  return { Authorization: `Bearer ${token}` };
};

/* -------------------------------- User Authentication -------------------------------- */

// Get authenticated user
export const getAuthenticatedUser = async () => {
  const res = await axios.get(`${API_BASE_URL}/auth/me`, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

// Register new user
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

//update user password
export const updateUserPassword = async (userData) => {
  const res = await axios.put(`${API_BASE_URL}/auth/profile`, userData, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

/* -------------------------------- Business Management -------------------------------- */

// Create business
export const createBusiness = async (businessData) => {
  const res = await axios.post(`${API_BASE_URL}/business`, businessData, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

// Fetch business details
export const fetchBusiness = async () => {
  const res = await axios.get(`${API_BASE_URL}/business`, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

// Update business details
export const updateBusiness = async (businessData) => {
  const res = await axios.put(`${API_BASE_URL}/business`, businessData, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

/* ----------------------------- Operations Management ----------------------------- */

// Create operations
export const createOperations = async (data) => {
  const res = await axios.post(`${API_BASE_URL}/operations`, data, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

// Fetch operations
export const fetchOperations = async () => {
  const res = await axios.get(`${API_BASE_URL}/operations`, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

// Update operations
export const updateOperations = async (operationsData) => {
  const res = await axios.put(`${API_BASE_URL}/operations`, operationsData, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

/* ----------------------------- Employee Management ----------------------------- */

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

// Delete employee
export const deleteEmployee = async (employeeId) => {
  const res = await axios.delete(`${API_BASE_URL}/employees/${employeeId}`, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

// Update employee
export const updateEmployee = async (employeeId, updatedData) => {
  const res = await axios.put(`${API_BASE_URL}/employees/${employeeId}`, updatedData, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

/* ----------------------------- Schedule Management ----------------------------- */

// Fetch all schedules
export const getSchedules = async () => {
  const res = await axios.get(`${API_BASE_URL}/schedule`, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

// Fetch schedule by ID
export const getScheduleById = async (id) => {
  const res = await axios.get(`${API_BASE_URL}/schedule/${id}`, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

// Generate a new schedule
export const generateSchedule = async ({ month, businessHours }) => {
  try {
    const res = await axios.post(
      `${API_BASE_URL}/schedule/generate`,
      { month, businessHours },
      { headers: getAuthHeaders() }
    );
    return res.data;
  } catch (error) {
    console.error('Error generating schedule:', error.message);
    throw error;
  }
};

// Update a schedule
export const updateSchedule = async (id, data) => {
  const res = await axios.put(`${API_BASE_URL}/schedule/${id}`, data, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

// Delete a schedule
export const deleteSchedule = async (id) => {
  const res = await axios.delete(`${API_BASE_URL}/schedule/${id}`, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

/* ----------------------------- Analytics Management ----------------------------- */

// Get analytics for the dashboard
export const getAnalytics = async () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No token found');

  const res = await axios.get(`${API_BASE_URL}/employees/analytics`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data;
};