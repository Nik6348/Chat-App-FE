import axios from 'axios';

const axiosInstance = axios.create({
  // baseURL: 'https://chat-app-be-nik6348s-projects.vercel.app/api',
  baseURL: 'http://localhost:3000/api',
  withCredentials: true
});

export default axiosInstance;
