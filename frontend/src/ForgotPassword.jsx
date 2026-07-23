import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from './api';
import { AuthLayout, Badge } from './ui';
import './styles.css';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setMessage('Please enter your email.');
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE_URL}/auth/forgot-password`, { email });
      setMessage(res.data.message);
      navigate(`/reset-password/${encodeURIComponent(email)}`);
    } catch (error) {
      console.error('❌ Error:', error);
      if (error.response && error.response.data && error.response.data.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage('An error occurred. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      badge="Account recovery"
      title="Find your account."
      subtitle="Enter the email tied to your HomeChef profile. If it matches, we’ll move you into the reset flow."
      highlights={[
        { title: 'Fast recovery', text: 'The existing backend only needs the registered email.' },
        { title: 'No extra setup', text: 'You can continue without backend changes or extra dependencies.' }
      ]}
      footer={
        <>
          Remembered your password? <Link className="text-link" to="/">Back to login</Link>
        </>
      }
    >
      <div className="dashboard-title">
        <div>
          <Badge tone="orange">Reset access</Badge>
          <h2 style={{ marginTop: '12px' }}>Forgot password</h2>
        </div>
      </div>

      <form className="form-stack" onSubmit={handleSubmit}>
        <div className="field-group">
          <label htmlFor="forgot-email">Registered email</label>
          <input
            id="forgot-email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? 'Checking account...' : 'Search account'}
        </button>

        {message && <p className="helper-text">{message}</p>}

        <button className="btn btn-secondary" type="button" onClick={() => navigate('/')}>
          Back to login
        </button>
      </form>
    </AuthLayout>
  );
}

export default ForgotPassword;
