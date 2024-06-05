import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Avatar } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CallIcon from '@mui/icons-material/Call';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import MenuIcon from '@mui/icons-material/Menu';
import { useParams } from 'react-router-dom';
import { getUser } from '../api/userService';

const ChatHeader = () => {
  const { friendId } = useParams();
  const [friendName, setFriendName] = useState('');

  useEffect(() => {
    // get friends from friendId
    const fetchFriendsName = async () => {
      const response = await getUser(friendId);
      setFriendName(response.data.fullName);
    };
    fetchFriendsName();
  }, []);

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="back">
          <ArrowBackIcon />
        </IconButton>
        <Typography
          variant="h6"
          style={{
            flexGrow: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Avatar
            sx={{
              width: 30,
              height: 30,
              marginRight: 1,
              boxShadow: 3,
            }}
          >
            {/* {friendName[0]} */}
          </Avatar>
          {friendName}
        </Typography>
        <IconButton color="inherit" aria-label="call">
          <CallIcon />
        </IconButton>
        <IconButton color="inherit" aria-label="video call">
          <VideoCallIcon />
        </IconButton>
        <IconButton color="inherit" aria-label="menu">
          <MenuIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default ChatHeader;
