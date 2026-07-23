import React, { useContext, useState } from 'react';
import { CartContext } from './cart-context';
import axios from 'axios';
import './styles.css';
import { API_BASE_URL } from './api';
import { Badge, EmptyState, PageShell, SectionHeader, StatCard, SurfaceCard } from './ui';

function CartPage() {
  const { cart, removeFromCart, clearCart } = useContext(CartContext);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const total = cart.reduce((sum, item) => sum + (item.price || 0), 0);

  const handlePlaceOrder = async () => {
    setMessage('');
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    if (!user || !token) {
      alert('Please login to place an order.');
      return;
    }

    const phoneRegex = /^\+92\d{10}$/;
    if (!phoneRegex.test(phone)) {
      setMessage('Please enter a valid phone number in format +92XXXXXXXXXX');
      return;
    }

    if (!address.trim()) {
      setMessage('Please enter a delivery address.');
      return;
    }

    const cleanedItems = cart.map(dish => ({
      _id: dish._id,
      name: dish.name,
      price: dish.price,
      chefId: typeof dish.chefId === 'object'
        ? dish.chefId._id || dish.chefId?.$oid
        : dish.chefId
    }));

    try {
      setLoading(true);
      await axios.post(
        `${API_BASE_URL}/orders/place`,
        {
          customerId: user._id,
          items: cleanedItems,
          totalPrice: total,
          paymentMethod,
          address,
          phone
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage('Order placed successfully.');
      clearCart();
      setAddress('');
      setPhone('');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to place order. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell
      eyebrow="Checkout"
      title="Review your cart and place the order."
      subtitle="Keep the same delivery and payment flow, but in a cleaner, more premium layout."
    >
      <div className="stat-grid">
        <StatCard label="Items" value={cart.length} hint="Currently in your cart" tone="emerald" />
        <StatCard label="Total" value={`Rs ${total.toLocaleString('en-PK')}`} hint="Before delivery" tone="orange" />
        <StatCard label="Payment" value={paymentMethod === 'cod' ? 'Cash on delivery' : 'Selected'} hint="Current choice" tone="neutral" />
        <StatCard label="Status" value={loading ? 'Placing order...' : 'Ready'} hint="Checkout state" tone="emerald" />
      </div>

      <div className="cart-layout">
        <SurfaceCard className="surface-card--padded">
          <SectionHeader
            eyebrow="Cart items"
            title="Your selected dishes"
            subtitle={cart.length === 0 ? 'Nothing has been added yet.' : 'Each item will be sent to the same order endpoint as before.'}
            compact
          />

          {cart.length === 0 ? (
            <EmptyState
              title="Your cart is empty"
              description="Start from the home page and add dishes you want to try."
              secondaryLabel="Browse dishes"
              secondaryTo="/home"
            />
          ) : (
            <div className="cart-box" style={{ padding: 0, boxShadow: 'none', border: 0, background: 'transparent' }}>
              {cart.map(dish => (
                <div key={dish._id} className="cart-item">
                  <div>
                    <strong>{dish.name}</strong>
                    <div className="dish-meta" style={{ marginTop: '8px' }}>
                      <Badge tone="emerald">Rs {Number(dish.price || 0).toLocaleString('en-PK')}</Badge>
                    </div>
                  </div>
                  <button onClick={() => removeFromCart(dish._id)} className="btn btn-danger" type="button">Remove</button>
                </div>
              ))}
            </div>
          )}
        </SurfaceCard>

        <div className="cart-summary">
          <SurfaceCard className="surface-card--padded">
            <SectionHeader eyebrow="Order summary" title="Delivery details" compact />
            <ul className="summary-list">
              <li><span>Items</span><strong>{cart.length}</strong></li>
              <li><span>Total</span><strong>Rs {total.toLocaleString('en-PK')}</strong></li>
              <li><span>Payment</span><strong>Cash on delivery</strong></li>
            </ul>
          </SurfaceCard>

          <SurfaceCard className="surface-card--padded">
            <SectionHeader eyebrow="Checkout form" title="Complete your order" compact />
            <div className="form-stack">
              <div className="field-group">
                <label>Payment method</label>
                <label style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                  />
                  Cash on delivery (CoD)
                </label>
              </div>

              <div className="field-group">
                <label htmlFor="cart-address">Delivery address</label>
                <input
                  id="cart-address"
                  type="text"
                  placeholder="Enter your delivery address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div className="field-group">
                <label htmlFor="cart-phone">Phone number</label>
                <input
                  id="cart-phone"
                  type="text"
                  placeholder="+92XXXXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              {message && <p className="helper-text">{message}</p>}

              <button className="btn btn-primary place-btn" onClick={handlePlaceOrder} disabled={loading || cart.length === 0} type="button">
                {loading ? 'Placing order...' : 'Place order'}
              </button>
            </div>
          </SurfaceCard>
        </div>
      </div>
    </PageShell>
  );
}

export default CartPage;
