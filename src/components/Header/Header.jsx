import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Header.css";
import { useTelegram } from "../../hooks/useTelegram";
import { useLocalStorage } from "@uidotdev/usehooks";

const Header = (props) => {
  const { user } = useTelegram();
  const location = useLocation(); // Хук для получения текущего маршрута
  const navigate = useNavigate(); // Хук для навигации
  const [cart, setCart] = useLocalStorage("cart", []);
  const [title, setTitle] = useLocalStorage("title", "");
  const isIndexPage = location.pathname === "/";
  const isCartPage = location.pathname === "/cart";

  const handleGoBack = () => {
    navigate(-1); // Навигация назад
  };
  const handleCart = () => {
    navigate("/cart"); // Навигация назад
  };
  return (
    <div className={"header"}>
      <h2>{title}</h2>
      <div style={{display: 'flex'}}>
        {cart.length !== 0 && !isCartPage && (
          <button
            className="back-button"
            onClick={handleCart}
            style={{
              alignItems: "center",
              textAlign: "center",
              display: "flex",
              gap: "10px",
            }}
          >
            <img
              src="https://www.svgrepo.com/show/533043/cart-shopping.svg"
              height={20}
              alt={"Корзина"}
            />
            {cart.length}
          </button>
        )}
        {!isIndexPage && (
          <button className="back-button" onClick={handleGoBack}>
            Назад
          </button>
        )}
      </div>
    </div>
  );
};

export default Header;
