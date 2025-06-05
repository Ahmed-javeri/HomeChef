import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      const { token, user } = res.data;

      if (token && user && user._id) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        alert(`Login successful as ${user.role}`);

        if (user.role === 'chef') navigate('/chef');
        else if (user.role === 'admin') navigate('/admin');
        else if (user.role === 'customer') navigate('/home');
      } else {
        alert("⚠️ Login response incomplete. Please check.");
      }
    } catch (err) {
      console.error('❌ Login error:', err.response?.data || err);
      alert('Login failed. Please check your credentials.');
    }
  };

return (
  <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ width: '350px', background: '#2f2f31', padding: '30px', borderRadius: '10px' }}>
      <h2 style={{ textAlign: 'center' }}>🔐 Login</h2>
      <form onSubmit={handleLogin}>
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit">Login</button>
      </form>
    </div>
  </div>
);
}

export default Login;
