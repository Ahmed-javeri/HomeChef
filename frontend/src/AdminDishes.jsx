import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './styles.css';
import { API_BASE_URL } from './api';
import { Badge, EmptyState, PageShell, SectionHeader, StatCard } from './ui';

function AdminDishes() {
  const [dishes, setDishes] = useState([]);
  const [chefFilter, setChefFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('default');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchDishes(currentPage);
  }, [currentPage]);

  const fetchDishes = async (page) => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/dishes?page=${page}&limit=12`);
      setDishes(res.data.dishes || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error('❌ Error fetching dishes:', err);
      setMessage('Unable to load dishes right now.');
    } finally {
      setLoading(false);
    }
  };

  const handleRating = async (dishId) => {
    const newRating = prompt('Enter rating for this dish (0-5):');
    if (newRating === null) return;

    const numericRating = parseFloat(newRating);

    if (isNaN(numericRating) || numericRating < 0 || numericRating > 5) {
      alert('Invalid rating. Please enter a number between 0 and 5.');
      return;
    }

    try {
      await axios.put(`${API_BASE_URL}/dishes/rate/${dishId}`, { rating: numericRating });
      setMessage('Rating updated successfully.');
      fetchDishes(currentPage);
    } catch (err) {
      console.error('❌ Failed to update rating:', err);
      setMessage('Failed to update rating.');
    }
  };

  // ✅ Filtering and Sorting Logic
  const filteredDishes = dishes
    .filter(dish => chefFilter ? dish.chefId.name.toLowerCase().includes(chefFilter.toLowerCase()) : true)
    .sort((a, b) => {
      if (sortOrder === 'highest') return (b.rating || 0) - (a.rating || 0);
      if (sortOrder === 'lowest') return (a.rating || 0) - (b.rating || 0);
      return 0;
    });

  const avgRating = filteredDishes.length
    ? filteredDishes.reduce((sum, dish) => sum + Number(dish.rating || 0), 0) / filteredDishes.length
    : 0;

  return (
    <PageShell
      eyebrow="Moderation tools"
      title="Dish ratings and menu quality."
      subtitle="Filter by chef, inspect ratings, and update the existing dish rating field without altering the backend."
    >
      <div className="stat-grid">
        <StatCard label="Visible dishes" value={filteredDishes.length} hint="Current page after filtering" tone="emerald" />
        <StatCard label="Average rating" value={avgRating.toFixed(1)} hint="Across visible dishes" tone="orange" />
        <StatCard label="Page" value={`${currentPage} / ${totalPages}`} hint="Pagination status" tone="neutral" />
        <StatCard label="Menu load" value={loading ? 'Loading' : 'Ready'} hint="API response status" tone="emerald" />
      </div>

      <div className="filter-shell">
        <SectionHeader
          eyebrow="Filters"
          title="Sort the rating view"
          subtitle="Use the existing paginated dishes endpoint and keep the review surface compact."
          compact
        />
        <div className="filter-row filter-row--two">
          <input
            type="text"
            placeholder="Filter by chef name..."
            value={chefFilter}
            onChange={(e) => setChefFilter(e.target.value)}
            className="search-input"
          />

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="search-input"
          >
            <option value="default">Sort by rating</option>
            <option value="highest">Highest to lowest</option>
            <option value="lowest">Lowest to highest</option>
          </select>
        </div>
      </div>

      {message && <p className="helper-text">{message}</p>}

      {filteredDishes.length === 0 ? (
        <EmptyState
          title="No dishes found"
          description="Try another chef filter or move through the page navigation."
          actionLabel="Reset filters"
          onAction={() => {
            setChefFilter('');
            setSortOrder('default');
          }}
        />
      ) : (
        <div className="dish-grid">
          {filteredDishes.map(dish => (
            <div key={dish._id} className="dish-card">
              {dish.imageUrl ? <img src={dish.imageUrl} alt={dish.name} className="dish-image" /> : <div className="loading-card loading-card--image" />}
              <div className="dish-meta">
                <Badge tone="emerald">{dish.category || 'Uncategorized'}</Badge>
                <Badge tone="neutral">Chef rating</Badge>
              </div>
              <h3>{dish.name}</h3>
              <p>{dish.description}</p>
              <div className="item-meta">
                <span className="status-chip status-chip--success">{dish.chefId.name}</span>
                <span className="status-chip status-chip--warning">Rating: {dish.rating || 0} / 5</span>
              </div>
              <p><strong>Price:</strong> Rs {dish.price}</p>
              <button className="btn btn-primary" onClick={() => handleRating(dish._id)} type="button">Update rating</button>
            </div>
          ))}
        </div>
      )}

      <div className="pagination-controls">
        <button className="btn btn-secondary" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} type="button">
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button className="btn btn-secondary" onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} type="button">
          Next
        </button>
      </div>
    </PageShell>
  );
}

export default AdminDishes;
