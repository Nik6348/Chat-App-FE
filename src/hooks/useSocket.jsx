import { useEffect, useRef } from 'react';
import io from 'socket.io-client';
import {
  getMessages as getMessagesAPI,
  updateStatus as updateStatusAPI,
} from '../api/messageService';

const useSocket = (userId, setMessages) => {
  const apiUrl = 'https://chat-app-be-nik6348s-projects.vercel.app/';
  // const apiUrl = 'http://localhost:3000/'
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io(apiUrl, { query: { userId } });

    socketRef.current.on('connect', () => {
      console.log('Connected to socket server');
    });

    socketRef.current.on('disconnect', () => {
      console.log('Disconnected from socket server');
    });

    // Handle connection errors
    socketRef.current.on('connect_error', (error) => {
      console.error('Connection error:', error);
    });

    // Handle other errors
    socketRef.current.on('error', (error) => {
      console.error('An error occurred:', error);
    });

    // Listen for new messages
    socketRef.current.on('receive_message', async (msg) => {
      console.log('Received message:', msg);
      // get decrypted message
      const message = await getMessagesAPI(msg._id);
      console.log('Decrypted message:', message);
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Listen for message status updates
    socketRef.current.on(
      'update_message_status',
      async ({ messageId, status }) => {
        console.log('Received message status update:', { messageId, status });
        // Update the message status in the db
        await updateStatusAPI(messageId, status);
        setMessages((prevMessages) =>
          prevMessages.map((message) =>
            message._id === messageId ? { ...message, status } : message
          )
        );
      }
    );
    return () => {
      socketRef.current.disconnect();
    };
  }, [userId, setMessages]);

  return { socket: socketRef.current };
};

export default useSocket;
