import React, { useState, useEffect } from 'react';
import { Container, Paper, Grid } from '@mui/material';
import Message from './Message.jsx';
import InputField from './InputField';
import ChatHeader from './ChatHeader';
import {
  sendMessage as sendMessageAPI,
  getMessages as getMessagesAPI,
  editMessage,
} from '../api/messageService.js';
import { useParams } from 'react-router-dom';
import useSocket from '../hooks/useSocket';
import { useAuth } from '../context/AuthContext';

const Chat = () => {
  const { friendId } = useParams();
  const [messages, setMessages] = useState([]);
  const { user } = useAuth();
  const socket = useSocket(user._id, setMessages);

  useEffect(() => {
    const fetchMessages = async () => {
      const messages = await getMessagesAPI(friendId);
      setMessages(messages.data);
    };

    fetchMessages();
  }, [friendId, messages]);

  const sendMessage = async (message) => {
    const newMessage = {
      text: message,
      recipientId: friendId,
    };

    // Call message API
    const savedMessage = await sendMessageAPI(friendId, newMessage);

    // Fetch the latest messages to get the decrypted message
    const messages = await getMessagesAPI(friendId);
    const latestMessage = messages.data[messages.data.length - 1];

    // Send message to the server
    socket.emit('chat message', latestMessage);

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

  return (
    <Container maxWidth="md">
      <ChatHeader />
      <Paper
        elevation={3}
        style={{
          height: '70vh',
          padding: '20px',
          overflowY: 'auto',
          marginTop: '10px',
        }}
      >
        <Grid container spacing={2}>
          {messages.map((msg, index) => (
            <Grid item xs={12} key={index}>
              <Message message={msg} />
            </Grid>
          ))}
        </Grid>
      </Paper>
      <InputField sendMessage={(message) => sendMessage(message)} />
    </Container>
  );
};

export default Chat;
