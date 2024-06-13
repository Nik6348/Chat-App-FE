import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Divider,
  Button,
  ListItemSecondaryAction,
  Tabs,
  Tab,
  AppBar,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  useMediaQuery,
  useTheme,
  IconButton,
  InputAdornment,
  BottomNavigation,
  BottomNavigationAction,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ChatIcon from '@mui/icons-material/Chat';
import SettingsIcon from '@mui/icons-material/Settings';
import { styled } from '@mui/material/styles';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getAllFriends,
  getSentFriendRequests,
  getReceivedFriendRequests,
} from '../api/friendService';
import StyledDialog from './StyledDialog.jsx';
import PeopleIcon from '@mui/icons-material/People';
import MarkAsUnreadIcon from '@mui/icons-material/MarkAsUnread';
import PendingActionsIcon from '@mui/icons-material/PendingActions';

import { searchUsers } from '../api/userService';
import { useNavigate } from 'react-router-dom';

// Styling
const AnimatedAvatar = styled(Avatar)(({ theme }) => ({
  transition: 'transform 0.3s ease',
  boxShadow: theme.shadows[2],
  '&:hover': {
    transform: 'scale(1.1)',
    boxShadow: theme.shadows[4],
  },
}));

const GradientDivider = styled(Divider)(({ theme }) => ({
  height: '2px',
  background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  margin: '16px 0',
}));

