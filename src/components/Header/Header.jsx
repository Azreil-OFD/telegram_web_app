import React from "react";

import './Header.module.css'
const tg = window.Telegram;
const Header = (props) => {
    const onClose = () => {
        tg.WebApp.close()
      }
      
    return (
       <div className={'header'}>
            <button onClick={onClose}>Закрыть</button>
            <span className={'username'}>Добро пожаловать, {tg.WebApp.initDataUnsafe?.user?.username}!</span>
       </div>
    )
}

export default Header;