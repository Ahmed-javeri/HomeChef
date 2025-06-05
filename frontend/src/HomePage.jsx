import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { CartContext } from './CartContext';
import { useNavigate } from 'react-router-dom';
import './styles.css';

function HomePage() {
  const [dishes, setDishes] = useState([]);
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/api/dishes')
      .then(res => {
        console.log('🍽️ Dishes fetched:', res.data);
        setDishes(res.data);
      })
      .catch(err => console.error('❌ Error fetching dishes:', err));
  }, []);

  const handleAddToCart = (dish) => {
    let chefId = null;

    if (dish.chefId && typeof dish.chefId === 'object') {
      chefId = dish.chefId._id || dish.chefId.$oid || null;
    } else {
      chefId = dish.chefId;
    }

    const cleanedDish = {
      _id: dish._id,
      name: dish.name,
      price: dish.price,
      chefId: chefId
    };

    console.log('🛒 Cleaned Dish:', cleanedDish);

    if (!cleanedDish.chefId) {
      alert('❌ Error: chefId missing. Cannot add to cart.');
      return;
    }

    addToCart(cleanedDish);
  };

  return (
    <div className="homepage-container">
      <div className="logo">
        🍽️ HomeChef <span style={{ fontSize: '0.6em' }}></span>
      </div>
      <h2 className="homepage-heading">Explore Dishes</h2>

      <div className="dish-grid">
        {dishes.map((dish) => (
          <div key={dish._id} className="dish-card">
            {dish.imageUrl && (
              <img
                src={dish.imageUrl}
                alt={dish.name}
                className="dish-image"
              />
            )}
            <h3>{dish.name}</h3>
            <p>{dish.description}</p>
            <p><strong>Rs:</strong> {dish.price}</p>
            <button className="add-btn" onClick={() => handleAddToCart(dish)}>
              🛒 Add to Cart
            </button>
            <button className="report-btn" onClick={() => navigate(`/report/${dish.chefId._id || dish.chefId}`)}>
              🚩 Report Chef
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
