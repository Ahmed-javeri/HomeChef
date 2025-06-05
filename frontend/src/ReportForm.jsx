import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function ReportForm() {
  const { chefId } = useParams();
  const [message, setMessage] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !user._id) {
      alert('Please login to submit feedback.');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/feedback/submit', {
        customerId: user._id,
        chefId,
        message
      });

      alert('✅ Feedback submitted!');
      setMessage('');
    } catch (err) {
      console.error('❌ Error submitting feedback:', err);
      alert('❌ Failed to submit feedback.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>🚩 Report Chef</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: '500px' }}>
        <textarea
          placeholder="Describe your issue or feedback..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows="5"
          style={{ width: '100%' }}
          required
        />
        <br /><br />
        <button type="submit">Submit Feedback</button>
      </form>
    </div>
  );
}

export default ReportForm;
