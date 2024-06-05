import axiosInstance from './axiosConfig';

// Register a new user
const registerUser = async (userData) => {
  try {
    const response = await axiosInstance.post('/user/register', userData);
    return response.data;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

// Login an existing user
const loginUser = async (userData) => {
  try {
    const response = await axiosInstance.post('/user/login', userData);
    return response.data;
  } catch (error) {
    console.error('Error logging in user:', error);
    throw error;
  }
};

// Get logged in user's data
const getUserData = async () => {
  try {
    const response = await axiosInstance.get('/user/me');
    return response.data;
  } catch (error) {
    console.error('Error getting user data:', error);
    throw error;
  }
};

// Get user by ID
const getUser = async (id) => {
  try {
    const response = await axiosInstance.get(`/user/getuser/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error getting user by ID:', error);
    throw error;
  }
};

// Update user
const updateUser = async (userData) => {
  try {
    const response = await axiosInstance.patch('/user/update', userData);
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

// Delete user
const deleteUser = async (userId) => {
  try {
    const response = await axiosInstance.delete(`/user/delete/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

export { registerUser, loginUser, getUser, updateUser, deleteUser, getUserData };