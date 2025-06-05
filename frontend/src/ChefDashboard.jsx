import React, { useEffect, useState } from 'react';
import axios from 'axios';

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

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user._id) {
      console.log("✅ Logged-in Chef ID:", user._id);
      setDishData(prev => ({ ...prev, chefId: user._id }));

      axios.get(`http://localhost:5000/api/orders/chef/${user._id}`)
        .then(res => {
          console.log("📦 Chef orders:", res.data);
          setOrders(res.data);
        })
        .catch(err => console.error('❌ Error fetching chef orders:', err));
    }
  }, []);

  const handleChange = (e) => {
    setDishData({ ...dishData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log("📤 Sending dish:", dishData);
      const res = await axios.post('http://localhost:5000/api/dishes/add', dishData);

      if (res.data && res.data.dish) {
        alert('✅ Dish added successfully!');
        console.log('✅ Response:', res.data);

        setDishData(prev => ({
          ...prev,
          name: '',
          description: '',
          price: '',
          imageUrl: '',
          category: 'meal'
        }));
      } else {
        alert('⚠️ Dish added but no response from server');
      }

    } catch (err) {
      alert('❌ Failed to add dish');
      console.error('❌ Error:', err);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>👨‍🍳 Chef Dashboard – Add Dish</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: '400px' }}>
        <input type="text" name="name" value={dishData.name} placeholder="Dish Name" onChange={handleChange} required /><br /><br />
        <textarea name="description" value={dishData.description} placeholder="Description" onChange={handleChange}></textarea><br /><br />
        <input type="number" name="price" value={dishData.price} placeholder="Price" onChange={handleChange} required /><br /><br />
        <input type="text" name="imageUrl" value={dishData.imageUrl} placeholder="Image URL" onChange={handleChange} /><br /><br />
        <select name="category" value={dishData.category} onChange={handleChange}>
          <option value="meal">Meal</option>
          <option value="snack">Snack</option>
          <option value="dessert">Dessert</option>
          <option value="drink">Drink</option>
        </select><br /><br />
        <button type="submit">Add Dish</button>
      </form>

      <hr style={{ margin: '40px 0' }} />

      <h2>📦 Incoming Orders</h2>
      {orders.length === 0 ? <p>No orders yet</p> : (
        orders.map(order => (
          <div key={order._id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '15px', borderRadius: '8px' }}>
            <p><strong>Customer:</strong> {order.customerId?.name || 'Unknown'} ({order.customerId?.email})</p>
            <p><strong>Address:</strong> {order.address || 'Not provided'}</p>
            <p><strong>Phone:</strong> {order.phone || 'Not provided'}</p>
            <p><strong>Status:</strong> {order.status}</p>
            <p><strong>Items:</strong></p>
            <ul>
              {order.items.map((item, idx) => (
                <li key={idx}>{item.name} — Rs. {item.price}</li>
              ))}
            </ul>
            <p><strong>Total:</strong> Rs. {order.totalPrice}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default ChefDashboard;
