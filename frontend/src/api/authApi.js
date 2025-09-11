import axios from 'axios';

const API_URL = '/api/auth';

export const register = (data) => axios.post(`${API_URL}/register`, data);
export const login = (data) => axios.post(`${API_URL}/login`, data);
export const verifyEmail = (params) => axios.get(`${API_URL}/verify-email`, { params });
export const verifyMobile = (data) => axios.post(`${API_URL}/verify-mobile`, data);
