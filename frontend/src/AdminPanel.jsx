import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './styles.css';

function AdminPanel() {
  const [orders, setOrders] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:5000/api/orders/all')
      .then(res => setOrders(res.data))
      .catch(err => console.error('Error:', err));
  }, []);

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/update/${id}`, { status: newStatus });
      alert('Status updated');
      setOrders(prev =>
        prev.map(order =>
          order._id === id ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      alert('Failed to update status');
      console.error(err);
    }
  };

  const fetchFeedbacks = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/feedback');
      setFeedbacks(res.data);
      setShowFeedback(true);
    } catch (err) {
      alert('Failed to fetch feedback');
      console.error(err);
    }
  };

  return (
    <div className="admin-panel">
      <h2>🛡️ Admin – Order Management</h2>

      <button onClick={fetchFeedbacks} className="feedback-toggle">
        📋 View Customer Feedback
      </button>

      {showFeedback && (
        <div>
          <h3>📝 Customer Feedback</h3>
          {feedbacks.length === 0 ? (
            <p>No feedback submitted yet.</p>
          ) : (
            feedbacks.map(fb => (
              <div key={fb._id} className="feedback-box">
                <p><strong>Customer:</strong> {fb.customerName}</p>
                <p><strong>About Chef:</strong> {fb.chefName}</p>
                <p><strong>Message:</strong> {fb.message}</p>
              </div>
            ))
          )}
        </div>
      )}

      <hr />

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map(order => (
          <div key={order._id} className="order-box">
            <p><strong>Customer:</strong> {order.customerId?.name || 'Unknown'} ({order.customerId?.email})</p>
            <p><strong>Total:</strong> Rs. {order.totalPrice}</p>
            <p><strong>Status:</strong> {order.status}</p>
            <p><strong>Address:</strong> {order.address || 'N/A'}</p>
            <p><strong>Phone:</strong> {order.phone || 'N/A'}</p>
            <p><strong>Items:</strong></p>
            <ul>
              {order.items.map((item, idx) => (
                <li key={idx}>{item.name} — Rs. {item.price}</li>
              ))}
            </ul>
            <label>Update Status:</label>
            <select
              value={order.status}
              onChange={(e) => updateStatus(order._id, e.target.value)}
            >
              <option value="pending">Pending</option>
              <option value="preparing">Preparing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        ))
      )}
    </div>
  );
}

export default AdminPanel;
