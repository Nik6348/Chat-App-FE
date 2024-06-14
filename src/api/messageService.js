import axiosInstance from './axiosConfig';

const sendMessage = async (friendId, messageData) => {
  try {
    const response = await axiosInstance.post(`/message/send/${friendId}`, { text: messageData });
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

const uploadFile = async (formData) => {
  try {
    const response = await axiosInstance.post('/message/upload', formData);
    return response.data;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};
const getMessageById = async (id) => {
  try {
    const response = await axiosInstance.get(`/message/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error getting message by ID:', error);
    throw error;
  }
};

const getMessages = async (friendId) => {
  try {
    const response = await axiosInstance.get(`/message/${friendId}`);
    return response.data;
  } catch (error) {
    console.error('Error getting messages:', error);
    throw error;
  }
};

const updateStatus = async (messageId, status) => {
  try {
    const response = await axiosInstance.put(`/message/update-status/${messageId}`, status);
    return response.data;
  } catch (error) {
    console.error('Error updating message status:', error);
    throw error;
  }
};

const deleteMessage = async (messageId) => {
  try {
    const response = await axiosInstance.delete(`/message/delete/${messageId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting message:', error);
    throw error;
  }
};

const deleteAllMessages = async (friendId) => {
  try {
    const response = await axiosInstance.delete(`/message/deleteAll/${friendId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting all messages:', error);
    throw error;
  }
};

export { sendMessage, uploadFile, getMessageById, getMessages, updateStatus, deleteMessage, deleteAllMessages };
