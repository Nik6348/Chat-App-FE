import React from 'react';
import { Button, Typography, Container, Box, Grow } from '@mui/material';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleStartChat = () => {
    navigate('/signup');
  };

  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        textAlign: 'center',
      }}
    >
      <Grow in={true}>
        <Box>
          <ChatBubbleOutlineIcon sx={{ fontSize: 100, color: 'primary.main' }} />
          <Typography variant="h2" component="h1" gutterBottom>
            Welcome to Chat App
          </Typography>
          <Typography variant="h5" component="h2" gutterBottom>
            Connect with your friends and family instantly!
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<ChatBubbleOutlineIcon />}
            onClick={handleStartChat}
            sx={{ mt: 3 }}
          >
            Start Chatting
          </Button>
        </Box>
      </Grow>
    </Container>
  );
};

export default LandingPage;