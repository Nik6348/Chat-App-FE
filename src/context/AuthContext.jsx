import React, { createContext, useState, useContext, useEffect } from 'react';

// Create a context to manage user authentication
const AuthContext = createContext();

// Custom hook to consume the AuthContext
export const useAuth = () => useContext(AuthContext);

// AuthProvider component to wrap your application
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // State to hold user details
  const [loading, setLoading] = useState(true); // State to hold loading status

  // Function to log in the user
  const login = (userData) => {
    console.log(`User logged in successfully: ${userData.userName}`);
    localStorage.setItem('user', JSON.stringify(userData)); // Store user data in localStorage
    setUser(userData); // Set user data upon successful login
  };

  // Function to log out the user
  const logout = () => {
    // Perform logout logic (e.g., clear user data)
    localStorage.removeItem('user'); // Remove user data from localStorage
    setUser(null); // Clear user data upon logout
  };

  // Effect to retrieve user data from localStorage when the component is mounted
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false); // Set loading to false after user data has been retrieved
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Render a loading message while retrieving user data
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};