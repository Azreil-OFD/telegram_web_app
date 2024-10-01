import React from "react";

import './Header.css'
import { useTelegram } from "../../hooks/useTelegram";
const Header = (props) => {
    const {user} = useTelegram()
      
    return (
       <div className={'header'}>
            <span className={'username'}>Добро пожаловать{user?.username ? ', ' : ''}{user?.username}!</span>
       </div>
    )
}

export default Header;