import React, { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Slider from "react-slick";
import "./ProductItem.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useTelegram } from "../../hooks/useTelegram";
import Select from "./../Select/Select";
import { useLocalStorage } from "@uidotdev/usehooks";
import Button from './../Button/Button';

const BASE_URL = "https://azreil-ofj-backend-tg-c56e.twc1.net";
// TODO: Добавить информацию о наличии товара

const ProductItem = () => {
  const [cart, setCart] = useLocalStorage("cart", []);
  const { categoryID, productID } = useParams();
  const [product, setProduct] = useState(null);
  const [weight, setWeight] = useState(50);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [visible, setVisible] = useState(true)
  const { tg } = useTelegram();
  const [title, setTitle] = useLocalStorage("title", "");
  const [In_stock, setIn_stock] = useState(true)
  const navigate = useNavigate();
  const themeParams = tg.themeParams;
  const handleAddToCart = async () => {
    if (!product) {
      console.error("Продукт не найден");
      return;
    }
    if (!product.attributes.In_stock) {
      alert("Товар отсутствует на складе");
      return;
    }
    addToCart({ id: product.id, ...product.attributes, weight });
    setWeight(0);
    setSuccess(true);
    navigate("/");
  };


  const totalPrice = useMemo(() => {
    return product ? (product.attributes.solar / 50) * weight : 0;
  }, [product, weight]);

  const addToCart = (productToAdd) => {
    console.log(productToAdd)
    const existingProduct = cart.find(
      (item) =>
        item.id === productToAdd.id && item.weight === productToAdd.weight,
    );

    const updatedCart = existingProduct
      ? cart.map((item) =>
        item.id === productToAdd.id && item.weight === productToAdd.weight
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      )
      : [...cart, { ...productToAdd, quantity: 1 }];

    setCart(updatedCart);
  };
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${BASE_URL}/v1/categories?populate[products][populate]=images`
        );
        const data = await response.json();
        console.log("API Response:", data);
        const category = data.data.find(
          (category) => category.id === parseInt(categoryID)
        );

        if (category) {
          const foundProduct = category.attributes.products.data.find(
            (product) => product.id === parseInt(productID)
          );
          setProduct(foundProduct);
          setTitle(foundProduct?.attributes?.title || "");
          console.log("Found Product:", foundProduct);
          setIn_stock(foundProduct?.attributes?.In_stock || false);
          if (!foundProduct) {
            navigate("/");
          }
        } else {
          setProduct(null);
          navigate("/");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [categoryID, productID, navigate]);



  if (loading) return <h1 className="page-title">Загрузка...</h1>;
  if (!product) return <p>Продукт не найден</p>;

  const onSelect = (_weight) => {
    setSuccess(false);
    setWeight(_weight);
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <>
      <div className="product-item">
        {product?.attributes?.images?.data?.length > 1 ? (
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
        ) : (
          product?.attributes?.images?.data?.map((image, index) => (
            <div key={index}>
              <img
                src={image.attributes.url}
                alt={product.attributes.title}
                className="product-image"
              />
            </div>
          ))
        )}
        <p>
          <b>Описание: </b> {product.attributes.description}
        </p>
        <p>
          <b>Цена: </b> {product.attributes.solar}₽ / 50 гр
        </p>
        <div className="total">Итоговая стоимость: {Math.trunc(totalPrice)}₽</div>
        <br />
        <p>
          <b>Укажите грамовку</b>
          <Select start={50} end={1000} step={50} onSelect={onSelect} />

        </p>

      </div>
      {visible && (<button
        style={{
          backgroundColor: themeParams.button_color || "#2AABEE", // Цвет фона кнопки
          color: themeParams.button_text_color || "#ffffff", // Цвет текста кнопки
          border: "none",
          borderRadius: "8px",
          padding: "12px 16px",
          fontSize: "16px",
          fontWeight: "bold",
          width: "100%",
          position: "fixed",
          bottom: "16px",
          zIndex: 1000,
        }}
        onClick={handleAddToCart}
      >
        Добавить в корзину
      </button>)}</>
  );

};

export default ProductItem;
