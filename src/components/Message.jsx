import React from 'react';
import { Box, Typography, Paper, Avatar } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import DoneIcon from '@mui/icons-material/Done';
import DoneAllIcon from '@mui/icons-material/DoneAll';

const Message = ({ message }) => {
  const { user } = useAuth();

  const isOwnMessage = user._id === message.sender;
  const timestamp = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(message.createdAt));

  return (
    <Box
      display="flex"
      justifyContent={isOwnMessage ? 'flex-end' : 'flex-start'}
      mb={1}
    >
      <Paper
        sx={{
          padding: '10px',
          maxWidth: '70%',
          backgroundColor: isOwnMessage ? '#DCF8C6' : '#fff',
          borderRadius: isOwnMessage
            ? '15px 0px 15px 15px'
            : '0px 15px 15px 15px',
          boxShadow: 3,
          border: isOwnMessage ? '1px solid #4CAF50' : '1px solid #ccc',
        }}
      >
        <Box
          display="flex"
          // justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
        >
          <Typography variant="body1" sx={{ marginRight: 2 }}>
            {message.text}
          </Typography>

          <Box display="flex" alignItems="center" mt={1}>
            <Typography
              variant="caption"
              color="textSecondary"
            >
              {timestamp}
            </Typography>
            {isOwnMessage && (
              <Box display="flex" alignItems="center" ml={1}>
                {message.status === 'Sent' && <DoneIcon fontSize="small" />}
                {message.status === 'Delivered' && (
                  <DoneAllIcon fontSize="small" />
                )}
                {message.status === 'Seen' && (
                  <DoneAllIcon color="primary" fontSize="small" />
                )}
              </Box>
            )}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default Message;
