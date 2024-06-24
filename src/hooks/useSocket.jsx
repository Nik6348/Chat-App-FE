import { useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { updateStatus as updateStatusAPI } from '../api/messageService';

const useSocket = (userId, setMessages) => {
  const apiUrl = 'https://chat-app-be-nik6348s-projects.vercel.app/';
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io(apiUrl, {
      query: { userId },
      transports: ['websocket'], // Force WebSocket transport
      reconnectionAttempts: 5, // Attempt to reconnect up to 5 times
      reconnectionDelay: 2000, // Wait 2 seconds before attempting to reconnect
    });

    socketRef.current.on('connect', () => {
      console.log('Connected to socket server');
    });

    socketRef.current.on('disconnect', (reason) => {
      console.log('Disconnected from socket server:', reason);
      if (reason === 'io server disconnect') {
        // The disconnection was initiated by the server, we need to reconnect manually
        socketRef.current.connect();
      }
    });

    socketRef.current.on('connect_error', (error) => {
      console.error('Connection error:', error);
    });

    socketRef.current.on('error', (error) => {
      console.error('An error occurred:', error);
    });

    socketRef.current.on('receive_message', async (msg) => {
      console.log('Received message:', msg);
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    socketRef.current.on('update_message_status', async ({ messageId, status }) => {
      console.log('Received message status update:', { messageId, status });
      await updateStatusAPI(messageId, status);
      setMessages((prevMessages) =>
        prevMessages.map((message) =>
          message._id === messageId ? { ...message, status } : message
        )
      );
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [userId, setMessages]);

  return { socket: socketRef.current };
};

export default useSocket;