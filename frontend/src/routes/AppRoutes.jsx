import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../layouts/Layout';
import ProtectedRoute from '../components/ProtectedRoute';

// Import Pages
import Home from '../pages/Home';
import Category from '../pages/Category';
import Products from '../pages/Products';
import ProductDetails from '../pages/ProductDetails';
import About from '../pages/About';
import Contact from '../pages/Contact';
import Login from '../pages/Login';
import AdminLogin from '../pages/AdminLogin';
import Register from '../pages/Register';
import VerifyRegistrationOtp from '../pages/VerifyRegistrationOtp';
import ForgotPassword from '../pages/ForgotPassword';
import VerifyForgotPasswordOtp from '../pages/VerifyForgotPasswordOtp';
import ResetPassword from '../pages/ResetPassword';
import Cart from '../pages/Cart';
import Wishlist from '../pages/Wishlist';
import Checkout from '../pages/Checkout';
import OrderSuccess from '../pages/OrderSuccess';
import Orders from '../pages/Orders';
import OrderDetails from '../pages/OrderDetails';
import Profile from '../pages/Profile';
import AdminDashboard from '../pages/AdminDashboard';
import NotFound from '../pages/NotFound';
import LoginSelection from "../pages/LoginSelection";

import { useAuth } from '../context/AuthContext';

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Layout />}>

        {/* Public Pages */}
        <Route index element={<Home />} />
        <Route path="home" element={<Home />} />
        <Route path="categories" element={<Category />} />
        <Route path="products" element={<Products />} />
        <Route path="products/:id" element={<ProductDetails />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />

        {/* Customer Login */}
        <Route
          path="login"
          element={
            isAuthenticated
              ? <Navigate to="/" replace />
              : <Login />
          }
        />

        {/* Admin Login */}
        <Route
          path="admin/login"
          element={
            isAuthenticated
              ? <Navigate to="/admin/dashboard" replace />
              : <AdminLogin />
          }
        />

        {/* Registration */}
        <Route
          path="register"
          element={
            isAuthenticated
              ? <Navigate to="/" replace />
              : <Register />
          }
        />

        <Route
          path="verify-registration-otp"
          element={
            isAuthenticated
              ? <Navigate to="/" replace />
              : <VerifyRegistrationOtp />
          }
        />

        <Route
          path="forgot-password"
          element={
            isAuthenticated
              ? <Navigate to="/" replace />
              : <ForgotPassword />
          }
        />

        <Route
          path="verify-forgot-password-otp"
          element={
            isAuthenticated
              ? <Navigate to="/" replace />
              : <VerifyForgotPasswordOtp />
          }
        />

        <Route
          path="reset-password"
          element={
            isAuthenticated
              ? <Navigate to="/" replace />
              : <ResetPassword />
          }
        />

        {/* Customer Protected Routes */}

        <Route path="cart" element={<Cart />} />
        <Route path="wishlist" element={<Wishlist />} />

        <Route
          path="checkout"
          element={
            <ProtectedRoute customerOnly={true}>
              <Checkout />
            </ProtectedRoute>
          }
        />

        <Route
          path="order-success"
          element={
            <ProtectedRoute customerOnly={true}>
              <OrderSuccess />
            </ProtectedRoute>
          }
        />

        <Route
          path="orders"
          element={
            <ProtectedRoute customerOnly={true}>
              <Orders />
            </ProtectedRoute>
          }
        />

        <Route
          path="orders/:orderId"
          element={
            <ProtectedRoute customerOnly={true}>
              <OrderDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="profile"
          element={
            <ProtectedRoute customerOnly={true}>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Admin Protected Routes */}

        <Route path="admin" element={<Navigate to="/admin/dashboard" replace />} />

        <Route
          path="admin/dashboard"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminDashboard initialTab="overview" />
            </ProtectedRoute>
          }
        />

        <Route
          path="admin/products"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminDashboard initialTab="products" />
            </ProtectedRoute>
          }
        />

        <Route
          path="admin/categories"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminDashboard initialTab="categories" />
            </ProtectedRoute>
          }
        />

        <Route
          path="admin/orders"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminDashboard initialTab="orders" />
            </ProtectedRoute>
          }
        />

        <Route
          path="admin/customers"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminDashboard initialTab="customers" />
            </ProtectedRoute>
          }
        />

        <Route
          path="admin/register"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminDashboard initialTab="admins" />
            </ProtectedRoute>
          }
        />

        <Route
          path="admin/inventory"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminDashboard initialTab="inventory" />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />

      </Route>
    </Routes>
  );
};

export default AppRoutes;