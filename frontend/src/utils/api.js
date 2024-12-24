import axios from 'axios';

const API_BASE_URL = 'http://localhost:5500/api';

export const loginUser = async (loginData) => {
    const res = await axios.post(`${API_BASE_URL}/auth/login`, loginData);
    localStorage.setItem('token', res.data.token);
    return res.data;
};

export const registerUser = async (credentials) => {
    const res = await axios.post(`${API_BASE_URL}/auth/register`, credentials);
    localStorage.setItem('token', res.data.token);
};

export const getUserProfile = async () => {
    const res = await axios.get(`${API_BASE_URL}/auth/profile`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    });
    return res.data;
};

export const saveBusinessInfo = async (businessData) => {
    const res = await axios.post(`${API_BASE_URL}/business`, businessData, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    });
    return res.data;
};