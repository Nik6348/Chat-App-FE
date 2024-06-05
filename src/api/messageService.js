import axiosInstance from './axiosConfig';

// Send a new message
const sendMessage = async (friendId, messageData) => {
  try {
    const response = await axiosInstance.post(`/message/send/${friendId}`, messageData);
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

// Get all messages between two users
const getMessages = async (friendId) => {
  try {
    const response = await axiosInstance.get(`/message/${friendId}`);
    return response.data;
  } catch (error) {
    console.error('Error getting messages:', error);
    throw error;
  }
};

// Edit a message
const editMessage = async (messageId, messageData) => {
  try {
    const response = await axiosInstance.put(`/message/edit/${messageId}`, messageData);
    return response.data;
  } catch (error) {
    console.error('Error editing message:', error);
    throw error;
  }
};

// Delete a message
const deleteMessage = async (messageId) => {
  try {
    const response = await axiosInstance.delete(`/message/delete/${messageId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting message:', error);
    throw error;
  }
};

// Delete all messages between two users
const deleteAllMessages = async (friendId) => {
  try {
    const response = await axiosInstance.delete(`/message/deleteAll/${friendId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting all messages:', error);
    throw error;
  }
};

export { sendMessage, getMessages, editMessage, deleteMessage, deleteAllMessages };