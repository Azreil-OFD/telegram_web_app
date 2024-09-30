import './App.css';
import { useEffect } from 'react';
import { TelegramWebAppContainer } from '@telegram-web-app/core';
import Header from './components/Header/Header';

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
      
      <Header className="App-header">
      {telegram.WebApp.version}

      <button onClick={onClose} >Закрыть</button>
      </Header>
    </div>
  );
}

export default App;
