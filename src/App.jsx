import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import Chat from './components/Chat';
import LandingPage from './components/LandingPage';
import ChatList from './components/ChatList';

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/chat/:friendId" element={<Chat />} />
          <Route path="/chatlist" element={<ChatList />} />
        </Routes>
      </Router>
  );
}

export default App;
