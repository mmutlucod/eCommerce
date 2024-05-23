// src/context/AuthContext.js
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const login = (data) => {
    console.log(data)
    localStorage.setItem('token', data.token);

    if (data) {

      localStorage.setItem('token', data.token);
      setToken(data.token);
    }

    // setToken(newToken);
  };


  const logoutAdmin = () => {
    localStorage.clear();

    setToken(null);
    window.location.href = '/admin'
  };
  const logoutSeller = () => {
    localStorage.clear()

    setToken(null);
    window.location.href = '/seller'
  };
  const logoutUser = () => {
    localStorage.clear();

    setToken(null);
  }

  return (
    <AuthContext.Provider value={{ token, login, logoutUser, logoutAdmin, logoutSeller }}>
      {children}
    </AuthContext.Provider>
  );
};
