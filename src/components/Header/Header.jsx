import React from "react";
import { TelegramWebAppContainer } from '@telegram-web-app/core';
import './Header.module.css'
const telegram = new TelegramWebAppContainer();
const Header = (props) => {
    return (
       <div className={'header'}>
            <button >Закрыть</button>
            <span className={'username'}>Добро пожаловать, {telegram.WebApp.initDataUnsafe?.user?.username}!</span>
       </div>
    )
}

export default Header;