import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

const useSocket = (userId, setMessages) => {
  const apiUrl = 'http://localhost:3000';
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io(apiUrl, { query: { userId } });

    socketRef.current.on('connect', () => {
      console.log('Connected to socket server');
    });

    socketRef.current.on('disconnect', () => {
      console.log('Disconnected from socket server');
    });

    socketRef.current.on('receive_message', (msg) => {
      console.log('Message received on client: ', msg);
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    socketRef.current.on('update_message_status', ({ messageId, status }) => {
      console.log('Message status update received on client: ', {
        messageId,
        status,
      });
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg._id === messageId ? { ...msg, status } : msg
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
