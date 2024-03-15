import React from 'react';
import './App.css';
import Login from './admin/login';
import MainPage from './admin/MainPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Users from './admin/Users'
import Orders from './admin/Orders'
import Sellers from './admin/Sellers'
import { AuthProvider } from './context/AuthContext';
function App() {
  return (
    <AuthProvider>
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/adminpaneli" element={<MainPage />} />
          <Route path="/users" element={<Users/>} />
          <Route path="/orders" element={<Orders/>} />
          <Route path="/sellers" element={<Sellers/>} />
        </Routes>
      </Router>
    </div>
    </AuthProvider>
  );
}

export default App;
