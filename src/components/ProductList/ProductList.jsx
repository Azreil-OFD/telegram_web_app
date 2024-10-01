import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductItem from "./ProductItem";
import "./ProductList.css";

const ProductList = () => {
  const { categoryID, productID } = useParams(); // Получаем categoryID и productID из URL
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    // Загружаем данные категорий с продуктами
    fetch(`https://committed-victory-e015be0776.strapiapp.com/api/categories?populate[products][populate]=images`)
      .then((response) => response.json())
      .then((data) => {
        // Ищем нужную категорию по categoryID
        const category = data.data.find(category => category.id === parseInt(categoryID));
        if (category) {
          const allProducts = category.products;
          setProducts(allProducts);

          // Если указан productID, ищем конкретный продукт
          if (productID) {
            const foundProduct = allProducts.find(product => product.id === parseInt(productID));
            setSelectedProduct(foundProduct);
          }
        }
      })
      .catch((error) => console.error("Error fetching products:", error));
  }, [categoryID, productID]);

  // Если выбран конкретный продукт, отображаем только его с помощью ProductItem
  if (selectedProduct) {
    return <ProductItem product={selectedProduct} />;
  }

  // Если нет конкретного продукта, отображаем все продукты категории
  return (
    <div className="product-list">
      {products.length > 0 ? (
        products.map((product) => <ProductItem key={product.id} product={product} />)
      ) : (
        <p>Нет доступных продуктов</p>
      )}
    </div>
  );
};

export default ProductList;
