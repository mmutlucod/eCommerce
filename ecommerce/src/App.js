import React from 'react';
import './App.css';
import Login from './admin/login';
import MainPage from './admin/MainPage';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Users from './admin/Users'
import Orders from './admin/Orders'
import Sellers from './admin/Sellers'
import Brands from './admin/Brands'
import Categories from './admin/Categories'
import Products from './admin/Products'
import ProductAdd from './admin/ProductAdd'

// Adjust the names here
import SellerLogin from './seller/Login';
import SellerMainPage from './seller/MainPage';
import SellerAdd from './seller/SellerAdd';
import SellerProduct from './seller/Product';

import UserLogin from './user/Login';
import UserMainPage from './user/MainPage';
import UserRegister from './user/Register';
import UserProfil from './user/Profil';
function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Router>
          <Routes>
            {/* ADMIN */}
            <Route path="/" element={<Navigate to="/user/mainpage/" />} />
            <Route path="/admin" element={<Login />} />
            <Route path="/admin/dashboard" element={<MainPage />} />
            <Route path="/admin/users" element={<Users />} />
            <Route path="/admin/orders" element={<Orders />} />
            <Route path="/admin/sellers" element={<Sellers />} />
            <Route path="/admin/brands" element={<Brands />} />
            <Route path="/admin/categories" element={<Categories />} />
            <Route path="/admin/products" element={<Products />} />
            <Route path="/admin/productadd" element={<ProductAdd />} />

            {/* SELLER */}
            <Route path="/seller" element={<SellerLogin />} />
            <Route path="/seller/dashboard" element={<SellerMainPage />} />
            <Route path="/seller/seller-add" element={<SellerAdd />} />
            <Route path="/seller/product" element={<SellerProduct />} />

            <Route path="/user/mainpage" element={< UserMainPage/>} />
            <Route path="/user/login" element={< UserRegister/>} />
            <Route path="/user/auth" element={< UserRegister/>} />
            <Route path="/user/profile" element={< UserProfil/>} />
          </Routes>
        </Router>
      </div>
    </AuthProvider>
  );
}

export default App;
