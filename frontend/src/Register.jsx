import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from './api';
import { AuthLayout, Badge } from './ui';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'customer'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await axios.post(`${API_BASE_URL}/auth/register`, formData);
      navigate('/login');
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      badge="Start here"
      title="Create your HomeChef account."
      subtitle="Set up a customer or chef profile in a polished, low-friction sign-up flow."
      highlights={[
        { title: 'Customer mode', text: 'Browse dishes, save favorites, and place orders quickly.' },
        { title: 'Chef mode', text: 'Manage your menu and incoming orders in one place.' },
        { title: 'Secure onboarding', text: 'Passwords and account creation stay on the existing backend flow.' },
        { title: 'Simple recovery', text: 'Forgot password and reset screens stay available when needed.' }
      ]}
      footer={
        <>
          Already have an account? <Link className="text-link" to="/login">Sign in</Link>
        </>
      }
    >
      <div className="dashboard-title">
        <div>
          <Badge tone="orange">Create account</Badge>
          <h2 style={{ marginTop: '12px' }}>Register</h2>
        </div>
      </div>

      <form className="form-stack" onSubmit={handleRegister}>
        <div className="field-group">
          <label htmlFor="register-name">Name</label>
          <input id="register-name" name="name" placeholder="Your full name" onChange={handleChange} required />
        </div>

        <div className="field-group">
          <label htmlFor="register-email">Email</label>
          <input id="register-email" name="email" placeholder="you@example.com" onChange={handleChange} required />
        </div>

        <div className="field-group">
          <label htmlFor="register-password">Password</label>
          <input id="register-password" name="password" type="password" placeholder="Choose a strong password" onChange={handleChange} required />
        </div>

        <div className="field-group">
          <label htmlFor="register-role">Account type</label>
          <select id="register-role" name="role" onChange={handleChange} value={formData.role}>
            <option value="customer">Customer</option>
            <option value="chef">Chef</option>
          </select>
        </div>

        {error && <p className="error-msg">{error}</p>}

        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? 'Creating account...' : 'Register'}
        </button>
      </form>
    </AuthLayout>
  );
}

export default Register;
