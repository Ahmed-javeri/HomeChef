import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { API_BASE_URL } from './api';
import { Badge, PageShell, SectionHeader, SurfaceCard } from './ui';

function ReportForm() {
  const { chefId } = useParams();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !user._id) {
      alert('Please login to submit feedback.');
      return;
    }

    setLoading(true);

    try {
      await axios.post(`${API_BASE_URL}/feedback/submit`, {
        customerId: user._id,
        chefId,
        message
      });

      setMessage('');
      alert('Feedback submitted.');
      setMessage('');
    } catch (err) {
      console.error('❌ Error submitting feedback:', err);
      alert('Failed to submit feedback.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell
      eyebrow="Support"
      title="Share feedback about a chef."
      subtitle="Use the current feedback endpoint to report issues, praise a meal, or leave constructive notes."
    >
      <div className="dashboard-layout">
        <SurfaceCard className="surface-card--padded">
          <SectionHeader
            eyebrow="Report form"
            title="Tell us what happened"
            subtitle="This message goes to the existing feedback collection used by admin."
            compact
          />

          <form className="form-stack" onSubmit={handleSubmit}>
            <div className="field-group">
              <label htmlFor="report-chef">Chef id</label>
              <input id="report-chef" type="text" value={chefId} readOnly />
            </div>

            <div className="field-group">
              <label htmlFor="report-message">Message</label>
              <textarea
                id="report-message"
                placeholder="Describe your issue or feedback..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows="5"
                required
              />
            </div>

            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit feedback'}
            </button>
          </form>
        </SurfaceCard>

        <div className="dashboard-sidebar">
          <SurfaceCard className="surface-card--padded">
            <Badge tone="orange">Customer note</Badge>
            <p style={{ marginTop: '12px' }} className="muted">
              Feedback stays lightweight and works with the current moderation flow in the admin panel.
            </p>
          </SurfaceCard>
        </div>
      </div>
    </PageShell>
  );
}

export default ReportForm;
