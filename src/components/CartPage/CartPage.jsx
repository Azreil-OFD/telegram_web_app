import React, { useEffect, useMemo, useState } from 'react';
import './CartPage.css'; // Предположим, что тут стили для Telegram Web App
import { useLocalStorage } from '@uidotdev/usehooks';
import { useTelegram } from '../../hooks/useTelegram';
import CartModal from "../CartModal/CartModal";


const CartPage = () => {
  const BASE_URL = "https://azreil-ofj-backend-tg-c56e.twc1.net";
  const [cart, setCart] = useLocalStorage('cart', []);
  const { tg } = useTelegram();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const totalCost = useMemo(() => cart.reduce((acc, item) =>
      acc + (item.weight / 50) * item.solar * item.quantity, 0
  ), [cart]);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const addToCart = (productId, weight) => {
    const updatedCart = cart.map(item =>
        item.id === productId && item.weight === weight
            ? { ...item, quantity: item.quantity + 1 }
            : item
    );
    setCart(updatedCart);
  };

  const removeFromCart = (productId, weight) => {
    const updatedCart = cart
        .map(item =>
            item.id === productId && item.weight === weight
                ? { ...item, quantity: item.quantity - 1 }
                : item
        )
        .filter(item => item.quantity > 0);
    setCart(updatedCart);
  };

  const formatNumber = number => number.toString().padStart(6, '0');

  const handleCreateOrder = async () => {
    const userResponse = await fetch(`${BASE_URL}/v1/bot-users?filters%5Btelegram_id%5D%5B%24eq%5D=${tg.initDataUnsafe.user.id}`);
    const userData = await userResponse.json();

    if (userData.data.length === 1) {
      const customer = userData.data[0].id;
      const cartItems = cart.map(({ id, title, weight, quantity }) => ({
        produkty: id,
        title,
        weight,
        quantity,
      }));

      const order = {
        data: {
          customer,
          accepted: false,
          send: false,
          received: false,
          products: cart.map(({ id, weight }) => ({ produkty: id, weight })),
        },
      };

      const orderResponse = await fetch(`${BASE_URL}/v1/sales`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
      });

      const result = await orderResponse.json();
      if (orderResponse.ok) {
        await fetch(`${BASE_URL}/v1/telegram/success`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: tg.initDataUnsafe.user.id,
            orderId: formatNumber(result.data.id),
            orderUnsafeId: result.data.id,
            cart: cartItems,
            totalCost,
          }),
        });
        tg.close();
        setCart([]);
      }
    }
  };

  useEffect(() => {
    tg.MainButton.setText('Оформить заявку!');
    tg.MainButton.onClick(handleOpenModal);
  }, [tg]);

  useEffect(() => {
    cart.length ? tg.MainButton.show() : tg.MainButton.hide();
  }, [cart]);

  return (
      <div className="cart-page">
        <CartModal isOpen={isModalOpen} onClose={handleCloseModal} onConfirm={handleCreateOrder} />
        <h1 className="page-title">Корзина</h1>

        {cart.length === 0 ? (
            <div>
              <h1 className="empty-cart">Тут пусто :{"("}</h1>
            </div>
        ) : (
            <ul className="cart-items">
              {cart.map(product => (
                  product?.title && (
                      <li key={product.id} className="cart-item">
                        <img
                            src={product.images.data[0]?.attributes.formats.thumbnail.url}
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
                                className="cart-item-remove"
                                onClick={() => removeFromCart(product.id, product.weight)}
                            >
                              -
                            </button>
                            <button
                                className="cart-item-add"
                                onClick={() => addToCart(product.id, product.weight)}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </li>
                  )
              ))}
            </ul>
        )}

        <div className="total-cost-container">
          <h3>Общая стоимость: {totalCost.toFixed(2)} ₽</h3>
        </div>
      </div>
  );
};

export default CartPage;
