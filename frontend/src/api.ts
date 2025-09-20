// src/api.ts
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add JWT token to every request if exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // store token on login
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const registerUser = (data: { name: string; email: string; password: string; role: string }) =>
  api.post('/auth/register', data);

export const loginUser = (data: { email: string; password: string }) =>
  api.post('/auth/login', data);

export const getProfile = () => api.get('/auth/profile');

export const updateProfile = (data: { name?: string; email?: string }) =>
  api.put('/auth/profile', data);

export const changePassword = (data: { currentPassword: string; newPassword: string }) =>
  api.put('/auth/change-password', data);

export default api;
