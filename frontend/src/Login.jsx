import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from './api';
import { AuthLayout, Badge } from './ui';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE_URL}/auth/login`, formData);
      const { token, user } = res.data;

      if (token && user && user._id) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        if (user.role === 'chef') navigate('/chef');
        else if (user.role === 'admin') navigate('/admin');
        else if (user.role === 'customer') navigate('/home');
      } else {
        setError('The login response was incomplete. Please try again.');
      }
    } catch (err) {
      console.error('❌ Login error:', err.response?.data || err);
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      badge="Welcome back"
      title="Food delivery built for real teams."
      subtitle="Sign in to a calmer, faster HomeChef experience with customer, chef, and admin spaces that feel like one product."
      highlights={[
        { title: 'Fresh menu discovery', text: 'Browse dishes with smoother cards, filters, and ratings.' },
        { title: 'Role-aware workspace', text: 'Move directly into the right dashboard for your account.' },
        { title: 'Streamlined checkout', text: 'Keep ordering, profile updates, and feedback in one flow.' },
        { title: 'Production-ready polish', text: 'Cleaner spacing, better hierarchy, and responsive layouts.' }
      ]}
      footer={
        <>
          New to HomeChef? <Link className="text-link" to="/register">Create your account</Link>
        </>
      }
    >
      <div className="dashboard-title">
        <div>
          <Badge tone="emerald">Secure login</Badge>
          <h2 style={{ marginTop: '12px' }}>Sign in</h2>
        </div>
      </div>

      <form className="form-stack" onSubmit={handleLogin}>
        <div className="field-group">
          <label htmlFor="login-email">Email</label>
          <input id="login-email" type="email" name="email" placeholder="you@example.com" onChange={handleChange} required />
        </div>

        <div className="field-group">
          <label htmlFor="login-password">Password</label>
          <input id="login-password" type="password" name="password" placeholder="Enter your password" onChange={handleChange} required />
        </div>

        {error && <p className="error-msg">{error}</p>}

        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? 'Signing in...' : 'Login'}
        </button>

        <div className="toolbar" style={{ margin: 0 }}>
          <Link className="auth-link" to="/forgot-password">Forgot password?</Link>
          <Link className="auth-link" to="/register">Register</Link>
        </div>
      </form>
    </AuthLayout>
  );
}

export default Login;
