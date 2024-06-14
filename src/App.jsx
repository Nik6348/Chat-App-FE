import React, { useEffect, useState } from 'react';
import {
  HashRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';

import LandingPage from './components/LandingPage';
import Signup from './components/Signup';
import Login from './components/Login';
import ChatList from './components/ChatList';
import Chat from './components/Chat';
import { useAuth } from './context/AuthContext';
import Loading from './components/Loading';

const App = () => {
  const { loggedIn } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  return loading ? (
    <Loading />
  ) : (
    <Router>
      <Routes>
        <Route
          path="/"
          element={loggedIn ? <Navigate to="/chatlist" /> : <LandingPage />}
        />
        <Route
          path="/signup"
          element={loggedIn ? <Navigate to="/chatlist" /> : <Signup />}
        />
        <Route
          path="/login"
          element={loggedIn ? <Navigate to="/chatlist" /> : <Login />}
        />
        <Route
          path="/chat/:friendId"
          element={loggedIn ? <Chat /> : <Navigate to="/login" />}
        />
        <Route
          path="/chatlist"
          element={loggedIn ? <ChatList /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
};

export default App;
