import './App.css';
import Header from './components/Header/Header';
import { Route, Routes } from 'react-router-dom';
import ProductList from './components/ProductList/ProductList';
import CategoryList from './components/CategoryList/CategoryList';
import ProductItem from './components/ProductItem/ProductItem';
import CartPage from './components/CartPage/CartPage';

function App() {
  
  return (
    <div className="App">      
      <Header className="App-header"></Header>
      <Routes>
        <Route index element={<CategoryList/>} />
        <Route path='/category/:categoryID' element={<ProductList/>} />
        <Route path='/category/:categoryID/:productID' element={<ProductItem/>} />
        <Route path='/cart' element={<CartPage/>} />
      </Routes>
     
    </div>
  );
}

export default App;
