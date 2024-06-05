import { useEffect, useRef } from 'react';
import io from 'socket.io-client';

const useSocket = (userId, setMessages) => {
  const socketRef = useRef();
  const apiUrl = 'https://chat-app-be-nik6348s-projects.vercel.app/';
  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io(apiUrl, { query: { userId } });

      // Listen for messages from the server
      socketRef.current.on('chat message', (msg) => {
        setMessages((prevMessages) => [...prevMessages, msg]);
      });
    }

    // Cleanup on component unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.off('chat message');
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [userId, setMessages]);

  return socketRef.current;
};

export default useSocket;
