import { useEffect, useRef } from 'react';
import io from 'socket.io-client';
import {
  getMessageById as getMessagesAPI,
  updateStatus as updateStatusAPI,
} from '../api/messageService';
const useSocket = (userId, setMessages) => {
  const socketRef = useRef();
  const apiUrl = 'https://chat-app-be-nik6348s-projects.vercel.app';

  useEffect(async () => {
    // Connect to the server
    socketRef.current = io(apiUrl, {
      query: { userId },
    });

    // Listen for new messages
    socketRef.current.on('receive_message', async (message) => {
      // Fetch the latest messages to get the decrypted message
      const messages = await getMessagesAPI(message._id);
      setMessages((prevMessages) => [...prevMessages, messages]);
    });

    // Listen for message status updates
    socketRef.current.on(
      'update_message_status',
      async ({ messageId, status }) => {
        await updateStatusAPI(messageId, status);
        setMessages((prevMessages) =>
          prevMessages.map((message) =>
            message._id === messageId ? { ...message, status } : message
          )
        );
        // Cleanup on component unmount
        return () => {
          if (socketRef.current) {
            socketRef.current.off('receive_message');
            socketRef.current.off('update_message_status');
            socketRef.current.disconnect();
            socketRef.current = null;
          }
        };
      },
      [userId, setMessages]
    );
    // Cleanup on component unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.off('receive_message');
        socketRef.current.off('update_message_status');
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [userId, setMessages]);

  return socketRef.current;
};

export default useSocket;
