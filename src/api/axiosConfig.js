import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://chat-app-be-nik6348s-projects.vercel.app/api',
  withCredentials: true
});

export default axiosInstance;
