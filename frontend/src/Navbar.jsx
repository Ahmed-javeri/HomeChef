import { NavLink, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { CartContext } from './cart-context';
import './styles.css';

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const { cart } = useContext(CartContext);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  if (!user) return null;

  const initials = (user.name || 'U')
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const roleLabel = user.role === 'customer' ? 'Customer view' : user.role === 'chef' ? 'Chef studio' : 'Admin control';

  return (
    <nav className="site-nav">
      <div className="site-nav__inner">
        <div className="site-nav__brand">
          <strong>HomeChef</strong>
          <span>{roleLabel}</span>
        </div>

        <div className="site-nav__links">
          {user.role === 'customer' && (
            <>
              <NavLink to="/home" className={({ isActive }) => (isActive ? 'active' : '')}>Discover</NavLink>
              <NavLink to="/cart" className={({ isActive }) => (isActive ? 'active' : '')}>Cart {cart.length > 0 ? `(${cart.length})` : ''}</NavLink>
              <NavLink to="/profile" className={({ isActive }) => (isActive ? 'active' : '')}>Profile</NavLink>
            </>
          )}
          {user.role === 'chef' && <NavLink to="/chef" className={({ isActive }) => (isActive ? 'active' : '')}>Chef Dashboard</NavLink>}
          {user.role === 'admin' && (
            <>
              <NavLink to="/admin" className={({ isActive }) => (isActive ? 'active' : '')}>Orders</NavLink>
              <NavLink to="/admin-dishes" className={({ isActive }) => (isActive ? 'active' : '')}>Dishes</NavLink>
            </>
          )}
        </div>

        <div className="site-nav__user">
          <div className="site-nav__avatar" aria-hidden="true">
            {initials}
          </div>
          <div className="site-nav__meta">
            <strong>{user.name}</strong>
            <span>{user.role}</span>
          </div>
          <button className="site-nav__logout btn btn-secondary" onClick={handleLogout} type="button">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
