import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ProductList.css";
import { useTelegram } from "../../hooks/useTelegram";
import {useLocalStorage} from "@uidotdev/usehooks";

const ProductList = () => {
  const { categoryID } = useParams(); // Получаем categoryID из URL
  const [products, setProducts] = useState([]);
  const navigate = useNavigate(); // Для навигации при клике на продукт
  const { tg } = useTelegram();
  const [loading, setLoading] = useState(true)
    const [title, setTitle] = useLocalStorage('title', "")

  tg.MainButton.hide();

  useEffect(() => {
    setLoading(true)
    // Загружаем данные категорий с продуктами
    fetch(
      `https://azreil-ofj-backend-tg-c56e.twc1.net/v1/categories?populate[products][populate]=images`
    )
      .then((response) => response.json())
      .then((data) => {
        const category = data.data.find(
          (category) => category.id === parseInt(categoryID)
        );
        if (category) {
          setProducts(category.attributes.products.data);
          setTitle(category.attributes.title)
        }
      })
      .catch((error) => console.error("Error fetching products:", error)).finally(() => setLoading(false));

  }, [categoryID]);

  // Функция для обработки клика по продукту
  const handleProductClick = (productID) => {
    navigate(`/category/${categoryID}/${productID}`);
  };

  const BASE_URL = "https://azreil-ofj-backend-tg-c56e.twc1.net";
  if (loading) {
    return (<h1 className="page-title">Загрузка...</h1>)
  }
  return (
    <>
      <h1 className="page-title">Товары</h1>

      <div className="product-list">
        {products.length > 0 ? (
          products.map((product) => (
            <div
              key={product.id}
              className="product-item-list"
              onClick={() => handleProductClick(product.id)}
            >
              <div className="product-item-list-image">
                {product.attributes.images.data.length > 0 && (
                  <img
                    src={
                      product.attributes.images.data[0].attributes.formats.thumbnail
                        .url
                    }
                    alt={product.attributes.title}
                    className="product-image"
                  />
                )}
              </div>
              <div className="data">
                <h3>{product.attributes.title}</h3>
                <p>{product.attributes.description.length >= 41 ? product.attributes.description.substring(0, 40) : product.attributes.description.length}</p>
                <p>Цена: {product.attributes.solar}</p>
              </div>

            </div>
          ))
        ) : (
          <p>Нет доступных продуктов</p>
        )}
      </div>
    </>
  );
};

export default ProductList;
