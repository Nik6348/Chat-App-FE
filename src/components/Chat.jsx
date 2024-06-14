import React, { useState, useEffect, useRef } from 'react';
import { Container, Paper, Grid, Box } from '@mui/material';
import Message from './Message';
import InputField from './InputField';
import ChatHeader from './ChatHeader';
import {
  sendMessage as sendMessageAPI,
  getMessages as getMessagesAPI,
  updateStatus as updateStatusAPI,
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
    // Call message API
    const savedMessage = await sendMessageAPI(friendId, message);

    // Fetch the latest messages to get the decrypted message
    const messages = await getMessagesAPI(friendId);
    const latestMessage = messages.data[messages.data.length - 1];

    // Send message to the server
    socket.emit('send_message', latestMessage);

    // Simulate message delivery and read status updates
    setTimeout(async () => {
      const updatedMessage = { ...latestMessage, status: 'Delivered' };
      await editMessage(savedMessage.data._id, updatedMessage);
      socket.emit('message status', updatedMessage);
    }, 1000);

    setTimeout(async () => {
      const updatedMessage = { ...latestMessage, status: 'Seen' };
      await editMessage(savedMessage.data._id, updatedMessage);
      socket.emit('message status', updatedMessage);
    }, 3000);
  };

  const markAsDelivered = async (messageId) => {
    await updateStatusAPI(messageId, { status: 'Delivered' });
    socket.emit('message_delivered', { messageId });
  };

  const markAsSeen = async (messageId) => {
    await updateStatusAPI(messageId, { status: 'Seen' });
    socket.emit('message_seen', { messageId });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
              <Message message={msg} />
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
