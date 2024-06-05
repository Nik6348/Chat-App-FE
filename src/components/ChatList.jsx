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
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { styled } from '@mui/material/styles';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
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

const CustomTab = styled(Tab)(({ theme }) => ({
  '&.Mui-selected': {
    color: theme.palette.primary.main,
    fontWeight: theme.typography.fontWeightBold,
  },
}));

const CustomAvatar = styled(Avatar)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.getContrastText(theme.palette.primary.main),
}));

const CustomListItem = styled(ListItem)(({ theme }) => ({
  '&:hover': { backgroundColor: theme.palette.action.hover },
}));

// Custom styled dialog content
const CustomDialogContent = styled(DialogContent)(({ theme }) => ({
  padding: theme.spacing(2),
}));

function ChatList() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [activeTab, setActiveTab] = useState('friends');
  const [friends, setFriends] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [searchQuery, setSearchQuery] = useState('');

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
  }, []);

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

  // Redirect to the chat component with the respective friend ID
  const handleOpenChat = (friendId) => {
    navigate(`/chat/${friendId}`);
  };

  return (
    <Container>
      <Box
        sx={{
          width: '100%',
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 3,
          mt: 4,
          p: 2,
        }}
      >
        <Typography variant="h6" align="center" gutterBottom>
          {user.fullName} Chat-List
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <TextField
            placeholder="Search Contacts"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{ startAdornment: <SearchIcon /> }}
            fullWidth
          />
          <Button
            onClick={handleSearch}
            disabled={loading}
            variant="contained"
            color="primary"
            startIcon={
              loading ? <CircularProgress size={24} /> : <SearchIcon />
            }
            style={{
              margin: '10px',
              backgroundColor: loading ? '#757575' : '#3f51b5',
            }}
          >
            {loading ? 'Loading...' : 'Search'}
          </Button>
        </Box>

        <Divider sx={{ mb: 2 }} />
        <AppBar position="static" color="transparent" elevation={0}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            centered={!isMobile}
          >
            <CustomTab label="My Friends" value="friends" />
            <CustomTab label="Received Requests" value="receivedRequests" />
            <CustomTab label="Sent Requests" value="sentRequests" />
          </Tabs>
        </AppBar>

        {/* Content for each tab */}
        <List>
          {activeTab === 'friends' &&
            friends.map((friend, index) => (
              <React.Fragment key={index}>
                <CustomListItem onClick={() => handleOpenChat(friend._id)}>
                  <ListItemAvatar>
                    <CustomAvatar>
                      {friend.fullName ? friend.fullName.charAt(0) : ''}
                    </CustomAvatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={friend.fullName}
                    secondary={friend.username}
                  />
                </CustomListItem>
                <Divider variant="inset" component="li" />
              </React.Fragment>
            ))}

          {activeTab === 'receivedRequests' &&
            receivedRequests.map((request, index) => (
              <React.Fragment key={index}>
                <ListItem>
                  <ListItemAvatar>
                    <CustomAvatar>
                      {request.sender.fullName
                        ? request.sender.fullName.charAt(0)
                        : ''}
                    </CustomAvatar>
                  </ListItemAvatar>
                  <ListItemText primary={request.sender.fullName} />
                  <ListItemSecondaryAction>
                    <Button onClick={() => handleAcceptRequest(request._id)}>
                      Accept
                    </Button>
                    <Button onClick={() => handleRejectRequest(request._id)}>
                      Reject
                    </Button>
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider variant="inset" component="li" />
              </React.Fragment>
            ))}

          {activeTab === 'sentRequests' &&
            sentRequests.map((request, index) => (
              <React.Fragment key={index}>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      {request.receiver.fullName
                        ? request.receiver.fullName.charAt(0)
                        : ''}
                    </Avatar>
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
        <Divider />
      </Box>

      {/* Friend Request Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Send Friend Request</DialogTitle>
        {selectedUser && (
          <CustomDialogContent>
            <ListItemAvatar>
              <CustomAvatar>
                {selectedUser.fullName && selectedUser.fullName.charAt(0)}
              </CustomAvatar>
            </ListItemAvatar>
            <ListItemText
              primary={selectedUser.fullName}
              secondary={selectedUser.username}
            />
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button
                onClick={() => handleSendRequest(selectedUser._id)}
                startIcon={<PersonAddIcon />}
                variant="contained"
                color="primary"
              >
                Send Request
              </Button>
            </DialogActions>
          </CustomDialogContent>
        )}
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
    </Container>
  );
}

export default ChatList;
