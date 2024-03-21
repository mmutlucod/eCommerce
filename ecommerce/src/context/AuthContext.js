// src/context/AuthContext.js
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const login = (data) => {
    console.log(data)

   
    if(data.role=='admin'){
      localStorage.setItem('adminToken',data.token);
    }
    else if (data.role == "user"){
      localStorage.setItem('userToken',data.token);
    }
    else {
      localStorage.setItem('sellerToken',data.token);
    
    }
    // setToken(newToken);
  };
  

  const logoutAdmin = () => {
    localStorage.removeItem('adminToken');

    setToken(null);
    window.location.href= '/admin'
  };
  const logoutSeller = () => {
    localStorage.removeItem('sellerToken');

    setToken(null);
    window.location.href= '/seller'
  };

  return (
    <AuthContext.Provider value={{ token, login,  logoutAdmin, logoutSeller }}>
      {children}
    </AuthContext.Provider>
  );
};
