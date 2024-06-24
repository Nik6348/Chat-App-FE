import React, { useState, useEffect, useRef } from 'react';
import { Container, Paper, Grid, Box } from '@mui/material';
import Message from './Message';
import InputField from './InputField';
import ChatHeader from './ChatHeader';
import {
  sendMessage as sendMessageAPI,
  getMessages as getMessagesAPI,
} from '../api/messageService';
import { useParams } from 'react-router-dom';
import useSocket from '../hooks/useSocket';
import { useAuth } from '../context/AuthContext';

const Chat = () => {
  const { friendId } = useParams();
  const [messages, setMessages] = useState([]);
  const { user } = useAuth();
  const { socket } = useSocket(user._id, setMessages);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      const response = await getMessagesAPI(friendId);
      setMessages(response.data);
      scrollToBottom();
    };

    fetchMessages();
  }, [friendId]);

  const sendMessage = async (message) => {
    const newMessage = {
      sender: user._id,
      receiver: friendId,
      text: message,
      status: 'Sent',
      createdAt: new Date(),
    };

    // Add message to the state
    setMessages([...messages, newMessage]);

    // Send message to the server
    socket.emit('send_message', newMessage);

    // Send message in the database
    const lettestMessage = await sendMessageAPI(friendId, message);

    // Simulate message delivery
    setTimeout(async () => {
      socket.emit('message_delivered', { messageId: lettestMessage._id });
    }, 2000);
  };

  // Function to mark a message as seen
  const markAsSeen = async (messageId) => {
    socket.emit('message_seen', { messageId });
  };

  // Function to scroll to the bottom of the chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        padding: 0,
      }}
    >
      <ChatHeader />
      <Paper
        elevation={3}
        sx={{ flex: 1, padding: '10px', overflowY: 'auto', marginTop: '10px' }}
      >
        <Grid container spacing={1}>
          {messages.map((msg, index) => (
            <Grid item xs={12} key={index}>
              <Message message={msg} onMarkAsSeen={() => markAsSeen(msg._id)} />
            </Grid>
          ))}
          <div ref={messagesEndRef} />
        </Grid>
      </Paper>
      <Box sx={{ padding: '10px' }}>
        <InputField sendMessage={sendMessage} />
      </Box>
    </Container>
  );
};

export default Chat;
