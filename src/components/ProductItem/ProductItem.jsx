import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import Slider from "react-slick"; // Импортируем Slider из react-slick
import "./ProductItem.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css"; // Стили для слайдера
import { useTelegram } from "./../../hooks/useTelegram";
import Select from "./../Select/Select";
import { useLocalStorage } from "@uidotdev/usehooks";
import Button from "./../Button/Button";
import { useNavigate } from "react-router-dom";

const ProductItem = () => {
  const [cart, setCart] = useLocalStorage("cart", []);
  const { categoryID, productID } = useParams(); // Получаем categoryID и productID из URL
  const [product, setProduct] = useState(null);
  const [weight, setWeight] = useState(null);
  const { tg } = useTelegram();
  const [success, setSuccess] = useState(false);
  const [loading , setLoading]= useState(true)
  const navigate = useNavigate();
  const totalPrice = useMemo(() => {
    return product ? (product.attributes.solar / 50) * weight : 0;
  }, [product, weight]);

  const handleAddToCart = () => {
    addToCart({id: product.id,  ...product.attributes, weight });
    setWeight(0);
    setSuccess(true);
    navigate("/")
  };

  // Функция для добавления продукта в корзину
  const addToCart = (product) => {
    // Проверяем, есть ли продукт уже в корзине
    const existingProduct = cart.find(
      (item) => item.id === product.id && item.weight === product.weight
    );
    if (existingProduct) {
      // Если уже в корзине, увеличиваем количество
      const updatedCart = cart.map((item) => {
        if (item.id === product.id && item.weight === product.weight) {
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      });
      setCart(updatedCart);
    } else {
      // Если нет, добавляем с количеством 1
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

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
          const products = category.attributes.products.data;
          const foundProduct = products.find(
            (product) => product.id === parseInt(productID)
          );
          if (foundProduct) {
            setProduct(foundProduct);  
        }
        
        }
      })
      .catch((error) => console.error("Error fetching product:", error)).finally(() => setLoading(false));
  }, [categoryID, productID]);
  if (loading) {
    return (<h1 className="page-title">Загрузка...</h1>)
  }
  if (!product) {
    return <p>Продукт не найден</p>;
  }

  const onSelect = (_weight) => {
    setSuccess(false);
    setWeight(_weight);
  };

  // Настройки для слайдера
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const BASE_URL = "https://azreil-ofj-backend-tg-c56e.twc1.net";

  return (
    <>
      <div className="product-item">
        {product.attributes.images.data.length > 1 && (
          <Slider {...sliderSettings}>
            {product.attributes.images.data.map((image, index) => (
              <div key={index}>
                <img
                  src={image.attributes.url}
                  alt={product.attributes.title}
                  className="product-image"
                />
              </div>
            ))}
          </Slider>
        )}
        {product.attributes.images.data.length === 1 &&
          product.attributes.images.data.map((image, index) => (
            <div key={index}>
              <img
                src={image.attributes.url}
                alt={product.attributes.title}
                className="product-image"
              />
            </div>
          ))}

        <p>
          <b>Наименование: </b> {product.attributes.title}
        </p>
        <p>
          <b>Описание: </b> {product.attributes.description}
        </p>
        <p>
          <b>Цена: </b> {product.attributes.solar}₽ / 50 гр
        </p>

        <div className="total">Итоговая стоимость: {totalPrice}₽</div>
        <br />
        <br />
        <p>
          <b>Выберите граммовку</b>
        </p>
        <Select start={50} end={1000} step={50} onSelect={onSelect}></Select>
      </div>
      <div
        style={{ position: "fixed", bottom: "10px", left: "10px", right: "10px" }}
      >
        {totalPrice !== 0 && (
          <Button
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              border: "black solid 1px",
            }}
            onClick={handleAddToCart}
          >
            Добавить в корзину
          </Button>
        )}
      </div>
    </>
  );
};

export default ProductItem;
