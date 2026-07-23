import React from 'react';
import { Navigate } from 'react-router-dom';

function PrivateRoute({ children, allowedRoles }) {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/login" />;
  }

  return children; 
}

export default PrivateRoute;
