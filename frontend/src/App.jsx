import { Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import './styles.css';

import Login from './Login';
import HomePage from './HomePage';
import ChefDashboard from './ChefDashboard';
import AdminPanel from './AdminPanel';
import PrivateRoute from './PrivateRoute';
import CartPage from './CartPage';
import Navbar from './Navbar';
import ReportForm from './ReportForm'; 

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      if (user.role === 'chef') navigate('/chef');
      else if (user.role === 'admin') navigate('/admin');
      else navigate('/home');
    }
  }, []);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />

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
          path="/report/:chefId"
          element={
            <PrivateRoute allowedRoles={['customer']}>
              <ReportForm />
            </PrivateRoute>
          }
        />
        {}
      </Routes>
    </>
  );
}

export default App;
