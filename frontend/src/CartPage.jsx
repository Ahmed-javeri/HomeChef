import React, { useContext, useState } from 'react';
import { CartContext } from './CartContext';
import axios from 'axios';
import './styles.css';

function CartPage() {
  const { cart, removeFromCart, clearCart } = useContext(CartContext);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');

  const total = cart.reduce((sum, item) => sum + (item.price || 0), 0);

  const handlePlaceOrder = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    if (!user || !token) {
      alert('Please login to place an order.');
      return;
    }

    const phoneRegex = /^\+92\d{10}$/;
    if (!phoneRegex.test(phone)) {
      alert('❌ Please enter a valid phone number in format +92XXXXXXXXXX');
      return;
    }

    if (!address.trim()) {
      alert('❌ Please enter a delivery address.');
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
      const res = await axios.post(
        'http://localhost:5000/api/orders/place',
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

      alert('✅ Order placed successfully!');
      clearCart();
      setAddress('');
      setPhone('');
    } catch (err) {
      alert('❌ Failed to place order. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="cart-container">
      <h2>🛍️ Your Cart</h2>
      {cart.length === 0 ? (
        <p>No items in cart</p>
      ) : (
        <div className="cart-box">
          {cart.map(dish => (
            <div key={dish._id} className="cart-item">
              <strong>{dish.name}</strong> - Rs. {dish.price}
              <button onClick={() => removeFromCart(dish._id)} className="remove-btn">❌</button>
            </div>
          ))}
          <hr />
          <p><strong>Total:</strong> Rs. {total}</p>

          <div className="form-section">
            <label>
              <input
                type="radio"
                name="payment"
                value="cod"
                checked={paymentMethod === 'cod'}
                onChange={() => setPaymentMethod('cod')}
              />
              &nbsp;Cash on Delivery (CoD)
            </label>
            <input
              type="text"
              placeholder="Enter your delivery address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <input
              type="text"
              placeholder="+92XXXXXXXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <button className="place-btn" onClick={handlePlaceOrder}>🧾 Place Order</button>
        </div>
      )}
    </div>
  );
}

export default CartPage;
