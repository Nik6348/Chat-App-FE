import React, { useState } from 'react';
import { TextField, IconButton, Grid, Paper } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { styled } from '@mui/material/styles';

const CustomInput = styled(Paper)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: '2px 4px',
  margin: theme.spacing(1),
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
}));

const InputField = ({ sendMessage }) => {
  const [input, setInput] = useState('');

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage(input);
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CustomInput variant="outlined">
        <Grid container spacing={1} alignItems="center">
          <Grid item xs>
            <TextField
              fullWidth
              placeholder="Type a message..."
              value={input}
              onChange={handleInputChange}
              variant="standard"
              InputProps={{ disableUnderline: true }}
            />
          </Grid>
          <Grid item>
            <IconButton type="submit" color="primary">
              <SendIcon />
            </IconButton>
          </Grid>
        </Grid>
      </CustomInput>
    </form>
  );
};

export default InputField;