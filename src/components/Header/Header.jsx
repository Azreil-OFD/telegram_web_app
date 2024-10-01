import React from "react";

import './Header.css'
import { useTelegram } from "../../hooks/useTelegram";
const Header = (props) => {
    const {onClose , user} = useTelegram()
      
    return (
       <div className={'header'}>
            <button onClick={onClose}>Закрыть</button>
            <span className={'username'}>Добро пожаловать, {user?.id}!</span>
       </div>
    )
}

export default Header;