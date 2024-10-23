import React, { useEffect, useMemo, useState } from "react";
import "./CartPage.css"; // Assume you have some basic Telegram Mini App CSS variables
import { useLocalStorage } from "@uidotdev/usehooks";
import { useTelegram } from "../../hooks/useTelegram";
import CartModal from './../CartModal/CartModal';
// TODO: Перед тем как дать возможность нажать кнопку оформления, проверить наличие товара

const CartPage = () => {
  const BASE_URL = "https://azreil-ofj-backend-tg-c56e.twc1.net";
  const [cart, setCart] = useLocalStorage("cart", []);
  const { tg } = useTelegram();
  const [title, setTitle] = useLocalStorage("title", "");
  const [isModalOpen , setIsModalOpen] = useState(false)
  const isModalConfirm =async () => {
    await handleCreateOrder();
  } 
  const isModalClose = () => {
    setIsModalOpen(false)
  } 
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
  function formatNumber(number) {
    return number.toString().padStart(6, "0");
  }
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
  const handleCreateOrder = async () => {
    const userData = await fetch(
      `https://azreil-ofj-backend-tg-c56e.twc1.net/v1/bot-users?filters%5Btelegram_id%5D%5B%24eq%5D=${tg.initDataUnsafe.user.id}`,
      {
        method: "GET",
      },
    );
    const user = await userData.json();
    if (user.data.length === 1) {
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "insomnia/10.0.0",
        },
        body: {
          data: {
            customer: -1,
            accepted: false,
            send: false,
            received: false,
            products: [],
          },
        },
      };
      options.body.data.customer = user.data[0].id;
      const saveCart = cart.map((e) => ({
        produkty: e.id,
        title: e.title,
        weight: e.weight,
        quantity: e.quantity,
      }));
      options.body.data.products = saveCart.map((e) => ({
        produkty: e.id,
        weight: e.weight,
        quantity: e.quantity,
      }));
      console.log(options.body)
      options.body = JSON.stringify(options.body);
      const resultData = await fetch(
        `https://azreil-ofj-backend-tg-c56e.twc1.net/v1/sales`,
        options,
      );
      const result = await resultData.json();
      if (resultData.ok) {
        await fetch(
          `https://azreil-ofj-backend-tg-c56e.twc1.net/v1/telegram/success`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "User-Agent": "insomnia/10.0.0",
            },
            body: JSON.stringify({
              id: tg.initDataUnsafe.user.id,
              orderId: formatNumber(Number(result.data.id)),
              orderUnsafeId: result.data.id,
              cart: saveCart,
              totalCost,
            }),
          },
        );
        tg.close();
        setCart([]);
      }
    }
  };
  useEffect(() => {
    setTitle("Корзина");
    tg.MainButton.setText("Оформить заявку!");
    tg.MainButton.setParams({ is_active: true });
    tg.MainButton.onClick(() => {
      setIsModalOpen(true)
    });
  }, [tg]);
  useEffect(() => {
    if (!cart.length) {
      tg.MainButton.hide();
    } else {
      tg.MainButton.show();
    }
  }, [cart]);
  return (
    <div className="cart-page">
      {/*<h1 className="page-title">Корзина</h1>*/}
      {cart.length === 0 ? (
        <>
          <h1 className="empty-cart">Тут пусто :{"("}</h1>
          <br />
        </>
      ) : (
        <ul className="cart-items">
          {cart.map((product) => {
            if (product?.title) {
              return (
                <li key={product.id} className="cart-item">
                  <img
                    src={
                      product.images.data[0]?.attributes.formats.thumbnail.url
                    }
                    alt={product.title}
                    className="cart-item-image"
                  />
                  <div className="cart-item-info">
                    <h2 className="cart-item-title">{product.title}</h2>
                    <p className="cart-item-description">
                      {product.description}
                    </p>
                    <p className="cart-item-price">
                      {(
                        (product.solar / 50) *
                        product.weight *
                        product.quantity
                      ).toFixed(2)}{" "}
                      ₽
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
                        onClick={() =>
                          removeFromCart(product.id, product.weight)
                        }
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
                  <CartModal isOpen={isModalOpen} onClose={isModalClose} onConfirm={isModalConfirm}></CartModal>
                </li>
              );
            } else {
              return <></>;
            }
          })}
        </ul>
      )}
      <div
        style={{
          position: "fixed",
          bottom: "10px",
          left: "10px",
          right: "10px",
        }}
      >
        <h3>Общая стоимость: {totalCost.toFixed(2)} ₽</h3>
      </div>
    </div>
  );
};

export default CartPage;