function ChatList() {
  const [activeTab, setActiveTab] = useState('friends');
  const [friends, setFriends] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredFriends, setFilteredFriends] = useState([]);
  const [searchUserTerm, setSearchUserTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [friendsResponse, receivedResponse, sentResponse] =
          await Promise.all([
            getAllFriends(),
            getReceivedFriendRequests(),
            getSentFriendRequests(),
          ]);
        setFriends(friendsResponse.data || []);
        setReceivedRequests(receivedResponse.data || []);
        setSentRequests(sentResponse.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [activeTab]);

  useEffect(() => {
    setFilteredFriends(
      friends.filter((friend) =>
        friend.fullName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, friends]);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null); // Clear selected user
  };

  const handleSendRequest = async (receiverId) => {
    try {
      await sendFriendRequest(receiverId);
      handleCloseDialog();
      setSnackbar({
        open: true,
        message: 'Friend request sent successfully',
        severity: 'success',
      });
    } catch (error) {
      console.error('Error sending friend request:', error);
      setSnackbar({
        open: true,
        message: 'Failed to send friend request',
        severity: 'error',
      });
    }
  };

  const handleAcceptRequest = async (id) => {
    try {
      await acceptFriendRequest(id);
      setReceivedRequests(receivedRequests.filter((req) => req._id !== id));
      setSnackbar({
        open: true,
        message: 'Friend request accepted',
        severity: 'success',
      });
    } catch (error) {
      console.error('Error accepting request:', error);
      setSnackbar({
        open: true,
        message: 'Failed to accept friend request',
        severity: 'error',
      });
    }
  };

  const handleRejectRequest = async (id) => {
    try {
      await rejectFriendRequest(id);
      setReceivedRequests(receivedRequests.filter((req) => req._id !== id));
      setSnackbar({
        open: true,
        message: 'Friend request rejected',
        severity: 'success',
      });
    } catch (error) {
      console.error('Error rejecting request:', error);
      setSnackbar({
        open: true,
        message: 'Failed to reject friend request',
        severity: 'error',
      });
    }
  };

  const handleTabChange = (_, newValue) => {
    setActiveTab(newValue);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleOpenChat = (friendId) => {
    // Ensure friendId is not undefined or null
    if (!friendId) {
      console.error('Friend ID is missing or invalid.');
      setSnackbar({
        open: true,
        message: 'Failed to open chat',
        severity: 'error',
      });
      return; // Prevent further execution if friendId is invalid
    }
    // Navigate to the chat page, passing the friendId
    navigate(`/chat/${friendId}`);
  };

  const handleSearchUser = async (event) => {
    const { value } = event.target;
    setSearchUserTerm(value);
    if (value.length > 0) {
      try {
        const response = await searchUsers(value);
        setSearchResults(response.data || []);
      } catch (error) {
        console.error('Error searching users:', error);
      }
    } else {
      setSearchResults([]);
    }
  };

  return (
    <Container>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        sx={{
          width: '100%',
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 3,
          mt: 4,
          p: 2,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="h6">
            {user ? `Welcome ${user.fullName}` : 'Loading...'}
          </Typography>
          <IconButton onClick={() => navigate('/settings')}>
            <SettingsIcon />
          </IconButton>
        </Box>

        {/* Enhanced Search with Autocomplete */}
        <TextField
          fullWidth
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ my: 2 }}
        />

        <Button
          variant="contained"
          color="primary"
          startIcon={<PersonAddIcon />}
          onClick={handleOpenDialog}
          sx={{ mb: 2 }}
        >
          Add New Friends
        </Button>

        <GradientDivider />

        {/* Responsive Tabs/Bottom Navigation */}
        {isMobile ? ( // Conditional rendering for mobile
          <BottomNavigation
            value={activeTab}
            onChange={handleTabChange}
            showLabels
          >
            <BottomNavigationAction
              label="Friends"
              value="friends"
              icon={<PeopleIcon />}
            />
            <BottomNavigationAction
              label="Received"
              value="receivedRequests"
              icon={<MarkAsUnreadIcon />}
            />
            <BottomNavigationAction
              label="Pending"
              value="sentRequests"
              icon={<PendingActionsIcon />}
            />
          </BottomNavigation>
        ) : (
          // Desktop/Larger Screens
          <AppBar position="static" color="transparent" elevation={0}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              TabIndicatorProps={{
                style: {
                  background: 'linear-gradient(to right, #ff4081, #f50057)',
                },
              }}
            >
              <Tab label="My Friends" value="friends" />
              <Tab label="Received Requests" value="receivedRequests" />
              <Tab label="Sent Requests" value="sentRequests" />
            </Tabs>
          </AppBar>
        )}

        {/* Content for each tab */}
        <AnimatePresence>
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <List>
              {activeTab === 'friends' &&
                filteredFriends.map((friend) => (
                  <React.Fragment key={friend._id}>
                    <ListItem button onClick={() => handleOpenChat(friend._id)}>
                      <ListItemAvatar>
                        <AnimatedAvatar>
                          {friend.fullName.charAt(0)}
                        </AnimatedAvatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={friend.fullName}
                        secondary={`(${friend.userName})`}
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          aria-label="chat"
                          onClick={() => handleOpenChat(friend._id)}
                        >
                          <ChatIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </React.Fragment>
                ))}

              {activeTab === 'receivedRequests' &&
                receivedRequests.map((request) => (
                  <React.Fragment key={request._id}>
                    <ListItem>
                      <ListItemAvatar>
                        <AnimatedAvatar>
                          {request.sender.fullName.charAt(0)}
                        </AnimatedAvatar>
                      </ListItemAvatar>
                      <ListItemText primary={request.sender.fullName} />
                      <ListItemSecondaryAction>
                        <Button
                          onClick={() => handleAcceptRequest(request._id)}
                        >
                          Accept
                        </Button>
                        <Button
                          onClick={() => handleRejectRequest(request._id)}
                        >
                          Reject
                        </Button>
                      </ListItemSecondaryAction>
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </React.Fragment>
                ))}

              {activeTab === 'sentRequests' &&
                sentRequests.map((request) => (
                  <React.Fragment key={request._id}>
                    <ListItem>
                      <ListItemAvatar>
                        <AnimatedAvatar>
                          {request.receiver.fullName.charAt(0)}
                        </AnimatedAvatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={request.receiver.fullName}
                        secondary="Pending"
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </React.Fragment>
                ))}
            </List>
          </motion.div>
        </AnimatePresence>

        {/* Friend Request Dialog */}
        <StyledDialog
          fullScreen={isMobile}
          open={openDialog}
          onClose={handleCloseDialog}
        >
          <DialogTitle>Search Users</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              placeholder="Search Users..."
              value={searchUserTerm}
              onChange={handleSearchUser}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ my: 2 }}
            />
            <List>
              {searchResults.map((user) => (
                <ListItem key={user._id}>
                  <ListItemAvatar>
                    <AnimatedAvatar>{user.fullName.charAt(0)}</AnimatedAvatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={user.fullName}
                    secondary={`(${user.userName})`}
                  />
                  <ListItemSecondaryAction>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleSendRequest(user._id)}
                    >
                      Add Friend
                    </Button>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              Close
            </Button>
          </DialogActions>
        </StyledDialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </motion.div>
    </Container>
  );
}

export default ChatList;
