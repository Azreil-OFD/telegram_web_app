import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import './Header.css';
import { useTelegram } from "../../hooks/useTelegram";

const Header = (props) => {
    const { user } = useTelegram();
    const location = useLocation();  // Хук для получения текущего маршрута
    const navigate = useNavigate();  // Хук для навигации

    const isIndexPage = location.pathname === "/";

    const handleGoBack = () => {
        navigate(-1);  // Навигация назад
    };

    return (
        <div className={'header'}>
            <span className={'username'}>
                Добро пожаловать{user?.username ? ', ' : ''}{user?.username}!
            </span>
            {!isIndexPage && (
                <button className="back-button" onClick={handleGoBack}>
                    Назад
                </button>
            )}
        </div>
    );
};

export default Header;
