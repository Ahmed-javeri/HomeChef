import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AdminFeedback() {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/feedback/all')
      .then(res => setFeedbacks(res.data))
      .catch(err => console.error('❌ Error fetching feedback:', err));
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>📋 All Customer Feedback</h2>
      {feedbacks.length === 0 ? <p>No feedback yet</p> : (
        feedbacks.map((fb, i) => (
          <div key={i} style={{ border: '1px solid #ccc', marginBottom: '10px', padding: '10px', borderRadius: '8px' }}>
            <p><strong>Customer:</strong> {fb.customerId?.name} ({fb.customerId?.email})</p>
            <p><strong>Chef:</strong> {fb.chefId?.name} ({fb.chefId?.email})</p>
            <p><strong>Message:</strong> {fb.message}</p>
            <p><em>{new Date(fb.createdAt).toLocaleString()}</em></p>
          </div>
        ))
      )}
    </div>
  );
}

export default AdminFeedback;
