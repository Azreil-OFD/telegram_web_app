import './App.css';
import Header from './components/Header/Header';
import { Route, Routes } from 'react-router-dom';
import ProductList from './components/ProductList/ProductList';
import CategoryList from './components/CategoryList/CategoryList';

function App() {
  
  return (
    <div className="App">      
      <Header className="App-header"></Header>
      <Routes>
        <Route index element={<CategoryList/>} />
        <Route path='/category/:categoryID' element={<ProductList/>} />
        <Route path='/category/:categoryID/:productID' element={<ProductList/>} />
      </Routes>
     
    </div>
  );
}

export default App;
