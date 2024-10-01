import React, { useState } from 'react';
import './CartPage.css'; // Assume you have some basic Telegram Mini App CSS variables
import { useLocalStorage } from '@uidotdev/usehooks';

const CartPage = () => {
  const [cart, setCart] = useLocalStorage('cart', []);

  // Function to add a product to the cart
  const addToCart = (product) => {
    const existingProduct = cart.find((item) => item.id === product.id);
    if (existingProduct) {
      const updatedCart = cart.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      setCart(updatedCart);
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  // Function to remove a product from the cart
  const removeFromCart = (productId) => {
    const updatedCart = cart
      .map((item) =>
        item.id === productId
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
      .filter((item) => item.quantity > 0); // Remove items with 0 quantity
    setCart(updatedCart);
  };

  return (
    <div className="cart-page">
      <h1 className="cart-page-title">Your Cart</h1>
      {cart.length === 0 ? (
        <p className="empty-cart">Your cart is empty</p>
      ) : (
        <ul className="cart-items">
          {cart.map((product) => (
            <li key={product.id} className="cart-item">
              <img
                src={product.images[0]?.formats.thumbnail.url}
                alt={product.title}
                className="cart-item-image"
              />
              <div className="cart-item-info">
                <h2 className="cart-item-title">{product.title}</h2>
                <p className="cart-item-description">{product.description}</p>
                <p className="cart-item-price">{product.solar} Р</p>
                <p className="cart-item-quantity">
                  Количество: {product.quantity}
                </p>
                <div className="cart-item-actions">
                  <button
                    className="cart-item-add"
                    onClick={() => addToCart(product)}
                  >
                    +
                  </button>
                  <button
                    className="cart-item-remove"
                    onClick={() => removeFromCart(product.id)}
                  >
                    -
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CartPage;
