import React, { createContext, useState, useContext, useEffect } from 'react';
import { getUserData, isLogin } from '../api/userService';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);

  const login = (userData) => {
    setUser(userData);
    setLoggedIn(true);
  };

  const logout = () => {
    setUser(null);
  };

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const loggedIn = await isLogin();
        console.log('Logged in:', loggedIn);
        setLoggedIn(loggedIn);
      } catch (error) {
        console.error('Error checking login status:', error);
        setLoggedIn(false);
      }
    };

    const fetchUserData = async () => {
      try {
        const response = await getUserData();
        setUser(response.data);
      } catch (error) {
        console.log('No user logged in');
      }
    };

    checkLoginStatus();
    fetchUserData();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loggedIn, login }}>
      {children}
    </AuthContext.Provider>
  );
};
