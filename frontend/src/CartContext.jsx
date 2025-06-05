import { createContext, useState } from 'react';

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  const addToCart = (dish) => {
    const cleanedDish = {
      _id: dish._id || (dish._id?.$oid ?? null),
      name: dish.name,
      price: dish.price,
      chefId:
        typeof dish.chefId === 'object'
          ? dish.chefId._id || dish.chefId?.$oid || null
          : dish.chefId || null,
    };

    console.log('🛒 Adding cleaned dish to cart:', cleanedDish);

    if (!cleanedDish._id || !cleanedDish.chefId) {
      console.warn('❌ Missing _id or chefId when adding to cart:', dish);
      return alert('Failed to add to cart. Dish data is incomplete.');
    }

    setCart((prev) => [...prev, cleanedDish]);
  };

  const removeFromCart = (dishId) => {
    setCart((prev) => prev.filter((d) => d._id !== dishId));
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}
