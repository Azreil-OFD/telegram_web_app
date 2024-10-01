import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import './Header.css';
import { useTelegram } from "../../hooks/useTelegram";
import { useLocalStorage } from "@uidotdev/usehooks";

const Header = (props) => {
    const { user } = useTelegram();
    const location = useLocation();  // Хук для получения текущего маршрута
    const navigate = useNavigate();  // Хук для навигации
    const [cart , setCart] = useLocalStorage('cart', [])
    const isIndexPage = location.pathname === "/";
    const isCartPage = location.pathname === "/cart";

    const handleGoBack = () => {
        navigate(-1);  // Навигация назад
    };
    const handleCart = () => {
        navigate('/cart');  // Навигация назад
    };
    return (
        <div className={'header'}>
            <span className={'username'}>
                Магазин грибочков
            </span>
            {(!cart.length !== 0 && !isCartPage) && (
                <button className="back-button" onClick={handleCart}>
                    Корзина
                </button>
            )}
            {!isIndexPage && (
                <button className="back-button" onClick={handleGoBack}>
                    Назад
                </button>
            )}
            
        </div>
    );
};

export default Header;
