import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ProductList.css";
import { useTelegram } from "../../hooks/useTelegram";

const ProductList = () => {
  const { categoryID } = useParams(); // Получаем categoryID из URL
  const [products, setProducts] = useState([]);
  const navigate = useNavigate(); // Для навигации при клике на продукт
  const { tg } = useTelegram()
  tg.MainButton.hide()
  useEffect(() => {
    // Загружаем данные категорий с продуктами
    fetch(`https://committed-victory-e015be0776.strapiapp.com/api/categories?populate[products][populate]=images`)
      .then((response) => response.json())
      .then((data) => {
        const category = data.data.find(category => category.id === parseInt(categoryID));
        if (category) {
          setProducts(category.products);
        }
      })
      .catch((error) => console.error("Error fetching products:", error));
  }, [categoryID]);

  // Функция для обработки клика по продукту
  const handleProductClick = (productID) => {
    navigate(`/category/${categoryID}/${productID}`);
  };

  return (
    <>
      <h1 className="page-title">Товары</h1>

      <div className="product-list">
        {products.length > 0 ? (
          products.map((product) => (
            <div
              key={product.id}
              className="product-item"
              onClick={() => handleProductClick(product.id)}
            >
              <h3>{product.title}</h3>
              <p>{product.description}</p>
              <p>Цена: {product.solar}</p>
              {product.images.length > 0 && (
                <img
                  src={product.images[0].formats.thumbnail.url}
                  alt={product.title}
                  className="product-image"
                />
              )}
            </div>
          ))
        ) : (
          <p>Нет доступных продуктов</p>
        )}
      </div></>
  );
};

export default ProductList;
