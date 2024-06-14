import { useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { getMessages as getMessagesAPI } from '../api/messageService';

const useSocket = (userId) => {
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

    // Listen for new messages
    socketRef.current.on('receive_message', async (message) => {
      // get decrypted message
      const message = await getMessagesAPI(message._id);
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Listen for message status updates
    socketRef.current.on('update_message_status', ({ messageId, status }) => {
      setMessages((prevMessages) =>
        prevMessages.map((message) =>
          message._id === messageId ? { ...message, status } : message
        )
      );
    });
    return () => {
      socketRef.current.disconnect();
    };
  }, [userId]);

  return { socket: socketRef.current };
};

export default useSocket;
