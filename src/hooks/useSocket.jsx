import { useEffect, useRef } from 'react';
import io from 'socket.io-client';

const useSocket = (userId, setMessages) => {
  const socketRef = useRef();
  const apiUrl = 'https://mern-chat-app-be-nik6348s-projects.vercel.app/';

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io(apiUrl, { query: { userId } });

      // Listen for messages from the server
      socketRef.current.on('receive_message', (msg) => {
        setMessages((prevMessages) => [...prevMessages, msg]);
      });
    }
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
