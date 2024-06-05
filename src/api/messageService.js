import axios from 'axios';

const API_URL = 'https://mern-chat-app-be-nik6348s-projects.vercel.app/api/message';

// Send a new message
const sendMessage = async (friendId, messageData) => {
  const response = await axios.post(`${API_URL}/send/${friendId}`, messageData);
  return response.data;
};

// Get all messages between two users
const getMessages = async (friendId) => {
  const response = await axios.get(`${API_URL}/${friendId}`);
  return response.data;
};

// Edit a message
const editMessage = async (messageId, messageData) => {
  const response = await axios.put(`${API_URL}/edit/${messageId}`, messageData);
  return response.data;
};

// Delete a message
const deleteMessage = async (messageId) => {
  const response = await axios.delete(`${API_URL}/delete/${messageId}`);
  return response.data;
};

// Delete all messages between two users
const deleteAllMessages = async (friendId) => {
  const response = await axios.delete(`${API_URL}/deleteAll/${friendId}`);
  return response.data;
};

export { sendMessage, getMessages, editMessage, deleteMessage, deleteAllMessages };
