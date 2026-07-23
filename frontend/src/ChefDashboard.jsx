import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './styles.css';
import { API_BASE_URL } from './api';
import { Badge, PageShell, SectionHeader, StatCard, SurfaceCard } from './ui';

function ChefDashboard() {
  const [dishData, setDishData] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
    category: 'meal',
    chefId: ''
  });

  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user._id) {
      setDishData(prev => ({ ...prev, chefId: user._id }));

      setOrdersLoading(true);
      axios.get(`${API_BASE_URL}/orders/chef/${user._id}`)
        .then(res => {
          setOrders(res.data);
        })
        .catch(err => {
          console.error('❌ Error fetching chef orders:', err);
          setMessage('Unable to load incoming orders right now.');
        })
        .finally(() => setOrdersLoading(false));
    }
  }, []);

  const handleChange = (e) => {
    setDishData({ ...dishData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE_URL}/dishes/add`, dishData);

      if (res.data && res.data.dish) {
        setMessage('Dish added successfully.');

        setDishData(prev => ({
          ...prev,
          name: '',
          description: '',
          price: '',
          imageUrl: '',
          category: 'meal'
        }));
      } else {
        setMessage('Dish added, but the server did not return a dish payload.');
      }

    } catch (err) {
      console.error('❌ Error:', err);
      setMessage(err.response?.data?.message || 'Failed to add dish.');
    } finally {
      setLoading(false);
    }
  };

  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + Number(order.totalPrice || 0), 0);
  const totalItems = orders.reduce((sum, order) => sum + (order.items?.length || 0), 0);
  const averageOrder = totalOrders ? totalRevenue / totalOrders : 0;

  return (
    <PageShell
      eyebrow="Chef studio"
      title="Run your kitchen like a product team."
      subtitle="Add dishes, review incoming orders, and keep your menu polished with the same backend routes you already have."
    >
      <div className="stat-grid">
        <StatCard label="Incoming orders" value={totalOrders} hint="Orders matched to your menu" tone="emerald" />
        <StatCard label="Total revenue" value={`Rs ${Math.round(totalRevenue).toLocaleString('en-PK')}`} hint="From the visible order set" tone="orange" />
        <StatCard label="Items sold" value={totalItems} hint="Across all order line items" tone="neutral" />
        <StatCard label="Average order" value={`Rs ${Math.round(averageOrder).toLocaleString('en-PK')}`} hint="Per incoming order" tone="emerald" />
      </div>

      <div className="dashboard-layout">
        <SurfaceCard className="surface-card--padded">
          <SectionHeader
            eyebrow="Menu builder"
            title="Add a new dish"
            subtitle="The form still posts to the same add-dish endpoint, now wrapped in a cleaner workspace."
          />

          <form className="form-stack" onSubmit={handleSubmit}>
            <div className="filter-row filter-row--two">
              <div className="field-group">
                <label htmlFor="chef-dish-name">Dish name</label>
                <input id="chef-dish-name" type="text" name="name" value={dishData.name} placeholder="Dish Name" onChange={handleChange} required />
              </div>
              <div className="field-group">
                <label htmlFor="chef-dish-price">Price</label>
                <input id="chef-dish-price" type="number" name="price" value={dishData.price} placeholder="Price" onChange={handleChange} required />
              </div>
            </div>

            <div className="field-group">
              <label htmlFor="chef-dish-description">Description</label>
              <textarea id="chef-dish-description" name="description" value={dishData.description} placeholder="Short description that sells the dish" onChange={handleChange} />
            </div>

            <div className="field-group">
              <label htmlFor="chef-dish-image">Image URL</label>
              <input id="chef-dish-image" type="text" name="imageUrl" value={dishData.imageUrl} placeholder="Image URL" onChange={handleChange} />
            </div>

            <div className="field-group">
              <label htmlFor="chef-dish-category">Category</label>
              <select id="chef-dish-category" name="category" value={dishData.category} onChange={handleChange}>
                <option value="meal">Meal</option>
                <option value="snack">Snack</option>
                <option value="dessert">Dessert</option>
                <option value="drink">Drink</option>
              </select>
            </div>

            {message && <p className="helper-text">{message}</p>}

            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? 'Publishing...' : 'Add dish'}
            </button>
          </form>
        </SurfaceCard>

        <div className="dashboard-sidebar">
          <SurfaceCard className="surface-card--padded">
            <SectionHeader
              eyebrow="Kitchen pulse"
              title="Operational snapshot"
              subtitle="A quick read on your menu and order load."
              compact
            />
            <ul className="mini-list">
              <li><span>Chef profile</span><strong>{dishData.chefId || 'Not linked yet'}</strong></li>
              <li><span>Menu status</span><strong>Active</strong></li>
              <li><span>Orders loaded</span><strong>{ordersLoading ? 'Loading' : totalOrders}</strong></li>
            </ul>
          </SurfaceCard>
        </div>
      </div>

      <SectionHeader
        eyebrow="Incoming orders"
        title="Recent kitchen queue"
        subtitle={ordersLoading ? 'Loading orders...' : `${orders.length} orders in the queue right now`}
      />

      {orders.length === 0 ? (
        <SurfaceCard className="surface-card--padded">
          <p className="muted">No orders yet.</p>
        </SurfaceCard>
      ) : (
        <div className="order-list">
          {orders.map(order => (
            <SurfaceCard key={order._id} className="surface-card--padded">
              <div className="dashboard-title">
                <div>
                  <Badge tone="emerald">{order.status}</Badge>
                  <h2 style={{ marginTop: '12px', fontSize: '1.3rem' }}>{order.customerId?.name || 'Unknown customer'}</h2>
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
                  <strong>Delivery</strong>
                  <span>{order.address || 'No address provided'}</span>
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
            </SurfaceCard>
          ))}
        </div>
      )}
    </PageShell>
  );
}

export default ChefDashboard;
