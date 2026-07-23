import React, { useEffect, useMemo, useState, useContext } from 'react';
import axios from 'axios';
import { CartContext } from './cart-context';
import { useNavigate } from 'react-router-dom';
import './styles.css';
import { API_BASE_URL } from './api';
import { Badge, EmptyState, PageShell, SectionHeader, StatCard, SurfaceCard } from './ui';

const priceFormatter = new Intl.NumberFormat('en-PK', { maximumFractionDigits: 0 });

const formatPrice = (value) => `Rs ${priceFormatter.format(Number(value || 0))}`;

const getChefName = (dish) =>
  typeof dish.chefId === 'object' ? dish.chefId?.name || 'HomeChef chef' : dish.chefId || 'HomeChef chef';

const getChefId = (dish) =>
  typeof dish.chefId === 'object' ? dish.chefId?._id || dish.chefId?.id || null : dish.chefId || null;

function HomePage() {
  const [dishes, setDishes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [chefFilter, setChefFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('default');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [ratingPopup, setRatingPopup] = useState(false);
  const [selectedDishId, setSelectedDishId] = useState(null);
  const [selectedRating, setSelectedRating] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDishes(currentPage);
  }, [currentPage]);

  const fetchDishes = (page) => {
    setLoading(true);
    setError('');

    axios.get(`${API_BASE_URL}/dishes?page=${page}&limit=12`)
      .then(res => {
        setDishes(res.data.dishes || []);
        setTotalPages(res.data.totalPages || 1);
      })
      .catch(err => {
        console.error('❌ Error fetching dishes:', err);
        setError('We could not load the menu right now. Please try again in a moment.');
      })
      .finally(() => setLoading(false));
  };

  const handleAddToCart = (dish) => {
    const chefId = getChefId(dish);

    if (!chefId) {
      alert('Unable to add this dish right now because chef information is missing.');
      return;
    }

    const cleanedDish = { _id: dish._id, name: dish.name, price: dish.price, chefId };
    addToCart(cleanedDish);
  };

  const handleRateDish = (dishId) => {
    setSelectedDishId(dishId);
    setSelectedRating(5);
    setRatingPopup(true);
  };

  const submitRating = () => {
    axios.put(`${API_BASE_URL}/dishes/rate/${selectedDishId}`, { rating: selectedRating })
      .then(() => {
        setRatingPopup(false);
        fetchDishes(currentPage);
      })
      .catch(err => console.error('❌ Error rating dish:', err));
  };

  const categories = useMemo(
    () => ['All', ...new Set(dishes.map((dish) => dish.category).filter(Boolean))],
    [dishes]
  );

  const filteredDishes = useMemo(() => {
    return dishes
      .filter((dish) => dish.name.toLowerCase().includes(searchQuery.toLowerCase()))
      .filter((dish) =>
        chefFilter ? getChefName(dish).toLowerCase().includes(chefFilter.toLowerCase()) : true
      )
      .filter((dish) => (categoryFilter === 'All' ? true : dish.category === categoryFilter))
      .sort((a, b) => {
        if (sortOrder === 'lowToHigh') return a.price - b.price;
        if (sortOrder === 'highToLow') return b.price - a.price;
        return 0;
      });
  }, [dishes, searchQuery, chefFilter, categoryFilter, sortOrder]);

  const heroStats = useMemo(() => {
    const totalPrice = filteredDishes.reduce((sum, dish) => sum + Number(dish.price || 0), 0);
    const uniqueChefs = new Set(
      filteredDishes
        .map((dish) => getChefId(dish))
        .filter(Boolean)
    ).size;

    return [
      { label: 'Dishes on page', value: dishes.length, hint: 'Current catalog window', tone: 'emerald' },
      { label: 'Visible results', value: filteredDishes.length, hint: 'After filters and search', tone: 'neutral' },
      { label: 'Chefs represented', value: uniqueChefs, hint: 'Distinct kitchens', tone: 'orange' },
      { label: 'Cart value', value: formatPrice(totalPrice), hint: 'If everything was added', tone: 'emerald' }
    ];
  }, [dishes.length, filteredDishes]);

  return (
    <PageShell
      eyebrow="Customer home"
      title="Discover your next favorite meal."
      subtitle="Search by dish, chef, category, or price and keep the checkout flow close at hand."
      actions={
        <button className="btn btn-secondary" type="button" onClick={() => navigate('/cart')}>
          Open cart
        </button>
      }
    >
      <div className="home-hero">
        <div className="home-hero__top">
          <div>
            <Badge tone="orange">Curated menu</Badge>
            <h2 style={{ marginTop: '14px', fontSize: 'clamp(2rem, 4vw, 3.4rem)', lineHeight: 1.02 }}>Premium dishes, calmer browsing.</h2>
            <p>Every card, filter, and action is designed to feel lighter while keeping the same HomeChef ordering flow.</p>
          </div>
          <div className="pill-list">
            <span className="pill">Fresh meals</span>
            <span className="pill">Trusted chefs</span>
            <span className="pill">Fast checkout</span>
          </div>
        </div>
        <div className="hero-kpis">
          {heroStats.map((stat) => (
            <div key={stat.label} className="hero-kpi">
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="filter-shell">
        <SectionHeader
          eyebrow="Refine the menu"
          title="Search, filter, and sort."
          subtitle="The backend returns paginated dishes, so these controls work within the current page and keep everything responsive."
          compact
        />
        <div className="filter-row">
          <input type="text" placeholder="Search dishes by name..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="search-input" />
          <input type="text" placeholder="Filter by chef name..." value={chefFilter} onChange={(e) => setChefFilter(e.target.value)} className="search-input" />
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="search-input">
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="search-input">
            <option value="default">Sort by</option>
            <option value="lowToHigh">Price: low to high</option>
            <option value="highToLow">Price: high to low</option>
          </select>
        </div>
      </div>

      <div className="stat-grid" style={{ marginTop: '18px' }}>
        {heroStats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <SectionHeader
        eyebrow="Menu"
        title="Explore dishes"
        subtitle={loading ? 'Loading today’s menu...' : `${filteredDishes.length} dishes on this page`}
      />

      {error && <SurfaceCard className="surface-card--padded"><p className="error-msg">{error}</p></SurfaceCard>}

      {loading ? (
        <div className="dish-grid">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="dish-card">
              <div className="loading-card loading-card--image" />
              <div className="loading-card loading-card--line" />
              <div className="loading-card loading-card--line short" />
              <div className="loading-card loading-card--line" />
            </div>
          ))}
        </div>
      ) : filteredDishes.length > 0 ? (
        <div className="dish-grid">
          {filteredDishes.map((dish) => {
            const averageRating = dish.ratingCount > 0 ? (dish.totalRating / dish.ratingCount).toFixed(1) : 'No ratings';
            const chefId = getChefId(dish);
            return (
              <div key={dish._id} className="dish-card">
                {dish.imageUrl ? <img src={dish.imageUrl} alt={dish.name} className="dish-image" /> : <div className="loading-card loading-card--image" />}
                <div className="dish-meta">
                  <Badge tone="emerald">{dish.category || 'Uncategorized'}</Badge>
                  <Badge tone="neutral">{formatPrice(dish.price)}</Badge>
                </div>
                <h3>{dish.name}</h3>
                <p>{dish.description}</p>
                <div className="item-meta">
                  <span className="status-chip status-chip--success">Chef: {getChefName(dish)}</span>
                  <span className="status-chip status-chip--warning">Rating: {averageRating}</span>
                </div>
                <div className="card-actions">
                  <button className="btn btn-primary" onClick={() => handleAddToCart(dish)} type="button">
                    Add to cart
                  </button>
                  <button className="btn btn-secondary" onClick={() => navigate(`/report/${chefId}`)} type="button">
                    Report chef
                  </button>
                  <button className="btn btn-soft" onClick={() => handleRateDish(dish._id)} type="button">
                    Rate dish
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="No dishes found"
          description="Try broadening the chef, category, or price filters to reveal more menu items."
          actionLabel="Clear filters"
          onAction={() => {
            setSearchQuery('');
            setChefFilter('');
            setCategoryFilter('All');
            setSortOrder('default');
          }}
        />
      )}

      <div className="pagination-controls">
        <button className="btn btn-secondary" onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1} type="button">
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button className="btn btn-secondary" onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} type="button">
          Next
        </button>
      </div>

      {ratingPopup && (
        <div className="rating-popup">
          <div className="rating-box">
            <h3>Rate this dish</h3>
            <select value={selectedRating} onChange={(e) => setSelectedRating(parseInt(e.target.value))}>
              <option value={1}>1 star</option>
              <option value={2}>2 stars</option>
              <option value={3}>3 stars</option>
              <option value={4}>4 stars</option>
              <option value={5}>5 stars</option>
            </select>
            <div>
              <button className="btn btn-primary" onClick={submitRating} type="button">Submit</button>
              <button className="btn btn-danger" onClick={() => setRatingPopup(false)} type="button">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
}

export default HomePage;
