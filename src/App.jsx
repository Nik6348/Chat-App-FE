import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import Chat from './components/Chat';
import LandingPage from './components/LandingPage';
import ChatList from './components/ChatList';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router basename="/Chat-App-FE">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/chat/:friendId" element={<Chat />} />
          <Route path="/chatlist" element={<ChatList />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
