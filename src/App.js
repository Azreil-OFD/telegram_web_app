import './App.css';
import Header from './components/Header/Header';
import { useTelegram } from './hooks/useTelegram';
import Button from './components/Button/Button';


function App() {
  const {onToggleButton} = useTelegram()
  
  return (
    <div className="App">
      
      <Header className="App-header"></Header>

      <Button></Button>
      <button onClick={onToggleButton}>toggle</button>
    </div>
  );
}

export default App;
