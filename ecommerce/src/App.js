import React from 'react';
import './App.css';
import A_Login from './admin/login';
import MainPage from './admin/MainPage';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Users from './admin/Users'
import Orders from './admin/Orders'
import Sellers from './admin/Sellers'
import Brands from './admin/Brands'
import Categories from './admin/Categories'

import S_Login from './seller/Login';
import S_MainPage from './seller/MainPage';
import S_SellerAdd from './seller/SellerAdd';
import { AuthProvider } from './context/AuthContext';
import S_Product from './seller/Product';
function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Router>
          <Routes>
            {/* ADMİN */}
            <Route path="/" element={<Navigate to="/admin/" />} />
            <Route path="/admin" element={<A_Login />} />
            <Route path="/admin/dashboard" element={<MainPage />} />
            <Route path="/admin/users" element={<Users />} />
            <Route path="/admin/orders" element={<Orders />} />
            <Route path="/admin/sellers" element={<Sellers />} />
            <Route path="/admin/brands" element={<Brands />} />
            <Route path="/admin/categories" element={<Categories />} />

            {/* SATICI */}
            <Route path="/seller" element={<S_Login />} />
            <Route path="/seller/dashboard" element={<S_MainPage />} />
            <Route path="/seller/seller-add" element={<S_SellerAdd />} />
            <Route path="/seller/product" element={<S_Product />} />

          </Routes>
        </Router>
      </div>
    </AuthProvider>
  );
}

export default App;
