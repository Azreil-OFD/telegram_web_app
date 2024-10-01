import React from "react";

import './Header.module.css'
import { useTelegram } from "../../hooks/useTelegram";
const Header = (props) => {
    const {onClose , user} = useTelegram()
      
    return (
       <div className={'header'}>
            <button onClick={onClose}>Закрыть</button>
            <span className={'username'}>Добро пожаловать, {user?.username}!</span>
       </div>
    )
}

export default Header;