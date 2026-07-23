import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './styles.css';
import { API_BASE_URL } from './api';
import { Badge, PageShell, SectionHeader, StatCard, SurfaceCard } from './ui';

function AdminPanel() {
  const [orders, setOrders] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setLoadingOrders(true);
    axios.get(`${API_BASE_URL}/orders/all`)
      .then(res => setOrders(res.data))
      .catch(err => console.error('Error:', err))
      .finally(() => setLoadingOrders(false));
  }, []);

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.put(`${API_BASE_URL}/orders/update/${id}`, { status: newStatus });
      setOrders(prev =>
        prev.map(order =>
          order._id === id ? { ...order, status: newStatus } : order
        )
      );
      setMessage('Order status updated successfully.');
    } catch (err) {
      setMessage('Failed to update status.');
      console.error(err);
    }
  };

  const fetchFeedbacks = async () => {
    try {
      setLoadingFeedback(true);
      const res = await axios.get(`${API_BASE_URL}/feedback`);
      setFeedbacks(res.data);
      setShowFeedback(true);
    } catch (err) {
      setMessage('Failed to fetch feedback.');
      console.error(err);
    } finally {
      setLoadingFeedback(false);
    }
  };

  const statusCounts = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <PageShell
      eyebrow="Admin command center"
      title="Keep the marketplace moving."
      subtitle="Review orders, inspect feedback, and jump into dish ratings without changing any backend behavior."
      actions={
        <button className="btn btn-secondary" type="button" onClick={() => navigate('/admin-dishes')}>
          Review dishes
        </button>
      }
    >
      <div className="stat-grid">
        <StatCard label="All orders" value={orders.length} hint="Loaded from the orders API" tone="emerald" />
        <StatCard label="Pending" value={statusCounts.pending || 0} hint="Awaiting action" tone="orange" />
        <StatCard label="Preparing" value={statusCounts.preparing || 0} hint="In progress" tone="neutral" />
        <StatCard label="Completed" value={statusCounts.completed || 0} hint="Finished orders" tone="emerald" />
      </div>

      <div className="admin-layout">
        <div className="panel-grid">
          <SurfaceCard className="surface-card--padded">
            <SectionHeader
              eyebrow="Order management"
              title="Live order feed"
              subtitle={loadingOrders ? 'Loading orders...' : 'Update order status without leaving this screen.'}
              compact
            />

            {message && <p className="helper-text">{message}</p>}

            {orders.length === 0 ? (
              <p className="muted">No orders found.</p>
            ) : (
              <div className="order-list">
                {orders.map(order => (
                  <div key={order._id} className="order-box">
                    <div className="dashboard-title">
                      <div>
                        <Badge tone="emerald">{order.status}</Badge>
                        <h2 style={{ marginTop: '12px', fontSize: '1.25rem' }}>{order.customerId?.name || 'Unknown customer'}</h2>
                      </div>
                      <strong>Rs {Number(order.totalPrice || 0).toLocaleString('en-PK')}</strong>
                    </div>

                    <div className="panel-grid panel-grid--two" style={{ marginTop: '16px' }}>
                      <div className="timeline-item">
                        <strong>Contact</strong>
                        <span>{order.customerId?.email || 'No email'}</span>
                        <span>{order.phone || 'No phone provided'}</span>
                      </div>
                      <div className="timeline-item">
                        <strong>Address</strong>
                        <span>{order.address || 'N/A'}</span>
                      </div>
                    </div>

                    <div className="section-block">
                      <strong>Items</strong>
                      <ul className="summary-list">
                        {order.items.map((item, idx) => (
                          <li key={idx}><span>{item.name}</span><strong>Rs {Number(item.price || 0).toLocaleString('en-PK')}</strong></li>
                        ))}
                      </ul>
                    </div>

                    <div className="field-group" style={{ marginTop: '14px' }}>
                      <label htmlFor={`status-${order._id}`}>Update status</label>
                      <select
                        id={`status-${order._id}`}
                        value={order.status}
                        onChange={(e) => updateStatus(order._id, e.target.value)}
                      >
                        <option value="pending">Pending</option>
                        <option value="preparing">Preparing</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </SurfaceCard>
        </div>

        <div className="admin-sidebar">
          <SurfaceCard className="surface-card--padded">
            <SectionHeader
              eyebrow="Admin shortcuts"
              title="Workspace actions"
              subtitle="Jump between moderation and dish review quickly."
              compact
            />
            <div className="card-actions">
              <button className="btn btn-primary" onClick={fetchFeedbacks} type="button" disabled={loadingFeedback}>
                {loadingFeedback ? 'Loading feedback...' : 'View customer feedback'}
              </button>
              <button className="btn btn-secondary" onClick={() => navigate('/admin-dishes')} type="button">
                View dishes for rating
              </button>
            </div>
          </SurfaceCard>

          {showFeedback && (
            <SurfaceCard className="surface-card--padded feedback-panel">
              <SectionHeader
                eyebrow="Customer feedback"
                title="Recent reports"
                subtitle={feedbacks.length === 0 ? 'No feedback has been submitted yet.' : `${feedbacks.length} feedback entries loaded.`}
                compact
              />

              {feedbacks.length === 0 ? (
                <p className="muted">No feedback submitted yet.</p>
              ) : (
                <div className="feedback-list">
                  {feedbacks.map(fb => (
                    <div key={fb._id} className="feedback-box">
                      <p><strong>Customer:</strong> {fb.customerId?.name || fb.customerName || 'Unknown'}</p>
                      <p><strong>Chef:</strong> {fb.chefId?.name || fb.chefName || 'Unknown'}</p>
                      <p><strong>Message:</strong> {fb.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </SurfaceCard>
          )}
        </div>
      </div>
    </PageShell>
  );
}

export default AdminPanel;
