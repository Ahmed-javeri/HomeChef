import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from './api';
import { PageShell, SectionHeader, SurfaceCard } from './ui';

function AdminFeedback() {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/feedback`)
      .then(res => setFeedbacks(res.data))
      .catch(err => console.error('❌ Error fetching feedback:', err));
  }, []);

  return (
    <PageShell
      eyebrow="Feedback archive"
      title="All customer feedback."
      subtitle="A cleaner moderation view for the current feedback collection."
    >
      <SurfaceCard className="surface-card--padded">
        <SectionHeader
          eyebrow="Records"
          title="Customer reports"
          subtitle={feedbacks.length === 0 ? 'No feedback yet.' : `${feedbacks.length} feedback entries loaded.`}
          compact
        />

        {feedbacks.length === 0 ? (
          <p className="muted">No feedback yet.</p>
        ) : (
          <div className="feedback-list">
            {feedbacks.map((fb, i) => (
              <div key={i} className="feedback-box">
                <p><strong>Customer:</strong> {fb.customerId?.name} ({fb.customerId?.email})</p>
                <p><strong>Chef:</strong> {fb.chefId?.name} ({fb.chefId?.email})</p>
                <p><strong>Message:</strong> {fb.message}</p>
                <p><em>{new Date(fb.createdAt).toLocaleString()}</em></p>
              </div>
            ))}
          </div>
        )}
      </SurfaceCard>
    </PageShell>
  );
}

export default AdminFeedback;
