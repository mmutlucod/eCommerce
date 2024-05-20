import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchCart } from './redux/cartSlice';

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
import UserOrders from './user/Orders';
import UserAddress from './user/Address';
import UserAddressAdd from './user/AddressAdd';
import UserFavorites from './user/Favorites';
import ProductCart from './user/ProductCart';
import UserCart from './components/Cart';
import UserProductPage from './user/ProductPage';
import MultiStepForm from './user/PaymentPage';
import UserSearchPage from './user/SearchPage';
import UserCategorySearch from './user/CategorySearch';

export const images = [
  "https://n11scdn.akamaized.net/a1/org/24/04/26/50/30/87/81/38/19/97/83/96/43595415462427475004.jpg",
  "https://n11scdn.akamaized.net/a1/org/24/04/26/63/89/62/43/75/83/27/68/78/01130236963544872031.jpg",
  "https://n11scdn.akamaized.net/a1/org/24/04/24/81/55/40/56/74/28/01/14/99/1646350707450756961.jpg"
];
function App() {

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

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
            <Route path="/user/mainpage" element={< UserMainPage />} />
            <Route path="/user/login" element={< UserRegister />} />
            <Route path="/user/auth" element={< UserRegister />} />
            <Route path="/user/profile" element={< UserProfil />} />
            <Route path="/user/orders" element={< UserOrders />} />
            <Route path="/user/address-info" element={< UserAddress />} />
            <Route path="/user/address-add" element={< UserAddressAdd />} />
            <Route path="/user/favorites" element={< UserFavorites />} />
            <Route path="/sepetim" element={< UserCart />} />
            <Route path="/degerlendirmelerim" element={< ReviewsPage />} />
            <Route path="/sorularim" element={< QuestionsPage />} />
            <Route path="/urun/:productSlug" element={< UserProductPage />} />
            <Route path="/sepetim/odeme" element={< MultiStepForm />} />
            <Route path="marka/:brandSlug" element={<UserSearchPage />} />
            <Route path="kategori/:categorySlug" element={<UserCategorySearch />} />
            <Route path="/arama/:query" element={<UserSearchProducts />} />
            <Route path="/satici/:sellerSlug" element={<UserSellerPage />} />
          </Routes>
        </Router>

      </div>
    </AuthProvider>
  );
}

export default App;
