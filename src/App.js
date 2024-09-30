import { TelegramWebAppContainer } from '@telegram-web-app/core';
import './App.css';
import { useEffect } from 'react';

const telegram = new TelegramWebAppContainer();
function App() {

  useEffect(() => {
    telegram.WebApp.ready()
  }, [])

  const onClose = () => {
    telegram.WebApp.close()
  }
  
  return (
    <div className="App">
      <header className="App-header">
      {telegram.WebApp.version}

      <button onClick={onClose} >Закрыть</button>
      </header>
    </div>
  );
}

export default App;
