import { useEffect, useRef } from 'react';
import io from 'socket.io-client';

const useSocket = (userId, setMessages) => {
  const socketRef = useRef();
  const apiUrl = 'https://chat-app-be-nik6348s-projects.vercel.app';

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io(apiUrl, { query: { userId }, withCredentials: true });

      // Listen for new messages
      socketRef.current.on('receive_message', (message) => {
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
    }

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
