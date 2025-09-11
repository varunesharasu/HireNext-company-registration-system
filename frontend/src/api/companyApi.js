import axios from 'axios';

const API_URL = '/api/company';

export const registerCompany = (data, token) => axios.post(`${API_URL}/register`, data, { headers: { Authorization: `Bearer ${token}` } });
export const getProfile = (token) => axios.get(`${API_URL}/profile`, { headers: { Authorization: `Bearer ${token}` } });
export const updateProfile = (data, token) => axios.put(`${API_URL}/profile`, data, { headers: { Authorization: `Bearer ${token}` } });
export const uploadLogo = (formData, token) => axios.post(`${API_URL}/upload-logo`, formData, { headers: { Authorization: `Bearer ${token}` } });
export const uploadBanner = (formData, token) => axios.post(`${API_URL}/upload-banner`, formData, { headers: { Authorization: `Bearer ${token}` } });
