import React, { useEffect, useMemo, useState } from 'react';
import './CartPage.css'; // Assume you have some basic Telegram Mini App CSS variables
import { useLocalStorage } from '@uidotdev/usehooks';
import { useTelegram } from '../../hooks/useTelegram';

const CartPage = () => {


  
  const BASE_URL = "https://azreil-ofj-backend-tg-c56e.twc1.net";
  const [cart, setCart] = useLocalStorage('cart', []);
  const { tg } = useTelegram();

  const totalCost = useMemo(() => {
    return cart.reduce((acc, item) => {
      return acc + (item.weight / 50) * item.solar * item.quantity; // Учитываем количество
    }, 0);
  }, [cart]);

  // Function to add a product to the cart
  const addToCart = (productId, weight) => {
    const updatedCart = cart.map((item) => {
      if (item.id === productId && item.weight === weight) {
        return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    });
    setCart(updatedCart);
  };

  // Function to remove a product from the cart
  const removeFromCart = (productId, weight) => {
    const updatedCart = cart
      .map((item) => {
        if (item.id === productId && item.weight === weight) {
          return { ...item, quantity: item.quantity - 1 };
        }
        return item;
      })
      .filter((item) => item.quantity > 0); // Удаляем товары с количеством 0
    setCart(updatedCart);
  };

  useEffect(() => {
    tg.MainButton.setText('Оставить заявку');

    const handleAddToCart = () => {
      tg.close()
      setCart([])
    };

    tg.MainButton.onClick(handleAddToCart);

    return () => {
      tg.MainButton.offClick(handleAddToCart);
    };
  }, [tg]);

  return (
    <div className="cart-page">
      <h1 className="page-title">Корзина</h1>
      {cart.length === 0 ? (
        <><h1 className="empty-cart">Тут пусто :{"("}</h1><br/></>
      ) : (
        <ul className="cart-items">
          {cart.map((product) => {
            if (product?.title) {
              return (
                <li key={product.id} className="cart-item">
                  <img
                      src={BASE_URL + product.images.data[0]?.attributes.formats.thumbnail.url}
                      alt={product.title}
                      className="cart-item-image"
                    />
                  <div className="cart-item-info">
                    <h2 className="cart-item-title">{product.title}</h2>
                    <p className="cart-item-description">{product.description}</p>
                    <p className="cart-item-price">
                      {((product.solar / 50) * product.weight * product.quantity).toFixed(2)} ₽
                    </p>
                    <p className="cart-item-quantity">
                      Грамовка: {product.weight} гр.
                    </p>
                    <p className="cart-item-quantity">
                      Количество: {product.quantity}
                    </p>
                    <div className="cart-item-actions">
                      <button
                        className="cart-item-add"
                        onClick={() => addToCart(product.id, product.weight)}
                      >
                        +
                      </button>
                      <button
                        className="cart-item-remove"
                        onClick={() => removeFromCart(product.id, product.weight)}
                      >
                        -
                      </button>
                    </div>
                  </div>
                </li>
              );
            } else {
              return <></>;
            }
          })}
        </ul>
      )}

      <div>
        <h3>Общая стоимость: {totalCost.toFixed(2)} ₽</h3>
      </div>
    </div>
  );
};

export default CartPage;
