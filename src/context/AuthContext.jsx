import React, { createContext, useState, useContext, useEffect } from 'react';
import { getUserData } from '../api/userService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // const [loading, setLoading] = useState(true);

  const login = (userData) => {
    setUser(userData);
  };

  // const logout = () => {
  //   setUser(null);
  // };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getUserData();
        setUser(response.data);
      } catch (error) {
        console.log('No user logged in');
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  return (
    <AuthContext.Provider value={{ user, login }}>
      {children}
    </AuthContext.Provider>
  );
};
