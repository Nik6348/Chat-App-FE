import axios from 'axios';

const API_URL = 'https://chat-app-be-nik6348s-projects.vercel.app/api/user';

// Register a new user
const registerUser = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  return response.data;
};

// Login an existing user
const loginUser = async (userData) => {
  const response = await axios.post(`${API_URL}/login`, userData, {
    withCredentials: true
  });
  return response.data;
};

// get logged in user's data
const getUserData = async () => {
  const response = await axios.get(`${API_URL}/me`, {
    withCredentials: true
  });
  return response.data;
};

// Get user by ID
const getUser = async (id) => {
  const response = await axios.get(`${API_URL}/getuser/${id}`, {
    withCredentials: true
  });
  return response.data;
};

// Update user
const updateUser = async (userData) => {
  const response = await axios.patch(`${API_URL}/update`, userData, {
    withCredentials: true
  });
  return response.data;
};

// Delete user
const deleteUser = async (userId) => {
  const response = await axios.delete(`${API_URL}/delete/${userId}`, {
    withCredentials: true
  });
  return response.data;
};

export { registerUser, loginUser, getUser, updateUser, deleteUser, getUserData };