import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './styles.css';
import { API_BASE_URL } from './api';
import { Badge, PageShell, SectionHeader, SurfaceCard } from './ui';

function CustomerProfile() {
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    axios.get(`${API_BASE_URL}/auth/profile/${user._id}`)
      .then(res => {
        setAddress(res.data.address || '');
        setPhone(res.data.phone || '');
      })
      .catch(err => console.error('Error fetching profile:', err));
  }, [user._id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    if (!/^\+92\d{10}$/.test(phone)) {
      setMessage('Invalid phone number format. Use +92XXXXXXXXXX');
      setLoading(false);
      return;
    }

    axios.put(`${API_BASE_URL}/auth/profile/${user._id}`, { address, phone })
      .then(res => {
        setMessage('Profile updated successfully.');
        localStorage.setItem('user', JSON.stringify(res.data.user));
      })
      .catch(err => {
        console.error('Error updating profile:', err);
        setMessage('Failed to update profile');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <PageShell
      eyebrow="Profile"
      title="Keep your delivery details updated."
      subtitle="Your name and role come from the current session, while address and phone stay editable through the existing profile endpoint."
    >
      <div className="profile-summary">
        <SurfaceCard className="surface-card--padded">
          <div className="avatar-card">
            <div className="avatar-card__circle" aria-hidden="true">
              {(user.name || 'U').split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()}
            </div>
            <strong>{user.name}</strong>
            <Badge tone="emerald">{user.role}</Badge>
            <small>{user.email}</small>
          </div>
        </SurfaceCard>

        <SurfaceCard className="surface-card--padded">
          <SectionHeader
            eyebrow="Account details"
            title="Update profile"
            subtitle="Keep the delivery address and phone number current for a smoother checkout."
            compact
          />

          <form className="form-stack" onSubmit={handleSubmit}>
            <div className="field-group">
              <label>Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>

            <div className="field-group">
              <label>Phone (+92XXXXXXXXXX)</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            {message && <p className="helper-text">{message}</p>}

            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Update profile'}
            </button>
          </form>
        </SurfaceCard>
      </div>
    </PageShell>
  );
}

export default CustomerProfile;
