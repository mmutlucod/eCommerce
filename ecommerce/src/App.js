import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchCart } from './redux/cartSlice';
import PrivateRoute from './components/PrivateRoute'; // PrivateRoute bileşeninizi doğru yoldan içe aktarın
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
import CommentApprove from './admin/CommentApprove'
import QuestionApprove from './admin/QuestionApprove'
import ProductSellerApprove from './admin/ProductSellerApprove'
import ProductApprove from './admin/ProductApprove'

// Adjust the names here
import SellerLogin from './seller/Login';
import SellerMainPage from './seller/MainPage';
import SellerAdd from './seller/SellerAdd';
import SellerProduct from './seller/Product';
import SellerProductAdd from './seller/ProductAdd';
import SellerSellerProductAdd from './seller/SellerProductAdd';
import SellerOrders from './seller/Orders';
import SellerQuestion from './seller/Question';


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
import UserSearchProducts from './user/SearchProducts';
import UserSellerPage from './user/SellerPage';
import ReviewsPage from './user/ReviewsPage';
import QuestionsPage from './user/QuestionPage';
import UserErrorPage from './user/ErrorPage';

export const images = [
  "https://cdn.vatanbilgisayar.com/Upload/BANNER//0banner/2024/005/samsung-galaxy-ailesi-21-5-24-web.jpg",
  "https://cdn.vatanbilgisayar.com/Upload/BANNER//0banner/2024/005/microsoft-copilot-28-5-24-web.jpg",
  "https://cdn.vatanbilgisayar.com/Upload/BANNER//0banner/2024/003/philips-tv-21-3-24-web-reklam.jpg"
];

export const links = [
  "http://localhost:3000/arama/samsung%20galaxy",
  "http://localhost:3000/kategori/bilgisayar-tablet",
  "http://localhost:3000/kategori/tv-goruntu-ve-ses-sistemleri"
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
            <Route path="/" element={<Navigate to="/anasayfa" />} />
            <Route path="/admin" element={<Login />} />
            <Route path="/admin/dashboard" element={<MainPage />} />
            <Route path="/admin/users" element={<Users />} />
            <Route path="/admin/orders" element={<Orders />} />
            <Route path="/admin/sellers" element={<Sellers />} />
            <Route path="/admin/brands" element={<Brands />} />
            <Route path="/admin/categories" element={<Categories />} />
            <Route path="/admin/products" element={<Products />} />
            <Route path="/admin/productadd" element={<ProductAdd />} />
            <Route path="/admin/yorumonay" element={<CommentApprove />} />
            <Route path="/admin/soruonay" element={<QuestionApprove />} />
            <Route path="/admin/urunonay" element={<ProductApprove />} />
            <Route path="/admin/saticiurunonay" element={<ProductSellerApprove />} />

            {/* SELLER */}
            <Route path="/seller" element={<SellerLogin />} />
            <Route path="/seller/dashboard" element={<SellerMainPage />} />
            <Route path="/seller/seller-add" element={<SellerAdd />} />
            <Route path="/seller/product" element={<SellerProduct />} />
            <Route path="/seller/urun-ekle" element={<SellerProductAdd />} />
            <Route path="/urun-ekle" element={<SellerSellerProductAdd />} />
            <Route path="/seller/orders" element={<SellerOrders />} />
            <Route path="/seller/question" element={<SellerQuestion />} />

            {/** USER*/}
            <Route path="/anasayfa" element={< UserMainPage />} />
            <Route path="/giris-yap" element={< UserRegister />} />
            <Route path="/kayit-ol" element={< UserRegister />} />
            <Route path="/profilim" element={<PrivateRoute element={<UserProfil />} />} />
            <Route path="/siparislerim" element={<PrivateRoute element={<UserOrders />} />} />
            <Route path="/adreslerim" element={<PrivateRoute element={<UserAddress />} />} />
            <Route path="/adres-ekle" element={<PrivateRoute element={<UserAddressAdd />} />} />
            <Route path="/favorilerim" element={<PrivateRoute element={<UserFavorites />} />} />
            <Route path="/sepetim" element={<PrivateRoute element={<UserCart />} />} />
            <Route path="/degerlendirmelerim" element={<PrivateRoute element={<ReviewsPage />} />} />
            <Route path="/sorularim" element={<PrivateRoute element={<QuestionsPage />} />} />
            <Route path="/urun/:productSlug" element={< UserProductPage />} />
            <Route path="/sepetim/odeme" element={<PrivateRoute element={< MultiStepForm />} />} />
            <Route path="/marka/:brandSlug" element={<UserSearchPage />} />
            <Route path="/kategori/:categorySlug" element={<UserCategorySearch />} />
            <Route path="/arama/:query" element={<UserSearchProducts />} />
            <Route path="/satici/:sellerSlug" element={<UserSellerPage />} />

            {/** ERROR */}
            <Route path="/hata404" element={<UserErrorPage />} />
            <Route path="*" element={<UserErrorPage />} />

          </Routes>
        </Router>

      </div>
    </AuthProvider>
  );
}

export default App;
