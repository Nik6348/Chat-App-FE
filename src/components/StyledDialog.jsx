import { Dialog } from '@mui/material';
import styled from '@mui/material/styles/styled';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  // Main Container (Dialog Paper)
  '& .MuiDialog-paper': {
    width: '90%',
    maxWidth: 600, // Adjust for comfortable reading on larger screens
    borderRadius: 16,
    overflow: 'hidden', // Prevent content overflow
    boxShadow: theme.shadows[12], // Pronounced shadow

    // Media Query for Small Screens (Mobile-First)
    [theme.breakpoints.down('sm')]: {
      width: '100%', // Full-width on mobile
      margin: 0, // No margins on mobile
      maxHeight: '80%', // Prevent content from going off-screen
    },

    // Media Query for Medium and Larger Screens
    [theme.breakpoints.up('md')]: {
      width: '60%', // Wider on larger screens
      maxWidth: 800, // Maximum width cap
    },
  },

  // Dialog Title
  '& .MuiDialogTitle-root': {
    padding: '16px 24px', // Padding around the title text
    background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`, // Gradient
    color: theme.palette.primary.contrastText, // Ensure text is readable
  },

  // Dialog Content
  '& .MuiDialogContent-root': {
    padding: 24, // Default padding for larger screens
    display: 'flex', // Use flexbox for layout
    flexDirection: 'column', // Stack elements vertically

    // Media Query for Small Screens
    [theme.breakpoints.down('sm')]: {
      padding: 16, // Smaller padding on mobile
    },

    // List Items
    '& .MuiListItem-root': {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between', // Distribute space evenly
      gap: theme.spacing(2), // Add spacing between items
    },

    // Avatar
    '& .MuiListItemAvatar-root': {
      minWidth: 56, // Ensure enough space for avatar
    },

    // Primary Text (Name/Username)
    '& .MuiListItemText-primary': {
      overflow: 'hidden', // Hide overflow
      textOverflow: 'ellipsis', // Show ellipsis if text is too long
      whiteSpace: 'nowrap', // Prevent text from wrapping
      flexGrow: 1, // Let the text take up remaining space
    },

    // Secondary Text (Additional Info)
    '& .MuiListItemText-secondary': {
      fontSize: '0.875rem', // Slightly smaller font size
    },

    // Button
    '& .MuiButton-root': {
      [theme.breakpoints.down('sm')]: {
        width: '100%', // Full-width on small screens
      },
    },

    // List
    '& .MuiList-root': {
      display: 'grid',
    //   gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', // Responsive columns (larger screens)
      gap: 16,

      [theme.breakpoints.down('sm')]: {
        gridTemplateColumns: '1fr', // Single column on mobile
      },
    },
  },

  // Dialog Actions (Optional, adjust as needed)
  '& .MuiDialogActions-root': {
    padding: 16,
  },
}));

export default StyledDialog;
