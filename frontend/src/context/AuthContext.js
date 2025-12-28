import React, { createContext, useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const isSettingUserRef = useRef(false);

  // Set up axios interceptor for token
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  }, [token]);

  // Check if user is authenticated on mount or when token changes
  useEffect(() => {
    const checkAuth = async () => {
      // Don't fetch if we're in the middle of setting user (login/register)
      if (isSettingUserRef.current) {
        setLoading(false);
        return;
      }

      if (token) {
        // Only fetch user if we have a token but no user (initial load or token restored)
        if (!user) {
          try {
            const response = await axios.get(`${API_BASE_URL}/auth/me`);
            setUser(response.data.user);
          } catch (error) {
            // Token is invalid, clear it
            setToken(null);
            setUser(null);
          }
        }
      } else {
        // No token, ensure user is null
        setUser(null);
      }
      setLoading(false);
    };

    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]); // Only run when token changes

  const login = async (email, password) => {
    try {
      isSettingUserRef.current = true;
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password
      });
      // Set both token and user immediately
      const newToken = response.data.token;
      const newUser = response.data.user;
      setToken(newToken);
      setUser(newUser);
      setLoading(false);
      // Reset flag after a short delay to allow state to update
      setTimeout(() => {
        isSettingUserRef.current = false;
      }, 100);
      return { success: true };
    } catch (error) {
      isSettingUserRef.current = false;
      return {
        success: false,
        error: error.response?.data?.error || 'Login failed'
      };
    }
  };

  const register = async (name, email, password) => {
    try {
      isSettingUserRef.current = true;
      const response = await axios.post(`${API_BASE_URL}/auth/register`, {
        name,
        email,
        password
      });
      // Set both token and user immediately
      const newToken = response.data.token;
      const newUser = response.data.user;
      setToken(newToken);
      setUser(newUser);
      setLoading(false);
      // Reset flag after a short delay to allow state to update
      setTimeout(() => {
        isSettingUserRef.current = false;
      }, 100);
      return { success: true };
    } catch (error) {
      isSettingUserRef.current = false;
      return {
        success: false,
        error: error.response?.data?.error || 'Registration failed'
      };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  const updateProfile = async (name) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/auth/profile`, { name });
      setUser(response.data.user);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to update profile'
      };
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

