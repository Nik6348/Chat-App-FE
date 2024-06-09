import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

const useSocket = (userId, setMessages) => {
    const socketRef = useRef(null);
    const apiUrl = 'https://chat-app-be-nik6348s-projects.vercel.app/';
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (userId) {
            const socket = io(apiUrl, { query: { userId } });
            socketRef.current = socket;

            socket.on('connect', () => {
                setIsLoading(false);
            });

            socket.on('chat message', (msg) => {
                setMessages((prevMessages) => [...prevMessages, msg]);
            });

            socket.on('message status', (updatedMessage) => {
                setMessages(prevMessages => prevMessages.map(msg =>
                    msg._id === updatedMessage._id ? updatedMessage : msg
                ));
            });

            return () => {
                socket.off('chat message');
                socket.off('message status');
                socket.disconnect();
                socketRef.current = null; 
            };
        }
    }, [userId]);

    return { socket: socketRef.current, isLoading };
};

export default useSocket;
