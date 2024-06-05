import axios from 'axios';

const API_URL = 'https://chat-app-be-nik6348s-projects.vercel.app/api/friend';

// Send a friend request
const sendFriendRequest = async (friendId) => {
  const response = await axios.post(`${API_URL}/send-request/${friendId}`);
  return response.data;
};

// Accept a friend request
const acceptFriendRequest = async (friendId) => {
  const response = await axios.post(`${API_URL}/accept-request/${friendId}`);
  return response.data;
};

// Reject a friend request
const rejectFriendRequest = async (friendId) => {
  const response = await axios.post(`${API_URL}/reject-request/${friendId}`);
  return response.data;
};

// Get all friends
const getAllFriends = async () => {
  const response = await axios.get(`${API_URL}/all-friends`);
  return response.data;
};

// Get sent friend requests
const getSentFriendRequests = async () => {
  const response = await axios.get(`${API_URL}/sent`);
  return response.data;
};

// Get received friend requests
const getReceivedFriendRequests = async () => {
  const response = await axios.get(`${API_URL}/received`);
  return response.data;
};

export { sendFriendRequest, acceptFriendRequest, rejectFriendRequest, getAllFriends, getSentFriendRequests, getReceivedFriendRequests };
