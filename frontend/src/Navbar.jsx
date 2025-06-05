import { Link, useNavigate } from 'react-router-dom';
import './styles.css';

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  if (!user) return null;

  return (
    <nav>
      <div><strong>👋 {user.name} ({user.role})</strong></div>
      <div>
        {user.role === 'customer' && <Link to="/home">Home</Link>}
        {user.role === 'customer' && <Link to="/cart">Cart</Link>}
        {user.role === 'chef' && <Link to="/chef">Chef Dashboard</Link>}
        {user.role === 'admin' && <Link to="/admin">Admin Panel</Link>}
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}

export default Navbar;
