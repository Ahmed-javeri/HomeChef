import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { API_BASE_URL } from './api';
import { AuthLayout, Badge } from './ui';
import './styles.css';

function ResetPassword() {
  const { id } = useParams();
  const emailFromRoute = decodeURIComponent(id || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!emailFromRoute) {
      setMessage('Missing account email in the reset link.');
      return;
    }

    if (!newPassword || !confirmPassword) {
      setMessage('Please fill in both fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE_URL}/auth/reset-password`, {
        email: emailFromRoute,
        newPassword
      });
      setMessage(res.data.message);

      setTimeout(() => {
        navigate('/');
      }, 2000);
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
      badge="Set a new password"
      title="Reset your password."
      subtitle="Confirm the new password for your HomeChef account and we’ll send it through the existing backend flow."
      highlights={[
        { title: 'Direct reset', text: 'The backend accepts email + new password, so the flow stays simple.' },
        { title: 'Quick return', text: 'Once reset, you can sign in again from the login screen.' }
      ]}
      footer={
        <>
          Need to start over? <Link className="text-link" to="/forgot-password">Go back</Link>
        </>
      }
    >
      <div className="dashboard-title">
        <div>
          <Badge tone="emerald">Reset form</Badge>
          <h2 style={{ marginTop: '12px' }}>Reset password</h2>
        </div>
      </div>

      <form className="form-stack" onSubmit={handleSubmit}>
        <div className="field-group">
          <label htmlFor="reset-email">Account email</label>
          <input id="reset-email" type="email" value={emailFromRoute} readOnly />
        </div>

        <div className="field-group">
          <label htmlFor="reset-new-password">New password</label>
          <input
            id="reset-new-password"
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        <div className="field-group">
          <label htmlFor="reset-confirm-password">Confirm password</label>
          <input
            id="reset-confirm-password"
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? 'Resetting...' : 'Reset password'}
        </button>

        {message && <p className="helper-text">{message}</p>}

        <button className="btn btn-secondary" type="button" onClick={() => navigate('/')}>
          Back to login
        </button>
      </form>
    </AuthLayout>
  );
}

export default ResetPassword;
