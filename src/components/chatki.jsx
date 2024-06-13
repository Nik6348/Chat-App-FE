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
  CircularProgress,
  Snackbar,
  Alert,
  useMediaQuery,
  useTheme,
  IconButton,
  InputAdornment,
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
import { getUser } from '../api/userService';
import { useNavigate } from 'react-router-dom';

// Styling Enhancements
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
  const [selectedUser, setSelectedUser] = useState(null); // Use null for initial state
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [searchQuery, setSearchQuery] = useState('');
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

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await getUser(searchQuery);
      const results = response.data;
      setLoading(false);
      if (results) {
        setSelectedUser(results);
        setOpenDialog(true);
      } else {
        setOpenDialog(false);
      }
    } catch (error) {
      console.error('Error searching users:', error);
      setLoading(false);
      setOpenDialog(false);
    }
  };

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

        {/* Enhanced Search with Icon Placement */}
        <TextField
          placeholder="Search Contacts"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          fullWidth
        />
        <Button
          onClick={handleSearch}
          disabled={loading}
          variant="contained"
          color="primary"
          startIcon={loading ? <CircularProgress size={24} /> : <SearchIcon />}
          style={{
            margin: '10px',
            backgroundColor: loading ? '#757575' : '#3f51b5',
          }}
        >
          {loading ? 'Loading...' : 'Search'}
        </Button>
        <GradientDivider />

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
                friends.map((friend) => (
                  <React.Fragment key={friend._id}>
                    <ListItem button onClick={() => handleOpenChat(friend._id)}>
                      {' '}
                      {/* Navigate to chat */}
                      <ListItemAvatar>
                        <AnimatedAvatar>
                          {friend.fullName.charAt(0)}
                        </AnimatedAvatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={friend.fullName}
                        secondary={friend.username}
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
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Send Friend Request</DialogTitle>
          {selectedUser && (
            <DialogContent>
              <ListItemAvatar>
                <AnimatedAvatar>
                  {selectedUser.fullName.charAt(0)}
                </AnimatedAvatar>
              </ListItemAvatar>
              <ListItemText
                primary={selectedUser.fullName}
                secondary={selectedUser.username}
              />
            </DialogContent>
          )}
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            {selectedUser && ( // Only show the Send Request button if a user is selected
              <Button
                onClick={() => handleSendRequest(selectedUser._id)}
                startIcon={<PersonAddIcon />}
                variant="contained"
                color="primary"
              >
                Send Request
              </Button>
            )}
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </motion.div>

      {/* Floating Action Button */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.8, duration: 0.4 }}
        style={{ position: 'fixed', bottom: 20, right: 20 }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenDialog}
          startIcon={<PersonAddIcon />}
          sx={{ borderRadius: '50%', boxShadow: 5 }}
        >
          Add Friend
        </Button>
      </motion.div>
    </Container>
  );
}

export default ChatList;
