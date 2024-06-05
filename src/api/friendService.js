import axiosInstance from './axiosConfig';

// Send a friend request
const sendFriendRequest = async (friendId) => {
  try {
    const response = await axiosInstance.post(`/friend/send-request/${friendId}`);
    return response.data;
  } catch (error) {
    console.error('Error sending friend request:', error);
    throw error;
  }
};

// Accept a friend request
const acceptFriendRequest = async (friendId) => {
  try {
    const response = await axiosInstance.post(`/friend/accept-request/${friendId}`);
    return response.data;
  } catch (error) {
    console.error('Error accepting friend request:', error);
    throw error;
  }
};

// Reject a friend request
const rejectFriendRequest = async (friendId) => {
  try {
    const response = await axiosInstance.post(`/friend/reject-request/${friendId}`);
    return response.data;
  } catch (error) {
    console.error('Error rejecting friend request:', error);
    throw error;
  }
};

// Get all friends
const getAllFriends = async () => {
  try {
    const response = await axiosInstance.get('/friend/all-friends');
    return response.data;
  } catch (error) {
    console.error('Error getting all friends:', error);
    throw error;
  }
};

// Get sent friend requests
const getSentFriendRequests = async () => {
  try {
    const response = await axiosInstance.get('/friend/sent');
    return response.data;
  } catch (error) {
    console.error('Error getting sent friend requests:', error);
    throw error;
  }
};

// Get received friend requests
const getReceivedFriendRequests = async () => {
  try {
    const response = await axiosInstance.get('/friend/received');
    return response.data;
  } catch (error) {
    console.error('Error getting received friend requests:', error);
    throw error;
  }
};

export { sendFriendRequest, acceptFriendRequest, rejectFriendRequest, getAllFriends, getSentFriendRequests, getReceivedFriendRequests };