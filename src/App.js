import './App.css';
import { useEffect } from 'react';
import Header from './components/Header/Header';

const tg = window.Telegram;
function App() {

  useEffect(() => {
    tg.WebApp.ready()
  }, [])

  const onClose = () => {
    tg.WebApp.close()
  }
  
  
  return (
    <div className="App">
      
      <Header className="App-header">
      {tg.WebApp.version}

      <button onClick={onClose} >Закрыть</button>
      </Header>
    </div>
  );
}

export default App;
