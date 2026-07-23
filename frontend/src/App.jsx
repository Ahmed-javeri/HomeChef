import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import './styles.css';

import Login from './Login';
import Register from './Register';
import HomePage from './HomePage';
import ChefDashboard from './ChefDashboard';
import AdminPanel from './AdminPanel';
import AdminDishes from './AdminDishes';
import PrivateRoute from './PrivateRoute';
import CartPage from './CartPage';
import Navbar from './Navbar';
import ReportForm from './ReportForm';
import CustomerProfile from './CustomerProfile';
import ForgotPassword from './ForgotPassword';
import ResetPassword from './ResetPassword';

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const userData = localStorage.getItem('user');

    if (!userData) return;
    if (location.pathname !== '/' && location.pathname !== '/login') return;

    const user = JSON.parse(userData);

    if (user.role === 'chef') navigate('/chef', { replace: true });
    else if (user.role === 'admin') navigate('/admin', { replace: true });
    else navigate('/home', { replace: true });
  }, [location.pathname, navigate]);

  return (
    <>
      <Navbar />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:id" element={<ResetPassword />} />

        {/* Protected Routes */}
        <Route
          path="/home"
          element={
            <PrivateRoute allowedRoles={['customer']}>
              <HomePage />
            </PrivateRoute>
          }
        />

        <Route
          path="/chef"
          element={
            <PrivateRoute allowedRoles={['chef']}>
              <ChefDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/cart"
          element={
            <PrivateRoute allowedRoles={['customer']}>
              <CartPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <AdminPanel />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin-dishes"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <AdminDishes />
            </PrivateRoute>
          }
        />

        <Route
          path="/report/:chefId"
          element={
            <PrivateRoute allowedRoles={['customer']}>
              <ReportForm />
            </PrivateRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <PrivateRoute allowedRoles={['customer']}>
              <CustomerProfile />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
